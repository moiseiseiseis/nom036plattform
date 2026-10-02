-- Contenido real del Criterio 4 ("Difusión y promoción de la salud"):
-- numeral NOM-036 por ítem, recomendaciones por ítem × nivel (10 ítems × 5
-- niveles = 50 filas), y plantillas de apertura por bucket.
--
-- A diferencia de los Criterios 1-3, este criterio NO mapea limpio a un
-- solo capítulo de la norma (no existe un "Capítulo de difusión" en la
-- NOM-036-1-STPS-2018) — son más bien prácticas de gestión organizacional
-- alrededor del cumplimiento. Se citó un numeral solo cuando hay un
-- requisito puntual que lo respalda; en los demás se dejó sin numeral y se
-- marcó como optativo, en vez de forzar una cita imprecisa (mismo criterio
-- que ya se usó en `content_criterio2.sql` y `content_criterio3.sql`).
--
-- Mapeo item -> numeral -> obligatorio/optativo:
--   4.1  Política interna por escrito           -> (sin numeral)         -> optativo
--   4.2  Responsable designado                  -> (sin numeral)         -> optativo
--   4.3  Presupuesto para equipo auxiliar        -> (sin numeral)         -> optativo
--   4.4  Registros de diagnósticos/programas     -> 5.6                  -> obligatorio
--   4.5  Supervisión de medidas ergonómicas      -> 8.3, inciso a) 1)    -> obligatorio
--   4.6  Auditorías internas/externas            -> 11.1                -> optativo
--   4.7  Comunicación al personal                -> 5.4                 -> obligatorio
--   4.8  Información accesible a trabajadores    -> 7.5                 -> obligatorio
--   4.9  Integración al programa anual           -> 7.7                 -> obligatorio
--   4.10 Cultura de prevención                   -> (sin numeral)         -> optativo
--
-- El ítem 4.6 es un caso distinto a los demás "sin numeral": sí tiene un
-- numeral exacto (11.1), pero ese numeral dice textualmente que "el patrón
-- TENDRÁ LA OPCIÓN de contratar una unidad de verificación" — es decir, la
-- propia norma lo define como voluntario, no como optativo por falta de
-- respaldo normativo (a diferencia de 4.1, 4.2, 4.3 y 4.10, que sí carecen
-- de un numeral que los sustente).
--
-- El ítem 4.2 ("responsable para el cumplimiento de la NOM-036") se dejó
-- sin numeral a propósito: el numeral 7.4, inciso f) sí pide los datos del
-- "responsable de la elaboración" del análisis de riesgo específico, pero
-- eso es un rol más acotado (quien elabora el análisis) que lo que
-- pregunta el ítem (un responsable general del cumplimiento de la norma en
-- la empresa) — no se forzó la cita por no ser el mismo concepto.
--
-- No se cargan plantillas de "cierre" por criterio (ver nota en
-- `content_criterio2.sql`: `repository.py` nunca las lee).
--
-- Primera versión de trabajo, pendiente de la revisión y validación final
-- del Dr. Sergio (CLAUDE.md, sección 4).

-- 1) Numeral NOM-036 y obligatorio/optativo por ítem.

update nom036.item i
set numeral_nom = v.numeral_nom,
    es_obligatorio = v.es_obligatorio
from (values
    (1, null, false),
    (2, null, false),
    (3, null, false),
    (4, '5.6', true),
    (5, '8.3 a) 1)', true),
    (6, '11.1', false),
    (7, '5.4', true),
    (8, '7.5', true),
    (9, '7.7', true),
    (10, null, false)
) as v(numero, numeral_nom, es_obligatorio)
where i.numero = v.numero
  and i.criterio_id = (select id from nom036.criterio where numero = 4);

-- 2) Recomendaciones por ítem × nivel.

