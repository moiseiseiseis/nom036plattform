-- Nuevo tipo de plantilla por criterio y franja: la "implicación", que cierra
-- el párrafo narrativo de cada criterio explicando por qué importa el nivel
-- alcanzado (al estilo del informe JASANA de referencia). El contenido vive en
-- retroalimentacion/criterios-valoraciones-separadas.md y se carga con
-- supabase/content_v4_valoraciones_separadas.sql.

alter table nom036.plantilla_bucket
    drop constraint if exists plantilla_bucket_tipo_check;

alter table nom036.plantilla_bucket
    add constraint plantilla_bucket_tipo_check
    check (tipo in ('apertura', 'cierre', 'implicacion'));
