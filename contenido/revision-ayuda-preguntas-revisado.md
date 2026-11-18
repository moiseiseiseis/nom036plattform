# Ayuda de las preguntas del formulario (para revisión del Dr. Sergio)

**Estado:** contenido de trabajo. Versión 2, corregida contra el texto de la NOM-036-1-STPS-2018
(DOF, 23/11/2018). Todavía no se carga en la base de datos. **Pendiente de tu revisión y aprobación.**

**Fecha de este corte:** 2026-11-18. **Fuente en el repositorio:** `retroalimentacion/ayuda-preguntas.md`
(los textos de la ayuda) y `supabase/content_v5_ayuda.sql` (generado a partir de ese archivo).

## Qué es este texto

Es texto nuevo que **no existía** en el instrumento ni en ninguna versión anterior del formulario.
Mientras la empresa responde cada pregunta, aparece un panel «Ayuda para esta pregunta». En
computadora queda a la derecha de la pregunta. En celular se abre con el botón «¿Qué significa? ·
Cómo responder». El panel tiene tres partes:

1. **Definición:** el término clave de la pregunta, en negritas, con una explicación breve.
   Cuando existe, se tomó del Capítulo 4 (Definiciones) de la NOM-036-1-STPS-2018 o del numeral
   que cita la pregunta. Se pasó a lenguaje simple, sin cambiar cifras ni alcances.
2. **Para responder, piensa en…:** de 1 a 3 preguntas cortas que ayudan a elegir el nivel. Están
   redactadas para no sugerir cuál es la respuesta correcta.
3. **Referencia:** «Referencia: NOM-036-1-STPS-2018, numeral …». Usa el mismo numeral que ya
   tiene cada ítem para el informe, así que no es texto nuevo. Si el ítem no tiene numeral, esta
   línea no aparece.

Este texto **solo sale en el formulario**. No aparece en el informe ni cambia ningún cálculo.

## Qué cambió respecto a la versión 1 (17/11/2026)

- Definiciones más cortas y con palabras de uso diario. Se quitaron términos de la norma que una
  persona sin capacitación no conoce, o se explican al usarlos (por ejemplo «estibar», «capacidad
  nominal», «medidas administrativas»).
- Cada definición se cotejó con el numeral de la norma. Las correcciones de fondo son:
  - **1.2:** la norma no pide «conocer» el peso de cada carga como obligación aparte; pide que el
    procedimiento de seguridad describa la carga (8.2 c). Se ajustó.
  - **1.6:** se agregó que la Tabla 1 marca topes y que el peso permitido puede ser menor según
    frecuencia, distancia y agarre (8.3 b) 2).
  - **2.10:** la pregunta guía 2 sugería que el límite de masa acumulada incluye lo que se mueve con
    equipo auxiliar. La norma lo fija solo para el transporte **manual** (8.3 b) 5). Se reescribió.
  - **4.6:** el término clave pasó de «Unidad de verificación» a «Auditoría de cumplimiento», que es
    lo que pregunta el ítem.
  - **3.10:** la definición de fatiga sí viene de la norma (4.10). Se corrigió el «Origen».
- Se agregó una línea **Qué cambió** en cada ítem con cambios de fondo. Los ítems sin esa línea
  solo tienen ajustes de redacción.

## Puntos que conviene revisar con más cuidado

- **Referencia del ítem 1.9.** El numeral guardado es «8.6 a) 2)», pero el 8.6 no tiene inciso a);
  sus fracciones van numeradas 1) a 4). Propuesta: «8.6 2)». Como ese numeral también sale en el
  informe, no se cambió en la base hasta que lo confirmes.
- **Ítem 2.6.** La norma (8.3 c) 12) dice que al subir una pendiente se jala el equipo «en el mismo
  sentido del ascenso» y al bajar «en sentido opuesto al del descenso». La ayuda lo traduce como
  «quien lo maneja queda del lado de arriba: al subir va delante jalando y al bajar va detrás
  sosteniéndolo». Es una interpretación; confirma que sea la correcta.
- **Ítem 1.6.** La norma también limita a 10 kg las cargas de mujeres embarazadas y en las 10 semanas
  después del parto (8.3 b) 1). La ayuda no lo menciona para no alargarla. ¿Lo agregamos?
- **Ítems sin numeral en la norma (3.8, 4.1, 4.2, 4.3, 4.10 y 5.8).** Su definición no viene de la
  norma. Es una explicación general redactada por el equipo.
- **Ítem 2.6.** Tampoco tiene numeral, así que no muestra referencia, pero su definición resume lo
  que dice la norma sobre rampas y pendientes.
- **Ítem 3.10.** No tiene numeral, pero la definición de fatiga es la 4.10 de la norma.
- **Ítem 3.9.** La norma pide reforzar la capacitación «por lo menos cada dos años». La ayuda no da
  plazo, para no contradecir tu decisión de dejar el ítem en «cada año».
- **Cifras citadas.** Se cotejaron con el texto del DOF y coinciden:
  - 3 kg como carga mínima (1.1; numeral 4.14).
  - Tabla 1 de masa máxima por edad y género (1.6; 8.3 b) 2).
  - 10,000 kg / 6,000 kg de masa acumulada por jornada de 8 horas (1.10 y 2.10; 8.3 b) 5).
  - Fechas de ejecución no mayores a un año en el programa de ergonomía (5.5; 8.5 c).
  - Expediente médico conservado al menos cinco años (4.4; 9.4). Cifra nueva en esta versión.
