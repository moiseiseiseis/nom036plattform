-- Separa la descripción del nivel (lo que ve el autoevaluador en el formulario
-- público) de la recomendación (lo que el motor inserta en el informe), según
-- la nota global del Dr. Sergio de octubre de 2026
-- (retroalimentacion/criterios-valoraciones-separadas.md).
--
-- Nullable a propósito: el contenido se carga aparte, con
-- supabase/content_v4_valoraciones_separadas.sql.

alter table nom036.recomendacion
    add column if not exists descripcion_nivel text;
