-- Contenido real del Criterio 3 ("Capacitación, adiestramiento y vigilancia
-- a la salud"): numeral NOM-036 por ítem, recomendaciones por ítem × nivel
-- (10 ítems × 5 niveles = 50 filas), y plantillas de apertura por bucket.
--
-- Fuente: texto oficial de la NOM-036-1-STPS-2018
-- (references/NOM-036-1-STPS-2018.pdf), Capítulo 9 "Vigilancia a la salud
-- de los trabajadores" (9.1-9.5) y Capítulo 10 "Capacitación y
-- adiestramiento" (10.1-10.4), más las obligaciones del patrón 5.3 y 5.5
-- que remiten a esos capítulos.
--
-- Mismo registro que `content_criterio2.sql`: apertura que nombra
-- explícitamente la etiqueta de bucket, recomendación en dos oraciones
-- (diagnóstico + "Se recomienda..."), numeral citado en los niveles 0 y 4
-- cuando hay un numeral concreto.
--
-- Tres ítems (3.4, 3.8, 3.10) se marcan como OPTATIVOS (es_obligatorio =
-- false) — es la primera vez que se usa este valor en el catálogo: a
-- diferencia de los demás, no derivan de un requisito puntual de los
-- Capítulos 9/10, sino de buenas prácticas adicionales (técnica específica
-- de empuje/tracción, difusión de hábitos posturales, bienestar general).
-- Antes de este criterio, todos los ítems cargados (Criterios 1 y 2) eran
-- obligatorios por derivar directamente de un numeral — con esto, el
-- catálogo por fin tiene ítems que pueden aparecer en "Temas optativos" en
-- vez de "Temas obligatorios". Pendiente de confirmar con el Dr. Sergio,
-- igual que el resto del contenido.
--
-- Aviso aparte para el desarrollador: el ítem 3.9 pregunta si "la
-- capacitación se refuerza cada año", pero el numeral 10.3 de la norma pide
-- reforzarla "por lo menos cada dos años" — el ítem es más exigente que la
-- norma. Se redactó la recomendación citando el límite real de la norma
-- (cada dos años), no "cada año" como dice el ítem; confirmar con el Dr.
-- Sergio si el ítem debía decir "cada dos años" o si es una exigencia
-- propia del instrumento, más estricta a propósito.
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
    (1, '10.1', true),
    (2, '10.4', true),
    (3, '10.1', true),
    (4, null, false),
    (5, '8.1 y 9.2 a)', true),
    (6, '9.2 b)', true),
    (7, '9.5', true),
    (8, null, false),
    (9, '10.3', true),
    (10, null, false)
) as v(numero, numeral_nom, es_obligatorio)
where i.numero = v.numero
  and i.criterio_id = (select id from nom036.criterio where numero = 3);

-- 2) Recomendaciones por ítem × nivel.

