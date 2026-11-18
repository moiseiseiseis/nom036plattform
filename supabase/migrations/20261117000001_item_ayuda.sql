-- Ayuda de cada pregunta del formulario público: definición del término clave
-- (con el término entre **…**) y de 1 a 3 preguntas guía «Para responder,
-- piensa en…». Solo la lee el formulario; el motor y el informe no la usan.
--
-- Nullable a propósito: una pregunta sin ayuda no muestra el panel. El
-- contenido se carga aparte, con supabase/content_v5_ayuda.sql, generado desde
-- retroalimentacion/ayuda-preguntas.md.

alter table nom036.item
    add column if not exists ayuda_definicion text,
    add column if not exists ayuda_preguntas_guia text[];
