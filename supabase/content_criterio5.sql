-- Contenido real del Criterio 5 ("Medidas de prevención y control"):
-- numeral NOM-036 por ítem, recomendaciones por ítem × nivel (10 ítems × 5
-- niveles = 50 filas), y plantillas de apertura por bucket. Último de los
-- 5 criterios — completa el contenido base del instrumento (Etapa 7).
--
-- Fuente: texto oficial de la NOM-036-1-STPS-2018
-- (references/NOM-036-1-STPS-2018.pdf), Capítulo 7 "Análisis de los
-- factores de riesgo ergonómico" (7.1-7.7), Capítulo 8 "Medidas de
-- prevención y/o control" (8.1-8.7), Capítulo 9 "Vigilancia a la salud"
-- (9.2) y Capítulo 10 "Capacitación y adiestramiento" (10.1). Este criterio
-- es el que mapea de forma más directa a la norma desde el Criterio 1 — la
-- mayoría de sus ítems citan un numeral concreto.
--
-- Mapeo item -> numeral -> obligatorio/optativo:
--   5.1  Diagnóstico de factores de riesgo        -> 7.1      -> obligatorio
--   5.2  Método de evaluación ergonómica          -> 7.3      -> obligatorio
--   5.3  Medidas técnicas                         -> 8.7      -> obligatorio
--   5.4  Medidas administrativas                  -> 8.6      -> obligatorio
--   5.5  Programa formal de ergonomía             -> 8.5      -> obligatorio
--   5.6  Seguimiento a trastornos musculoesquel.  -> 9.2 b)   -> obligatorio
--   5.7  Cuestionario Nórdico de Kuorinka         -> 9.2      -> optativo
--   5.8  Reportes de mejora continua              -> (sin numeral) -> optativo
--   5.9  Capacitación en autodetección            -> 10.1     -> obligatorio
--   5.10 Programa describe medidas con claridad   -> 8.5 b)   -> obligatorio
--
-- El ítem 5.7 es un caso como el 4.6 (auditorías, Criterio 4) y el 11.1 de
-- unidades de verificación: el numeral 9.2 dice textualmente que la
-- detección de síntomas "SE PODRÁ realizar mediante la aplicación del
-- Cuestionario Nórdico de Kuorinka" — la vigilancia a la salud en sí es
-- obligatoria (numeral 9.2, ítem 5.6), pero esta herramienta específica es
-- solo una de las formas posibles, no la única ni una exigida. Por eso se
-- marca optativa aunque sí tenga un numeral concreto detrás.
--
-- Los ítems 5.3 y 5.4 citan ejemplos de medidas que los numerales 8.6/8.7
-- listan como no exhaustivos ("podrán comprender, entre otras, las
-- siguientes") — se mantienen como obligatorios porque la obligación real
-- (adoptar alguna medida de control cuando el análisis de riesgo lo
-- indique, numeral 8.4) sí es un requisito de la norma y el ítem nombra
-- una de las formas válidas de cumplirla, igual que los ítems del
-- Criterio 1 que citan el Apéndice I o II como métodos específicos.
--
-- El ítem 5.2 menciona métodos como "NIOSH, REBA, MAC Tool, RAPP Tool" que
-- no aparecen enumerados tal cual en la norma (el numeral 4.9 sí cita el
-- método NIOSH y "otros métodos científicamente validados"; REBA, MAC Tool
-- y RAPP Tool son métodos de la literatura ergonómica en general, no
-- mencionados por nombre en la NOM-036) — se cita el numeral 7.3
-- (estimación del nivel de riesgo conforme al Apéndice I o II) como la
-- obligación real que estos métodos ayudan a cumplir.
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
    (1, '7.1', true),
    (2, '7.3', true),
    (3, '8.7', true),
    (4, '8.6', true),
    (5, '8.5', true),
    (6, '9.2 b)', true),
    (7, '9.2', false),
    (8, null, false),
    (9, '10.1', true),
    (10, '8.5 b)', true)
) as v(numero, numeral_nom, es_obligatorio)
where i.numero = v.numero
  and i.criterio_id = (select id from nom036.criterio where numero = 5);

-- 2) Recomendaciones por ítem × nivel.

