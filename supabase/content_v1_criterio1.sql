-- Primera versión de contenido real para el Criterio 1: numeral NOM-036 por
-- ítem, recomendaciones por ítem × nivel, y plantillas de apertura/cierre
-- por bucket (Criterio 1 y global). Sustituye el contenido "[PLACEHOLDER]"
-- cargado en las Etapas 1 y 4.
--
-- Fuente: texto oficial de la NOM-036-1-STPS-2018 (references/NOM-036-1-STPS-2018.pdf,
-- Capítulos 7 y 8, numerales citados por ítem) y estructura narrativa del
-- informe JASANA real (references/REPORTE FINAL JASANA 07.03.26.docx).
--
-- Es la primera versión de trabajo, co-redactada con el desarrollador y
-- pendiente de la revisión y validación final del Dr. Sergio (CLAUDE.md,
-- sección 4). Los 10 ítems del Criterio 1 se clasifican como "obligatorios"
-- porque todos derivan directamente del análisis exigido por el Capítulo 7
-- de la norma (obligación 5.1 del patrón), no de una sugerencia opcional.

-- 1) Numeral NOM-036 y clasificación obligatorio/optativo por ítem.

update nom036.item i
set numeral_nom = v.numeral_nom,
    es_obligatorio = true
from (values
    (1, '7.2 a)'),
    (2, '8.2 c)'),
    (3, '8.3 a) 3)'),
    (4, '7.3'),
    (5, '7.2 d)'),
    (6, '8.3 b) 2) y Tabla 1'),
    (7, '7.4'),
    (8, '8.7 b) y c)'),
    (9, '8.6 a) 2)'),
    (10, '8.3 b) 5)')
) as v(numero, numeral_nom)
where i.numero = v.numero
  and i.criterio_id = (select id from nom036.criterio where numero = 1);

-- 2) Recomendaciones por ítem × nivel (10 ítems × 5 niveles = 50 filas).

