-- Contenido real del Criterio 2 ("Uso de equipos auxiliares y condiciones
-- ambientales"): numeral NOM-036 por ítem, recomendaciones por ítem × nivel
-- (10 ítems × 5 niveles = 50 filas), y plantillas de apertura por bucket.
--
-- Fuente: texto oficial de la NOM-036-1-STPS-2018 (references/NOM-036-1-STPS-2018.pdf,
-- numeral 8.2 "condiciones ambientales que puedan incrementar el esfuerzo del
-- trabajador" y numeral 8.3, inciso c) "medidas de seguridad para empujar o
-- jalar cargas, con o sin ayuda de equipo auxiliar") y el texto de los
-- ítems del instrumento oficial del Dr. Sergio (ver CLAUDE.md sección 4).
--
-- Mismo registro y estructura que `content_v3_retroalimentacion_piloto.sql`
-- usó para el Criterio 1 (apertura que nombra explícitamente la etiqueta de
-- bucket, recomendación en dos oraciones: diagnóstico + "Se recomienda...",
-- numeral citado en los niveles 0 y 4 cuando aplica a un numeral concreto).
--
-- El ítem 2.6 (señalización de rampas/plataformas) no tiene un numeral
-- exacto en la norma — el numeral 8.3 c) 12 solo habla de evitar rampas o
-- jalar el equipo en el sentido correcto, no de señalización — así que sus
-- recomendaciones no citan ningún numeral, en vez de forzar uno impreciso.
--
-- No se cargan plantillas de "cierre" por criterio: `repository.py` nunca
-- las lee (solo lee `tipo = 'apertura'` por criterio); existen como
-- contenido inerte para el Criterio 1 desde `content_v1_criterio1.sql`,
-- pero no vale la pena repetir ese contenido muerto en los criterios nuevos.
--
-- Primera versión de trabajo, pendiente de la revisión y validación final
-- del Dr. Sergio (CLAUDE.md, sección 4) — igual que el contenido del
-- Criterio 1.

-- 1) Numeral NOM-036 por ítem (es_obligatorio se deja en el default `true`
--    cargado por seed_etapa7_items_criterios_2_a_5.sql: los 10 ítems caen
--    bajo la obligación 5.2 del patrón, "adoptar medidas de prevención y/o
--    control... de acuerdo con el Capítulo 8").

update nom036.item i
set numeral_nom = v.numeral_nom
from (values
    (1, '8.3 b) 3) II)'),
    (2, '8.3 c) 1)'),
    (3, '8.3 c) 3)'),
    (4, '8.3 a) 3) y c) 5)'),
    (5, '8.3 c) 7)'),
    (6, null),
    (7, '8.3 c) 4)'),
    (8, '8.3 c) 1)'),
    (9, '8.2 d)'),
    (10, '8.3 b) 5)')
) as v(numero, numeral_nom)
where i.numero = v.numero
  and i.criterio_id = (select id from nom036.criterio where numero = 2);

-- 2) Recomendaciones por ítem × nivel.