- **Ítems 1.10 y 2.10.** Comparten la misma definición, «Masa acumulada». Cambian sus preguntas guía.

## Otros textos nuevos de la pantalla de pregunta

Son textos fijos de la interfaz, no del contenido. Se listan aquí por si quieres cambiar alguno.

| Dónde aparece | Texto |
|---|---|
| Título del panel (computadora) y de la hoja (celular) | Ayuda para esta pregunta |
| Botón que abre la ayuda en celular | ¿Qué significa? · Cómo responder |
| Encabezado de las preguntas guía | Para responder, piensa en… |
| Pie de la ayuda | Referencia: NOM-036-1-STPS-2018, numeral … (o «numerales …» si son varios) |
| Botón para cerrar la ayuda en celular | Entendido |
| Botón «Siguiente» en celular, cuando todavía no se elige una opción | Elige una opción |

## Cómo revisar este documento

Para cada pregunta se repite primero el texto de la pregunta, como contexto (ese texto no cambió).
Después vienen la definición, las preguntas guía y la referencia que se muestra. Al revisar,
lo más útil es señalar:

- (a) si la definición es correcta y fiel a la norma;
- (b) si las preguntas guía ayudan a responder sin inducir la respuesta;
- (c) si falta o sobra algo.

Hay un bloque de retroalimentación después de cada ítem.

---

## Criterio 1 — Identificación y clasificación de los puestos de trabajo ocupacionalmente expuestos

### Ítem 1.1

**Pregunta:** ¿Se han identificado todas las tareas que implican levantar, bajar, empujar, jalar, transportar o estibar materiales manualmente?

**Definición:** **Manejo manual de cargas:** levantar, bajar, empujar, jalar, transportar o estibar (apilar) materiales con la fuerza del cuerpo, con o sin ayuda de diablos, carretillas u otros equipos. Para la norma, carga es cualquier objeto de 3 kg o más.

**Para responder, piensa en…**
1. ¿En qué áreas o puestos se mueven a mano objetos de 3 kg o más?
2. ¿La lista incluye empujar, jalar, transportar y estibar, además de levantar?
3. ¿Está por escrito y se actualiza cuando cambian los puestos?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 7.2 a)

**Origen de la definición:** texto de la norma (4.14), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 1.2

**Pregunta:** ¿Se conoce el peso promedio y máximo de las cargas manipuladas en cada estación de trabajo?

**Definición:** **Peso de la carga:** cuánto pesa lo que se mueve en cada estación. La norma pide que el procedimiento de seguridad de cada actividad describa la carga: peso, tamaño, forma, agarre y estabilidad.

**Para responder, piensa en…**
1. ¿Se ha pesado lo que se maneja en cada estación, o solo se calcula a ojo?
2. ¿Se sabe cuál es la carga más pesada de cada estación?
3. ¿El dato está registrado?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.2 c)

**Origen de la definición:** texto de la norma, en lenguaje simple

**Qué cambió:** antes decía que la norma pide «conocer» estos datos; en realidad los pide como parte del procedimiento de seguridad.

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 1.3

**Pregunta:** ¿Todas las actividades de carga manual se hacen en lugares con suficiente espacio y sin obstrucciones?

**Definición:** **Áreas libres de obstáculos:** los lugares donde se trabaja con cargas y por donde se pasa con ellas deben estar despejados, ordenados y limpios.

**Para responder, piensa en…**
1. ¿Hay lugares donde haya que esquivar objetos con una carga en las manos?
2. ¿El espacio permite girar y acomodar la carga sin posturas forzadas?
3. ¿El orden se mantiene todos los días o solo de vez en cuando?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.3 a) 3)

**Origen de la definición:** texto de la norma (8.3 a) 3) y 4), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 1.4

**Pregunta:** ¿Se aplican métodos de estimación del riesgo (Apéndice I o II) para evaluar la carga laboral?

**Definición:** **Evaluación rápida (estimación simple del nivel de riesgo):** primera revisión de una tarea con cargas, sin mediciones detalladas, para saber qué tan riesgosa es. Se hace con el Apéndice I de la norma si la tarea es levantar, bajar o transportar, y con el Apéndice II si es empujar o jalar.

**Para responder, piensa en…**
1. ¿Se ha aplicado el Apéndice I o el II a alguna tarea?
2. ¿Se aplicó a todas las tareas con manejo de cargas, o solo a algunas?
3. ¿Los resultados están documentados?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 7.3

**Origen de la definición:** texto de la norma (4.8 y 7.3), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 1.5

**Pregunta:** ¿Se registran frecuencias de levantamiento o traslado de cargas durante la jornada laboral?

**Definición:** **Frecuencia:** cuántas veces se levanta o traslada una carga en cierto tiempo, por ejemplo por minuto. La norma pide anotarla al identificar cada tarea con cargas, junto con cuánto dura esa tarea.

**Para responder, piensa en…**
1. ¿Se sabe cuántas veces por minuto o por hora se levanta o traslada carga en cada tarea?
2. ¿Ese dato se midió o es un cálculo de memoria?
3. ¿Se registra también cuánto dura la tarea?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 7.2 d)

**Origen de la definición:** texto de la norma (7.2 d) y e), 8.2 a), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 1.6

