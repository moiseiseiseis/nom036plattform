# Criterio 1 — Recomendaciones por ítem y nivel (para revisión del Dr. Sergio)

**Criterio:** Identificación y clasificación de los puestos de trabajo ocupacionalmente
expuestos (al manejo manual de cargas).
**Estado:** primera versión de trabajo, co-redactada con el desarrollador a partir del texto
oficial de la NOM-036-1-STPS-2018 (Capítulos 7 y 8) y de la estructura narrativa del informe
JASANA real. **Pendiente de revisión y validación final antes de usarse en un informe a una
empresa real.**
**Fuente en el repositorio:** `supabase/content_v1_criterio1.sql`.

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

Al revisar, lo más útil es señalar, por cada recomendación: (a) si el contenido es correcto y
suficiente, (b) si el numeral citado es el correcto, o (c) si el texto necesita reescribirse.

---

## Ítem 1 — Numeral 7.2 a) — Obligatorio

**Pregunta:** ¿Se han identificado todas las tareas que implican levantar, bajar, empujar,
jalar, transportar o estibar materiales manualmente?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se han identificado las tareas que implican manejo manual de cargas (levantar, bajar, empujar, jalar, transportar o estibar materiales). Se recomienda realizar el análisis de identificación que exige el numeral 7.2 de la NOM-036-1-STPS-2018, enlistando cada actividad, tarea o puesto de trabajo en el que se manipulen cargas. |
| 1 — Mínimo | La identificación de tareas con manejo manual de cargas es parcial o informal. Se recomienda formalizarla por escrito, cubriendo todas las actividades de levantar, bajar, empujar, jalar, transportar y estibar materiales, conforme al numeral 7.2. |
| 2 — Regular | Existe una identificación de tareas con manejo manual de cargas, pero no cubre todos los puestos de trabajo. Se recomienda revisarla y completarla para todos los puestos ocupacionalmente expuestos. |
| 3 — Aceptable | La identificación de tareas con manejo manual de cargas cubre la mayoría de los puestos. Se recomienda mantenerla actualizada y revisarla cuando cambien las condiciones de trabajo (numeral 7.6). |
| 4 — Óptimo | La identificación de tareas con manejo manual de cargas está completa y documentada conforme al numeral 7.2. Se recomienda mantener este proceso y actualizarlo periódicamente. |

---

## Ítem 2 — Numeral 8.2 c) — Obligatorio

**Pregunta:** ¿Se conoce el peso promedio y máximo de las cargas manipuladas en cada estación
de trabajo?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se conoce el peso promedio ni máximo de las cargas manipuladas en las estaciones de trabajo. Se recomienda determinar estos datos como parte de las características de la carga que exige el numeral 8.2 c) de la NOM-036-1-STPS-2018. |
| 1 — Mínimo | Se tiene una idea aproximada del peso de las cargas, pero no está documentada ni verificada. Se recomienda medir y registrar el peso promedio y máximo por estación de trabajo. |
| 2 — Regular | Se conoce el peso de las cargas en algunas estaciones de trabajo, pero no en todas. Se recomienda completar el registro para todas las estaciones donde se manipulen cargas. |
| 3 — Aceptable | Se conoce el peso promedio y máximo de las cargas en la mayoría de las estaciones de trabajo. Se recomienda mantener este registro actualizado. |
| 4 — Óptimo | Se conoce y tiene documentado el peso promedio y máximo de las cargas en todas las estaciones de trabajo, conforme al numeral 8.2 c). Se recomienda mantener este control. |

---

## Ítem 3 — Numeral 8.3 a) 3) — Obligatorio

**Pregunta:** ¿Todas las actividades de carga manual se hacen en lugares con suficiente espacio
y sin obstrucciones?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | Las actividades de carga manual se realizan en espacios reducidos o con obstrucciones frecuentes. Se recomienda mantener las áreas de tránsito y de trabajo libres de obstáculos, conforme al numeral 8.3 a). |
| 1 — Mínimo | Existen obstrucciones o falta de espacio en varias de las áreas donde se realiza manejo manual de cargas. Se recomienda revisar y despejar dichas áreas. |
| 2 — Regular | La mayoría de las áreas cuentan con espacio suficiente, pero persisten algunos puntos con obstrucciones. Se recomienda identificarlos y corregirlos. |
| 3 — Aceptable | Las áreas de trabajo cuentan con espacio suficiente y están libres de obstáculos en la mayoría de los casos. Se recomienda mantener esta condición mediante inspecciones periódicas. |
| 4 — Óptimo | Todas las áreas donde se realiza manejo manual de cargas cuentan con espacio suficiente y están libres de obstrucciones. Se recomienda mantener este control como parte de las inspecciones rutinarias. |

