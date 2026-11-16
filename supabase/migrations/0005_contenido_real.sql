-- =========================================================
-- Textos del inicio, cifras, aliados, catálogo, cotizaciones y proyectos reales
-- =========================================================

-- Texto del inicio (el título también se puede cambiar desde Panel > Datos y redes)
insert into ajustes (clave, valor) values
  ('inicio_subtitulo', 'Fabricamos, soldamos y montamos estructuras para obras civiles, bodegas y viviendas dándole forma al metal y a tus sueños.')
on conflict (clave) do update set valor = excluded.valor;

-- Cifras del inicio
update estadisticas set valor = 25 where etiqueta like 'años%';
update estadisticas set valor = 300 where etiqueta like 'proyectos%';
update estadisticas set valor = 10000 where etiqueta like 'toneladas%';

-- Aliados (página Nosotros)
create table if not exists aliados (
  id uuid primary key default gen_random_uuid(),
  nombre text not null, logo_url text,
  orden int not null default 0, activo boolean not null default true
);
alter table aliados enable row level security;
drop policy if exists "ver aliados" on aliados;
drop policy if exists "admin gestiona aliados" on aliados;
create policy "ver aliados" on aliados for select using (activo or es_admin());
create policy "admin gestiona aliados" on aliados for all using (es_admin()) with check (es_admin());
drop trigger if exists auditar_aliados on aliados;
create trigger auditar_aliados after insert or update or delete on aliados
  for each row execute function registrar_auditoria();
insert into aliados (nombre, orden)
select * from (values
  ('Ferrecortes', 1), ('Agofer', 2), ('Tornituercas', 3), ('Montajes Estructurales JJ', 4), ('Oxigenar', 5)
) as v(nombre, orden) where not exists (select 1 from aliados);

-- Servicio nuevo: acero inoxidable (se puede editar desde el panel)
insert into servicios (nombre, descripcion, capacidades, orden, activo)
select 'Trabajos en acero inoxidable',
       'Fabricación y soldadura en acero inoxidable, con acabados limpios, resistentes y duraderos.',
       array['Soldadura TIG en acero inoxidable','Barandas, pasamanos y escaleras en inox','Mesones y estructuras para cocinas y alimentos','Tanques y soportes']::text[],
       5, true
where not exists (select 1 from servicios where nombre = 'Trabajos en acero inoxidable');

-- Catálogo: medidas (m²) y unidad del precio
alter table productos add column if not exists medidas text not null default '';
alter table productos add column if not exists unidad_precio text not null default '';

-- Cotizaciones: valor que se cobra por la cotización, aparte del trabajo
alter table documentos add column if not exists valor_cotizacion numeric not null default 0;

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
    'validez', d.validez, 'entrega', d.entrega, 'total', d.total, 'valor_cotizacion', d.valor_cotizacion,
    'aprobacion', d.aprobacion, 'aprobada_por', d.aprobada_por,
    'vencida', (d.fecha + d.validez) < current_date);
end $$;
grant execute on function cotizacion_por_token(text) to anon, authenticated;

-- Proyectos con las fotos reales (las imágenes viven en la carpeta public/proyectos del sitio)

insert into proyectos (slug, titulo, categoria, ubicacion, medidas, descripcion, estado, orden)
values ('casa-estructura-metalica', 'Casa en estructura metálica', 'Estructuras', '', '', 'Vivienda campestre con estructura metálica, ventanales con perfilería de acero y terraza con baranda.', 'publicado', 1)
on conflict (slug) do nothing;
insert into proyecto_media (proyecto_id, tipo, url, es_portada, orden)
select p.id, 'foto', v.url, v.portada, v.orden
from proyectos p,
  (values
    ('/proyectos/casa/01.webp', false, 0),
    ('/proyectos/casa/02.webp', false, 1),
    ('/proyectos/casa/03.webp', false, 2),
    ('/proyectos/casa/04.webp', true, 3),
    ('/proyectos/casa/05.webp', false, 4),
    ('/proyectos/casa/06.webp', false, 5),
    ('/proyectos/casa/07.webp', false, 6),
    ('/proyectos/casa/08.webp', false, 7),
    ('/proyectos/casa/09.webp', false, 8)
  ) as v(url, portada, orden)
