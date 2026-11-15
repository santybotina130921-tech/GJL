-- =========================================================
-- Fase A: seguimiento de obra, visitas y tarifas del cotizador
-- =========================================================
create table if not exists obras (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  nombre text not null,
  cliente text not null,
  cliente_whatsapp text not null default '',
  descripcion text not null default '',
  estado text not null default 'en_proceso' check (estado in ('en_proceso', 'pausada', 'terminada')),
  avance int not null default 0 check (avance between 0 and 100),
  etapas jsonb not null default '[]',
  fecha_inicio date,
  fecha_estimada date,
  publica boolean not null default true,
  creado_en timestamptz not null default now()
);
create table if not exists avances_obra (
  id uuid primary key default gen_random_uuid(),
  obra_id uuid not null references obras(id) on delete cascade,
  nota text not null default '',
  foto_url text,
  fecha date not null default current_date,
  creado_en timestamptz not null default now()
);

alter table visitas add column if not exists direccion text not null default '';
alter table visitas add column if not exists notas text not null default '';
create unique index if not exists visitas_unica on visitas (fecha, hora) where estado in ('pendiente', 'confirmada');

create table if not exists tarifas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null, unidad text not null default 'm²',
  precio_min int not null default 0, precio_max int not null default 0,
  orden int not null default 0, activo boolean not null default false
);

-- =========================================================
-- Fase B: aprobación de cotizaciones, catálogo y blog
-- =========================================================
alter table documentos add column if not exists cliente_whatsapp text not null default '';
alter table documentos add column if not exists token_aprobacion text unique;
alter table documentos add column if not exists aprobacion text not null default 'sin_enviar';
alter table documentos drop constraint if exists documentos_aprobacion_check;
alter table documentos add constraint documentos_aprobacion_check
  check (aprobacion in ('sin_enviar', 'pendiente', 'aprobada', 'rechazada'));
alter table documentos add column if not exists aprobada_en timestamptz;
alter table documentos add column if not exists aprobada_por text;
alter table documentos add column if not exists comentario_cliente text;
alter table documentos add column if not exists ultimo_recordatorio date;

create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null, categoria text not null default '', descripcion text not null default '',
  imagen_url text, precio_desde int not null default 0,
  orden int not null default 0, activo boolean not null default false
);
create table if not exists entradas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  titulo text not null, resumen text not null default '', contenido text not null default '',
  imagen_url text, publicado boolean not null default false,
  publicada_en timestamptz, creado_en timestamptz not null default now()
);

-- =========================================================
-- Fase C: registro de cambios (auditoría)
-- =========================================================
create table if not exists auditoria (
  id bigint generated always as identity primary key,
  usuario_id uuid, email text,
  accion text not null, tabla text not null, registro_id text,
  antes jsonb, despues jsonb,
  creado_en timestamptz not null default now()
);
create index if not exists auditoria_fecha_idx on auditoria (creado_en desc);

create or replace function registrar_auditoria() returns trigger
language plpgsql security definer set search_path = public as $$
declare uid uuid := auth.uid(); mail text; a jsonb; d jsonb; j jsonb;
begin
  if uid is not null then select email into mail from auth.users where id = uid; end if;
  if tg_op = 'DELETE' then a := to_jsonb(old); j := a;
  elsif tg_op = 'UPDATE' then a := to_jsonb(old); d := to_jsonb(new); j := d;
  else d := to_jsonb(new); j := d; end if;
  insert into auditoria (usuario_id, email, accion, tabla, registro_id, antes, despues)
  values (uid, mail, tg_op, tg_table_name, coalesce(j->>'id', j->>'clave'), a, d);
  return null;
end $$;