**Pregunta:** ¿Las cargas manipuladas se encuentran dentro de los límites permitidos de acuerdo con el género y la edad?

**Definición:** **Peso máximo por edad y género (Tabla 1 de la norma):** lo más que una persona puede levantar o bajar. Menores de 18 años: 7 kg. De 18 a 45 años: 20 kg mujeres y 25 kg hombres. Mayores de 45: 15 kg mujeres y 20 kg hombres; con aval médico pueden llegar al límite de 18 a 45. Son topes: el peso permitido puede ser menor según la frecuencia, la distancia y el agarre.

**Para responder, piensa en…**
1. ¿Se conoce la edad y el género de quienes levantan o bajan cargas?
2. ¿Alguna carga supera el límite que le corresponde a quien la maneja?
3. ¿Esta revisión se hizo por escrito?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numerales 8.3 b) 2) y Tabla 1

**Origen de la definición:** texto de la norma, en lenguaje simple

**Qué cambió:** se agregó la última oración. La norma dice que el peso real permitido se ajusta por frecuencia, distancia, posición, agarre y masa acumulada, sin pasar de la Tabla 1.

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 1.7

**Pregunta:** ¿Se cuenta con documentación o planos donde se indiquen los puestos de trabajo con manejo manual de cargas (MMC)?

**Definición:** **Informe del análisis de riesgo:** documento que pide la norma. Entre otros datos, debe decir qué actividades del centro de trabajo implican manejo manual de cargas.

**Para responder, piensa en…**
1. ¿Hay un documento o plano que indique qué puestos manejan cargas?
2. ¿Corresponde a los puestos que existen hoy?
3. ¿Se puede consultar cuando se necesita?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 7.4

**Origen de la definición:** texto de la norma (7.4 b), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 1.8

**Pregunta:** ¿Se han reubicado procesos o materiales para evitar posturas forzadas o traslados innecesarios?

**Definición:** **Medidas técnicas:** cambios físicos en el lugar de trabajo para reducir el esfuerzo. Por ejemplo, mover máquinas, equipos o materiales para que queden cerca de donde se usan.

**Para responder, piensa en…**
1. ¿Hay materiales que se trasladan lejos o varias veces sin necesidad?
2. ¿Se ha movido algo de lugar para evitar agacharse, girar o estirarse con carga?
3. ¿Esos cambios se basaron en un análisis?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numerales 8.7 b) y c)

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 1.9

**Pregunta:** ¿Se han realizado pausas activas o descansos programados para actividades repetitivas con MMC?

**Definición:** **Período de descanso:** pausa, contada en minutos, que se da después de una tarea con cargas o entre varias tareas. La norma la incluye entre las medidas administrativas, es decir, cambios en la forma de organizar el trabajo.

**Para responder, piensa en…**
1. ¿Las tareas repetitivas con cargas tienen pausas definidas?
2. ¿Las pausas están programadas o dependen de cada persona?
3. ¿Se respetan en la práctica?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.6 a) 2) → **propuesta: 8.6 2)** (ver «Puntos que conviene revisar»)

**Origen de la definición:** texto de la norma (4.20 y 8.6), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 1.10

**Pregunta:** ¿Se ha limitado la cantidad de masa acumulada que se maneja manualmente por trabajador durante su jornada?

**Definición:** **Masa acumulada:** el total de kilos que una persona transporta a mano durante su jornada. La norma pone un tope por jornada de 8 horas: 10,000 kg si los traslados son de menos de 10 m, o 6,000 kg si son de hasta 20 m.

**Para responder, piensa en…**
1. ¿Se sabe cuántos kilos transporta a mano cada trabajador en un turno?
2. ¿Alguna persona se acerca a esos topes?
3. ¿Ese total se controla o se registra?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.3 b) 5)

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

## Criterio 2 — Uso de equipos auxiliares y condiciones ambientales

### Ítem 2.1

**Pregunta:** ¿Se utilizan equipos auxiliares (carretillas, diablos, patines) en el manejo cotidiano de cargas?

**Definición:** **Equipos auxiliares:** carretillas, diablos, patines y otros equipos con ruedas y sin motor que el trabajador empuja o sostiene para mover material en distancias cortas.

**Para responder, piensa en…**
1. ¿Los puestos que mueven cargas tienen equipo auxiliar a la mano?
2. ¿El personal lo usa de verdad, o solo existe?
3. ¿Hay cargas pesadas que se siguen moviendo a mano?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.3 b) 3) II)

**Origen de la definición:** texto de la norma (4.6), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 2.2

**Pregunta:** ¿Se evalúa la estabilidad de las cargas antes de su transporte (por ejemplo, que no se vayan a caer del diablo, patín, carretilla, etc.)?

**Definición:** **Estabilidad de la carga:** que la carga no se mueva, no se ladee y no se caiga durante el traslado. La norma pide asegurarla al empujar o jalar y, cuando haga falta, sujetarla (con cinchos, flejes o similares).

**Para responder, piensa en…**
1. ¿Se revisa que la carga esté bien acomodada y sujeta antes de moverla?
2. ¿Ha habido cargas que se caen del equipo durante el traslado?
3. ¿Hay una forma establecida de hacer esa revisión?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.3 c) 1)

**Origen de la definición:** texto de la norma (8.3 c) 1) y a) 6), en lenguaje simple. Los ejemplos de sujeción son del equipo.

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 2.3

