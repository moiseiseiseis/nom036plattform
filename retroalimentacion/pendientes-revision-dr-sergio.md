# Pendientes para revisar con el Dr. Sergio — Instrumento NOM-036-1-STPS-2018

Lista consolidada de los puntos que quedaron abiertos al corregir los 5 criterios (octubre de 2026). Están ordenados por impacto: primero lo que afecta al instrumento completo o al motor, después lo que es de un solo ítem.

---

## 0. Decisiones tomadas (2026-10-24)

El Dr. Sergio delegó estas decisiones al equipo de desarrollo. Cada una se verificó contra el texto oficial de la NOM-036-1-STPS-2018 (DOF 23/11/2018) y ya está aplicada en `criterios-valoraciones-separadas.md`. Criterio general: **no se modifica el texto de las preguntas** (el instrumento está publicado en Valenzuela-Gómez et al., 2026); solo se ajustan las descripciones, las recomendaciones, los numerales y la clasificación.

| # | Decisión |
|---|---|
| 1.1 | Límite inferior incluido y superior excluido: 0 a <20 % Inexistente, 20 a <40 % Mínimo, 40 a <60 % Regular, 60 a <80 % Aceptable, 80 a 100 % Óptimo. Así funciona ya el motor (`scoring.py::clasificar_bucket`). Las tablas de apertura ahora lo dicen explícitamente. |
| 1.2 | Se **conservan** las menciones a la norma dentro de las aperturas Inexistente y Mínimo. Lo que se pidió quitar fue el formato entre paréntesis en las valoraciones; en las franjas más bajas, citar el capítulo da sustento normativo al hallazgo, igual que en el informe JASANA. |
| 1.3 | No se deduplica en el motor (sigue siendo determinista y simple): se diferencian las recomendaciones. **1.4 / 5.2:** la norma distingue dos cosas. 1.4 es la estimación simple (7.1 b, 7.3, Apéndices I y II). 5.2 pasa a ser la evaluación específica (7.1 c y 4.9: NIOSH, ISO 11228-2…) y su recomendación de nivel 0 ya no repite los Apéndices. **1.10 / 2.10:** misma cifra exacta del 8.3 b) 5) en ambos, pero 1.10 se enfoca en el control por trabajador y 2.10 en organizar el transporte (equipo auxiliar, división de cargas). **5.5 / 5.10:** la descripción de nivel 0 se queda igual en ambos (es lógicamente correcta), pero la recomendación de 5.10 ahora habla de describir las medidas de control, no de crear el programa. **3.1 / 3.3 / 5.9:** se quedan, porque evalúan aspectos distintos de la capacitación (cobertura, estructura, tema de autodetección). |
| 1.4 | El Criterio 4 se llama **"Difusión y registro de políticas y estrategias ergonómicas"**, como en el artículo publicado (Tabla 1). Es la fuente que citará el artículo derivado y corresponde mejor al contenido. Las aperturas se ajustaron. |
| 1.5 | El informe muestra **la descripción del nivel como hallazgo, seguida de la recomendación**: "Se identificó que [descripción]. [Recomendación]". Se acerca más al informe JASANA, que siempre describe la situación concreta antes de recomendar. |
| 1.6 | La primera versión de la "autoevaluación dinámica" será: un criterio por pantalla con barra de progreso, la descripción de cada nivel visible al elegir, y guardado automático del avance en el navegador. **No** se implementa "No aplica" en esta versión, porque cambiaría el denominador del porcentaje del instrumento validado. |
| 2 · 1.10 / 2.10 | Texto exacto del 8.3 b) 5): 10,000 kg/jornada de 8 h para distancias menores a 10 m; 6,000 kg/jornada de 8 h para distancias no mayores a 20 m. Ya se usa igual en ambos ítems. |
| 2 · 2.6 | Pasa a **Optativo**. El único numeral relacionado, 8.3 c) 12), pide *evitar* las rampas y explica cómo jalar el equipo en pendientes; no exige señalizarlas. |
| 2 · 3.4 | Pasa a **Obligatorio, numeral 10.1 c) y d)**. La capacitación debe cubrir las medidas de seguridad de la norma (incluidas las de empujar y jalar, 8.3 c) y las prácticas seguras de trabajo. Aplica cuando el personal realiza estas actividades. |
| 2 · 4.6 | Se confirma **Optativo**: el 11.1 dice "el patrón tendrá la opción de contratar una unidad de verificación". |
| 2 · 5.7 | Se confirma **Optativo**: el 9.2 b) dice que la detección "se podrá realizar" mediante el Cuestionario Nórdico de Kuorinka. |
| 3 · 1.1 | Nivel 2 se queda como está. Se alinea la progresión: nivel 3 = "lista actualizada que cubre la mayoría"; nivel 4 = "completa, por escrito y actualizada". |
| 3 · 1.9 | No fue intencional: el nivel 3 vuelve a decir "repetitivas **con** manejo manual de cargas", igual que la pregunta. |
| 3 · 2.1 | Se queda sin "cotidiano" en los niveles 1 a 4. El matiz ya está en la pregunta. |
| 3 · 3.3 | El nivel 1 ahora dice "incluye solo uno o dos de los tres componentes", para cubrir el caso de que falten dos. El nivel 2 se queda como está. |
| 3 · 4.7 | Toda la organización: el 5.4 dice "informar a los trabajadores", sin acotar al personal expuesto. El nivel 4 ahora dice "todo el personal". |
| 3 · 5.1 | Correcto, se queda. |