do $$
declare t text;
begin
  foreach t in array array['proyectos','proyecto_media','servicios','diapositivas','estadisticas','hitos',
    'preguntas','testimonios','equipo','certificaciones','ajustes','documentos','movimientos',
    'cotizaciones','visitas','obras','avances_obra','tarifas','productos','entradas','perfiles']
  loop
    execute format('drop trigger if exists auditar_%1$s on %1$I', t);
    execute format('create trigger auditar_%1$s after insert or update or delete on %1$I
                    for each row execute function registrar_auditoria()', t);
  end loop;
end $$;

-- =========================================================
-- Seguridad (RLS)
-- =========================================================
alter table obras enable row level security;
alter table avances_obra enable row level security;
alter table tarifas enable row level security;
alter table productos enable row level security;
alter table entradas enable row level security;
alter table auditoria enable row level security;

create policy "admin gestiona obras" on obras for all using (es_admin()) with check (es_admin());
create policy "admin gestiona avances" on avances_obra for all using (es_admin()) with check (es_admin());
create policy "ver tarifas" on tarifas for select using (activo or es_admin());
create policy "admin gestiona tarifas" on tarifas for all using (es_admin()) with check (es_admin());
create policy "ver productos" on productos for select using (activo or es_admin());
create policy "admin gestiona productos" on productos for all using (es_admin()) with check (es_admin());
create policy "ver entradas" on entradas for select using (publicado or es_admin());
create policy "admin gestiona entradas" on entradas for all using (es_admin()) with check (es_admin());
create policy "admin ve auditoria" on auditoria for select using (es_admin());

-- =========================================================
-- Funciones públicas (solo devuelven lo necesario)
-- =========================================================
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
    'avances', coalesce((
      select jsonb_agg(jsonb_build_object('nota', a.nota, 'foto_url', a.foto_url, 'fecha', a.fecha)
                       order by a.fecha desc, a.creado_en desc)
      from avances_obra a where a.obra_id = o.id), '[]'::jsonb));
end $$;

create or replace function horas_ocupadas(f date) returns text[]
language sql security definer set search_path = public stable as $$
  select coalesce(array_agg(hora), '{}') from visitas
  where fecha = f and estado in ('pendiente', 'confirmada');
$$;

create or replace function cotizacion_por_token(t text) returns jsonb
language plpgsql security definer set search_path = public stable as $$
declare d documentos%rowtype;
begin
  select * into d from documentos where token_aprobacion = t and tipo = 'cotizacion';
  if not found then return null; end if;
  return jsonb_build_object(
    'numero', d.numero, 'fecha', d.fecha, 'prestador', d.prestador, 'identificacion', d.identificacion,
    'cliente', d.cliente, 'concepto', d.concepto, 'items', d.items, 'iva', d.iva,
    'forma_pago', d.forma_pago, 'cuenta', d.cuenta, 'titular', d.titular,
    'validez', d.validez, 'entrega', d.entrega, 'total', d.total,
    'aprobacion', d.aprobacion, 'aprobada_por', d.aprobada_por,
    'vencida', (d.fecha + d.validez) < current_date);
end $$;

create or replace function responder_cotizacion(t text, decision text, quien text, comentario text) returns text
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if decision not in ('aprobada', 'rechazada') then return 'no'; end if;
  update documentos
  set aprobacion = decision, aprobada_en = now(),
      aprobada_por = left(coalesce(quien, ''), 80), comentario_cliente = left(coalesce(comentario, ''), 500)
  where token_aprobacion = t and tipo = 'cotizacion' and aprobacion = 'pendiente'
    and (fecha + validez) >= current_date;
  get diagnostics n = row_count;
  return case when n = 1 then 'ok' else 'no' end;
end $$;

grant execute on function obra_por_codigo(text) to anon, authenticated;
grant execute on function horas_ocupadas(date) to anon, authenticated;
grant execute on function cotizacion_por_token(text) to anon, authenticated;
grant execute on function responder_cotizacion(text, text, text, text) to anon, authenticated;

-- Ejemplos (desactivados): se editan y se activan desde el panel
insert into tarifas (nombre, unidad, orden)
select * from (values
  ('Cubierta metálica', 'm²', 1), ('Estructura metálica', 'm²', 2),
  ('Barandas', 'metro lineal', 3), ('Portón', 'unidad', 4)
) as v(nombre, unidad, orden) where not exists (select 1 from tarifas);

insert into productos (nombre, categoria, descripcion, orden)
select * from (values
  ('Portón batiente', 'Portones', 'Portón de dos hojas, a la medida.', 1),
  ('Portón corredizo', 'Portones', 'Con riel y motor opcional.', 2),
  ('Baranda para escalera', 'Barandas', 'En tubo, con acabado anticorrosivo.', 3),
  ('Marquesina', 'Cubiertas', 'Para entradas, locales y parqueaderos.', 4)
) as v(nombre, categoria, descripcion, orden) where not exists (select 1 from productos);
