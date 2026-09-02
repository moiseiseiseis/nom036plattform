-- Segunda versión de contenido para el Criterio 1: mismo contenido normativo
-- que content_v1_criterio1.sql, reescrito en lenguaje menos técnico, a
-- solicitud del Dr. Sergio (reunión de seguimiento). Cambios de estilo:
-- frases más cortas y en voz activa, el numeral de la NOM-036 se mueve al
-- final entre paréntesis en vez de ir incrustado a media oración, y se
-- evita vocabulario administrativo ("análisis de identificación", "grado
-- de cumplimiento general").
--
-- Sigue siendo contenido de trabajo, pendiente de la revisión y validación
-- final del Dr. Sergio (CLAUDE.md, sección 4).

-- 1) Recomendaciones por ítem × nivel (10 ítems × 5 niveles = 50 filas).

update nom036.recomendacion r
set texto = v.texto
from nom036.item i, (values
    (1, 0, 'Todavía no se ha hecho una lista de las tareas donde el personal levanta, empuja, jala o transporta cargas manualmente. Se recomienda hacer esa lista, anotando en qué puesto y actividad ocurre cada una. (NOM-036, numeral 7.2)'),
    (1, 1, 'Existe una lista de tareas con manejo de cargas, pero es informal o está incompleta. Se recomienda ponerla por escrito y cubrir todas las actividades de levantar, empujar, jalar y transportar. (NOM-036, numeral 7.2)'),
    (1, 2, 'Ya hay una lista de tareas con manejo de cargas, pero no cubre todos los puestos. Se recomienda revisarla y completarla para todo el personal expuesto.'),
    (1, 3, 'La lista de tareas con manejo de cargas cubre la mayoría de los puestos. Se recomienda mantenerla al día y revisarla cuando cambien las condiciones de trabajo. (NOM-036, numeral 7.6)'),
    (1, 4, 'La lista de tareas con manejo de cargas está completa y por escrito. Se recomienda mantener este control y actualizarlo periódicamente. (NOM-036, numeral 7.2)'),

    (2, 0, 'No se conoce cuánto pesan, en promedio ni como máximo, las cargas que se manejan en cada estación de trabajo. Se recomienda pesarlas y anotar ese dato. (NOM-036, numeral 8.2)'),
    (2, 1, 'Se tiene una idea aproximada del peso de las cargas, pero no se ha medido ni registrado. Se recomienda medir y anotar el peso promedio y máximo por estación.'),
    (2, 2, 'Se conoce el peso de las cargas en algunas estaciones, pero no en todas. Se recomienda completar este registro en las que faltan.'),
    (2, 3, 'Se conoce el peso de las cargas en la mayoría de las estaciones de trabajo. Se recomienda mantener este registro actualizado.'),
    (2, 4, 'Se conoce y está por escrito el peso promedio y máximo de las cargas en todas las estaciones de trabajo. Se recomienda mantener este control. (NOM-036, numeral 8.2)'),

    (3, 0, 'Las tareas de carga manual se hacen en espacios reducidos o con obstáculos frecuentes. Se recomienda mantener despejadas las áreas de trabajo y de paso. (NOM-036, numeral 8.3)'),
    (3, 1, 'Hay obstáculos o falta de espacio en varias de las áreas donde se manejan cargas. Se recomienda revisar y despejar esas áreas.'),
    (3, 2, 'La mayoría de las áreas tienen espacio suficiente, pero todavía hay algunos puntos con obstáculos. Se recomienda identificarlos y corregirlos.'),
    (3, 3, 'Las áreas de trabajo tienen espacio suficiente y están despejadas en la mayoría de los casos. Se recomienda mantener esta condición con inspecciones periódicas.'),
    (3, 4, 'Todas las áreas donde se manejan cargas tienen espacio suficiente y están libres de obstáculos. Se recomienda mantener este control en las inspecciones de rutina.'),

    (4, 0, 'No se usa ningún método para estimar el riesgo de las tareas de manejo de cargas. Se recomienda aplicar el Apéndice I (para levantar, bajar o transportar cargas) o el Apéndice II (para empujar o jalar) de la NOM-036, según el caso.'),
    (4, 1, 'Se ha intentado aplicar algún método de estimación del riesgo, pero de forma incompleta. Se recomienda hacerlo de manera formal, siguiendo el Apéndice I o II.'),
    (4, 2, 'Se aplican métodos de estimación del riesgo en algunas tareas, pero no en todas las que involucran manejo de cargas. Se recomienda extenderlo a todas las tareas identificadas.'),
    (4, 3, 'Se aplican los métodos de estimación del riesgo (Apéndice I o II) en la mayoría de las tareas. Se recomienda mantener esta práctica y documentar los resultados.'),
    (4, 4, 'Se aplican y quedan documentados los métodos de estimación del riesgo (Apéndice I o II) en todas las tareas de manejo de cargas. Se recomienda mantener esta práctica.'),

    (5, 0, 'No se lleva un registro de cuántas veces al día se levantan o trasladan cargas. Se recomienda registrar ese dato para cada actividad. (NOM-036, numeral 7.2)'),
    (5, 1, 'Se tiene una idea aproximada de la frecuencia, pero no está registrada por escrito. Se recomienda formalizar ese registro.'),
    (5, 2, 'Se registra la frecuencia en algunas actividades, pero no en todas. Se recomienda extender el registro a todas las tareas con manejo de cargas.'),
    (5, 3, 'Se registra la frecuencia de levantamiento o traslado de cargas en la mayoría de las actividades. Se recomienda mantener y actualizar este registro.'),
    (5, 4, 'Se registra de forma sistemática la frecuencia de levantamiento o traslado de cargas en todas las actividades. Se recomienda mantener esta práctica. (NOM-036, numeral 7.2)'),

    (6, 0, 'No se revisa si las cargas que se manejan respetan los límites de peso permitidos según género y edad (Tabla 1 de la NOM-036). Se recomienda empezar a hacer esa revisión.'),
    (6, 1, 'Se revisa de forma informal si las cargas respetan esos límites, sin comparar sistemáticamente contra la Tabla 1. Se recomienda formalizar esta revisión.'),
    (6, 2, 'Se revisa el cumplimiento de los límites de carga en algunos puestos, pero no en todos. Se recomienda extenderlo a todos los puestos con manejo de cargas.'),
    (6, 3, 'Las cargas que se manejan respetan los límites de la Tabla 1 en la mayoría de los puestos. Se recomienda seguir revisándolo periódicamente.'),
    (6, 4, 'Se revisa y queda documentado que las cargas respetan los límites de peso por género y edad en todos los puestos. Se recomienda mantener este control.'),

    (7, 0, 'No existe ningún documento ni plano que señale los puntos donde el manejo de cargas representa un riesgo mayor. Se recomienda elaborar ese documento. (NOM-036, numeral 7.4)'),
    (7, 1, 'Existe documentación parcial o informal sobre esos puntos críticos. Se recomienda formalizarla.'),
    (7, 2, 'Se cuenta con documentación de los puntos críticos en algunas áreas, pero no en todas. Se recomienda completarla para todos los puestos identificados.'),
    (7, 3, 'Se cuenta con documentación de los puntos críticos para la mayoría de los puestos. Se recomienda mantenerla actualizada.'),
    (7, 4, 'Se cuenta con documentación y/o planos completos de los puntos críticos de manejo de cargas. Se recomienda mantenerlos actualizados. (NOM-036, numeral 7.4)'),

    (8, 0, 'No se ha ajustado la forma en que están distribuidos los procesos o materiales para evitar posturas forzadas o traslados innecesarios. Se recomienda revisar y reacomodar el espacio de trabajo. (NOM-036, numeral 8.7)'),
    (8, 1, 'Se han hecho algunos ajustes puntuales, sin un plan general. Se recomienda evaluar la distribución del espacio de trabajo de forma integral.'),
    (8, 2, 'Se han reubicado procesos o materiales en algunas áreas, pero en otras persisten posturas forzadas o traslados innecesarios. Se recomienda revisar las áreas restantes.'),
    (8, 3, 'Se han reubicado procesos o materiales en la mayoría de las áreas para evitar posturas forzadas o traslados innecesarios. Se recomienda revisar las áreas que faltan.'),
    (8, 4, 'Los procesos y materiales están acomodados de forma que se evitan posturas forzadas y traslados innecesarios. Se recomienda mantener este control.'),

    (9, 0, 'No hay pausas activas ni descansos programados para las tareas repetitivas de manejo de cargas. Se recomienda establecer periodos de descanso. (NOM-036, numeral 8.6)'),
    (9, 1, 'Las pausas o descansos se dan de manera informal, sin un programa establecido. Se recomienda programarlos y ponerlos por escrito.'),
    (9, 2, 'Existen pausas o descansos, pero no para todas las actividades repetitivas que lo requieren. Se recomienda extender el programa a todos los puestos necesarios.'),
    (9, 3, 'El programa de pausas activas y descansos cubre la mayoría de las actividades repetitivas. Se recomienda ponerlo por escrito y darle seguimiento.'),
    (9, 4, 'El programa de pausas activas y descansos está documentado y se aplica de forma constante. Se recomienda mantenerlo y revisarlo si cambian las condiciones de trabajo.'),

    (10, 0, 'No se controla cuánto peso en total maneja cada trabajador durante su jornada. Se recomienda asegurar que no se pasen de 10,000 kg al día para distancias cortas, o 6,000 kg para distancias de hasta 20 m. (NOM-036, numeral 8.3)'),
    (10, 1, 'Hay un control informal de ese total, sin comparar contra los límites de la norma. Se recomienda formalizar esta revisión.'),
    (10, 2, 'Se controla el peso total en algunos puestos, pero no en todos los que manejan cargas. Se recomienda extenderlo a todos los puestos.'),
    (10, 3, 'Se controla el peso total que maneja cada trabajador en la mayoría de los puestos, dentro de los límites permitidos. Se recomienda mantener este control.'),
    (10, 4, 'Se controla y queda documentado que ningún trabajador excede los límites de peso total por jornada. Se recomienda mantener este control. (NOM-036, numeral 8.3)')
) as v(numero, nivel, texto)
where r.item_id = i.id
  and i.numero = v.numero
  and r.nivel = v.nivel
  and i.criterio_id = (select id from nom036.criterio where numero = 1);