insert into nom036.recomendacion (item_id, nivel, texto)
select i.id, v.nivel, v.texto
from nom036.item i
cross join (values
    (1, 0, 'No se utiliza ningún dispositivo auxiliar (carretillas, diablos, patines) para el manejo cotidiano de cargas. Se recomienda incorporar equipos auxiliares manuales cuando el peso o la longitud de la carga dificulte su transporte. (NOM-036, numeral 8.3)'),
    (1, 1, 'Se usan dispositivos auxiliares de forma ocasional o solo en algunos puestos, sin que sea una práctica establecida. Se recomienda extender su uso a todas las tareas de manejo cotidiano de cargas que lo requieran.'),
    (1, 2, 'Se utilizan dispositivos auxiliares en algunos puestos de trabajo, pero no en todos los que manejan cargas de forma cotidiana. Se recomienda completar su incorporación en los puestos restantes.'),
    (1, 3, 'Se utilizan dispositivos auxiliares en la mayoría de los puestos que manejan cargas de forma cotidiana. Se recomienda mantener esta práctica y revisar los puestos pendientes.'),
    (1, 4, 'Se utilizan dispositivos auxiliares (carretillas, diablos, patines) en todos los puestos donde se manejan cargas de forma cotidiana. Se recomienda mantener este control. (NOM-036, numeral 8.3)'),

    (2, 0, 'No se evalúa la estabilidad de las cargas antes de transportarlas con equipo auxiliar. Se recomienda verificarla antes de cada traslado, para evitar que la carga se caiga del diablo, patín o carretilla. (NOM-036, numeral 8.3)'),
    (2, 1, 'La estabilidad de la carga se revisa de forma informal, sin un procedimiento establecido. Se recomienda formalizar esta verificación antes de cada traslado.'),
    (2, 2, 'Se evalúa la estabilidad de la carga en algunos traslados, pero no de manera sistemática en todos. Se recomienda extender esta práctica a todos los traslados con equipo auxiliar.'),
    (2, 3, 'Se evalúa la estabilidad de la carga en la mayoría de los traslados con equipo auxiliar. Se recomienda mantener esta verificación de forma constante.'),
    (2, 4, 'Se evalúa y asegura la estabilidad de la carga antes de cada traslado con equipo auxiliar. Se recomienda mantener este control. (NOM-036, numeral 8.3)'),

    (3, 0, 'No se conoce la capacidad de carga de los equipos auxiliares que se utilizan. Se recomienda identificar y verificar la capacidad nominal de cada equipo, para no excederla. (NOM-036, numeral 8.3)'),
    (3, 1, 'Se tiene una idea aproximada de la capacidad de los equipos auxiliares, pero no está verificada ni documentada. Se recomienda confirmar y registrar la capacidad nominal de cada equipo.'),
    (3, 2, 'Se conoce la capacidad de carga de algunos equipos auxiliares, pero no de todos los que se utilizan. Se recomienda completar esta identificación.'),
    (3, 3, 'Se conoce la capacidad de carga de la mayoría de los equipos auxiliares utilizados. Se recomienda mantener este registro actualizado.'),
    (3, 4, 'Se conoce y se verifica que no se exceda la capacidad nominal de cada equipo auxiliar utilizado. Se recomienda mantener este control. (NOM-036, numeral 8.3)'),

    (4, 0, 'Las superficies por donde circulan los equipos auxiliares no están niveladas ni libres de obstáculos. Se recomienda mantener los pisos en condiciones seguras para el desplazamiento de cargas. (NOM-036, numeral 8.3)'),
    (4, 1, 'Las superficies de rodamiento se mantienen libres de obstáculos de forma ocasional, sin una revisión constante. Se recomienda establecer una revisión periódica.'),
    (4, 2, 'Las superficies de rodamiento están en buenas condiciones en algunas áreas, pero no en todas las que se usan para transportar cargas. Se recomienda extender este mantenimiento a las áreas restantes.'),
    (4, 3, 'Las superficies de rodamiento están niveladas, limpias y libres de obstáculos en la mayoría de las áreas. Se recomienda mantener esta condición con inspecciones periódicas.'),
    (4, 4, 'Las superficies de rodamiento están niveladas, limpias y libres de obstáculos en todas las áreas donde se transportan cargas. Se recomienda mantener este control. (NOM-036, numeral 8.3)'),

    (5, 0, 'Los pasillos de tránsito no tienen el espacio suficiente para maniobrar con cargas de forma segura. Se recomienda revisar que el espacio disponible corresponda a las dimensiones de las cargas que se transportan, en especial en pasillos angostos. (NOM-036, numeral 8.3)'),
    (5, 1, 'Algunos pasillos permiten maniobrar con cargas, pero no se ha revisado de forma sistemática. Se recomienda hacer una revisión formal de los pasillos de tránsito.'),
    (5, 2, 'Los pasillos de tránsito permiten maniobras seguras en algunas áreas, pero no en todas. Se recomienda corregir los pasillos pendientes.'),
    (5, 3, 'Los pasillos de tránsito permiten maniobras seguras con cargas en la mayoría de las áreas. Se recomienda mantener esta condición.'),
    (5, 4, 'Los pasillos de tránsito permiten maniobras seguras con cargas en todas las áreas, incluidos los pasillos angostos. Se recomienda mantener este control. (NOM-036, numeral 8.3)'),

    (6, 0, 'Las rampas, pendientes y plataformas no cuentan con ninguna señalización para su uso seguro. Se recomienda delimitar y señalizar estas zonas para orientar el tránsito con cargas.'),
    (6, 1, 'Hay señalización en algunas rampas o plataformas, pero de forma aislada y sin un criterio uniforme. Se recomienda estandarizar la señalización en todas las zonas con pendiente.'),
    (6, 2, 'Las rampas y plataformas cuentan con señalización en algunas áreas, pero no en todas las que se usan para transportar cargas. Se recomienda completar la señalización faltante.'),
    (6, 3, 'Las rampas, pendientes y plataformas cuentan con señalización adecuada en la mayoría de los casos. Se recomienda mantenerla y revisarla periódicamente.'),
    (6, 4, 'Todas las rampas, pendientes y plataformas cuentan con señalización clara para su uso seguro. Se recomienda mantener este control.'),

    (7, 0, 'No se revisa el estado físico de los equipos auxiliares antes de usarlos. Se recomienda verificar que estén en condiciones seguras de operación antes de cada actividad. (NOM-036, numeral 8.3)'),
    (7, 1, 'El estado de los equipos auxiliares se revisa de forma ocasional, sin un programa establecido. Se recomienda formalizar una revisión periódica.'),
    (7, 2, 'Se revisa el estado físico de algunos equipos auxiliares, pero no de todos los que están en uso. Se recomienda extender la revisión a todo el equipo.'),
    (7, 3, 'Se revisa periódicamente el estado físico de la mayoría de los equipos auxiliares. Se recomienda mantener este programa de revisión.'),
    (7, 4, 'Se revisa periódicamente el estado físico de todos los equipos auxiliares antes de su uso. Se recomienda mantener este control. (NOM-036, numeral 8.3)'),

    (8, 0, 'Las cargas no se distribuyen de forma equilibrada en el equipo auxiliar durante el traslado. Se recomienda acomodarlas de manera que se mantenga la estabilidad del equipo. (NOM-036, numeral 8.3)'),
    (8, 1, 'La distribución de la carga en el equipo auxiliar se hace de forma informal, sin un criterio establecido. Se recomienda definir un criterio de acomodo seguro.'),
    (8, 2, 'Las cargas se distribuyen equilibradamente en algunos casos, pero no de forma constante. Se recomienda aplicar este criterio en todos los traslados.'),
    (8, 3, 'Las cargas se distribuyen equilibradamente en el equipo auxiliar en la mayoría de los traslados. Se recomienda mantener esta práctica.'),
    (8, 4, 'Las cargas se distribuyen equilibradamente en el equipo auxiliar en todos los traslados. Se recomienda mantener este control. (NOM-036, numeral 8.3)'),

    (9, 0, 'No se identifican riesgos por condiciones térmicas o de iluminación en las rutas de traslado de cargas. Se recomienda identificar estas condiciones del ambiente, ya que pueden incrementar el esfuerzo del trabajador. (NOM-036, numeral 8.2)'),
    (9, 1, 'Se tiene una idea informal de estos riesgos, sin que se haya hecho una identificación formal. Se recomienda documentar las condiciones térmicas y de iluminación de las rutas de traslado.'),
    (9, 2, 'Se identifican estos riesgos en algunas rutas de traslado, pero no en todas. Se recomienda completar esta identificación en las rutas restantes.'),
    (9, 3, 'Se identifican los riesgos por condiciones térmicas o de iluminación en la mayoría de las rutas de traslado. Se recomienda mantener esta revisión actualizada.'),
    (9, 4, 'Se identifican y documentan los riesgos por condiciones térmicas o de iluminación en todas las rutas de traslado de cargas. Se recomienda mantener este control. (NOM-036, numeral 8.2)'),

    (10, 0, 'No se controla el peso total que se transporta por jornada de trabajo. Se recomienda asegurar que no se exceda de 10,000 kg por jornada de 8 horas para distancias menores a 10 m, o de 6,000 kg para distancias de hasta 20 m. (NOM-036, numeral 8.3)'),
    (10, 1, 'Hay un control informal del peso total transportado, sin comparar contra los límites de la norma. Se recomienda formalizar esta verificación.'),
    (10, 2, 'Se controla el peso total transportado en algunos puestos, pero no en todos los que manejan materiales con o sin equipo auxiliar. Se recomienda extender el control a todos los puestos.'),
    (10, 3, 'Se controla el peso total transportado por jornada en la mayoría de los puestos, dentro de los límites permitidos. Se recomienda mantener este control.'),
    (10, 4, 'Se controla y queda documentado que ningún puesto excede los límites de peso total por jornada en el transporte de materiales. Se recomienda mantener este control. (NOM-036, numeral 8.3)')
) as v(numero, nivel, texto)
where i.numero = v.numero
  and i.criterio_id = (select id from nom036.criterio where numero = 2);