---

## 1. Decisiones que afectan a todo el instrumento

**1.1 Rangos de las franjas de apertura.** En los 5 criterios, los rangos se traslapan en los valores frontera (Inexistente 0–20 %, Mínimo 20–40 %, Regular 40–60 %, Aceptable 60–80 %, Óptimo 80–100 %). El motor necesita saber a qué franja corresponde exactamente un 20 %, 40 %, 60 % u 80 %.
→ Propuesta: límite inferior incluido y superior excluido (0 a <20, 20 a <40… 80 a 100), o fijar los rangos en puntos (0–40 por criterio), como en el informe piloto.

**1.2 Citas de numeral dentro de las aperturas.** Se quitó "(NOM-036, numeral …)" de todas las valoraciones. Las aperturas Inexistente y Mínimo todavía citan la norma dentro del texto ("conforme a lo que exige el numeral 7.2…", "el Capítulo 8…"). No es el formato que pidió quitar, pero hay que confirmar si también deben salir.

**1.3 Ítems duplicados entre criterios.** Varios ítems derivan del mismo numeral, así que en el informe pueden salir hallazgos casi idénticos:
- **1.10 y 2.10** (numeral 8.3 b) 5), masa acumulada). Además, los límites están escritos distinto: 1.10 dice "distancias cortas" y 2.10 dice "menores a 10 m, jornada de 8 h". Esto es lo que señaló el Dr. con "Comparar con el criterio de arriba".
- **1.4 y 5.2** (numeral 7.3, métodos de estimación del riesgo, Apéndices I y II).
- **5.5 y 5.10** (programa de ergonomía): después del cambio del Dr., el nivel 0 de ambos dice "no se cuenta con ningún programa de ergonomía".
- **3.1, 3.3 y 5.9** (numeral 10.1, capacitación).

→ Decidir para cada par si se queda tal cual, si se reformula uno de los dos ítems, o si el motor debe deduplicar los hallazgos.

**1.4 Nombre del Criterio 4.** En el artículo publicado (Valenzuela-Gómez et al., 2026, Tabla 1) se llama *Dissemination and registration of ergonomic policies and strategies* (difusión y registro de políticas y estrategias ergonómicas). En la base de datos se llama "Difusión y promoción de la salud". El contenido (políticas, responsable, presupuesto, registros, auditorías) corresponde más al nombre del artículo. Hay que homologar el nombre y, en consecuencia, las aperturas.

**1.5 Recomendaciones separadas de la descripción (nota global ya aplicada).** Al separar descripción y recomendación, se reescribieron 209 de las 250 recomendaciones para que se entiendan solas en el informe, sin depender de la descripción. Conviene que el Dr. les dé una lectura rápida en `criterios-valoraciones-separadas.md`, sobre todo las de los niveles 3 y 4. En algunas, "mantener esta práctica" se volvió una acción concreta (por ejemplo, "extender la supervisión a todos los puestos de trabajo con manejo manual de cargas").
→ Confirmar además si el informe mostrará solo la recomendación o también la descripción como hallazgo.