**Pregunta:** ¿Se conoce la capacidad de carga de cada equipo auxiliar?

**Definición:** **Capacidad de carga (capacidad nominal):** el peso máximo que un diablo, patín o carretilla puede llevar con seguridad, según su fabricante. La norma pide verificar que la carga no lo rebase.

**Para responder, piensa en…**
1. ¿Se sabe cuánto peso soporta cada diablo, patín o carretilla?
2. ¿Esa capacidad está marcada en el equipo o registrada?
3. ¿Se verifica que no se cargue de más?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.3 c) 3)

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 2.4

**Pregunta:** ¿Las superficies de rodamiento (pisos) están niveladas, limpias y libres de obstáculos?

**Definición:** **Superficie de rodamiento:** el piso por donde pasan las ruedas del equipo auxiliar. La norma pide revisarlo antes de mover cargas, evitar pisos ranurados, dañados o resbalosos y quitar los obstáculos.

**Para responder, piensa en…**
1. ¿Hay baches, desniveles, grietas o rejillas en las rutas de traslado?
2. ¿Los pisos suelen estar limpios y secos?
3. ¿Se revisan antes de mover cargas?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numerales 8.3 a) 3) y c) 5)

**Origen de la definición:** texto de la norma (8.3 c) 5), 11) y 13), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 2.5

**Pregunta:** ¿Los pasillos de tránsito peatonal permiten maniobras seguras con cargas?

**Definición:** **Espacio de maniobra:** el lugar necesario para dar vuelta o girar con la carga. La norma pide revisar de antemano que alcance para el tamaño de la carga, sobre todo en pasillos angostos.

**Para responder, piensa en…**
1. ¿Hay pasillos donde no se puede girar con el equipo cargado?
2. ¿Peatones y cargas comparten el pasillo de forma segura?
3. ¿Los pasillos se revisan de forma periódica?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.3 c) 7)

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 2.6

**Pregunta:** ¿Las rampas, pendientes y plataformas cuentan con indicaciones, como señalización y pintura de carriles, para su uso seguro?

**Definición:** **Rampas y pendientes:** la norma pide evitarlas en la ruta de traslado. Si no se puede, quien maneja el diablo, patín o carretilla queda del lado de arriba: al subir va delante jalándolo y al bajar va detrás sosteniéndolo. La señalización ayuda a usarlas con seguridad.

**Para responder, piensa en…**
1. ¿Las rampas y plataformas tienen señalización visible?
2. ¿Hay carriles pintados o indicaciones del sentido de circulación?
3. ¿La señalización está en buen estado?

**Referencia que se muestra:** sin numeral (no se muestra la línea de referencia)

**Origen de la definición:** texto de la norma (8.3 c) 12), en lenguaje simple

**Qué cambió:** se reescribió la regla de «mismo sentido / sentido opuesto», que era difícil de entender. Es una interpretación; ver «Puntos que conviene revisar».

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 2.7

**Pregunta:** ¿Se revisa periódicamente el estado físico del equipo auxiliar?

**Definición:** **Condiciones seguras del equipo:** que las ruedas, frenos, estructura y asas del equipo auxiliar estén en buen estado. La norma pide revisarlo antes de empezar a trabajar con él.

**Para responder, piensa en…**
1. ¿Alguien revisa ruedas, frenos y estructura de los equipos?
2. ¿Esa revisión tiene una frecuencia definida?
3. ¿El equipo dañado se repara o se retira?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.3 c) 4)

**Origen de la definición:** texto de la norma, en lenguaje simple. La lista de partes es del equipo.

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 2.8

**Pregunta:** ¿Las cargas se distribuyen de forma equilibrada en el equipo auxiliar durante el traslado?

**Definición:** **Reparto de la carga:** acomodar el peso de forma pareja en el equipo auxiliar para que no se ladee ni se vuelque y sea más fácil de mover. Es parte de lo que la norma pide para que la carga se mantenga estable.

**Para responder, piensa en…**
1. ¿Lo más pesado se acomoda abajo y al centro?
2. ¿El personal sabe cómo repartir la carga?
3. ¿Ha habido volcaduras o cargas inestables?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.3 c) 1)

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 2.9

**Pregunta:** ¿Se identifican riesgos adicionales por condiciones de ruido, temperatura o iluminación en las rutas de traslado?

**Definición:** **Condiciones del ambiente:** características del lugar, como ruido, calor, frío o poca luz, que hacen más pesado el trabajo o lo vuelven peligroso. La norma pide tomarlas en cuenta en el procedimiento de seguridad.

**Para responder, piensa en…**
1. ¿Hay zonas con poca luz, mucho calor o mucho ruido en las rutas de traslado?
2. ¿Esas zonas están identificadas por escrito?
3. ¿Se tomaron medidas para ellas?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.2 d)

**Origen de la definición:** texto de la norma, en lenguaje simple. Los ejemplos (ruido, calor, frío, luz) son del equipo.

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 2.10

**Pregunta:** ¿Se aplican límites de peso total por jornada de trabajo en el transporte de materiales (con o sin uso de equipo auxiliar)?

**Definición:** **Masa acumulada:** el total de kilos que una persona transporta a mano durante su jornada. La norma pone un tope por jornada de 8 horas: 10,000 kg si los traslados son de menos de 10 m, o 6,000 kg si son de hasta 20 m.