where p.slug = 'casa-estructura-metalica'
  and not exists (select 1 from proyecto_media m where m.proyecto_id = p.id);

insert into proyectos (slug, titulo, categoria, ubicacion, medidas, descripcion, estado, orden)
values ('cubierta-gran-luz', 'Cubierta metálica de gran luz', 'Cubiertas', '', '', 'Estructura de cubierta metálica con grandes voladizos, montada con grúa sobre columnas.', 'publicado', 2)
on conflict (slug) do nothing;
insert into proyecto_media (proyecto_id, tipo, url, es_portada, orden)
select p.id, 'foto', v.url, v.portada, v.orden
from proyectos p,
  (values
    ('/proyectos/cubierta/01.webp', true, 0),
    ('/proyectos/cubierta/02.webp', false, 1),
    ('/proyectos/cubierta/03.webp', false, 2),
    ('/proyectos/cubierta/04.webp', false, 3),
    ('/proyectos/cubierta/05.webp', false, 4),
    ('/proyectos/cubierta/06.webp', false, 5)
  ) as v(url, portada, orden)
where p.slug = 'cubierta-gran-luz'
  and not exists (select 1 from proyecto_media m where m.proyecto_id = p.id);

insert into proyectos (slug, titulo, categoria, ubicacion, medidas, descripcion, estado, orden)
values ('cerchas-cubierta', 'Cerchas y estructura de cubierta', 'Cubiertas', '', '', 'Cerchas metálicas para cubierta, fabricadas y montadas en obra.', 'publicado', 3)
on conflict (slug) do nothing;
insert into proyecto_media (proyecto_id, tipo, url, es_portada, orden)
select p.id, 'foto', v.url, v.portada, v.orden
from proyectos p,
  (values
    ('/proyectos/cerchas/01.webp', true, 0),
    ('/proyectos/cerchas/02.webp', false, 1),
    ('/proyectos/cerchas/03.webp', false, 2)
  ) as v(url, portada, orden)
where p.slug = 'cerchas-cubierta'
  and not exists (select 1 from proyecto_media m where m.proyecto_id = p.id);

insert into proyectos (slug, titulo, categoria, ubicacion, medidas, descripcion, estado, orden)
values ('estructura-edificacion', 'Estructura metálica para edificación', 'Estructuras', '', '', 'Columnas y vigas metálicas para edificación, con detalle de anclaje en placa base.', 'publicado', 4)
on conflict (slug) do nothing;
insert into proyecto_media (proyecto_id, tipo, url, es_portada, orden)
select p.id, 'foto', v.url, v.portada, v.orden
from proyectos p,
  (values
    ('/proyectos/edificacion/01.webp', true, 0),
    ('/proyectos/edificacion/02.webp', false, 1),
    ('/proyectos/edificacion/03.webp', false, 2),
    ('/proyectos/edificacion/04.webp', false, 3),
    ('/proyectos/edificacion/05.webp', false, 4)
  ) as v(url, portada, orden)
where p.slug = 'estructura-edificacion'
  and not exists (select 1 from proyecto_media m where m.proyecto_id = p.id);

insert into proyectos (slug, titulo, categoria, ubicacion, medidas, descripcion, estado, orden)
values ('marquesina-fachada-lamas', 'Marquesina y fachada en lamas de madera', 'Fachadas', '', '', 'Estructura metálica combinada con revestimiento en lamas de madera, para marquesina de acceso y fachada.', 'publicado', 5)
on conflict (slug) do nothing;
insert into proyecto_media (proyecto_id, tipo, url, es_portada, orden)
select p.id, 'foto', v.url, v.portada, v.orden
from proyectos p,
  (values
    ('/proyectos/marquesina/01.webp', true, 0),
    ('/proyectos/marquesina/02.webp', false, 1),
    ('/proyectos/marquesina/03.webp', false, 2),
    ('/proyectos/marquesina/04.webp', false, 3),
    ('/proyectos/marquesina/05.webp', false, 4),
    ('/proyectos/marquesina/06.webp', false, 5)
  ) as v(url, portada, orden)
