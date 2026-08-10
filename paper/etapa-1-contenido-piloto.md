# Etapa 1 — Esquema de datos y contenido del Criterio 1 (piloto)

## 1. Propósito de este documento

Se documenta, en continuidad con el registro de la Etapa 0, el alcance de la fase dedicada a
poblar la base de datos con el contenido del primer criterio del instrumento de
autoevaluación. Se deja constancia explícita de qué contenido corresponde a información
validada y cuál es de naturaleza provisional, distinción que resulta relevante para la
trazabilidad metodológica del sistema.

## 2. Objetivo de la etapa

El instrumento de autoevaluación se compone de cinco criterios de diez ítems cada uno; al
momento de esta fase del desarrollo únicamente se contaba con el contenido íntegro del primer
criterio, correspondiente a la identificación y clasificación de los puestos de trabajo
ocupacionalmente expuestos al manejo manual de cargas. El objetivo de esta etapa fue cargar
dicho contenido en la base de datos y, sobre esa base, construir un conjunto de datos de
prueba que permitiera continuar el desarrollo técnico de las etapas subsecuentes sin quedar
supeditado a la disponibilidad del contenido normativo restante.

## 3. Contenido cargado

Se distinguen dos categorías de contenido, marcadas de manera inequívoca en la base de datos:

- **Contenido validado.** Los diez ítems del Criterio 1 y su redacción se tomaron directamente
  del instrumento de referencia. Este contenido se considera definitivo y no está sujeto a
  revisión adicional en esta etapa.
- **Contenido provisional.** Las recomendaciones asociadas a cada combinación de ítem y nivel
  de cumplimiento (cincuenta combinaciones para el Criterio 1), así como las plantillas
  narrativas de apertura y cierre por franja de cumplimiento, aún no han sido validadas por el
  equipo investigador. Este contenido se cargó con un marcador textual explícito que impide
  que sea confundido con contenido definitivo, y su única función es sostener el desarrollo y
  la prueba de los componentes que dependen de él hasta que el contenido real esté disponible.

## 4. Conjunto de datos de prueba

Con el fin de que el motor de cálculo, descrito en el documento de la Etapa 2, pudiera
validarse desde su primera implementación contra un caso reproducible, se construyó un
registro de evaluación ficticia cuyas respuestas al Criterio 1 fueron elegidas
deliberadamente para reproducir el puntaje real obtenido por ese mismo criterio en un informe
de prediagnóstico previamente elaborado por el equipo investigador para una empresa real del
sector textil. Dicho antecedente sirve como caso de referencia externo al propio desarrollo
del sistema, lo que permite contrastar la salida del motor de cálculo contra un resultado ya
conocido e independiente de la implementación.

## 5. Entregable y estado al cierre de la etapa

Al cierre de esta etapa, la base de datos cuenta con el catálogo normativo del Criterio 1
completo, contenido narrativo provisional suficiente para ejercitar el flujo completo de
generación de recomendaciones, y un conjunto de datos de prueba anclado a un caso real
externo. La incorporación del contenido validado para las recomendaciones y las plantillas
narrativas, así como la carga de los cuatro criterios restantes del instrumento, quedan
pendientes de la validación normativa por parte del equipo investigador y se abordarán en una
etapa posterior de expansión de contenido.