**Para responder, piensa en…**
1. ¿Existe un límite de kilos por jornada para quien transporta materiales?
2. ¿Se distingue cuánto de ese peso se mueve a mano y cuánto con equipo auxiliar?
3. ¿Se verifica que se respete?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.3 b) 5)

**Origen de la definición:** texto de la norma, en lenguaje simple

**Qué cambió:** la pregunta guía 2 decía «¿Se cuenta también lo que se mueve con equipo auxiliar?». Eso sugería que el tope incluye el equipo auxiliar, y la norma lo fija solo para el transporte a mano. Nota: el propio texto del ítem dice «con o sin uso de equipo auxiliar»; quizá convenga revisarlo.

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

## Criterio 3 — Capacitación, adiestramiento y vigilancia a la salud

### Ítem 3.1

**Pregunta:** ¿El personal con tareas de manejo manual de cargas ha recibido capacitación específica en técnicas seguras para su manipulación?

**Definición:** **Capacitación:** la norma pide enseñar al personal que maneja cargas, de acuerdo con sus tareas: qué daños a la salud puede causar, cómo reconocer los riesgos, qué dice la norma y cómo trabajar de forma segura.

**Para responder, piensa en…**
1. ¿Todo el personal que maneja cargas recibió capacitación sobre cómo hacerlo de forma segura?
2. ¿Fue específica para sus tareas o general?
3. ¿El personal de nuevo ingreso la recibe antes de empezar?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 10.1

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 3.2

**Pregunta:** ¿Existen registros actualizados de dichas capacitaciones?

**Definición:** **Registro de capacitación:** la norma pide anotar, como mínimo, el nombre y puesto de cada trabajador capacitado, la fecha, los temas y el nombre del instructor.

**Para responder, piensa en…**
1. ¿Hay una lista de quién se capacitó y cuándo?
2. ¿Incluye los temas y al instructor?
3. ¿Está al día?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 10.4

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 3.3

**Pregunta:** ¿La capacitación incluye aspectos teóricos, prácticos y de evaluación?

**Definición:** **Partes de la capacitación:** la norma pide que tenga teoría (explicación), práctica (hacer la tarea con guía del instructor) y una evaluación de lo aprendido.

**Para responder, piensa en…**
1. ¿La capacitación incluye práctica, no solo explicación?
2. ¿Se evalúa lo aprendido?
3. ¿Se hace así en todas las sesiones?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 10.1

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 3.4

**Pregunta:** ¿Se capacita al personal de almacén en técnicas seguras de empuje y tracción?

**Definición:** **Empujar y jalar (tracción) cargas:** mover una carga de forma horizontal, a mano o con diablo, patín o carretilla. Al empujar, la fuerza se aleja del cuerpo; al jalar, va hacia el cuerpo.

**Para responder, piensa en…**
1. ¿El personal de almacén sabe empujar y jalar sin forzar la espalda?
2. ¿Se le ha enseñado a usar diablos, patines y carretillas en rampas?
3. ¿Esa capacitación incluyó práctica?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numerales 10.1 c) y d)

**Origen de la definición:** texto de la norma (4.5), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 3.5

**Pregunta:** ¿Se aplican exámenes médicos de ingreso para evaluar la aptitud física para el manejo manual de cargas?

**Definición:** **Aptitud física:** que la salud de una persona le permita manejar cargas sin riesgo. La norma pide que la avale un médico (de la empresa, de una institución de seguridad social o privada) y que haya un examen médico inicial.

**Para responder, piensa en…**
1. ¿Se hace un examen médico antes de asignar a alguien a tareas con cargas?
2. ¿Ese examen evalúa específicamente el manejo de cargas?
3. ¿Los resultados quedan registrados?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numerales 8.1 y 9.2 a)

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 3.6

**Pregunta:** ¿Se realizan evaluaciones médicas periódicas al personal expuesto?

**Definición:** **Vigilancia a la salud:** revisiones médicas al personal que maneja cargas, hechas por un médico con conocimientos en medicina del trabajo. La norma pide seguimiento cada año, o antes si aparecen señales de una lesión en músculos, huesos o articulaciones.

**Para responder, piensa en…**
1. ¿El personal expuesto tiene revisión médica al menos una vez al año?
2. ¿Se revisa antes si alguien reporta dolor o molestias?
3. ¿La realiza un médico con conocimientos en medicina del trabajo?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 9.2 b)

**Origen de la definición:** texto de la norma (9.2 b) y 9.3), en lenguaje simple

**Qué cambió:** se agregó el requisito del médico con conocimientos en medicina del trabajo (9.3), también en la pregunta guía 3.

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 3.7

**Pregunta:** ¿Se ha reubicado al personal en caso de restricción médica para el manejo manual de cargas?

**Definición:** **Restricción médica:** indicación del médico de que una persona no debe hacer cierta tarea con cargas o de que necesita un tiempo de recuperación. Según la norma, solo el médico determina la aptitud física.

**Para responder, piensa en…**
1. ¿Ha habido personal con restricción médica para cargar?
2. ¿Se le asignó otra tarea compatible con su salud?
3. ¿Hay una forma establecida de hacerlo?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 9.5

**Origen de la definición:** texto de la norma (9.5 y 4.21), en lenguaje simple. El término «restricción médica» no está en la norma.

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 3.8

**Pregunta:** ¿Se promueven hábitos posturales saludables en el entorno laboral por medio de campañas, charlas informativas, carteles, trípticos, etc.?