update nom036.recomendacion r
set texto = v.texto
from nom036.item i, (values
    (1, 0, 'No se han identificado las tareas que implican manejo manual de cargas (levantar, bajar, empujar, jalar, transportar o estibar materiales). Se recomienda realizar el análisis de identificación que exige el numeral 7.2 de la NOM-036-1-STPS-2018, enlistando cada actividad, tarea o puesto de trabajo en el que se manipulen cargas.'),
    (1, 1, 'La identificación de tareas con manejo manual de cargas es parcial o informal. Se recomienda formalizarla por escrito, cubriendo todas las actividades de levantar, bajar, empujar, jalar, transportar y estibar materiales, conforme al numeral 7.2.'),
    (1, 2, 'Existe una identificación de tareas con manejo manual de cargas, pero no cubre todos los puestos de trabajo. Se recomienda revisarla y completarla para todos los puestos ocupacionalmente expuestos.'),
    (1, 3, 'La identificación de tareas con manejo manual de cargas cubre la mayoría de los puestos. Se recomienda mantenerla actualizada y revisarla cuando cambien las condiciones de trabajo (numeral 7.6).'),
    (1, 4, 'La identificación de tareas con manejo manual de cargas está completa y documentada conforme al numeral 7.2. Se recomienda mantener este proceso y actualizarlo periódicamente.'),

    (2, 0, 'No se conoce el peso promedio ni máximo de las cargas manipuladas en las estaciones de trabajo. Se recomienda determinar estos datos como parte de las características de la carga que exige el numeral 8.2 c) de la NOM-036-1-STPS-2018.'),
    (2, 1, 'Se tiene una idea aproximada del peso de las cargas, pero no está documentada ni verificada. Se recomienda medir y registrar el peso promedio y máximo por estación de trabajo.'),
    (2, 2, 'Se conoce el peso de las cargas en algunas estaciones de trabajo, pero no en todas. Se recomienda completar el registro para todas las estaciones donde se manipulen cargas.'),
    (2, 3, 'Se conoce el peso promedio y máximo de las cargas en la mayoría de las estaciones de trabajo. Se recomienda mantener este registro actualizado.'),
    (2, 4, 'Se conoce y tiene documentado el peso promedio y máximo de las cargas en todas las estaciones de trabajo, conforme al numeral 8.2 c). Se recomienda mantener este control.'),

    (3, 0, 'Las actividades de carga manual se realizan en espacios reducidos o con obstrucciones frecuentes. Se recomienda mantener las áreas de tránsito y de trabajo libres de obstáculos, conforme al numeral 8.3 a).'),
    (3, 1, 'Existen obstrucciones o falta de espacio en varias de las áreas donde se realiza manejo manual de cargas. Se recomienda revisar y despejar dichas áreas.'),
    (3, 2, 'La mayoría de las áreas cuentan con espacio suficiente, pero persisten algunos puntos con obstrucciones. Se recomienda identificarlos y corregirlos.'),
    (3, 3, 'Las áreas de trabajo cuentan con espacio suficiente y están libres de obstáculos en la mayoría de los casos. Se recomienda mantener esta condición mediante inspecciones periódicas.'),
    (3, 4, 'Todas las áreas donde se realiza manejo manual de cargas cuentan con espacio suficiente y están libres de obstrucciones. Se recomienda mantener este control como parte de las inspecciones rutinarias.'),

    (4, 0, 'No se aplica ningún método de estimación del riesgo para las actividades de manejo manual de cargas. Se recomienda realizar la estimación del nivel de riesgo conforme al Apéndice I (levantar, bajar o transportar cargas) o al Apéndice II (empujar o jalar cargas) de la NOM-036-1-STPS-2018, según corresponda.'),
    (4, 1, 'Se ha intentado aplicar algún método de estimación del riesgo, pero de forma incompleta o no sistemática. Se recomienda formalizar su aplicación conforme al numeral 7.3.'),
    (4, 2, 'Se aplican métodos de estimación del riesgo en algunas actividades, pero no en todas las que involucran manejo manual de cargas. Se recomienda extender su aplicación a todas las actividades identificadas.'),
    (4, 3, 'Se aplican métodos de estimación del riesgo (Apéndice I o II) en la mayoría de las actividades de manejo manual de cargas. Se recomienda mantener esta práctica y documentar los resultados.'),
    (4, 4, 'Se aplican y documentan métodos de estimación del riesgo (Apéndice I o II) para todas las actividades de manejo manual de cargas, conforme al numeral 7.3. Se recomienda mantener esta práctica.'),

    (5, 0, 'No se registra la frecuencia con que se levantan o trasladan cargas durante la jornada laboral. Se recomienda registrar este dato como parte de la identificación de actividades que exige el numeral 7.2 d).'),
    (5, 1, 'Se tiene una estimación informal de la frecuencia, sin registro documentado. Se recomienda formalizar su registro.'),
    (5, 2, 'Se registra la frecuencia en algunas actividades, pero no de manera sistemática en todas. Se recomienda extender el registro a todas las actividades con manejo manual de cargas.'),
    (5, 3, 'Se registra la frecuencia de levantamiento o traslado de cargas en la mayoría de las actividades. Se recomienda mantener y actualizar este registro.'),
    (5, 4, 'Se registra sistemáticamente la frecuencia de levantamiento o traslado de cargas en todas las actividades, conforme al numeral 7.2 d). Se recomienda mantener esta práctica.'),

    (6, 0, 'No se verifica que las cargas manipuladas respeten los límites de masa máxima por género y edad establecidos en la Tabla 1 de la NOM-036-1-STPS-2018. Se recomienda implementar esta verificación conforme al numeral 8.3 b).'),
    (6, 1, 'Existe una verificación informal de los límites de carga por género y edad, sin comparación sistemática contra la Tabla 1. Se recomienda formalizar esta verificación.'),
    (6, 2, 'Se verifica el cumplimiento de los límites de carga en algunos puestos, pero no en todos. Se recomienda extender la verificación a todos los puestos con manejo manual de cargas.'),
    (6, 3, 'Las cargas manipuladas respetan los límites de la Tabla 1 en la mayoría de los puestos. Se recomienda mantener esta verificación de forma periódica.'),
    (6, 4, 'Se verifica y documenta que las cargas manipuladas respetan los límites de masa máxima por género y edad de la Tabla 1 en todos los puestos. Se recomienda mantener este control.'),

    (7, 0, 'No se cuenta con documentación ni planos que indiquen los puntos críticos de manejo manual de cargas. Se recomienda elaborar el informe del análisis de factores de riesgo ergonómico que exige el numeral 7.4, identificando dichos puntos críticos.'),
    (7, 1, 'Existe documentación parcial o informal sobre los puntos críticos de MMC. Se recomienda formalizarla conforme al numeral 7.4.'),
    (7, 2, 'Se cuenta con documentación de los puntos críticos de MMC en algunas áreas, pero no en todas. Se recomienda completarla para todos los puestos identificados.'),
    (7, 3, 'Se cuenta con documentación de los puntos críticos de MMC para la mayoría de los puestos. Se recomienda mantenerla actualizada.'),
    (7, 4, 'Se cuenta con documentación y/o planos completos de los puntos críticos de manejo manual de cargas, conforme al numeral 7.4. Se recomienda mantener esta documentación actualizada.'),

    (8, 0, 'No se han realizado ajustes en la distribución de procesos o materiales para evitar posturas forzadas o traslados innecesarios. Se recomienda evaluar la redistribución física de instalaciones, procesos, maquinaria y equipos como medida de control técnica (numeral 8.7).'),
    (8, 1, 'Se han realizado ajustes puntuales y aislados, sin un criterio sistemático. Se recomienda evaluar de forma integral la distribución de procesos y materiales.'),
    (8, 2, 'Se han reubicado procesos o materiales en algunas áreas, pero persisten posturas forzadas o traslados innecesarios en otras. Se recomienda extender esta revisión a todas las áreas.'),
    (8, 3, 'Se han reubicado procesos o materiales en la mayoría de las áreas para evitar posturas forzadas o traslados innecesarios. Se recomienda mantener esta práctica y evaluar las áreas restantes.'),
    (8, 4, 'Los procesos y materiales están distribuidos de manera que se evitan posturas forzadas y traslados innecesarios, conforme al numeral 8.7. Se recomienda mantener este control.'),

    (9, 0, 'No existen pausas activas ni descansos programados para actividades repetitivas de manejo manual de cargas. Se recomienda establecer periodos de descanso como medida de control administrativa (numeral 8.6 a).'),
    (9, 1, 'Las pausas o descansos se dan de manera informal, sin un programa establecido. Se recomienda documentar y programar los periodos de descanso conforme al numeral 8.6.'),
    (9, 2, 'Existen pausas o descansos, pero no están formalizados para todas las actividades repetitivas con MMC. Se recomienda extender el programa a todos los puestos que lo requieran.'),
    (9, 3, 'El programa de pausas activas y descansos cubre la mayoría de las actividades repetitivas. Se recomienda documentarlo formalmente y darle seguimiento periódico.'),
    (9, 4, 'El programa de pausas activas y descansos está documentado y se aplica de forma consistente. Se recomienda mantenerlo y revisarlo cuando cambien las condiciones de trabajo.'),

    (10, 0, 'No se limita ni se controla la masa acumulada que cada trabajador maneja manualmente durante su jornada. Se recomienda asegurar que no se exceda de 10,000 kg/jornada de 8 horas para distancias menores a 10 m, o de 6,000 kg/jornada para distancias no mayores a 20 m, conforme al numeral 8.3 b) 5).'),
    (10, 1, 'Existe un control informal de la masa acumulada, sin verificación sistemática contra los límites normativos. Se recomienda formalizar esta verificación.'),
    (10, 2, 'Se controla la masa acumulada en algunos puestos, pero no en todos los que involucran manejo manual de cargas. Se recomienda extender el control a todos los puestos.'),
    (10, 3, 'Se controla la masa acumulada por trabajador en la mayoría de los puestos, dentro de los límites normativos. Se recomienda mantener este control.'),
    (10, 4, 'Se controla y documenta que la masa acumulada por trabajador no excede los límites establecidos en el numeral 8.3 b) 5). Se recomienda mantener este control.')
) as v(numero, nivel, texto)
where r.item_id = i.id
  and i.numero = v.numero
  and r.nivel = v.nivel
  and i.criterio_id = (select id from nom036.criterio where numero = 1);

