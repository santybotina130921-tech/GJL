create type rol_usuario as enum ('admin', 'empleado', 'cliente');
create type estado_publicacion as enum ('borrador', 'publicado');

create table perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null default '',
  telefono text,
  rol rol_usuario not null default 'cliente',
  creado_en timestamptz not null default now()
);

create or replace function es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from perfiles where id = auth.uid() and rol = 'admin');
$$;

create or replace function crear_perfil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into perfiles (id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre', ''));
  return new;
end $$;

create trigger al_crear_usuario after insert on auth.users
for each row execute function crear_perfil();

create table proyectos (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  categoria text not null,
  ubicacion text,
  medidas text,
  descripcion text,
  estado estado_publicacion not null default 'borrador',
  orden int not null default 0,
  creado_en timestamptz not null default now()
);

create table proyecto_media (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references proyectos(id) on delete cascade,
  tipo text not null check (tipo in ('foto', 'video')),
  url text not null,
  es_portada boolean not null default false,
  orden int not null default 0
);

create table servicios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  descripcion text,
  imagen_url text,
  orden int not null default 0,
  activo boolean not null default true
);

create table cotizaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  whatsapp text not null,
  tipo_trabajo text,
  medidas text,
  descripcion text,
  estado text not null default 'nueva',
  creado_en timestamptz not null default now()
);

create table visitas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  whatsapp text not null,
  fecha date not null,
  hora text not null,
  estado text not null default 'pendiente',
  creado_en timestamptz not null default now()
);

-- Seguridad: RLS activo en todo
alter table perfiles enable row level security;
alter table proyectos enable row level security;
alter table proyecto_media enable row level security;
alter table servicios enable row level security;
alter table cotizaciones enable row level security;
alter table visitas enable row level security;

-- Cada usuario ve su perfil; el admin ve todos
create policy "perfil propio o admin" on perfiles
  for select using (id = auth.uid() or es_admin());

-- Un usuario solo puede cambiar su nombre y teléfono, nunca su rol
revoke update on perfiles from authenticated;
grant update (nombre, telefono) on perfiles to authenticated;
create policy "editar perfil propio" on perfiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- Contenido público: solo lo publicado
create policy "ver proyectos publicados" on proyectos
  for select using (estado = 'publicado' or es_admin());
create policy "admin gestiona proyectos" on proyectos
  for all using (es_admin()) with check (es_admin());

create policy "ver media de publicados" on proyecto_media
  for select using (
    es_admin() or exists (
      select 1 from proyectos p
      where p.id = proyecto_id and p.estado = 'publicado'
    )
  );
create policy "admin gestiona media" on proyecto_media
  for all using (es_admin()) with check (es_admin());

create policy "ver servicios activos" on servicios
  for select using (activo or es_admin());
create policy "admin gestiona servicios" on servicios
  for all using (es_admin()) with check (es_admin());

-- Cotizaciones y visitas: solo el admin las ve.
-- Los formularios públicos guardan desde una ruta del servidor.
create policy "admin ve cotizaciones" on cotizaciones
  for all using (es_admin()) with check (es_admin());
create policy "admin ve visitas" on visitas
  for all using (es_admin()) with check (es_admin());