**Definición:** **Hábitos posturales:** la forma de colocar y mover el cuerpo al trabajar. Por ejemplo, doblar las rodillas al levantar, mantener la carga pegada al cuerpo y no girar el tronco con peso.

**Para responder, piensa en…**
1. ¿Hay campañas, carteles o pláticas sobre posturas al cargar?
2. ¿Se repiten de forma periódica?
3. ¿Llegan a todo el personal?

**Referencia que se muestra:** sin numeral (no se muestra la línea de referencia)

**Origen de la definición:** explicación general (el ítem no tiene numeral en la norma)

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 3.9

**Pregunta:** ¿La capacitación se refuerza cada año o tras cambios en el proceso?

**Definición:** **Reforzar la capacitación:** volver a darla o actualizarla cada cierto tiempo. También antes de ese plazo si llegan herramientas o equipo nuevo, cambian las condiciones de trabajo, se detectan condiciones inseguras o la última evaluación del personal lo sugiere.

**Para responder, piensa en…**
1. ¿Cuándo fue la última capacitación del personal expuesto?
2. ¿Se repite cada año?
3. ¿Se vuelve a dar cuando cambia el proceso o llega equipo nuevo?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 10.3

**Origen de la definición:** texto de la norma, en lenguaje simple

**Qué cambió:** se agregó el último motivo de la norma, «así lo sugiera la última evaluación aplicada a los trabajadores» (10.3 c).

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 3.10

**Pregunta:** ¿Se prioriza el bienestar físico y psicológico del personal en las actividades con esfuerzo físico?

**Definición:** **Fatiga:** cansancio físico o mental por un esfuerzo excesivo, que desaparece por completo con el descanso. Cuidar el bienestar del personal incluye prevenirla y evitar la sobrecarga de trabajo.

**Para responder, piensa en…**
1. ¿Se toma en cuenta el cansancio del personal al asignar tareas pesadas?
2. ¿El personal puede reportar malestar o exceso de trabajo?
3. ¿Se actúa cuando lo reporta?

**Referencia que se muestra:** sin numeral (no se muestra la línea de referencia)

**Origen de la definición:** texto de la norma (4.10), en lenguaje simple; el ítem no tiene numeral

**Qué cambió:** se quitó la mención al estrés, que no aparece en la NOM-036. El «Origen» decía «explicación general», pero la definición de fatiga sí viene de la norma.

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

## Criterio 4 — Difusión y registro de políticas y estrategias ergonómicas

### Ítem 4.1

**Pregunta:** ¿Existen políticas internas por escrito en materia de prevención de riesgos ergonómicos en el trabajo?

**Definición:** **Política interna:** documento de la empresa que declara su compromiso de prevenir riesgos ergonómicos y fija reglas generales para cumplirlo.

**Para responder, piensa en…**
1. ¿Existe por escrito?
2. ¿La respalda la dirección?
3. ¿El personal la conoce?

**Referencia que se muestra:** sin numeral (no se muestra la línea de referencia)

**Origen de la definición:** explicación general (el ítem no tiene numeral en la norma)

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 4.2

**Pregunta:** ¿Se ha designado a un responsable del cumplimiento de la NOM-036-1-STPS-2018?

**Definición:** **Responsable del cumplimiento:** persona o área encargada de dar seguimiento, dentro del centro de trabajo, a lo que pide la NOM-036-1-STPS-2018.

**Para responder, piensa en…**
1. ¿Hay una persona o un área a cargo de la norma?
2. ¿Su designación es oficial?
3. ¿Tiene tiempo y recursos para hacerlo?

**Referencia que se muestra:** sin numeral (no se muestra la línea de referencia)

**Origen de la definición:** explicación general (el ítem no tiene numeral en la norma)

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 4.3

**Pregunta:** ¿Se destina presupuesto para la adquisición de equipos auxiliares de carga?

**Definición:** **Presupuesto para equipos auxiliares:** dinero apartado de forma planeada para comprar o renovar carretillas, diablos, patines y otros equipos para mover cargas.

**Para responder, piensa en…**
1. ¿Hay una partida para estos equipos?
2. ¿Se planea cada año o solo se compra cuando algo falla?
3. ¿Se usó en el último año?

**Referencia que se muestra:** sin numeral (no se muestra la línea de referencia)

**Origen de la definición:** explicación general (el ítem no tiene numeral en la norma)

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 4.4

**Pregunta:** ¿Se mantienen registros actualizados de diagnósticos, programas y acciones en ergonomía?

**Definición:** **Registros:** la norma pide guardar evidencia de las medidas preventivas que se aplicaron y de los exámenes médicos. El expediente médico se conserva al menos cinco años.

**Para responder, piensa en…**
1. ¿Se guardan los diagnósticos, programas y acciones de ergonomía?
2. ¿Están actualizados?
3. ¿Se pueden consultar con facilidad?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 5.6

**Origen de la definición:** texto de la norma (5.6 y 9.4), en lenguaje simple

**Qué cambió:** se agregó el plazo de cinco años del expediente médico (9.4).

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 4.5

**Pregunta:** ¿Se supervisa la aplicación de las medidas ergonómicas en los puestos de trabajo con manejo manual de cargas?

**Definición:** **Supervisión:** revisar en el área de trabajo que las tareas con cargas se hagan de forma segura, siguiendo el procedimiento de seguridad de cada actividad.