---

## Ítem 4 — Numeral 7.3 — Obligatorio

**Pregunta:** ¿Se aplican métodos de estimación del riesgo (Apéndice I o II) para evaluar la
carga laboral?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se aplica ningún método de estimación del riesgo para las actividades de manejo manual de cargas. Se recomienda realizar la estimación del nivel de riesgo conforme al Apéndice I (levantar, bajar o transportar cargas) o al Apéndice II (empujar o jalar cargas) de la NOM-036-1-STPS-2018, según corresponda. |
| 1 — Mínimo | Se ha intentado aplicar algún método de estimación del riesgo, pero de forma incompleta o no sistemática. Se recomienda formalizar su aplicación conforme al numeral 7.3. |
| 2 — Regular | Se aplican métodos de estimación del riesgo en algunas actividades, pero no en todas las que involucran manejo manual de cargas. Se recomienda extender su aplicación a todas las actividades identificadas. |
| 3 — Aceptable | Se aplican métodos de estimación del riesgo (Apéndice I o II) en la mayoría de las actividades de manejo manual de cargas. Se recomienda mantener esta práctica y documentar los resultados. |
| 4 — Óptimo | Se aplican y documentan métodos de estimación del riesgo (Apéndice I o II) para todas las actividades de manejo manual de cargas, conforme al numeral 7.3. Se recomienda mantener esta práctica. |

---

## Ítem 5 — Numeral 7.2 d) — Obligatorio

**Pregunta:** ¿Se registran frecuencias de levantamiento o traslado de cargas durante la jornada
laboral?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se registra la frecuencia con que se levantan o trasladan cargas durante la jornada laboral. Se recomienda registrar este dato como parte de la identificación de actividades que exige el numeral 7.2 d). |
| 1 — Mínimo | Se tiene una estimación informal de la frecuencia, sin registro documentado. Se recomienda formalizar su registro. |
| 2 — Regular | Se registra la frecuencia en algunas actividades, pero no de manera sistemática en todas. Se recomienda extender el registro a todas las actividades con manejo manual de cargas. |
| 3 — Aceptable | Se registra la frecuencia de levantamiento o traslado de cargas en la mayoría de las actividades. Se recomienda mantener y actualizar este registro. |
| 4 — Óptimo | Se registra sistemáticamente la frecuencia de levantamiento o traslado de cargas en todas las actividades, conforme al numeral 7.2 d). Se recomienda mantener esta práctica. |

---

## Ítem 6 — Numeral 8.3 b) 2) y Tabla 1 — Obligatorio

**Pregunta:** ¿Las cargas manipuladas se encuentran dentro de los límites permitidos de acuerdo
al género y edad?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se verifica que las cargas manipuladas respeten los límites de masa máxima por género y edad establecidos en la Tabla 1 de la NOM-036-1-STPS-2018. Se recomienda implementar esta verificación conforme al numeral 8.3 b). |
| 1 — Mínimo | Existe una verificación informal de los límites de carga por género y edad, sin comparación sistemática contra la Tabla 1. Se recomienda formalizar esta verificación. |
| 2 — Regular | Se verifica el cumplimiento de los límites de carga en algunos puestos, pero no en todos. Se recomienda extender la verificación a todos los puestos con manejo manual de cargas. |
| 3 — Aceptable | Las cargas manipuladas respetan los límites de la Tabla 1 en la mayoría de los puestos. Se recomienda mantener esta verificación de forma periódica. |
| 4 — Óptimo | Se verifica y documenta que las cargas manipuladas respetan los límites de masa máxima por género y edad de la Tabla 1 en todos los puestos. Se recomienda mantener este control. |

---

## Ítem 7 — Numeral 7.4 — Obligatorio

