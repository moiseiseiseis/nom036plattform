-- Carga los 40 ítems de los Criterios 2-5 (10 cada uno), a partir del
-- instrumento oficial que entregó el Dr. Sergio:
-- `references/Formato de Pre Diagnóstico NOM 036-1-STPS-2018 versión
-- 22.09.26.xlsx` (hoja "Diagnóstico B"). Desbloquea CLAUDE.md sección 4
-- ("Lista completa de los 50 ítems").
--
-- Solo carga el texto de la pregunta (`texto_pregunta`). `numeral_nom` queda
-- en NULL y `es_obligatorio` en el default `true` (mismo placeholder que
-- usó `seed_etapa1_criterio1.sql` para el Criterio 1 antes de
-- `content_v1_criterio1.sql`) — todavía falta cruzar cada ítem contra el
-- texto oficial de la NOM-036 (Capítulos 7 y 8) para asignar el numeral
-- correcto y decidir obligatorio/optativo, igual que se hizo para el
-- Criterio 1. Las recomendaciones por ítem × nivel y las plantillas de
-- apertura/cierre por bucket de estos 4 criterios tampoco están cargadas
-- todavía (quedan como el siguiente paso de contenido).
--
-- Texto de las preguntas copiado literalmente del archivo del Dr. Sergio,
-- solo recortando espacios en blanco sueltos — no se corrigieron erratas
-- del original (ver aviso aparte al desarrollador: ítem 1.7 con un
-- paréntesis sin cerrar y el ítem 5.9 con una palabra que parece faltar),
-- porque este texto puede llegar a imprimirse tal cual en el formulario
-- público.

insert into nom036.item (criterio_id, numero, texto_pregunta, numeral_nom, es_obligatorio)
select c.id, v.numero, v.texto, null, true
from nom036.criterio c
cross join (values
    (1, 'Se utilizan dispositivos auxiliares (carretillas, diablos, patines) en el manejo cotidiano de cargas'),
    (2, 'Se evalúa la estabilidad de las cargas antes de su transporte (por ejemplo, que no se vaya a caer del diablo, patín, carretilla, etc.)'),
    (3, 'Se conoce la capacidad de carga que tiene cada equipo auxiliar'),
    (4, 'Las superficies de rodamiento (pisos) están niveladas, limpias y libres de obstáculos'),
    (5, 'Los pasillos de tránsito permiten maniobras seguras con cargas'),
    (6, 'Las rampas, pendientes y plataformas cuentan con indicaciones como señalización y pintura de carriles para uso seguro'),
    (7, 'Se revisa periódicamente el estado físico del equipo auxiliar'),
    (8, 'Las cargas se distribuyen equilibradamente en el equipo auxiliar durante el traslado'),
    (9, 'Se identifican riesgos adicionales por condiciones térmicas o de iluminación en las rutas de traslado'),
    (10, 'Se aplican límites de peso total por jornada de trabajo en transporte de materiales (con o sin uso de equipo auxiliar)')
) as v(numero, texto)
where c.numero = 2;

insert into nom036.item (criterio_id, numero, texto_pregunta, numeral_nom, es_obligatorio)
select c.id, v.numero, v.texto, null, true
from nom036.criterio c
cross join (values
    (1, 'El personal con tareas de manejo manual de cargas ha recibido capacitación específica en técnicas seguras para la manipulación de estas'),
    (2, 'Existen registros actualizados de dichas capacitaciones'),
    (3, 'La capacitación incluye aspectos teóricos, prácticos y de evaluación'),
    (4, 'Se capacita al personal de almacén en técnicas seguras de empuje y tracción'),
    (5, 'Se aplican exámenes médicos de ingreso para evaluar aptitud física para el manejo manual de cargas'),
    (6, 'Se realizan evaluaciones médicas periódicas al personal expuesto'),
    (7, 'Se ha reubicado personal en caso de restricción médica para el manejo manual de cargas'),
    (8, 'Se promueven hábitos posturales saludables en el entorno laboral por medio de campañas, charlas informativas, carteles, trípticos, etc.'),
    (9, 'La capacitación se refuerza cada año o tras cambios en el proceso'),
    (10, 'Se contempla el bienestar físico y psicológico del personal en actividades con esfuerzo físico')
) as v(numero, texto)
where c.numero = 3;

insert into nom036.item (criterio_id, numero, texto_pregunta, numeral_nom, es_obligatorio)
select c.id, v.numero, v.texto, null, true
from nom036.criterio c
cross join (values
    (1, 'Existe políticas internas y por escrito en materia de prevención de riesgos ergonómicos en el trabajo'),
    (2, 'Se ha designado un responsable para el cumplimiento de la NOM-036-1-STPS-2018'),
    (3, 'Se destina presupuesto para la adquisición de equipos auxiliares de carga'),
    (4, 'Se mantienen registros actualizados de diagnósticos, programas y acciones en ergonomía'),
    (5, 'Se supervisa la aplicación de las medidas ergonómicas dentro de los puestos de trabajo'),
    (6, 'Se han realizado auditorías internas o externas de cumplimiento normativo'),
    (7, 'Se ha comunicado al personal la importancia de esta norma mediante carteles, pláticas, boletines u otro medio informativo'),
    (8, 'La información sobre riesgos por Manejo Manual de Cargas es accesible a todos los trabajadores'),
    (9, 'Se integran los diagnósticos ergonómicos al programa anual de seguridad y salud'),
    (10, 'Se promueve una cultura de prevención y ergonomía dentro de la organización')
) as v(numero, texto)
where c.numero = 4;

insert into nom036.item (criterio_id, numero, texto_pregunta, numeral_nom, es_obligatorio)
select c.id, v.numero, v.texto, null, true
from nom036.criterio c
cross join (values
    (1, 'Se cuenta con un diagnóstico enfocado en la identificación de factores de riesgo ergonómico por manejo manual de cargas'),
    (2, 'Se ha realizado un análisis detallado de los puestos de trabajo mediante la aplicación de al menos un método de evaluación ergonómica como NIOSH, REBA, MAC Tool, RAPP Tool, etc.'),
    (3, 'Se aplican medidas técnicas (redistribución de espacios, adecuación de estaciones) para reducir riesgos'),
    (4, 'Se han implementado medidas administrativas como rotación de puestos de trabajo o pausas activas'),
    (5, 'Se cuenta con un programa formar de ergonomía con responsables y cronograma para la implementación de mejoras'),
    (6, 'Se da seguimiento a los casos de trastornos músculo-esqueléticos'),
    (7, 'Se ha aplicado el Cuestionario Nórdico de Kuorinka a los trabajadores'),
    (8, 'Se generan reportes de mejora continua en ergonomía'),
    (9, 'Se capacita al personal en la autodetección de síntomas musculoesqueléticos que estén posiblemente  con el manejo manual de cargas'),
    (10, 'En el programa de ergonomía se describen de manera clara las medidas de prevención y control ante la exposición a factores de riesgo ergonómico por manejo manual de cargas')
) as v(numero, texto)
where c.numero = 5;

-- El nombre del Criterio 4 confirmado por el informe JASANA ("Difusión,
-- registro y políticas en materia de Ergonomía", CLAUDE.md sección 4) no
-- coincide con el nombre del instrumento oficial del Dr. Sergio
-- ("Difusión y promoción de la salud") — se actualiza al nombre oficial,
-- que es la fuente más directa.
update nom036.criterio
set nombre = 'Difusión y promoción de la salud'
where numero = 4;
