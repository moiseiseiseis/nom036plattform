-- Tercera versión de contenido para el Criterio 1: ajustes de redacción a
-- partir de la retroalimentación de la validación piloto sobre un informe
-- real (`retroalimentacion/reporte.txt`, empresa "Grupo Modelo", comparado
-- contra el informe JASANA de referencia y la NOM-036-1-STPS-2018).
--
-- Cambios respecto a content_v2_lenguaje_simple.sql:
--   1) Aperturas por bucket del Criterio 1 reescritas para nombrar
--      explícitamente la misma etiqueta de franja que usa la Tabla 2 del
--      informe ("nivel Aceptable", "es Mínimo", etc.) — hallazgo 8
--      (consistencia léxica: el texto narrativo debe usar la misma palabra
--      que la clasificación tabulada). Texto de retroalimentacion/reporte.txt,
--      apéndice punto 4.
--   2) Cierre global "informe completo" (5/5 criterios respondidos)
--      reescrito con la misma lógica de nombrar la franja explícitamente.
--      Sigue sin ser alcanzable en la práctica hasta que la Etapa 7 cargue
--      los Criterios 2-5 (hoy toda evaluación es parcial y usa el texto
--      calculado en `engine/narrativa.py::construir_cierre_parcial`, no
--      esta plantilla) — se deja lista de una vez. Texto de
--      retroalimentacion/reporte.txt, apéndice punto 3.
--
-- No se tocan las recomendaciones por ítem × nivel (siguen siendo las de
-- content_v2_lenguaje_simple.sql) ni la apertura global ("A continuación se
-- detallan..."), que la retroalimentación no señaló como problemática.
--
-- Sigue siendo contenido de trabajo, pendiente de la revisión y validación
-- final del Dr. Sergio (CLAUDE.md, sección 4).

-- 1) Aperturas por bucket, Criterio 1.

update nom036.plantilla_bucket pb
set texto = v.texto
from (values
    ('inexistente', 'apertura', 'No existe un proceso formal de identificación y clasificación de los puestos con manejo manual de cargas, conforme a lo que exige el numeral 7.2 de la NOM-036-1-STPS-2018.'),
    ('minimo', 'apertura', 'El proceso de identificación y clasificación de los puestos con manejo manual de cargas es Mínimo: la mayoría de los elementos que exige el numeral 7.2 de la NOM-036-1-STPS-2018 no están cubiertos.'),
    ('regular', 'apertura', 'El proceso de identificación y clasificación de los puestos con manejo manual de cargas se encuentra en un nivel Regular: existen avances, pero persisten vacíos relevantes.'),
    ('aceptable', 'apertura', 'El proceso de identificación y clasificación de los puestos con manejo manual de cargas presenta un nivel Aceptable, con puntos específicos por reforzar.'),
    ('optimo', 'apertura', 'El proceso de identificación y clasificación de los puestos con manejo manual de cargas está consolidado.')
) as v(bucket, tipo, texto)
where pb.bucket = v.bucket
  and pb.tipo = v.tipo
  and pb.criterio_id = (select id from nom036.criterio where numero = 1);

-- 2) Cierre global (criterio_id NULL), caso "informe completo" (5/5
--    criterios respondidos) — no toca la apertura global.

update nom036.plantilla_bucket pb
set texto = v.texto
from (values
    ('inexistente', 'cierre', 'En general, la empresa no cuenta con los elementos que exige la NOM-036-1-STPS-2018 para el manejo manual de cargas. Es indispensable implementar sin demora los temas obligatorios señalados en este informe.'),
    ('minimo', 'cierre', 'En general, la empresa presenta un nivel de cumplimiento Mínimo con la NOM-036-1-STPS-2018. Se recomienda priorizar de inmediato los temas obligatorios señalados, dado que persisten brechas relevantes frente a lo que exige la norma.'),
    ('regular', 'cierre', 'En general, la empresa presenta un nivel de cumplimiento Regular con la NOM-036-1-STPS-2018. Es necesario atender los temas obligatorios identificados en los criterios con menor puntaje para reducir el riesgo de trastornos músculo-esqueléticos.'),
    ('aceptable', 'cierre', 'En general, la empresa presenta un nivel de cumplimiento Aceptable con la NOM-036-1-STPS-2018. Conviene cerrar los temas obligatorios pendientes en los criterios con menor puntaje y usar los temas optativos como oportunidades de mejora continua.'),
    ('optimo', 'cierre', 'En general, la empresa presenta un nivel de cumplimiento Óptimo con la NOM-036-1-STPS-2018. Se recomienda mantener las prácticas actuales y usar los temas optativos para consolidar la mejora continua.')
) as v(bucket, tipo, texto)
where pb.bucket = v.bucket
  and pb.tipo = v.tipo
  and pb.criterio_id is null;