-- 3) Plantillas de apertura/cierre por bucket, Criterio 1.

update nom036.plantilla_bucket pb
set texto = v.texto
from (values
    ('inexistente', 'apertura', 'Con respecto a la identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos al manejo manual de cargas, se observa que este proceso es prácticamente inexistente.'),
    ('minimo', 'apertura', 'Con respecto a la identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos, se observa que existen esfuerzos aislados, pero el proceso es incompleto en la mayoría de sus componentes.'),
    ('regular', 'apertura', 'Con respecto a la identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos, se observa que se cuenta con avances relevantes, aunque persisten áreas sin cubrir.'),
    ('aceptable', 'apertura', 'Con respecto a la identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos, se observa un nivel de cumplimiento aceptable, con algunos puntos específicos por reforzar.'),
    ('optimo', 'apertura', 'Con respecto a la identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos, se observa un cumplimiento óptimo de los requisitos establecidos por la NOM-036-1-STPS-2018.'),
    ('inexistente', 'cierre', 'Se requiere atención prioritaria e inmediata en este criterio para cumplir con lo establecido por el Capítulo 7 de la NOM-036-1-STPS-2018.'),
    ('minimo', 'cierre', 'Se recomienda priorizar las acciones de este criterio en el corto plazo.'),
    ('regular', 'cierre', 'Se recomienda continuar reforzando este criterio en el mediano plazo.'),
    ('aceptable', 'cierre', 'Se recomienda mantener y consolidar las buenas prácticas identificadas en este criterio.'),
    ('optimo', 'cierre', 'Se recomienda mantener este nivel de cumplimiento y usarlo como referencia para los demás criterios.')
) as v(bucket, tipo, texto)
where pb.bucket = v.bucket
  and pb.tipo = v.tipo
  and pb.criterio_id = (select id from nom036.criterio where numero = 1);