**Para responder, piensa en…**
1. ¿Alguien revisa en el área de trabajo que se apliquen las medidas?
2. ¿Con qué frecuencia?
3. ¿Hay un formato o criterio para hacerlo?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.3 a) 1)

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 4.6

**Pregunta:** ¿Se han realizado auditorías internas o externas de cumplimiento normativo?

**Definición:** **Auditoría de cumplimiento:** revisión de qué tanto cumple la empresa con la norma. Puede hacerla personal de la propia empresa (interna) o una unidad de verificación acreditada y aprobada (externa). Contratar una unidad de verificación es opcional.

**Para responder, piensa en…**
1. ¿Se ha revisado alguna vez el cumplimiento de la norma?
2. ¿La revisión fue interna o externa?
3. ¿Se atendieron sus hallazgos?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 11.1

**Origen de la definición:** texto de la norma (11.1), en lenguaje simple. La parte de auditoría interna es del equipo.

**Qué cambió:** el término clave era «Unidad de verificación». Se cambió por «Auditoría de cumplimiento», que es lo que pregunta el ítem.

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 4.7

**Pregunta:** ¿Se ha comunicado al personal la importancia de esta norma mediante carteles, pláticas, boletines u otro medio informativo?

**Definición:** **Informar al personal:** la norma pide explicar a los trabajadores qué daños a la salud puede causar el manejo manual de cargas.

**Para responder, piensa en…**
1. ¿El personal sabe qué es la NOM-036 y por qué importa?
2. ¿Se usan carteles, pláticas o boletines?
3. ¿Se hace de forma regular?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 5.4

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 4.8

**Pregunta:** ¿La información sobre los riesgos por manejo manual de cargas es accesible para todos los trabajadores?

**Definición:** **Acceso al análisis de riesgo:** la norma pide que el análisis de riesgo esté disponible para todos los trabajadores que manejan cargas.

**Para responder, piensa en…**
1. ¿El personal puede consultar los riesgos de su puesto?
2. ¿La información está en un lugar y formato accesibles?
3. ¿Se le avisa dónde encontrarla?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 7.5

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 4.9

**Pregunta:** ¿Se integran los diagnósticos ergonómicos al programa anual de seguridad y salud en el trabajo?

**Definición:** **Diagnóstico de seguridad y salud en el trabajo:** revisión general de los peligros y riesgos del centro de trabajo que pide otra norma, la NOM-030-STPS-2009. La NOM-036 pide que el análisis de riesgo por manejo de cargas forme parte de ese diagnóstico.

**Para responder, piensa en…**
1. ¿El diagnóstico ergonómico forma parte del diagnóstico o programa de seguridad y salud?
2. ¿Se actualizan juntos?
3. ¿Las acciones de ergonomía aparecen en ese programa?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 7.7

**Origen de la definición:** texto de la norma (4.4 y 7.7), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 4.10

**Pregunta:** ¿Se promueve una cultura de prevención y ergonomía dentro de la organización?

**Definición:** **Cultura de prevención:** que prevenir riesgos y cuidar la ergonomía sea parte de la forma habitual de trabajar, con participación de la dirección y del personal.

**Para responder, piensa en…**
1. ¿La dirección participa en las acciones de ergonomía?
2. ¿El personal propone mejoras?
3. ¿Hay actividades de prevención de forma continua?

**Referencia que se muestra:** sin numeral (no se muestra la línea de referencia)

**Origen de la definición:** explicación general (el ítem no tiene numeral en la norma)

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

## Criterio 5 — Medidas de prevención y control

### Ítem 5.1

**Pregunta:** ¿Se cuenta con un diagnóstico enfocado en la identificación de factores de riesgo ergonómico por manejo manual de cargas?

**Definición:** **Análisis de los factores de riesgo ergonómico:** revisión de lo que en el trabajo puede causar sobreesfuerzo, movimientos repetitivos o posturas forzadas. Según la norma tiene tres pasos: identificar las tareas con cargas, hacer una evaluación rápida de su riesgo y, si hace falta, una evaluación detallada.

**Para responder, piensa en…**
1. ¿Hay un diagnóstico centrado en el manejo manual de cargas?
2. ¿Incluye la identificación de tareas y la evaluación de su riesgo?
3. ¿Está por escrito?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 7.1

**Origen de la definición:** texto de la norma (4.11 y 7.1), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 5.2

**Pregunta:** ¿Se ha realizado un análisis detallado de los puestos de trabajo mediante la aplicación de al menos un método de evaluación ergonómica, como NIOSH, REBA, MAC Tool o RAPP Tool?

**Definición:** **Evaluación específica (detallada):** valoración a fondo del riesgo con un método científicamente validado, como la ecuación de NIOSH o la ISO 11228-2 para empujar o jalar. Se usa cuando la evaluación rápida no es suficiente o cuando sigue habiendo peligro después de aplicar medidas. También puede hacerse desde el principio.

**Para responder, piensa en…**
1. ¿Se ha aplicado algún método formal de evaluación a algún puesto?
2. ¿Lo aplicó una persona capacitada?
3. ¿Los resultados se usaron para decidir medidas?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numerales 7.1 c) y 4.9

**Origen de la definición:** texto de la norma, en lenguaje simple

**Qué cambió:** se agregó que la evaluación detallada puede aplicarse directamente, sin la evaluación rápida (párrafo final de 7.1).

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 5.3