**Pregunta:** ¿Se cuenta con documentación o planos donde se indiquen los puntos críticos de
Manejo Manual de Cargas (MMC)?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se cuenta con documentación ni planos que indiquen los puntos críticos de manejo manual de cargas. Se recomienda elaborar el informe del análisis de factores de riesgo ergonómico que exige el numeral 7.4, identificando dichos puntos críticos. |
| 1 — Mínimo | Existe documentación parcial o informal sobre los puntos críticos de MMC. Se recomienda formalizarla conforme al numeral 7.4. |
| 2 — Regular | Se cuenta con documentación de los puntos críticos de MMC en algunas áreas, pero no en todas. Se recomienda completarla para todos los puestos identificados. |
| 3 — Aceptable | Se cuenta con documentación de los puntos críticos de MMC para la mayoría de los puestos. Se recomienda mantenerla actualizada. |
| 4 — Óptimo | Se cuenta con documentación y/o planos completos de los puntos críticos de manejo manual de cargas, conforme al numeral 7.4. Se recomienda mantener esta documentación actualizada. |

---

## Ítem 8 — Numeral 8.7 b) y c) — Obligatorio

**Pregunta:** ¿Se han reubicado procesos o materiales para evitar posturas forzadas o traslados
innecesarios?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se han realizado ajustes en la distribución de procesos o materiales para evitar posturas forzadas o traslados innecesarios. Se recomienda evaluar la redistribución física de instalaciones, procesos, maquinaria y equipos como medida de control técnica (numeral 8.7). |
| 1 — Mínimo | Se han realizado ajustes puntuales y aislados, sin un criterio sistemático. Se recomienda evaluar de forma integral la distribución de procesos y materiales. |
| 2 — Regular | Se han reubicado procesos o materiales en algunas áreas, pero persisten posturas forzadas o traslados innecesarios en otras. Se recomienda extender esta revisión a todas las áreas. |
| 3 — Aceptable | Se han reubicado procesos o materiales en la mayoría de las áreas para evitar posturas forzadas o traslados innecesarios. Se recomienda mantener esta práctica y evaluar las áreas restantes. |
| 4 — Óptimo | Los procesos y materiales están distribuidos de manera que se evitan posturas forzadas y traslados innecesarios, conforme al numeral 8.7. Se recomienda mantener este control. |

---

## Ítem 9 — Numeral 8.6 a) 2) — Obligatorio

**Pregunta:** ¿Se han realizado pausas activas o descansos programados para actividades
repetitivas con MMC?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No existen pausas activas ni descansos programados para actividades repetitivas de manejo manual de cargas. Se recomienda establecer periodos de descanso como medida de control administrativa (numeral 8.6 a). |
| 1 — Mínimo | Las pausas o descansos se dan de manera informal, sin un programa establecido. Se recomienda documentar y programar los periodos de descanso conforme al numeral 8.6. |
| 2 — Regular | Existen pausas o descansos, pero no están formalizados para todas las actividades repetitivas con MMC. Se recomienda extender el programa a todos los puestos que lo requieran. |
| 3 — Aceptable | El programa de pausas activas y descansos cubre la mayoría de las actividades repetitivas. Se recomienda documentarlo formalmente y darle seguimiento periódico. |
| 4 — Óptimo | El programa de pausas activas y descansos está documentado y se aplica de forma consistente. Se recomienda mantenerlo y revisarlo cuando cambien las condiciones de trabajo. |

---

## Ítem 10 — Numeral 8.3 b) 5) — Obligatorio

**Pregunta:** ¿Se ha limitado la cantidad de masa acumulada que se maneja manualmente por
trabajador durante su jornada?

| Nivel | Recomendación |
|---|---|
| 0 — Nada | No se limita ni se controla la masa acumulada que cada trabajador maneja manualmente durante su jornada. Se recomienda asegurar que no se exceda de 10,000 kg/jornada de 8 horas para distancias menores a 10 m, o de 6,000 kg/jornada para distancias no mayores a 20 m, conforme al numeral 8.3 b) 5). |
| 1 — Mínimo | Existe un control informal de la masa acumulada, sin verificación sistemática contra los límites normativos. Se recomienda formalizar esta verificación. |
| 2 — Regular | Se controla la masa acumulada en algunos puestos, pero no en todos los que involucran manejo manual de cargas. Se recomienda extender el control a todos los puestos. |
| 3 — Aceptable | Se controla la masa acumulada por trabajador en la mayoría de los puestos, dentro de los límites normativos. Se recomienda mantener este control. |
| 4 — Óptimo | Se controla y documenta que la masa acumulada por trabajador no excede los límites establecidos en el numeral 8.3 b) 5). Se recomienda mantener este control. |

