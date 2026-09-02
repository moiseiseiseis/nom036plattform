# Criterio 1 — Recomendaciones por ítem y nivel (para revisión del Dr. Sergio)

**Criterio:** Identificación y clasificación de los puestos de trabajo ocupacionalmente
expuestos (al manejo manual de cargas).
**Estado:** segunda versión de trabajo — mismo contenido normativo que la primera, reescrito
en lenguaje menos técnico a solicitud del Dr. Sergio (reunión de seguimiento). Co-redactada con
el desarrollador a partir del texto oficial de la NOM-036-1-STPS-2018 (Capítulos 7 y 8) y de la
estructura narrativa del informe JASANA real. **Pendiente de revisión y validación final antes
de usarse en un informe a una empresa real.**
**Fuente en el repositorio:** `supabase/content_v2_lenguaje_simple.sql` (versión de lenguaje
técnico previa: `supabase/content_v1_criterio1.sql`).

## Cómo revisar este documento

Cada ítem del cuestionario tiene cinco recomendaciones posibles, una por cada nivel de
respuesta que la empresa puede seleccionar (escala 0 a 4). El sistema elige automáticamente
el texto que corresponde al nivel que la empresa haya respondido para ese ítem — no hay
redacción libre en ningún punto de este proceso, por lo que el texto que aparece abajo es,
literalmente, el que aparecerá en un informe real.

Escala de referencia:

| Nivel | Etiqueta |
|---|---|
| 0 | Nada |
| 1 | Mínimo |
| 2 | Regular |
| 3 | Aceptable |
| 4 | Óptimo |

Para cada ítem se indica también el numeral de la NOM-036-1-STPS-2018 del que se deriva, y si
quedó clasificado como tema **obligatorio** (exigencia directa de la norma) u **optativo**
(buena práctica sugerida) — clasificación que se usa para armar, en el informe global, la lista
de "temas obligatorios" y "temas optativos". Los diez ítems de este criterio se clasificaron
como obligatorios.

