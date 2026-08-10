-- Semilla de la Etapa 1 (piloto Criterio 1).
--
-- Los ítems del Criterio 1 son contenido REAL (tomados de la imagen del instrumento,
-- ver CLAUDE.md sección 4). Las recomendaciones y plantillas de bucket son contenido
-- DUMMY marcado con el prefijo "[PLACEHOLDER]" — están bloqueadas por la validación del
-- Dr. Sergio (CLAUDE.md sección 4) y existen solo para no bloquear el desarrollo técnico
-- de las Etapas 2-4. No usar este texto en ningún informe real.
--
-- La empresa/evaluación/respuestas ficticias reproducen el puntaje real del Criterio 1
-- del caso JASANA (17/40, ver CLAUDE.md sección 6, Etapa 2), para poder validar el motor
-- de cálculo contra ese dato de referencia.

insert into nom036.normativa (nombre, version)
values ('NOM-036-1-STPS-2018', '2018');

insert into nom036.criterio (normativa_id, numero, nombre, orden)
select id, 1, 'Identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos', 1
from nom036.normativa
where nombre = 'NOM-036-1-STPS-2018';

insert into nom036.item (criterio_id, numero, texto_pregunta, numeral_nom, es_obligatorio)
select c.id, v.numero, v.texto, null, true
from nom036.criterio c
cross join (values
    (1, '¿Se han identificado todas las tareas que implican levantar, bajar, empujar, jalar, transportar o estibar materiales manualmente?'),
    (2, '¿Se conoce el peso promedio y máximo de las cargas manipuladas en cada estación de trabajo?'),
    (3, '¿Todas las actividades de carga manual se hacen en lugares con suficiente espacio y sin obstrucciones?'),
    (4, '¿Se aplican métodos de estimación del riesgo (Apéndice I o II) para evaluar la carga laboral?'),
    (5, '¿Se registran frecuencias de levantamiento o traslado de cargas durante la jornada laboral?'),
    (6, '¿Las cargas manipuladas se encuentran dentro de los límites permitidos de acuerdo al género y edad?'),
    (7, '¿Se cuenta con documentación o planos donde se indiquen los puntos críticos de Manejo manual de Cargas (MMC)?'),
    (8, '¿Se han reubicado procesos o materiales para evitar posturas forzadas o traslados innecesarios?'),
    (9, '¿Se han realizado pausas activas o descansos programados para actividades repetitivas con MMC?'),
    (10, '¿Se ha limitado la cantidad de masa acumulada que se maneja manualmente por trabajador durante su jornada?')
) as v(numero, texto)
where c.numero = 1;

insert into nom036.recomendacion (item_id, nivel, texto)
select
    i.id,
    v.nivel,
    '[PLACEHOLDER] Ítem 1.' || i.numero || ', nivel ' || v.nivel || ' (' || v.etiqueta || '): recomendación de prueba, pendiente de contenido validado por el Dr. Sergio.'
from nom036.item i
cross join (values
    (0, 'Nada'),
    (1, 'Mínimo'),
    (2, 'Regular'),
    (3, 'Aceptable'),
    (4, 'Óptimo')
) as v(nivel, etiqueta)
where i.criterio_id = (select id from nom036.criterio where numero = 1);

insert into nom036.plantilla_bucket (criterio_id, bucket, tipo, texto)
select
    c.id,
    v.bucket,
    v.tipo,
    '[PLACEHOLDER] Plantilla de ' || v.tipo || ' para bucket ' || v.bucket || ' del Criterio 1 — pendiente de contenido validado por el Dr. Sergio.'
from nom036.criterio c
cross join (values
    ('inexistente', 'apertura'), ('inexistente', 'cierre'),
    ('minimo', 'apertura'), ('minimo', 'cierre'),
    ('regular', 'apertura'), ('regular', 'cierre'),
    ('aceptable', 'apertura'), ('aceptable', 'cierre'),
    ('optimo', 'apertura'), ('optimo', 'cierre')
) as v(bucket, tipo)
where c.numero = 1;

insert into nom036.empresa (nombre, ubicacion, giro, num_trabajadores, turnos, descripcion_mmh)
values (
    'Empresa Ficticia Piloto',
    'Guadalajara, Jalisco',
    'Textil y confección',
    35,
    'Un turno',
    'Almacenamiento, carga y transporte de rollos de tela; levantamiento y transporte de prendas y otras materias primas a lo largo de las líneas de producción.'
);

insert into nom036.evaluacion (empresa_id, token_publico, estado, fecha)
select id, 'seed-demo-jasana-criterio1', 'completado', now()
from nom036.empresa
where nombre = 'Empresa Ficticia Piloto';

insert into nom036.respuesta (evaluacion_id, item_id, nivel_seleccionado)
select e.id, i.id, v.nivel
from nom036.evaluacion e
join nom036.item i on i.criterio_id = (select id from nom036.criterio where numero = 1)
join (values
    (1, 2), (2, 1), (3, 2), (4, 2), (5, 2),
    (6, 1), (7, 2), (8, 2), (9, 1), (10, 2)
) as v(numero, nivel) on v.numero = i.numero
where e.token_publico = 'seed-demo-jasana-criterio1';