-- 4) Plantillas de apertura/cierre globales (criterio_id NULL).

update nom036.plantilla_bucket pb
set texto = v.texto
from (values
    ('inexistente', 'apertura', 'A continuación se describen los puntos más importantes en los que la empresa presenta un nivel de cumplimiento inexistente respecto a la NOM-036-1-STPS-2018.'),
    ('minimo', 'apertura', 'A continuación se describen los puntos más importantes en los que la empresa presenta un nivel de cumplimiento mínimo respecto a la NOM-036-1-STPS-2018.'),
    ('regular', 'apertura', 'A continuación se describen los puntos más importantes en los que la empresa presenta un nivel de cumplimiento regular respecto a la NOM-036-1-STPS-2018.'),
    ('aceptable', 'apertura', 'A continuación se describen los puntos más importantes en los que la empresa presenta un nivel de cumplimiento aceptable respecto a la NOM-036-1-STPS-2018.'),
    ('optimo', 'apertura', 'A continuación se describen los puntos más importantes en los que la empresa presenta un nivel de cumplimiento óptimo respecto a la NOM-036-1-STPS-2018.'),
    ('inexistente', 'cierre', 'El grado de cumplimiento general de la empresa respecto a la NOM-036-1-STPS-2018 es prácticamente inexistente. Se recomienda iniciar de manera urgente con las acciones señaladas como temas obligatorios, ya que la empresa se encuentra expuesta a un riesgo elevado de incumplimiento normativo y de afectaciones a la salud de los trabajadores.'),
    ('minimo', 'cierre', 'El grado de cumplimiento general de la empresa respecto a la NOM-036-1-STPS-2018 es mínimo. Se recomienda atender de manera prioritaria los temas obligatorios señalados a continuación, ya que constituyen los requisitos básicos establecidos por la norma.'),
    ('regular', 'cierre', 'El grado de cumplimiento general de la empresa respecto a la NOM-036-1-STPS-2018 es regular. Si bien existen avances, se recomienda continuar trabajando en los temas obligatorios señalados a continuación para consolidar el cumplimiento de la norma.'),
    ('aceptable', 'cierre', 'El grado de cumplimiento general de la empresa respecto a la NOM-036-1-STPS-2018 es aceptable. Se recomienda atender los temas obligatorios pendientes y considerar los temas optativos como oportunidades de mejora continua.'),
    ('optimo', 'cierre', 'El grado de cumplimiento general de la empresa respecto a la NOM-036-1-STPS-2018 es óptimo. Se recomienda mantener las prácticas actuales y considerar los temas optativos señalados a continuación como oportunidades de mejora continua.')
) as v(bucket, tipo, texto)
where pb.bucket = v.bucket
  and pb.tipo = v.tipo
  and pb.criterio_id is null;