-- 2) Plantillas de apertura/cierre por bucket, Criterio 1.

update nom036.plantilla_bucket pb
set texto = v.texto
from (values
    ('inexistente', 'apertura', 'Casi no se ha trabajado en identificar y clasificar los puestos donde el personal maneja cargas manualmente.'),
    ('minimo', 'apertura', 'Hay algunos avances sueltos para identificar y clasificar los puestos donde se maneja carga manualmente, pero falta cubrir la mayor parte.'),
    ('regular', 'apertura', 'Ya hay avances importantes en identificar y clasificar los puestos con manejo de cargas, aunque todavía quedan áreas sin cubrir.'),
    ('aceptable', 'apertura', 'El trabajo de identificar y clasificar los puestos con manejo de cargas está en buen nivel, con algunos puntos específicos por reforzar.'),
    ('optimo', 'apertura', 'La identificación y clasificación de los puestos con manejo de cargas cumple con lo que pide la norma.'),
    ('inexistente', 'cierre', 'Este es un tema urgente: conviene atenderlo cuanto antes.'),
    ('minimo', 'cierre', 'Conviene priorizar este tema en el corto plazo.'),
    ('regular', 'cierre', 'Conviene seguir reforzando este tema en los próximos meses.'),
    ('aceptable', 'cierre', 'Conviene mantener y afianzar las buenas prácticas que ya existen aquí.'),
    ('optimo', 'cierre', 'Conviene mantener este nivel y usarlo de referencia para los demás temas.')
) as v(bucket, tipo, texto)
where pb.bucket = v.bucket
  and pb.tipo = v.tipo
  and pb.criterio_id = (select id from nom036.criterio where numero = 1);