insert into nom036.recomendacion (item_id, nivel, texto)
select i.id, v.nivel, v.texto
from nom036.item i
cross join (values
    (1, 0, 'No existe ninguna política interna por escrito en materia de prevención de riesgos ergonómicos. Se recomienda documentar una política interna que establezca el compromiso de la empresa con la prevención de estos riesgos.'),
    (1, 1, 'Existen algunos lineamientos informales sobre el tema, sin que estén documentados como política interna. Se recomienda formalizarlos por escrito.'),
    (1, 2, 'Existe una política interna por escrito, pero no cubre todos los aspectos de la prevención de riesgos ergonómicos. Se recomienda completarla.'),
    (1, 3, 'Existe una política interna por escrito que cubre la mayoría de los aspectos de prevención de riesgos ergonómicos. Se recomienda mantenerla actualizada.'),
    (1, 4, 'Existe una política interna por escrito, completa y vigente, en materia de prevención de riesgos ergonómicos. Se recomienda mantener este control.'),

    (2, 0, 'No se ha designado a ningún responsable para el cumplimiento de la NOM-036-1-STPS-2018. Se recomienda asignar esta responsabilidad a una persona o área específica.'),
    (2, 1, 'Hay una persona que atiende el tema de forma informal, sin que esté designada oficialmente. Se recomienda formalizar esta designación.'),
    (2, 2, 'Se ha designado un responsable, pero sus funciones no están claramente definidas. Se recomienda precisar sus funciones y alcance.'),
    (2, 3, 'Se ha designado un responsable con funciones claras para el cumplimiento de la norma. Se recomienda mantener esta designación.'),
    (2, 4, 'Se ha designado formalmente a un responsable, con funciones claras, para el cumplimiento de la NOM-036-1-STPS-2018. Se recomienda mantener este control.'),

    (3, 0, 'No se destina presupuesto para la adquisición de equipos auxiliares de carga. Se recomienda asignar un presupuesto específico para este fin.'),
    (3, 1, 'Se destina presupuesto de forma esporádica, sin que esté planeado con anticipación. Se recomienda planear este gasto con antelación.'),
    (3, 2, 'Se destina presupuesto para algunos equipos auxiliares, pero no de forma consistente para todas las necesidades identificadas. Se recomienda ampliar esta asignación.'),
    (3, 3, 'Se destina presupuesto para la mayoría de las necesidades de equipos auxiliares identificadas. Se recomienda mantener esta práctica.'),
    (3, 4, 'Se destina y ejerce presupuesto de forma planeada para la adquisición de equipos auxiliares de carga. Se recomienda mantener este control.'),

    (4, 0, 'No se mantienen registros de los diagnósticos, programas ni acciones en materia de ergonomía. Se recomienda llevar estos registros, conforme a lo que exige la norma. (NOM-036, numeral 5.6)'),
    (4, 1, 'Existen algunos registros informales, sin que estén actualizados ni completos. Se recomienda formalizarlos y mantenerlos al día.'),
    (4, 2, 'Se mantienen registros de algunos diagnósticos o acciones, pero no de todos. Se recomienda completar los registros faltantes.'),
    (4, 3, 'Se mantienen registros actualizados de la mayoría de los diagnósticos, programas y acciones en ergonomía. Se recomienda mantenerlos así.'),
    (4, 4, 'Se mantienen registros actualizados y completos de todos los diagnósticos, programas y acciones en ergonomía. Se recomienda mantener este control. (NOM-036, numeral 5.6)'),

    (5, 0, 'No se supervisa que las medidas ergonómicas se apliquen dentro de los puestos de trabajo. Se recomienda supervisar que las actividades se realicen en condiciones seguras, conforme al procedimiento de seguridad de la empresa. (NOM-036, numeral 8.3)'),
    (5, 1, 'La supervisión de las medidas ergonómicas se hace de forma esporádica, sin un criterio establecido. Se recomienda formalizar esta supervisión.'),
    (5, 2, 'Se supervisa la aplicación de las medidas ergonómicas en algunos puestos de trabajo, pero no en todos. Se recomienda extender esta supervisión.'),
    (5, 3, 'Se supervisa la aplicación de las medidas ergonómicas en la mayoría de los puestos de trabajo. Se recomienda mantener esta práctica.'),
    (5, 4, 'Se supervisa de forma sistemática la aplicación de las medidas ergonómicas en todos los puestos de trabajo. Se recomienda mantener este control. (NOM-036, numeral 8.3)'),

    (6, 0, 'No se han realizado auditorías internas ni externas sobre el cumplimiento de la NOM-036-1-STPS-2018. Se recomienda considerar una auditoría, interna o a través de una unidad de verificación acreditada. (NOM-036, numeral 11.1)'),
    (6, 1, 'Se ha hecho alguna revisión informal del cumplimiento, sin que sea propiamente una auditoría. Se recomienda formalizar este ejercicio.'),
    (6, 2, 'Se han realizado auditorías de cumplimiento en algunos temas o áreas, pero no de forma integral. Se recomienda ampliar su alcance.'),
    (6, 3, 'Se han realizado auditorías internas o externas que cubren la mayoría de los temas de cumplimiento normativo. Se recomienda mantener esta práctica.'),
    (6, 4, 'Se realizan auditorías internas o externas de forma periódica para verificar el cumplimiento normativo. Se recomienda mantener este control. (NOM-036, numeral 11.1)'),

    (7, 0, 'No se ha comunicado al personal nada sobre la importancia de esta norma ni sobre los riesgos del manejo manual de cargas. Se recomienda informar a los trabajadores sobre las posibles alteraciones a la salud, mediante carteles, pláticas, boletines u otro medio. (NOM-036, numeral 5.4)'),
    (7, 1, 'Se ha comunicado el tema de forma aislada, sin que sea una práctica constante. Se recomienda establecer una comunicación regular.'),
    (7, 2, 'Se comunica la importancia de esta norma en algunas áreas de la empresa, pero no en toda la organización. Se recomienda extender esta comunicación.'),
    (7, 3, 'Se comunica la importancia de esta norma a la mayoría del personal, a través de distintos medios. Se recomienda mantener esta práctica.'),
    (7, 4, 'Se informa de forma constante a todo el personal sobre las posibles alteraciones a la salud por el manejo manual de cargas, mediante carteles, pláticas y boletines. Se recomienda mantener este control. (NOM-036, numeral 5.4)'),

    (8, 0, 'La información sobre los riesgos por manejo manual de cargas no está disponible para los trabajadores. Se recomienda ponerla a su disposición, conforme a lo que exige la norma. (NOM-036, numeral 7.5)'),
    (8, 1, 'La información está disponible de forma limitada, por ejemplo solo si el trabajador la solicita expresamente. Se recomienda facilitar su acceso de forma proactiva.'),
    (8, 2, 'La información sobre riesgos es accesible para algunos trabajadores, pero no para todos los que participan en actividades de manejo de cargas. Se recomienda extender su disponibilidad.'),
    (8, 3, 'La información sobre riesgos por manejo manual de cargas es accesible para la mayoría de los trabajadores. Se recomienda mantener esta práctica.'),
    (8, 4, 'La información sobre los riesgos por manejo manual de cargas está disponible para todos los trabajadores que participan en estas actividades. Se recomienda mantener este control. (NOM-036, numeral 7.5)'),

    (9, 0, 'Los diagnósticos ergonómicos no se integran al programa anual de seguridad y salud en el trabajo. Se recomienda integrarlos al diagnóstico de seguridad y salud que exige la NOM-030-STPS-2009. (NOM-036, numeral 7.7)'),
    (9, 1, 'Los diagnósticos ergonómicos se integran de forma parcial o informal al programa anual. Se recomienda formalizar esta integración.'),
    (9, 2, 'Se integran algunos diagnósticos ergonómicos al programa anual, pero no todos. Se recomienda completar esta integración.'),
    (9, 3, 'Se integran la mayoría de los diagnósticos ergonómicos al programa anual de seguridad y salud. Se recomienda mantener esta práctica.'),
    (9, 4, 'Todos los diagnósticos ergonómicos se integran al programa anual de seguridad y salud en el trabajo. Se recomienda mantener este control. (NOM-036, numeral 7.7)'),

    (10, 0, 'No se promueve ninguna cultura de prevención o ergonomía dentro de la organización. Se recomienda impulsar acciones que fomenten esta cultura entre el personal.'),
    (10, 1, 'Se han hecho algunas acciones aisladas para promover esta cultura, sin continuidad. Se recomienda darles seguimiento regular.'),
    (10, 2, 'Se promueve una cultura de prevención y ergonomía en algunas áreas de la organización, pero no en todas. Se recomienda extenderla.'),
    (10, 3, 'Se promueve una cultura de prevención y ergonomía en la mayoría de la organización. Se recomienda mantener esta práctica.'),
    (10, 4, 'Existe una cultura consolidada de prevención y ergonomía en toda la organización. Se recomienda mantener este control.')
) as v(numero, nivel, texto)
where i.numero = v.numero
  and i.criterio_id = (select id from nom036.criterio where numero = 4);

-- 3) Plantillas de apertura por bucket.

insert into nom036.plantilla_bucket (criterio_id, bucket, tipo, texto)
select c.id, v.bucket, 'apertura', v.texto
from nom036.criterio c
cross join (values
    ('inexistente', 'No existe un proceso formal de difusión ni de promoción de la salud en materia de ergonomía dentro de la organización.'),
    ('minimo', 'La difusión y promoción de la salud son Mínimas: la mayoría de las acciones de comunicación, registro y seguimiento en materia de ergonomía no están cubiertas.'),
    ('regular', 'La difusión y promoción de la salud se encuentran en un nivel Regular: existen avances, pero persisten vacíos relevantes.'),
    ('aceptable', 'La difusión y promoción de la salud presentan un nivel Aceptable, con puntos específicos por reforzar.'),
    ('optimo', 'La difusión y promoción de la salud están consolidadas.')
) as v(bucket, texto)
where c.numero = 4
  and not exists (
    select 1 from nom036.plantilla_bucket pb
    where pb.criterio_id = c.id and pb.bucket = v.bucket and pb.tipo = 'apertura'
  );