**1.6 Autoevaluación dinámica (nota global pendiente).** El Dr. pidió buscar la manera de hacer relativamente dinámica la autoevaluación del instrumento. Falta definir qué significa en la práctica (p. ej., saltar ítems que no aplican, mostrar la descripción del nivel al seleccionarlo, guardar progreso). Es una decisión de diseño de la UI, no de redacción.

---

## 2. Verificaciones contra el texto de la norma

| Ítem | Qué verificar |
|---|---|
| 1.10 / 2.10 | Límites de masa acumulada del numeral 8.3 b) 5): 10,000 kg y 6,000 kg, la distancia exacta de cada límite y si es por jornada de 8 h. Después, usar la misma redacción en ambos ítems. |
| 2.6 | Está marcado como Obligatorio, pero sin numeral puntual. Si no hay numeral que lo sustente, pasarlo a Optativo; si lo hay, citarlo. |
| 3.4 | Está marcado como Optativo, sin numeral, aunque el empuje y la tracción están en la norma (Apéndice II). Valorar si debe citar un numeral o cambiar a Obligatorio. |
| 4.6 | Está marcado como Optativo, con el numeral 11.1 (unidades de verificación). Es coherente porque las unidades de verificación son voluntarias, pero falta confirmarlo. |
| 5.7 | Está marcado como Optativo, con el numeral 9.2. Es coherente si el cuestionario es solo una de las opciones que permite la norma, pero falta confirmarlo. |

---

## 3. Interpretaciones de notas del Dr. por confirmar

| Ítem | Qué se hizo | Qué confirmar |
|---|---|---|
| 1.1, nivel 2 | La nota decía "puede o no haber una lista". Se redactó como "existe una lista, pero no se ha revisado ni actualizado", para distinguirlo del nivel 1. | ¿Es esa la intención? |
| 1.1, nivel 3 | Sigue hablando de cobertura ("la mayoría de los puestos"), mientras que el nuevo nivel 2 habla de actualización. | ¿Alinear la progresión? |
| 1.9, nivel 3 | Dice "actividades repetitivas *o* con manejo manual de cargas", lo que amplía el alcance de la pregunta (repetitivas *con* MMC). | ¿Fue intencional? |
| 2.1 | Se quitó "cotidiano" de los niveles 1 a 4 al agregar "con manejo manual de cargas"; se conserva en la pregunta y en el nivel 0. | ¿Se conserva ese matiz? |
| 3.3, niveles 1 y 2 | Con el cambio del Dr., al nivel 1 le falta un solo componente. El nivel 2 se reescribió como "incluye los tres, pero no en todas las sesiones". | ¿Es la progresión deseada? |
| 4.7 | Los niveles 2 y 3 hablan de toda la organización, y el nivel 4 (cambio del Dr.) habla del "personal expuesto". | ¿El ítem es para toda la organización o solo para el personal expuesto? |
| 5.1, niveles 1 y 2 | La nota del Dr. pasó a ser el nivel 1, y el texto anterior de ese nivel ("diagnóstico parcial o informal") se fusionó con el nivel 2. | ¿Correcto? |

---

## 4. Ya resuelto en esta revisión (para referencia)

- Se quitó "(NOM-036, numeral …)" de todas las valoraciones de los 5 criterios.
- Especificidad normativa: puestos, áreas, estaciones y personal se acotaron a "con manejo manual de cargas", salvo en los ítems con alcance de toda la organización (decisión del Dr.).
- 3.9: la periodicidad del refuerzo de la capacitación es **cada año** (decisión del Dr.), igual en la pregunta y en todos los niveles.
- 3.8 y 3.10: se mantienen con alcance de toda la organización (decisión del Dr.).
- 4.9: el nuevo nivel 0 es "no se cuenta con ningún diagnóstico ergonómico" (nota del Dr.).
- Nota global de separar la descripción del nivel y la recomendación: aplicada en `criterios-valoraciones-separadas.md`.