**Pregunta:** ¿Se aplican medidas técnicas (redistribución de espacios, adecuación de estaciones) para reducir riesgos?

**Definición:** **Medidas técnicas:** cambios en la forma de trabajar o en el lugar para reducir el esfuerzo, como modificar procedimientos, instalaciones, máquinas o equipos, o redistribuir espacios. La norma pide aplicarlas cuando el análisis de riesgo lo indica.

**Para responder, piensa en…**
1. ¿Se han hecho cambios físicos para reducir el esfuerzo?
2. ¿Se basaron en el análisis de riesgo?
3. ¿Se revisó si funcionaron?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.7

**Origen de la definición:** texto de la norma (8.4 y 8.7), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 5.4

**Pregunta:** ¿Se han implementado medidas administrativas, como rotación de puestos de trabajo o pausas activas?

**Definición:** **Medidas administrativas:** cambios en la organización del trabajo, como limitar el tiempo o las veces que se hace una tarea, programar descansos, variar las actividades o rotar al personal.

**Para responder, piensa en…**
1. ¿Hay rotación de puestos o pausas programadas?
2. ¿Están por escrito?
3. ¿Se aplican en todos los turnos?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.6

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 5.5

**Pregunta:** ¿Se cuenta con un programa formal de ergonomía con responsables y cronograma para la implementación de mejoras?

**Definición:** **Programa de ergonomía:** plan por escrito que, según la norma, dice qué puestos incluye, qué medidas se aplicarán, en qué fechas (no más de un año), quién es responsable, cómo se controla el avance y cómo se evalúa el resultado.

**Para responder, piensa en…**
1. ¿Existe un programa de ergonomía por escrito?
2. ¿Tiene responsables y fechas?
3. ¿Se le da seguimiento?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.5

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 5.6

**Pregunta:** ¿Se da seguimiento a los casos de trastornos musculoesqueléticos?

**Definición:** **Trastorno musculoesquelético laboral:** lesión o enfermedad de músculos, huesos, tendones o articulaciones causada por el trabajo, por ejemplo por sobreesfuerzo, movimientos repetitivos o posturas forzadas.

**Para responder, piensa en…**
1. ¿Se registran los casos de dolor o lesión relacionados con el manejo de cargas?
2. ¿Se les da seguimiento médico?
3. ¿Se revisan las tareas de quien presenta un caso?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 9.2 b)

**Origen de la definición:** texto de la norma (4.13 y 4.11), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 5.7

**Pregunta:** ¿Se ha aplicado algún cuestionario específico para la identificación de síntomas musculoesqueléticos?

**Definición:** **Cuestionario Nórdico de Kuorinka:** cuestionario sobre molestias en distintas partes del cuerpo. La norma lo propone como opción, no como obligación, para detectar a tiempo posibles trastornos musculoesqueléticos.

**Para responder, piensa en…**
1. ¿Se ha aplicado algún cuestionario sobre molestias o dolor al personal?
2. ¿A todo el personal expuesto?
3. ¿Se analizaron las respuestas?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 9.2

**Origen de la definición:** texto de la norma (9.2 b), en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 5.8

**Pregunta:** ¿Se generan reportes de mejora continua en ergonomía?

**Definición:** **Mejora continua:** revisar cada cierto tiempo los resultados de las acciones de ergonomía para corregir lo que no funciona y mantener lo que sí.

**Para responder, piensa en…**
1. ¿Se reportan los avances en ergonomía?
2. ¿Con qué frecuencia?
3. ¿Esos reportes llevan a nuevas acciones?

**Referencia que se muestra:** sin numeral (no se muestra la línea de referencia)

**Origen de la definición:** explicación general (el ítem no tiene numeral en la norma)

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 5.9

**Pregunta:** ¿Se capacita al personal en la autodetección de síntomas musculoesqueléticos posiblemente relacionados con el manejo manual de cargas?

**Definición:** **Síntomas musculoesqueléticos:** molestias como dolor, hormigueo, rigidez o pérdida de fuerza en espalda, cuello, hombros, brazos o piernas. La norma pide que la capacitación explique los daños a la salud que puede causar el manejo de cargas.

**Para responder, piensa en…**
1. ¿El personal sabe reconocer las primeras molestias?
2. ¿Sabe a quién reportarlas?
3. ¿Esto se incluye en la capacitación?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 10.1

**Origen de la definición:** texto de la norma (10.1 a), en lenguaje simple. La lista de síntomas es del equipo.

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---

### Ítem 5.10

**Pregunta:** ¿En el programa de ergonomía se describen de manera clara las medidas de prevención y control ante la exposición a factores de riesgo ergonómico por manejo manual de cargas?

**Definición:** **Medidas de control en el programa:** la norma pide que el programa de ergonomía diga qué medidas técnicas (cambios en el lugar o el equipo) y administrativas (cambios en la organización del trabajo) se van a aplicar.

**Para responder, piensa en…**
1. ¿El programa dice qué medidas se aplicarán y en qué puestos?
2. ¿Están descritas con claridad para quien las aplica?
3. ¿Se actualizan cuando cambian las condiciones?

**Referencia que se muestra:** NOM-036-1-STPS-2018, numeral 8.5 b)

**Origen de la definición:** texto de la norma, en lenguaje simple

> **Retroalimentación:** ☐ Aprobado tal cual ☐ Requiere cambios: 

---
