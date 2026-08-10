# Etapa 3 — Formulario público de autoevaluación

## 1. Propósito de este documento

Se documenta la implementación del primer punto de contacto de la plataforma con un usuario
final: el formulario mediante el cual una empresa responde el instrumento de autoevaluación.
Esta etapa marca la transición del sistema de un conjunto de componentes verificables solo por
línea de comandos a una interfaz operable desde un navegador.

## 2. Objetivo de la etapa

El objetivo fue habilitar un flujo de autoevaluación accesible mediante un enlace único, sin
que la persona que responde deba registrarse ni autenticarse, condición explícita del diseño
del sistema. El formulario debía cubrir dos secciones —los datos generales de la empresa y el
cuestionario del primer criterio— y garantizar que las respuestas quedaran asociadas de forma
inequívoca a la evaluación correspondiente.

## 3. Diseño de la interacción

La página pública se organiza en tres estados posibles, determinados por el estado de la
evaluación asociada al enlace: un estado en el que el enlace no corresponde a ninguna
evaluación existente, un estado en el que la evaluación ya fue respondida con anterioridad, y
el estado en el que el formulario está disponible para ser llenado. Esta distinción evita que
una misma evaluación pueda completarse más de una vez y comunica con claridad a la persona
usuaria la razón por la que, en su caso, no puede proceder.

El cuestionario reproduce la representación visual tipo semáforo del instrumento original: cada
uno de los diez ítems del Criterio 1 se presenta con cinco opciones de respuesta codificadas
por color, de un rojo asociado a la ausencia de la condición evaluada a un azul asociado a su
cumplimiento óptimo. Los ítems se obtienen dinámicamente de la base de datos en lugar de estar
escritos directamente en la interfaz, de modo que la incorporación de los criterios restantes
en una etapa posterior no requiera modificar el código del formulario.

## 4. Integridad de los datos

El registro de las respuestas se realiza dentro de una transacción de base de datos que
bloquea la fila de la evaluación mientras se procesa el envío, con el fin de prevenir que un
reenvío accidental o concurrente del formulario duplique respuestas o deje la evaluación en un
estado inconsistente. La validación de que la evaluación exista y se encuentre en estado
pendiente se realiza nuevamente en el momento del envío, de manera independiente a cualquier
validación previa realizada al cargar la página, como salvaguarda ante enlaces reutilizados o
manipulados.

Se identificó una discrepancia entre el plan de trabajo original, que contemplaba validar que
el enlace no hubiera expirado, y el modelo de datos definido para el proyecto, que no incluye
un campo de expiración para las evaluaciones. En ausencia de dicho campo no existe información
que expirar, por lo que esta validación no se implementó; de requerirse en el futuro, es
necesario extender primero el modelo de datos.

## 5. Estrategia de verificación

A diferencia de los componentes de las etapas previas, este es el primero que requiere
verificación mediante interacción real con una interfaz gráfica. La verificación se realizó
mediante automatización de navegador sobre el flujo completo: carga del formulario, llenado de
los campos de datos generales, selección de una respuesta para cada uno de los diez ítems,
envío, y confirmación de la redirección a la pantalla de agradecimiento. La prueba se ejecutó
tanto en una resolución representativa de un dispositivo móvil como en una de escritorio, y se
verificó de manera independiente, mediante consulta directa a la base de datos, que la
información enviada quedara registrada correctamente y que la evaluación cambiara a su estado
de completada.

## 6. Entregable y estado al cierre de la etapa

Al cierre de esta etapa, el flujo de autoevaluación para el Criterio 1 es funcional de extremo
a extremo desde un navegador, sin requerir intervención manual sobre la base de datos salvo
para la creación inicial del enlace —tarea que corresponde al panel privado, aún no
construido. La extensión de este mismo formulario a los cuatro criterios restantes del
instrumento no requiere cambios estructurales, dado que los ítems se leen dinámicamente del
catálogo normativo.