---

## Anexo — Plantillas de apertura y cierre por nivel de cumplimiento

Además de la recomendación por ítem, el informe usa dos plantillas fijas por franja de
cumplimiento (0-20% inexistente, 20-40% mínimo, 40-60% regular, 60-80% aceptable, 80-100%
óptimo): una de **apertura**, que introduce el párrafo del criterio, y una de **cierre**, que
introduce la conclusión general del informe. También están pendientes de validación.

### Apertura y cierre del Criterio 1

| Franja | Apertura | Cierre |
|---|---|---|
| Inexistente | Con respecto a la identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos al manejo manual de cargas, se observa que este proceso es prácticamente inexistente. | Se requiere atención prioritaria e inmediata en este criterio para cumplir con lo establecido por el Capítulo 7 de la NOM-036-1-STPS-2018. |
| Mínimo | Con respecto a la identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos, se observa que existen esfuerzos aislados, pero el proceso es incompleto en la mayoría de sus componentes. | Se recomienda priorizar las acciones de este criterio en el corto plazo. |
| Regular | Con respecto a la identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos, se observa que se cuenta con avances relevantes, aunque persisten áreas sin cubrir. | Se recomienda continuar reforzando este criterio en el mediano plazo. |
| Aceptable | Con respecto a la identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos, se observa un nivel de cumplimiento aceptable, con algunos puntos específicos por reforzar. | Se recomienda mantener y consolidar las buenas prácticas identificadas en este criterio. |
| Óptimo | Con respecto a la identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos, se observa un cumplimiento óptimo de los requisitos establecidos por la NOM-036-1-STPS-2018. | Se recomienda mantener este nivel de cumplimiento y usarlo como referencia para los demás criterios. |

### Apertura y cierre globales (nivel informe completo)

| Franja | Apertura | Cierre |
|---|---|---|
| Inexistente | A continuación se describen los puntos más importantes en los que la empresa presenta un nivel de cumplimiento inexistente respecto a la NOM-036-1-STPS-2018. | El grado de cumplimiento general de la empresa respecto a la NOM-036-1-STPS-2018 es prácticamente inexistente. Se recomienda iniciar de manera urgente con las acciones señaladas como temas obligatorios, ya que la empresa se encuentra expuesta a un riesgo elevado de incumplimiento normativo y de afectaciones a la salud de los trabajadores. |
| Mínimo | A continuación se describen los puntos más importantes en los que la empresa presenta un nivel de cumplimiento mínimo respecto a la NOM-036-1-STPS-2018. | El grado de cumplimiento general de la empresa respecto a la NOM-036-1-STPS-2018 es mínimo. Se recomienda atender de manera prioritaria los temas obligatorios señalados a continuación, ya que constituyen los requisitos básicos establecidos por la norma. |
| Regular | A continuación se describen los puntos más importantes en los que la empresa presenta un nivel de cumplimiento regular respecto a la NOM-036-1-STPS-2018. | El grado de cumplimiento general de la empresa respecto a la NOM-036-1-STPS-2018 es regular. Si bien existen avances, se recomienda continuar trabajando en los temas obligatorios señalados a continuación para consolidar el cumplimiento de la norma. |
| Aceptable | A continuación se describen los puntos más importantes en los que la empresa presenta un nivel de cumplimiento aceptable respecto a la NOM-036-1-STPS-2018. | El grado de cumplimiento general de la empresa respecto a la NOM-036-1-STPS-2018 es aceptable. Se recomienda atender los temas obligatorios pendientes y considerar los temas optativos como oportunidades de mejora continua. |
| Óptimo | A continuación se describen los puntos más importantes en los que la empresa presenta un nivel de cumplimiento óptimo respecto a la NOM-036-1-STPS-2018. | El grado de cumplimiento general de la empresa respecto a la NOM-036-1-STPS-2018 es óptimo. Se recomienda mantener las prácticas actuales y considerar los temas optativos señalados a continuación como oportunidades de mejora continua. |
