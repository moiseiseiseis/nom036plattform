# Etapa 4 — Generación del informe (.docx)

## 1. Propósito de este documento

Se documenta la implementación del componente que transforma las respuestas almacenadas de una
evaluación en el entregable final de la plataforma: un documento de Word descargable con la
estructura de un informe de prediagnóstico ergonómico. Se describen tanto la arquitectura de
generación del documento como las decisiones adoptadas para conciliar la necesidad de un
documento editable por personas no programadoras con la de un proceso de generación
automatizado y reproducible.

## 2. Objetivo de la etapa

El objetivo fue producir, a partir del identificador de una evaluación, un archivo `.docx`
completo —portada, datos generales de la empresa, tablas de resultados, gráfica comparativa,
narrativa por criterio y áreas de oportunidad— reutilizando sin modificaciones el motor de
cálculo descrito en la Etapa 2 y el contenido cargado en la Etapa 1.

## 3. Arquitectura de generación

Se adoptó un enfoque de plantilla editable: el documento se compone combinando una plantilla
base en formato `.docx`, con las secciones fijas del informe y marcadores de sustitución de
variables, con los datos específicos de cada evaluación. Este enfoque permite que, en el
futuro, el equipo investigador ajuste el texto fijo o la presentación del informe editando
directamente el archivo de plantilla en un procesador de texto convencional, sin necesidad de
modificar código.

La plantilla, sin embargo, no fue elaborada manualmente: se generó mediante un script que la
construye de forma programática. Esta decisión responde a una limitación conocida de la
técnica de plantillas basadas en marcadores de sustitución sobre documentos de Word: el editor
de texto enriquecido tiende a fragmentar en múltiples segmentos internos el texto que una
persona escribe de corrido, lo que corrompe silenciosamente los marcadores de sustitución
cuando estos se escriben directamente en la interfaz de Word. Al construir la plantilla por
código, cada marcador se escribe como una unidad indivisible, eliminando por completo ese
riesgo desde el origen. El costo de esta decisión es que cualquier ajuste futuro al texto fijo
del informe requerirá, al menos por ahora, modificar el script generador en lugar de editar el
documento directamente; se trata de una limitación temporal aceptada conscientemente para esta
etapa del proyecto.

Las dos tablas de resultados del informe —puntaje y porcentaje de cumplimiento por criterio— se
insertan mediante una segunda pasada de composición directa sobre el documento, en lugar de
mediante los mecanismos de repetición de filas que ofrece el motor de plantillas. Al tratarse
de tablas puramente numéricas, sin necesidad de edición manual posterior, esta alternativa
resultó más simple de verificar y menos propensa a errores que la sintaxis de repetición de
filas del motor de plantillas.

La gráfica comparativa de cumplimiento por criterio se genera de manera independiente como una
imagen y se incrusta en el documento en el momento de su composición. En esta etapa, al
encontrarse cargado únicamente el Criterio 1, la gráfica se compone de un solo eje; se trata de
una limitación esperada y transitoria que se resolverá de manera automática, sin cambios de
código, en cuanto se incorpore el contenido de los cuatro criterios restantes.

## 4. Separación entre obtención de datos y composición del documento

La función que orquesta la generación del informe se dividió explícitamente en dos partes: una
capa de acceso a datos, responsable de recuperar de la base de datos toda la información
necesaria de una evaluación, y una función de composición pura, responsable únicamente de
transformar esos datos —ya resueltos— en un documento. Esta separación, análoga a la adoptada
para el motor de cálculo en la Etapa 2, permite verificar de manera automatizada la totalidad
del proceso de composición del documento sin depender de una conexión activa a la base de
datos.

## 5. Estrategia de verificación

La verificación combinó dos vías complementarias. En primer lugar, se generó un informe real a
partir de la evaluación de prueba construida en la Etapa 1 —cuyas respuestas reproducen el
puntaje real del Criterio 1 del caso de referencia externo— y se inspeccionó de manera
programática el contenido resultante para confirmar que los datos de la empresa, el puntaje, el
porcentaje, la clasificación y la narrativa correspondieran exactamente a lo esperado. En
segundo lugar, se incorporó una prueba automatizada que ejercita el mismo proceso de
composición con datos sintéticos equivalentes, sin requerir acceso a la base de datos, lo que
permite que esta verificación se repita de manera consistente en el futuro.

## 6. Entregable y estado al cierre de la etapa

Al cierre de esta etapa, el sistema puede producir, mediante una función expuesta como servicio
web, un documento de Word completo y descargable a partir de una evaluación con respuestas
registradas. El documento contiene contenido narrativo provisional, en tanto no se incorpore el
contenido validado a que se refiere la Etapa 1, pero la estructura completa del informe —tablas,
gráfica, narrativa y listas de temas de atención— es ya la definitiva.