insert into nom036.recomendacion (item_id, nivel, texto)
select i.id, v.nivel, v.texto
from nom036.item i
cross join (values
    (1, 0, 'El personal con tareas de manejo manual de cargas no ha recibido ninguna capacitación específica sobre técnicas seguras de manipulación. Se recomienda proporcionar esta capacitación, con énfasis en la prevención de riesgos y según las tareas de cada puesto. (NOM-036, numeral 10.1)'),
    (1, 1, 'Se ha dado alguna capacitación informal sobre manejo de cargas, sin cubrir todas las tareas ni al personal expuesto. Se recomienda formalizar y ampliar esta capacitación.'),
    (1, 2, 'Se capacita en técnicas seguras de manipulación a parte del personal expuesto, pero no a todos. Se recomienda extender la capacitación a todo el personal con tareas de manejo manual de cargas.'),
    (1, 3, 'La mayoría del personal con tareas de manejo manual de cargas ha recibido capacitación específica en técnicas seguras. Se recomienda completarla con el personal restante.'),
    (1, 4, 'Todo el personal con tareas de manejo manual de cargas ha recibido capacitación específica en técnicas seguras de manipulación. Se recomienda mantener este control. (NOM-036, numeral 10.1)'),

    (2, 0, 'No existen registros de las capacitaciones impartidas sobre manejo manual de cargas. Se recomienda llevar un registro con el nombre y puesto de los trabajadores, la fecha y los temas impartidos. (NOM-036, numeral 10.4)'),
    (2, 1, 'Hay registros informales o incompletos de las capacitaciones, sin un formato establecido. Se recomienda formalizar este registro.'),
    (2, 2, 'Existen registros de capacitación para algunas de las sesiones impartidas, pero no para todas. Se recomienda completar el registro faltante.'),
    (2, 3, 'Existen registros actualizados de la mayoría de las capacitaciones impartidas. Se recomienda mantenerlos al día.'),
    (2, 4, 'Existen registros actualizados de todas las capacitaciones impartidas, con nombre, puesto, fecha y temas. Se recomienda mantener este control. (NOM-036, numeral 10.4)'),

    (3, 0, 'La capacitación que se imparte no incluye ningún componente teórico, práctico ni de evaluación. Se recomienda estructurarla con instrucción teórica, entrenamiento práctico y evaluación de los conocimientos adquiridos. (NOM-036, numeral 10.1)'),
    (3, 1, 'La capacitación cubre solo uno de los tres componentes (teórico, práctico o de evaluación), de forma aislada. Se recomienda integrar los tres elementos.'),
    (3, 2, 'La capacitación incluye algunos de los tres componentes, pero no de forma completa en todas las sesiones. Se recomienda cubrir los tres en cada sesión.'),
    (3, 3, 'La capacitación incluye aspectos teóricos, prácticos y de evaluación en la mayoría de las sesiones. Se recomienda mantener esta estructura.'),
    (3, 4, 'La capacitación incluye siempre instrucción teórica, entrenamiento práctico y evaluación de los conocimientos y habilidades adquiridos. Se recomienda mantener este control. (NOM-036, numeral 10.1)'),

    (4, 0, 'No se capacita al personal de almacén en técnicas seguras de empuje y tracción de cargas. Se recomienda incluir este tema en la capacitación cuando el personal realice estas actividades.'),
    (4, 1, 'Se ha dado alguna indicación informal sobre empuje y tracción, sin que sea parte de la capacitación formal. Se recomienda incorporar este tema de forma estructurada.'),
    (4, 2, 'Se capacita en técnicas de empuje y tracción a parte del personal de almacén, pero no a todos los que realizan estas actividades. Se recomienda extender la capacitación.'),
    (4, 3, 'Se capacita en técnicas seguras de empuje y tracción a la mayoría del personal de almacén. Se recomienda completarla con el personal restante.'),
    (4, 4, 'Se capacita a todo el personal de almacén en técnicas seguras de empuje y tracción de cargas. Se recomienda mantener este control.'),

    (5, 0, 'No se aplican exámenes médicos de ingreso para evaluar la aptitud física del personal que realizará manejo manual de cargas. Se recomienda aplicar estos exámenes antes de asignar tareas de manejo de cargas. (NOM-036, numerales 8.1 y 9.2)'),
    (5, 1, 'Se aplican exámenes médicos de ingreso de forma general, sin enfocarse en la aptitud física para el manejo de cargas. Se recomienda incluir específicamente esta evaluación.'),
    (5, 2, 'Se aplican exámenes médicos de ingreso enfocados en manejo de cargas a parte del personal, pero no a todos los que ingresan a estas tareas. Se recomienda extender esta práctica.'),
    (5, 3, 'Se aplican exámenes médicos de ingreso para evaluar la aptitud física a la mayoría del personal que realiza manejo manual de cargas. Se recomienda completarlo con el resto.'),
    (5, 4, 'Se aplican exámenes médicos de ingreso para evaluar la aptitud física de todo el personal que realizará manejo manual de cargas. Se recomienda mantener este control. (NOM-036, numerales 8.1 y 9.2)'),

    (6, 0, 'No se realizan evaluaciones médicas periódicas al personal ocupacionalmente expuesto al manejo manual de cargas. Se recomienda establecer un seguimiento clínico, al menos anual, o ante evidencia de signos o síntomas. (NOM-036, numeral 9.2)'),
    (6, 1, 'Se realizan evaluaciones médicas de forma esporádica, sin una periodicidad establecida. Se recomienda formalizar un programa de seguimiento clínico.'),
    (6, 2, 'Se realizan evaluaciones médicas periódicas a parte del personal expuesto, pero no a todos. Se recomienda extender el seguimiento a todo el personal expuesto.'),
    (6, 3, 'Se realizan evaluaciones médicas periódicas a la mayoría del personal expuesto. Se recomienda completarlo con el personal restante.'),
    (6, 4, 'Se realizan evaluaciones médicas periódicas a todo el personal ocupacionalmente expuesto, con seguimiento clínico anual. Se recomienda mantener este control. (NOM-036, numeral 9.2)'),

    (7, 0, 'No existe un procedimiento para reubicar al personal cuando el médico determina una restricción para el manejo manual de cargas. Se recomienda establecer este procedimiento, con base en la aptitud física que determine el médico. (NOM-036, numeral 9.5)'),
    (7, 1, 'La reubicación de personal con restricción médica se resuelve caso por caso, sin un procedimiento definido. Se recomienda formalizar este proceso.'),
    (7, 2, 'Se ha reubicado a parte del personal con restricción médica, pero no existe un procedimiento aplicado de forma consistente. Se recomienda estandarizarlo.'),
    (7, 3, 'Se reubica al personal con restricción médica en la mayoría de los casos identificados. Se recomienda mantener y documentar este procedimiento.'),
    (7, 4, 'Se reubica de forma sistemática al personal con restricción médica para el manejo manual de cargas, conforme a lo que determina el médico. Se recomienda mantener este control. (NOM-036, numeral 9.5)'),

    (8, 0, 'No se promueven hábitos posturales saludables en el entorno laboral. Se recomienda implementar campañas, charlas, carteles o trípticos informativos sobre el tema.'),
    (8, 1, 'Se han hecho algunas acciones aisladas de promoción de hábitos posturales, sin continuidad. Se recomienda darles seguimiento regular.'),
    (8, 2, 'Se promueven hábitos posturales saludables en algunas áreas de la empresa, pero no en todas. Se recomienda extender estas acciones a toda la organización.'),
    (8, 3, 'Se promueven hábitos posturales saludables en la mayoría de la organización, a través de distintos medios. Se recomienda mantener esta práctica.'),
    (8, 4, 'Se promueven de forma constante hábitos posturales saludables en toda la organización, a través de campañas, charlas, carteles y trípticos. Se recomienda mantener este control.'),

    (9, 0, 'La capacitación en manejo manual de cargas no se refuerza nunca después de la capacitación inicial. Se recomienda reforzarla por lo menos cada dos años, o antes si se introducen herramientas o equipo nuevo, o si cambian las condiciones de trabajo. (NOM-036, numeral 10.3)'),
    (9, 1, 'La capacitación se refuerza de forma esporádica, sin una periodicidad establecida. Se recomienda formalizar la frecuencia de refuerzo.'),
    (9, 2, 'La capacitación se refuerza en algunos casos cuando cambian las condiciones de trabajo, pero no de forma sistemática. Se recomienda aplicar este criterio de manera constante.'),
    (9, 3, 'La capacitación se refuerza de forma periódica, y también cuando hay cambios en el proceso. Se recomienda mantener esta práctica.'),
    (9, 4, 'La capacitación se refuerza por lo menos cada dos años, y antes cuando se introduce equipo nuevo o cambian las condiciones de trabajo. Se recomienda mantener este control. (NOM-036, numeral 10.3)'),

    (10, 0, 'No se contempla el bienestar físico ni psicológico del personal en las actividades que implican esfuerzo físico. Se recomienda incorporar este enfoque en los programas de ergonomía o de salud en el trabajo.'),
    (10, 1, 'El bienestar físico y psicológico del personal se contempla de forma informal, sin acciones concretas. Se recomienda definir acciones específicas al respecto.'),
    (10, 2, 'Se contempla el bienestar físico y psicológico en algunas actividades con esfuerzo físico, pero no en todas. Se recomienda extender este enfoque.'),
    (10, 3, 'Se contempla el bienestar físico y psicológico del personal en la mayoría de las actividades con esfuerzo físico. Se recomienda mantener esta práctica.'),
    (10, 4, 'Se contempla de forma integral el bienestar físico y psicológico del personal en todas las actividades con esfuerzo físico. Se recomienda mantener este control.')
) as v(numero, nivel, texto)
where i.numero = v.numero
  and i.criterio_id = (select id from nom036.criterio where numero = 3);

