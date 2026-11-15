-- Antes y después en proyectos
alter table proyectos add column if not exists antes_url text;
alter table proyectos add column if not exists despues_url text;

-- Estado de pago de los documentos
alter table documentos add column if not exists estado text not null default 'pendiente';
alter table documentos drop constraint if exists documentos_estado_check;
alter table documentos add constraint documentos_estado_check check (estado in ('pendiente', 'pagado'));

-- Ingresos y egresos
create table if not exists movimientos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('ingreso', 'egreso')),
  fecha date not null default current_date,
  concepto text not null check (char_length(concepto) between 1 and 160),
  categoria text not null default '',
  monto numeric(14,2) not null check (monto > 0),
  metodo text not null default '',
  notas text not null default '',
  documento_id uuid references documentos(id) on delete set null,
  creado_en timestamptz not null default now()
);
create index if not exists movimientos_fecha_idx on movimientos (fecha desc);

-- Equipo y certificaciones (página Nosotros)
create table if not exists equipo (
  id uuid primary key default gen_random_uuid(),
  nombre text not null, cargo text not null default '', foto_url text,
  orden int not null default 0, activo boolean not null default true
);
create table if not exists certificaciones (
  id uuid primary key default gen_random_uuid(),
  titulo text not null, detalle text not null default '',
  orden int not null default 0, activo boolean not null default true
);

alter table movimientos enable row level security;
alter table equipo enable row level security;
alter table certificaciones enable row level security;

create policy "admin gestiona movimientos" on movimientos for all using (es_admin()) with check (es_admin());
create policy "ver equipo" on equipo for select using (activo or es_admin());
create policy "admin gestiona equipo" on equipo for all using (es_admin()) with check (es_admin());
create policy "ver certificaciones" on certificaciones for select using (activo or es_admin());
create policy "admin gestiona certificaciones" on certificaciones for all using (es_admin()) with check (es_admin());

-- Seguridad del almacén: solo fotos y videos, máximo 50 MB por archivo
update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array['image/webp','image/jpeg','image/png','video/mp4','video/webm','video/quicktime']
where id = 'sitio';