**Cambio de estilo respecto a la primera versión:** frases más cortas y en voz activa, el
numeral de la norma se movió al final entre paréntesis en vez de ir incrustado a media oración,
y se evitó vocabulario administrativo ("análisis de identificación", "grado de cumplimiento
general") a favor de lenguaje cotidiano — buscando que una persona sin formación técnica
entienda la recomendación sin tener que releerla.

Al revisar, lo más útil es señalar, por cada recomendación: (a) si el contenido es correcto y
suficiente, (b) si el numeral citado es el correcto, (c) si el texto necesita reescribirse, o
(d) si la simplificación del lenguaje perdió algún matiz importante que sí debería estar.

---

## Ítem 1 — Numeral 7.2 a) — Obligatorio

**Pregunta:** ¿Se han identificado todas las tareas que implican levantar, bajar, empujar,
jalar, transportar o estibar materiales manualmente?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | Todavía no se ha hecho una lista de las tareas donde el personal levanta, empuja, jala o transporta cargas manualmente. Se recomienda hacer esa lista, anotando en qué puesto y actividad ocurre cada una. (NOM-036, numeral 7.2) |
| 1 — Mínimo | Existe una lista de tareas con manejo de cargas, pero es informal o está incompleta. Se recomienda ponerla por escrito y cubrir todas las actividades de levantar, empujar, jalar y transportar. (NOM-036, numeral 7.2) |
| 2 — Regular | Ya hay una lista de tareas con manejo de cargas, pero no cubre todos los puestos. Se recomienda revisarla y completarla para todo el personal expuesto. |
| 3 — Aceptable | La lista de tareas con manejo de cargas cubre la mayoría de los puestos. Se recomienda mantenerla al día y revisarla cuando cambien las condiciones de trabajo. (NOM-036, numeral 7.6) |
| 4 — Óptimo | La lista de tareas con manejo de cargas está completa y por escrito. Se recomienda mantener este control y actualizarlo periódicamente. (NOM-036, numeral 7.2) |

---

## Ítem 2 — Numeral 8.2 c) — Obligatorio

**Pregunta:** ¿Se conoce el peso promedio y máximo de las cargas manipuladas en cada estación
de trabajo?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se conoce cuánto pesan, en promedio ni como máximo, las cargas que se manejan en cada estación de trabajo. Se recomienda pesarlas y anotar ese dato. (NOM-036, numeral 8.2) |
| 1 — Mínimo | Se tiene una idea aproximada del peso de las cargas, pero no se ha medido ni registrado. Se recomienda medir y anotar el peso promedio y máximo por estación. |
| 2 — Regular | Se conoce el peso de las cargas en algunas estaciones, pero no en todas. Se recomienda completar este registro en las que faltan. |
| 3 — Aceptable | Se conoce el peso de las cargas en la mayoría de las estaciones de trabajo. Se recomienda mantener este registro actualizado. |
| 4 — Óptimo | Se conoce y está por escrito el peso promedio y máximo de las cargas en todas las estaciones de trabajo. Se recomienda mantener este control. (NOM-036, numeral 8.2) |

---

## Ítem 3 — Numeral 8.3 a) 3) — Obligatorio

**Pregunta:** ¿Todas las actividades de carga manual se hacen en lugares con suficiente espacio
y sin obstrucciones?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | Las tareas de carga manual se hacen en espacios reducidos o con obstáculos frecuentes. Se recomienda mantener despejadas las áreas de trabajo y de paso. (NOM-036, numeral 8.3) |
| 1 — Mínimo | Hay obstáculos o falta de espacio en varias de las áreas donde se manejan cargas. Se recomienda revisar y despejar esas áreas. |
| 2 — Regular | La mayoría de las áreas tienen espacio suficiente, pero todavía hay algunos puntos con obstáculos. Se recomienda identificarlos y corregirlos. |
| 3 — Aceptable | Las áreas de trabajo tienen espacio suficiente y están despejadas en la mayoría de los casos. Se recomienda mantener esta condición con inspecciones periódicas. |
| 4 — Óptimo | Todas las áreas donde se manejan cargas tienen espacio suficiente y están libres de obstáculos. Se recomienda mantener este control en las inspecciones de rutina. |

---

## Ítem 4 — Numeral 7.3 — Obligatorio

**Pregunta:** ¿Se aplican métodos de estimación del riesgo (Apéndice I o II) para evaluar la
carga laboral?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se usa ningún método para estimar el riesgo de las tareas de manejo de cargas. Se recomienda aplicar el Apéndice I (para levantar, bajar o transportar cargas) o el Apéndice II (para empujar o jalar) de la NOM-036, según el caso. |
| 1 — Mínimo | Se ha intentado aplicar algún método de estimación del riesgo, pero de forma incompleta. Se recomienda hacerlo de manera formal, siguiendo el Apéndice I o II. |
| 2 — Regular | Se aplican métodos de estimación del riesgo en algunas tareas, pero no en todas las que involucran manejo de cargas. Se recomienda extenderlo a todas las tareas identificadas. |
| 3 — Aceptable | Se aplican los métodos de estimación del riesgo (Apéndice I o II) en la mayoría de las tareas. Se recomienda mantener esta práctica y documentar los resultados. |
| 4 — Óptimo | Se aplican y quedan documentados los métodos de estimación del riesgo (Apéndice I o II) en todas las tareas de manejo de cargas. Se recomienda mantener esta práctica. |

---

## Ítem 5 — Numeral 7.2 d) — Obligatorio

**Pregunta:** ¿Se registran frecuencias de levantamiento o traslado de cargas durante la jornada
laboral?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se lleva un registro de cuántas veces al día se levantan o trasladan cargas. Se recomienda registrar ese dato para cada actividad. (NOM-036, numeral 7.2) |
| 1 — Mínimo | Se tiene una idea aproximada de la frecuencia, pero no está registrada por escrito. Se recomienda formalizar ese registro. |
| 2 — Regular | Se registra la frecuencia en algunas actividades, pero no en todas. Se recomienda extender el registro a todas las tareas con manejo de cargas. |
| 3 — Aceptable | Se registra la frecuencia de levantamiento o traslado de cargas en la mayoría de las actividades. Se recomienda mantener y actualizar este registro. |
| 4 — Óptimo | Se registra de forma sistemática la frecuencia de levantamiento o traslado de cargas en todas las actividades. Se recomienda mantener esta práctica. (NOM-036, numeral 7.2) |

---

## Ítem 6 — Numeral 8.3 b) 2) y Tabla 1 — Obligatorio

**Pregunta:** ¿Las cargas manipuladas se encuentran dentro de los límites permitidos de acuerdo
al género y edad?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se revisa si las cargas que se manejan respetan los límites de peso permitidos según género y edad (Tabla 1 de la NOM-036). Se recomienda empezar a hacer esa revisión. |
| 1 — Mínimo | Se revisa de forma informal si las cargas respetan esos límites, sin comparar sistemáticamente contra la Tabla 1. Se recomienda formalizar esta revisión. |
| 2 — Regular | Se revisa el cumplimiento de los límites de carga en algunos puestos, pero no en todos. Se recomienda extenderlo a todos los puestos con manejo de cargas. |
| 3 — Aceptable | Las cargas que se manejan respetan los límites de la Tabla 1 en la mayoría de los puestos. Se recomienda seguir revisándolo periódicamente. |
| 4 — Óptimo | Se revisa y queda documentado que las cargas respetan los límites de peso por género y edad en todos los puestos. Se recomienda mantener este control. |

---

## Ítem 7 — Numeral 7.4 — Obligatorio

**Pregunta:** ¿Se cuenta con documentación o planos donde se indiquen los puntos críticos de
Manejo Manual de Cargas (MMC)?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No existe ningún documento ni plano que señale los puntos donde el manejo de cargas representa un riesgo mayor. Se recomienda elaborar ese documento. (NOM-036, numeral 7.4) |
| 1 — Mínimo | Existe documentación parcial o informal sobre esos puntos críticos. Se recomienda formalizarla. |
| 2 — Regular | Se cuenta con documentación de los puntos críticos en algunas áreas, pero no en todas. Se recomienda completarla para todos los puestos identificados. |
| 3 — Aceptable | Se cuenta con documentación de los puntos críticos para la mayoría de los puestos. Se recomienda mantenerla actualizada. |
| 4 — Óptimo | Se cuenta con documentación y/o planos completos de los puntos críticos de manejo de cargas. Se recomienda mantenerlos actualizados. (NOM-036, numeral 7.4) |

---

## Ítem 8 — Numeral 8.7 b) y c) — Obligatorio

**Pregunta:** ¿Se han reubicado procesos o materiales para evitar posturas forzadas o traslados
innecesarios?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se ha ajustado la forma en que están distribuidos los procesos o materiales para evitar posturas forzadas o traslados innecesarios. Se recomienda revisar y reacomodar el espacio de trabajo. (NOM-036, numeral 8.7) |
| 1 — Mínimo | Se han hecho algunos ajustes puntuales, sin un plan general. Se recomienda evaluar la distribución del espacio de trabajo de forma integral. |
| 2 — Regular | Se han reubicado procesos o materiales en algunas áreas, pero en otras persisten posturas forzadas o traslados innecesarios. Se recomienda revisar las áreas restantes. |
| 3 — Aceptable | Se han reubicado procesos o materiales en la mayoría de las áreas para evitar posturas forzadas o traslados innecesarios. Se recomienda revisar las áreas que faltan. |
| 4 — Óptimo | Los procesos y materiales están acomodados de forma que se evitan posturas forzadas y traslados innecesarios. Se recomienda mantener este control. |

---

## Ítem 9 — Numeral 8.6 a) 2) — Obligatorio

**Pregunta:** ¿Se han realizado pausas activas o descansos programados para actividades
repetitivas con MMC?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No hay pausas activas ni descansos programados para las tareas repetitivas de manejo de cargas. Se recomienda establecer periodos de descanso. (NOM-036, numeral 8.6) |
| 1 — Mínimo | Las pausas o descansos se dan de manera informal, sin un programa establecido. Se recomienda programarlos y ponerlos por escrito. |
| 2 — Regular | Existen pausas o descansos, pero no para todas las actividades repetitivas que lo requieren. Se recomienda extender el programa a todos los puestos necesarios. |
| 3 — Aceptable | El programa de pausas activas y descansos cubre la mayoría de las actividades repetitivas. Se recomienda ponerlo por escrito y darle seguimiento. |
| 4 — Óptimo | El programa de pausas activas y descansos está documentado y se aplica de forma constante. Se recomienda mantenerlo y revisarlo si cambian las condiciones de trabajo. |

---

## Ítem 10 — Numeral 8.3 b) 5) — Obligatorio

**Pregunta:** ¿Se ha limitado la cantidad de masa acumulada que se maneja manualmente por
trabajador durante su jornada?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se controla cuánto peso en total maneja cada trabajador durante su jornada. Se recomienda asegurar que no se pasen de 10,000 kg al día para distancias cortas, o 6,000 kg para distancias de hasta 20 m. (NOM-036, numeral 8.3) |
| 1 — Mínimo | Hay un control informal de ese total, sin comparar contra los límites de la norma. Se recomienda formalizar esta revisión. |
| 2 — Regular | Se controla el peso total en algunos puestos, pero no en todos los que manejan cargas. Se recomienda extenderlo a todos los puestos. |
| 3 — Aceptable | Se controla el peso total que maneja cada trabajador en la mayoría de los puestos, dentro de los límites permitidos. Se recomienda mantener este control. |
| 4 — Óptimo | Se controla y queda documentado que ningún trabajador excede los límites de peso total por jornada. Se recomienda mantener este control. (NOM-036, numeral 8.3) |

---

## Anexo — Plantillas de apertura y cierre por nivel de cumplimiento

Además de la recomendación por ítem, el informe usa plantillas fijas por franja de
cumplimiento (0-20% inexistente, 20-40% mínimo, 40-60% regular, 60-80% aceptable, 80-100%
óptimo). A nivel de criterio, una plantilla de **apertura** introduce el párrafo del criterio.
A nivel global (informe completo), una plantilla de **apertura** introduce la sección de "Áreas
de oportunidad" y una de **cierre** da el veredicto general antes de las listas de temas.
También están pendientes de validación.

### Apertura del Criterio 1

| Franja | Apertura |
|---|---|
| Inexistente | Casi no se ha trabajado en identificar y clasificar los puestos donde el personal maneja cargas manualmente. |
| Mínimo | Hay algunos avances sueltos para identificar y clasificar los puestos donde se maneja carga manualmente, pero falta cubrir la mayor parte. |
| Regular | Ya hay avances importantes en identificar y clasificar los puestos con manejo de cargas, aunque todavía quedan áreas sin cubrir. |
| Aceptable | El trabajo de identificar y clasificar los puestos con manejo de cargas está en buen nivel, con algunos puntos específicos por reforzar. |
| Óptimo | La identificación y clasificación de los puestos con manejo de cargas cumple con lo que pide la norma. |

### Apertura y cierre globales (nivel informe completo)

| Franja | Apertura (introduce la lista) | Cierre (da el veredicto) |
|---|---|---|
| Inexistente | A continuación se detallan los puntos que la empresa necesita atender de inmediato. | En general, la empresa prácticamente no cumple con la NOM-036-1-STPS-2018. Conviene empezar de inmediato con los temas obligatorios de abajo: mientras no se atiendan, el riesgo de que el personal se lastime por manejo de cargas es alto. |
| Mínimo | A continuación se detallan los puntos que conviene empezar a atender cuanto antes. | En general, la empresa apenas empieza a cumplir con la NOM-036-1-STPS-2018. Los temas marcados como obligatorios abajo son lo mínimo que la norma exige — conviene atenderlos primero. |
| Regular | A continuación se detallan los puntos específicos en los que conviene seguir trabajando. | En general, la empresa va por buen camino con la NOM-036-1-STPS-2018, aunque todavía falta trabajo. Conviene seguir avanzando en los temas obligatorios de abajo para terminar de cumplir con la norma. |
| Aceptable | A continuación se detallan los puntos específicos que quedan por reforzar. | En general, la empresa cumple bien con la NOM-036-1-STPS-2018. Conviene cerrar los temas obligatorios pendientes y usar los optativos como oportunidades de mejora. |
| Óptimo | A continuación se detallan las áreas que conviene seguir vigilando para mantener este nivel. | En general, la empresa cumple de forma sobresaliente con la NOM-036-1-STPS-2018. Conviene mantener las buenas prácticas actuales y considerar los temas optativos de abajo como oportunidades de mejora. |

Nota: existe también una plantilla de **cierre** por franja a nivel de cada criterio individual
(no solo a nivel global), pero el motor de cálculo actual no la usa todavía en el ensamblado de
la narrativa del criterio — queda como contenido de reserva para una futura revisión de ese
ensamblado.