-- 3) Plantillas de apertura por bucket.

insert into nom036.plantilla_bucket (criterio_id, bucket, tipo, texto)
select c.id, v.bucket, 'apertura', v.texto
from nom036.criterio c
cross join (values
    ('inexistente', 'No existe un proceso formal de uso de equipos auxiliares ni de control de las condiciones ambientales en el manejo de cargas, conforme a lo que exige el numeral 8.3 de la NOM-036-1-STPS-2018.'),
    ('minimo', 'El uso de equipos auxiliares y el control de las condiciones ambientales es Mínimo: la mayoría de las medidas que exige el numeral 8.3 de la NOM-036-1-STPS-2018 no están cubiertas.'),
    ('regular', 'El uso de equipos auxiliares y el control de las condiciones ambientales se encuentra en un nivel Regular: existen avances, pero persisten vacíos relevantes.'),
    ('aceptable', 'El uso de equipos auxiliares y el control de las condiciones ambientales presenta un nivel Aceptable, con puntos específicos por reforzar.'),
    ('optimo', 'El uso de equipos auxiliares y el control de las condiciones ambientales está consolidado.')
) as v(bucket, texto)
where c.numero = 2
  and not exists (
    select 1 from nom036.plantilla_bucket pb
    where pb.criterio_id = c.id and pb.bucket = v.bucket and pb.tipo = 'apertura'
  );