-- 3) Plantillas de apertura por bucket.

insert into nom036.plantilla_bucket (criterio_id, bucket, tipo, texto)
select c.id, v.bucket, 'apertura', v.texto
from nom036.criterio c
cross join (values
    ('inexistente', 'No existe un proceso formal de capacitación, adiestramiento ni vigilancia a la salud del personal, conforme a lo que exige la NOM-036-1-STPS-2018 en sus Capítulos 9 y 10.'),
    ('minimo', 'La capacitación, el adiestramiento y la vigilancia a la salud del personal son Mínimos: la mayoría de las medidas que exigen los Capítulos 9 y 10 de la NOM-036-1-STPS-2018 no están cubiertas.'),
    ('regular', 'La capacitación, el adiestramiento y la vigilancia a la salud del personal se encuentran en un nivel Regular: existen avances, pero persisten vacíos relevantes.'),
    ('aceptable', 'La capacitación, el adiestramiento y la vigilancia a la salud del personal presentan un nivel Aceptable, con puntos específicos por reforzar.'),
    ('optimo', 'La capacitación, el adiestramiento y la vigilancia a la salud del personal están consolidados.')
) as v(bucket, texto)
where c.numero = 3
  and not exists (
    select 1 from nom036.plantilla_bucket pb
    where pb.criterio_id = c.id and pb.bucket = v.bucket and pb.tipo = 'apertura'
  );