insert into nom036.recomendacion (item_id, nivel, texto)
select i.id, v.nivel, v.texto
from nom036.item i
cross join (values
    (1, 0, 'No se cuenta con ningún diagnóstico enfocado en identificar los factores de riesgo ergonómico por manejo manual de cargas. Se recomienda elaborar el análisis que integra la identificación de actividades, la estimación del nivel de riesgo y, en su caso, la evaluación específica. (NOM-036, numeral 7.1)'),
    (1, 1, 'Existe un diagnóstico parcial o informal, que no cubre todos los elementos que exige el análisis de riesgo. Se recomienda completarlo conforme a lo que pide la norma.'),
    (1, 2, 'Se cuenta con un diagnóstico que identifica algunos factores de riesgo, pero no todos los puestos con manejo manual de cargas. Se recomienda extenderlo a los puestos faltantes.'),
    (1, 3, 'Se cuenta con un diagnóstico que identifica los factores de riesgo ergonómico en la mayoría de los puestos. Se recomienda mantenerlo actualizado.'),
    (1, 4, 'Se cuenta con un diagnóstico completo que identifica los factores de riesgo ergonómico por manejo manual de cargas en todos los puestos. Se recomienda mantener este control. (NOM-036, numeral 7.1)'),

    (2, 0, 'No se ha aplicado ningún método de evaluación ergonómica (como NIOSH, REBA, MAC Tool o RAPP Tool) a los puestos de trabajo. Se recomienda aplicar la estimación del nivel de riesgo conforme al Apéndice I o al Apéndice II de la norma, según el tipo de actividad. (NOM-036, numeral 7.3)'),
    (2, 1, 'Se ha intentado aplicar algún método de evaluación ergonómica, pero de forma incompleta o no sistemática. Se recomienda formalizar su aplicación.'),
    (2, 2, 'Se aplica algún método de evaluación ergonómica en algunos puestos de trabajo, pero no en todos los que lo requieren. Se recomienda extender su aplicación.'),
    (2, 3, 'Se aplica un método de evaluación ergonómica en la mayoría de los puestos de trabajo que lo requieren. Se recomienda mantener esta práctica y documentar los resultados.'),
    (2, 4, 'Se aplica y documenta un método de evaluación ergonómica validado en todos los puestos de trabajo que lo requieren. Se recomienda mantener este control. (NOM-036, numeral 7.3)'),

    (3, 0, 'No se aplica ninguna medida técnica, como redistribución de espacios o adecuación de estaciones, para reducir los riesgos identificados. Se recomienda adoptar medidas de control técnicas cuando el análisis de riesgo así lo indique. (NOM-036, numeral 8.7)'),
    (3, 1, 'Se han hecho algunos ajustes técnicos aislados, sin que respondan a un análisis de riesgo. Se recomienda basar estos ajustes en los resultados del análisis.'),
    (3, 2, 'Se aplican medidas técnicas en algunas áreas o estaciones de trabajo, pero no en todas las que lo requieren. Se recomienda extenderlas.'),
    (3, 3, 'Se aplican medidas técnicas en la mayoría de las áreas o estaciones que lo requieren. Se recomienda mantener esta práctica.'),
    (3, 4, 'Se aplican medidas técnicas (redistribución de espacios, adecuación de estaciones, modificación de procesos o equipos) en todas las áreas que lo requieren. Se recomienda mantener este control. (NOM-036, numeral 8.7)'),

    (4, 0, 'No se han implementado medidas administrativas como rotación de puestos o pausas activas. Se recomienda adoptar alguna de estas medidas cuando el análisis de riesgo lo indique. (NOM-036, numeral 8.6)'),
    (4, 1, 'Se aplican medidas administrativas de forma informal u ocasional, sin un criterio establecido. Se recomienda formalizarlas.'),
    (4, 2, 'Se implementan medidas administrativas en algunos puestos de trabajo, pero no en todos los que lo requieren. Se recomienda extenderlas.'),
    (4, 3, 'Se implementan medidas administrativas en la mayoría de los puestos que lo requieren. Se recomienda mantener esta práctica.'),
    (4, 4, 'Se implementan de forma sistemática medidas administrativas (rotación de puestos, pausas activas, reprogramación de actividades) en todos los puestos que lo requieren. Se recomienda mantener este control. (NOM-036, numeral 8.6)'),

    (5, 0, 'No se cuenta con ningún programa formal de ergonomía. Se recomienda elaborar uno que incluya los puestos sujetos al programa, las medidas de control, las fechas programadas, el responsable de su ejecución y la evaluación posterior. (NOM-036, numeral 8.5)'),
    (5, 1, 'Existe un programa informal, sin que cumpla con todos los elementos que exige la norma. Se recomienda formalizarlo.'),
    (5, 2, 'El programa de ergonomía existe, pero le faltan elementos como el cronograma o el responsable asignado. Se recomienda completarlo.'),
    (5, 3, 'El programa de ergonomía cuenta con la mayoría de sus elementos (puestos, medidas, fechas, responsable). Se recomienda mantenerlo actualizado.'),
    (5, 4, 'Se cuenta con un programa formal de ergonomía completo, con responsables y cronograma para la implementación de mejoras. Se recomienda mantener este control. (NOM-036, numeral 8.5)'),

    (6, 0, 'No se da ningún seguimiento a los casos de trastornos músculo-esqueléticos en el personal. Se recomienda dar seguimiento clínico a estos casos, conforme al programa de vigilancia a la salud. (NOM-036, numeral 9.2)'),
    (6, 1, 'El seguimiento a estos casos se hace de forma informal, sin un procedimiento establecido. Se recomienda formalizarlo.'),
    (6, 2, 'Se da seguimiento a algunos casos de trastornos músculo-esqueléticos, pero no a todos los identificados. Se recomienda extender este seguimiento.'),
    (6, 3, 'Se da seguimiento a la mayoría de los casos de trastornos músculo-esqueléticos identificados. Se recomienda mantener esta práctica.'),
    (6, 4, 'Se da seguimiento clínico sistemático a todos los casos de trastornos músculo-esqueléticos identificados. Se recomienda mantener este control. (NOM-036, numeral 9.2)'),

    (7, 0, 'No se ha aplicado el Cuestionario Nórdico de Kuorinka ni ninguna otra herramienta similar para detectar síntomas músculo-esqueléticos. Se recomienda considerar su aplicación como una de las formas que permite la norma para esta detección. (NOM-036, numeral 9.2)'),
    (7, 1, 'Se ha aplicado el cuestionario de forma aislada, a muy pocos trabajadores. Se recomienda ampliar su aplicación.'),
    (7, 2, 'Se aplica el cuestionario a algunos grupos de trabajadores, pero no de forma regular. Se recomienda establecer una periodicidad.'),
    (7, 3, 'Se aplica el Cuestionario Nórdico de Kuorinka a la mayoría de los trabajadores expuestos, de forma periódica. Se recomienda mantener esta práctica.'),
    (7, 4, 'Se aplica de forma periódica el Cuestionario Nórdico de Kuorinka a todos los trabajadores expuestos. Se recomienda mantener este control. (NOM-036, numeral 9.2)'),

    (8, 0, 'No se generan reportes de mejora continua en materia de ergonomía. Se recomienda generarlos para dar seguimiento a los avances del programa de ergonomía.'),
    (8, 1, 'Se generan reportes de forma esporádica, sin un formato ni periodicidad establecidos. Se recomienda formalizarlos.'),
    (8, 2, 'Se generan reportes de mejora continua para algunas áreas o periodos, pero no de forma constante. Se recomienda ampliar su alcance.'),
    (8, 3, 'Se generan reportes de mejora continua en ergonomía de forma periódica para la mayoría de las áreas. Se recomienda mantener esta práctica.'),
    (8, 4, 'Se generan de forma periódica reportes de mejora continua en ergonomía para toda la organización. Se recomienda mantener este control.'),

    (9, 0, 'No se capacita al personal para autodetectar síntomas musculoesqueléticos relacionados con el manejo manual de cargas. Se recomienda incluir este tema en la capacitación, junto con los efectos a la salud de la exposición a estos factores de riesgo. (NOM-036, numeral 10.1)'),
    (9, 1, 'Se ha dado alguna información aislada sobre el tema, sin que forme parte de la capacitación formal. Se recomienda incorporarlo de forma estructurada.'),
    (9, 2, 'Se capacita en autodetección de síntomas a parte del personal, pero no a todo el expuesto. Se recomienda extender esta capacitación.'),
    (9, 3, 'Se capacita en autodetección de síntomas musculoesqueléticos a la mayoría del personal expuesto. Se recomienda completarla con el personal restante.'),
    (9, 4, 'Se capacita a todo el personal expuesto en la autodetección de síntomas musculoesqueléticos relacionados con el manejo manual de cargas. Se recomienda mantener este control. (NOM-036, numeral 10.1)'),

    (10, 0, 'El programa de ergonomía no describe las medidas de prevención y control ante la exposición a factores de riesgo ergonómico. Se recomienda incluir esta descripción como parte del contenido del programa. (NOM-036, numeral 8.5)'),
    (10, 1, 'El programa describe las medidas de forma general, sin precisar cómo se aplican. Se recomienda detallarlas con mayor claridad.'),
    (10, 2, 'El programa describe con claridad las medidas de prevención y control para algunos puestos, pero no para todos. Se recomienda completar esta descripción.'),
    (10, 3, 'El programa describe con claridad las medidas de prevención y control para la mayoría de los puestos. Se recomienda mantenerlo actualizado.'),
    (10, 4, 'El programa de ergonomía describe con claridad las medidas de prevención y control para todos los puestos expuestos a factores de riesgo ergonómico. Se recomienda mantener este control. (NOM-036, numeral 8.5)')
) as v(numero, nivel, texto)
where i.numero = v.numero
  and i.criterio_id = (select id from nom036.criterio where numero = 5);

-- 3) Plantillas de apertura por bucket.

insert into nom036.plantilla_bucket (criterio_id, bucket, tipo, texto)
select c.id, v.bucket, 'apertura', v.texto
from nom036.criterio c
cross join (values
    ('inexistente', 'No existe un proceso formal de medidas de prevención y control de los factores de riesgo ergonómico, conforme a lo que exige el Capítulo 8 de la NOM-036-1-STPS-2018.'),
    ('minimo', 'Las medidas de prevención y control son Mínimas: la mayoría de los elementos que exige el Capítulo 8 de la NOM-036-1-STPS-2018 no están cubiertos.'),
    ('regular', 'Las medidas de prevención y control se encuentran en un nivel Regular: existen avances, pero persisten vacíos relevantes.'),
    ('aceptable', 'Las medidas de prevención y control presentan un nivel Aceptable, con puntos específicos por reforzar.'),
    ('optimo', 'Las medidas de prevención y control están consolidadas.')
) as v(bucket, texto)
where c.numero = 5
  and not exists (
    select 1 from nom036.plantilla_bucket pb
    where pb.criterio_id = c.id and pb.bucket = v.bucket and pb.tipo = 'apertura'
  );