-- 3) Plantillas de apertura/cierre globales (criterio_id NULL).

update nom036.plantilla_bucket pb
set texto = v.texto
from (values
    ('inexistente', 'apertura', 'A continuación se detallan los puntos que la empresa necesita atender de inmediato.'),
    ('minimo', 'apertura', 'A continuación se detallan los puntos que conviene empezar a atender cuanto antes.'),
    ('regular', 'apertura', 'A continuación se detallan los puntos específicos en los que conviene seguir trabajando.'),
    ('aceptable', 'apertura', 'A continuación se detallan los puntos específicos que quedan por reforzar.'),
    ('optimo', 'apertura', 'A continuación se detallan las áreas que conviene seguir vigilando para mantener este nivel.'),
    ('inexistente', 'cierre', 'En general, la empresa prácticamente no cumple con la NOM-036-1-STPS-2018. Conviene empezar de inmediato con los temas obligatorios de abajo: mientras no se atiendan, el riesgo de que el personal se lastime por manejo de cargas es alto.'),
    ('minimo', 'cierre', 'En general, la empresa apenas empieza a cumplir con la NOM-036-1-STPS-2018. Los temas marcados como obligatorios abajo son lo mínimo que la norma exige — conviene atenderlos primero.'),
    ('regular', 'cierre', 'En general, la empresa va por buen camino con la NOM-036-1-STPS-2018, aunque todavía falta trabajo. Conviene seguir avanzando en los temas obligatorios de abajo para terminar de cumplir con la norma.'),
    ('aceptable', 'cierre', 'En general, la empresa cumple bien con la NOM-036-1-STPS-2018. Conviene cerrar los temas obligatorios pendientes y usar los optativos como oportunidades de mejora.'),
    ('optimo', 'cierre', 'En general, la empresa cumple de forma sobresaliente con la NOM-036-1-STPS-2018. Conviene mantener las buenas prácticas actuales y considerar los temas optativos de abajo como oportunidades de mejora.')
) as v(bucket, tipo, texto)
where pb.bucket = v.bucket
  and pb.tipo = v.tipo
  and pb.criterio_id is null;
