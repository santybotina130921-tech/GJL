-- Calificaciones de clientes: solo quien tiene el código de una obra terminada puede calificar,
-- y nada se publica hasta que el administrador lo apruebe.
create table if not exists calificaciones (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null unique references obras(id) on delete cascade,
  estrellas int not null check (estrellas between 1 and 5),
  comentario text not null default '' check (char_length(comentario) <= 500),
  nombre text not null check (char_length(nombre) between 1 and 60),
  aprobada boolean not null default false,
  creado_en timestamptz not null default now()
);
alter table calificaciones enable row level security;
drop policy if exists "ver calificaciones aprobadas" on calificaciones;
drop policy if exists "admin gestiona calificaciones" on calificaciones;
create policy "ver calificaciones aprobadas" on calificaciones for select using (aprobada or es_admin());
create policy "admin gestiona calificaciones" on calificaciones for all using (es_admin()) with check (es_admin());

drop trigger if exists auditar_calificaciones on calificaciones;
create trigger auditar_calificaciones after insert or update or delete on calificaciones
  for each row execute function registrar_auditoria();

create or replace function calificar_obra(c text, e int, comentario text, quien text) returns text
language plpgsql security definer set search_path = public as $$
declare o obras%rowtype;
begin
  select * into o from obras where codigo = upper(trim(c)) and publica = true;
  if not found then return 'no_existe'; end if;
  if o.estado <> 'terminada' then return 'no_terminada'; end if;
  if exists (select 1 from calificaciones where obra_id = o.id) then return 'ya_calificada'; end if;
  if e is null or e < 1 or e > 5 then return 'datos'; end if;
  insert into calificaciones (obra_id, estrellas, comentario, nombre)
  values (o.id, e, left(coalesce(comentario, ''), 500), left(coalesce(nullif(trim(quien), ''), 'Cliente'), 60));
  return 'ok';
end $$;
grant execute on function calificar_obra(text, int, text, text) to anon, authenticated;

-- El seguimiento ahora también informa si la obra ya fue calificada
create or replace function obra_por_codigo(c text) returns jsonb
language plpgsql security definer set search_path = public stable as $$
declare o obras%rowtype;
begin
  select * into o from obras where codigo = upper(trim(c)) and publica = true;
  if not found then return null; end if;
  return jsonb_build_object(
    'nombre', o.nombre, 'cliente', o.cliente, 'descripcion', o.descripcion,
    'estado', o.estado, 'avance', o.avance, 'etapas', o.etapas,
    'fecha_inicio', o.fecha_inicio, 'fecha_estimada', o.fecha_estimada,
    'calificada', exists (select 1 from calificaciones k where k.obra_id = o.id),
    'avances', coalesce((
      select jsonb_agg(jsonb_build_object('nota', a.nota, 'foto_url', a.foto_url, 'fecha', a.fecha)
                       order by a.fecha desc, a.creado_en desc)
      from avances_obra a where a.obra_id = o.id), '[]'::jsonb));
end $$;
grant execute on function obra_por_codigo(text) to anon, authenticated;