where p.slug = 'marquesina-fachada-lamas'
  and not exists (select 1 from proyecto_media m where m.proyecto_id = p.id);

insert into proyectos (slug, titulo, categoria, ubicacion, medidas, descripcion, estado, orden)
values ('escaleras-acero-madera', 'Escaleras en acero y madera', 'Escaleras', '', '', 'Escaleras interiores con estructura en acero: modelo en caracol, de zanca central con peldaños de madera y flotante.', 'publicado', 6)
on conflict (slug) do nothing;
insert into proyecto_media (proyecto_id, tipo, url, es_portada, orden)
select p.id, 'foto', v.url, v.portada, v.orden
from proyectos p,
  (values
    ('/proyectos/escaleras-interiores/01.webp', true, 0),
    ('/proyectos/escaleras-interiores/02.webp', false, 1),
    ('/proyectos/escaleras-interiores/03.webp', false, 2)
  ) as v(url, portada, orden)
where p.slug = 'escaleras-acero-madera'
  and not exists (select 1 from proyecto_media m where m.proyecto_id = p.id);

insert into proyectos (slug, titulo, categoria, ubicacion, medidas, descripcion, estado, orden)
values ('escaleras-exteriores-industriales', 'Escaleras exteriores e industriales', 'Escaleras', '', '', 'Escaleras metálicas exteriores y de acceso industrial, con barandas.', 'publicado', 7)
on conflict (slug) do nothing;
insert into proyecto_media (proyecto_id, tipo, url, es_portada, orden)
select p.id, 'foto', v.url, v.portada, v.orden
from proyectos p,
  (values
    ('/proyectos/escaleras-exteriores/01.webp', true, 0),
    ('/proyectos/escaleras-exteriores/02.webp', false, 1),
    ('/proyectos/escaleras-exteriores/03.webp', false, 2)
  ) as v(url, portada, orden)
where p.slug = 'escaleras-exteriores-industriales'
  and not exists (select 1 from proyecto_media m where m.proyecto_id = p.id);

insert into proyectos (slug, titulo, categoria, ubicacion, medidas, descripcion, estado, orden)
values ('acero-inoxidable-diseno', 'Acero inoxidable y diseño', 'Inoxidable', '', '', 'Escalera en caracol con baranda en acero inoxidable y base geométrica en acero para mobiliario.', 'publicado', 8)
on conflict (slug) do nothing;
insert into proyecto_media (proyecto_id, tipo, url, es_portada, orden)
select p.id, 'foto', v.url, v.portada, v.orden
from proyectos p,
  (values
    ('/proyectos/inoxidable/01.webp', true, 0),
    ('/proyectos/inoxidable/02.webp', false, 1)
  ) as v(url, portada, orden)
where p.slug = 'acero-inoxidable-diseno'
  and not exists (select 1 from proyecto_media m where m.proyecto_id = p.id);

insert into proyectos (slug, titulo, categoria, ubicacion, medidas, descripcion, estado, orden)
values ('cerramiento-metalico', 'Cerramiento metálico', 'Portones', '', '', 'Cerramiento y reja metálica en perfilería, instalada junto a fachada en piedra.', 'publicado', 9)
on conflict (slug) do nothing;
insert into proyecto_media (proyecto_id, tipo, url, es_portada, orden)
select p.id, 'foto', v.url, v.portada, v.orden
from proyectos p,
  (values
    ('/proyectos/cerramiento/01.webp', true, 0)
  ) as v(url, portada, orden)
where p.slug = 'cerramiento-metalico'
  and not exists (select 1 from proyecto_media m where m.proyecto_id = p.id);
