-- Contenido que el cliente edita desde el panel
alter table servicios add column if not exists capacidades text[] not null default '{}';

create table if not exists ajustes (
  clave text primary key,
  valor text not null default '',
  actualizado timestamptz not null default now()
);
create table if not exists diapositivas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null, detalle text not null default '', imagen_url text,
  orden int not null default 0, activo boolean not null default true
);
create table if not exists testimonios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null, cargo text not null default '', texto text not null,
  orden int not null default 0, activo boolean not null default true
);
create table if not exists preguntas (
  id uuid primary key default gen_random_uuid(),
  pregunta text not null, respuesta text not null,
  orden int not null default 0, activo boolean not null default true
);
create table if not exists hitos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null, texto text not null default '',
  orden int not null default 0, activo boolean not null default true
);
create table if not exists estadisticas (
  id uuid primary key default gen_random_uuid(),
  valor int not null default 0, etiqueta text not null,
  orden int not null default 0, activo boolean not null default true
);
create table if not exists documentos (
  id uuid primary key default gen_random_uuid(),
  tipo text not null check (tipo in ('cuenta_cobro', 'cotizacion')),
  numero int not null,
  fecha date not null default current_date,
  prestador text not null default '', identificacion text not null default '',
  cliente text not null, concepto text not null default '',
  items jsonb not null default '[]', iva numeric not null default 0,
  forma_pago text not null default '', cuenta text not null default '', titular text not null default '',
  validez int not null default 15, entrega text not null default '',
  total numeric not null default 0,
  creado_en timestamptz not null default now(),
  unique (tipo, numero)
);

alter table ajustes enable row level security;
alter table diapositivas enable row level security;
alter table testimonios enable row level security;
alter table preguntas enable row level security;
alter table hitos enable row level security;
alter table estadisticas enable row level security;
alter table documentos enable row level security;

create policy "ver ajustes" on ajustes for select using (true);
create policy "admin gestiona ajustes" on ajustes for all using (es_admin()) with check (es_admin());

create policy "ver diapositivas" on diapositivas for select using (activo or es_admin());
create policy "admin gestiona diapositivas" on diapositivas for all using (es_admin()) with check (es_admin());
create policy "ver testimonios" on testimonios for select using (activo or es_admin());
create policy "admin gestiona testimonios" on testimonios for all using (es_admin()) with check (es_admin());
create policy "ver preguntas" on preguntas for select using (activo or es_admin());
create policy "admin gestiona preguntas" on preguntas for all using (es_admin()) with check (es_admin());
create policy "ver hitos" on hitos for select using (activo or es_admin());
create policy "admin gestiona hitos" on hitos for all using (es_admin()) with check (es_admin());
create policy "ver estadisticas" on estadisticas for select using (activo or es_admin());
create policy "admin gestiona estadisticas" on estadisticas for all using (es_admin()) with check (es_admin());
create policy "admin gestiona documentos" on documentos for all using (es_admin()) with check (es_admin());

-- Archivos (fotos y videos)
insert into storage.buckets (id, name, public) values ('sitio', 'sitio', true) on conflict (id) do nothing;
create policy "admin sube archivos" on storage.objects for insert to authenticated
  with check (bucket_id = 'sitio' and public.es_admin());
create policy "admin actualiza archivos" on storage.objects for update to authenticated
  using (bucket_id = 'sitio' and public.es_admin());
create policy "admin borra archivos" on storage.objects for delete to authenticated
  using (bucket_id = 'sitio' and public.es_admin());

-- Contenido inicial (se puede editar desde el panel)
insert into ajustes (clave, valor) values
  ('whatsapp', '573195562698'),
  ('telefono_visible', '+57 319 556 2698'),
  ('correo', 'santybotina130921@gmail.com'),
  ('ciudad', 'Ciudad, Colombia'),
  ('horario', 'Lunes a sábado, 7 a. m. a 5 p. m.'),
  ('nosotros_texto', 'Más que un taller, somos el equipo que convierte planos en estructuras seguras, bien soldadas y listas para durar décadas.'),
  ('nosotros_mision', 'Nuestra misión es simple: que cada unión soldada sostenga la confianza que el cliente puso en nosotros.')
on conflict (clave) do nothing;

insert into servicios (nombre, descripcion, capacidades, orden)
select * from (values
  ('Estructuras metálicas', 'Diseño, fabricación y montaje de columnas, vigas, entrepisos y naves en perfilería estructural.', array['Columnas y vigas en perfil estructural','Naves industriales y bodegas','Entrepisos metálicos','Pórticos y marcos','Montaje en obra con personal calificado']::text[], 1),
  ('Soldadura industrial', 'Procesos SMAW, MIG y TIG según el material y la exigencia de cada unión.', array['MIG para taller y producción','TIG para acabados de precisión','Electrodo revestido para obra y exteriores','Reparación y refuerzo de estructuras']::text[], 2),
  ('Cubiertas y cerchas', 'Cerchas y cubiertas para bodegas, parqueaderos y viviendas, con acabado anticorrosivo.', array['Cerchas en perfil tubular','Cubiertas para bodegas y parqueaderos','Marquesinas y voladizos','Acabado anticorrosivo y pintura']::text[], 3),
  ('Portones y cerramientos', 'Portones, rejas, barandas y cerramientos a la medida, instalados en tu obra.', array['Portones batientes y corredizos','Rejas y cerramientos','Barandas y escaleras','Instalación incluida']::text[], 4)
) as v(nombre, descripcion, capacidades, orden)
where not exists (select 1 from servicios);

insert into diapositivas (titulo, detalle, orden)
select * from (values
  ('Cubiertas y cerchas', 'Bodegas, parqueaderos y viviendas', 1),
  ('Estructuras metálicas', 'Naves, entrepisos y pórticos', 2),
  ('Soldadura industrial', 'MIG, TIG y electrodo revestido', 3),
  ('Portones y cerramientos', 'A la medida, con instalación', 4)
) as v(titulo, detalle, orden) where not exists (select 1 from diapositivas);

insert into estadisticas (valor, etiqueta, orden)
select * from (values
  (12, 'años de experiencia', 1), (140, 'proyectos entregados', 2), (85, 'toneladas de acero trabajadas', 3)
) as v(valor, etiqueta, orden) where not exists (select 1 from estadisticas);

insert into hitos (titulo, texto, orden)
select * from (values
  ('Los inicios', 'Un taller pequeño y la decisión de hacer cada soldadura bien.', 1),
  ('Primeras obras', 'Los primeros clientes confiaron y las obras empezaron a recomendarnos.', 2),
  ('Equipo y taller', 'Más personal calificado, más equipos y mayor capacidad de producción.', 3),
  ('Hoy', 'Estructuras para obras civiles, bodegas y viviendas, con entrega a tiempo.', 4)
) as v(titulo, texto, orden) where not exists (select 1 from hitos);

insert into preguntas (pregunta, respuesta, orden)
select * from (values
  ('¿Cuánto demora una obra?', 'Depende del tamaño y del tipo de estructura. En la cotización te damos un tiempo estimado.', 1),
  ('¿Hacen visita técnica?', 'Sí. Escríbenos por WhatsApp y coordinamos el día y la hora.', 2),
  ('¿Cómo se paga?', 'Se acuerda en la cotización, normalmente por abonos según el avance de la obra.', 3),
  ('¿Trabajan fuera de la ciudad?', 'Cuéntanos tu caso y revisamos la cobertura y el transporte.', 4)
) as v(pregunta, respuesta, orden) where not exists (select 1 from preguntas);
