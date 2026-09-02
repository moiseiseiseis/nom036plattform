# Primer informe de avance

**Proyecto:** Plataforma de automatización de informes de prediagnóstico ergonómico
(NOM-036-1-STPS-2018)
**Presenta:** Moisés (desarrollo)
**Dirige y valida contenido:** Dr. Sergio Valenzuela
**Fecha:** agosto de 2026

---

## 1. Propósito de este informe

Este documento resume el avance del proyecto hasta el cierre de su quinta etapa de trabajo,
con dos objetivos. El primero es de seguimiento: dar cuenta, de manera conceptual y sin entrar
en detalle de implementación, de qué partes del sistema ya funcionan de extremo a extremo y
cuáles siguen pendientes. El segundo es de fondo, y es el que ocupa la parte central de este
informe: explicar con precisión cómo el instrumento de autoevaluación —el cuestionario tipo
Likert que el Dr. Sergio diseñó y validó— se transformó en un motor de reglas capaz de producir,
sin intervención humana, un diagnóstico y un conjunto de recomendaciones para cualquier empresa
que lo responda. Esa transformación es la pieza que sostiene tanto la utilidad práctica de la
plataforma como su defendibilidad metodológica de cara al artículo académico derivado, por lo
que se explica aquí con el nivel de detalle que su revisión exige.

## 2. Qué es la plataforma, en una frase

La plataforma toma las respuestas de una empresa al instrumento de autoevaluación y produce, de
forma automática, el mismo tipo de documento que hasta ahora se redactaba a mano: un informe de
prediagnóstico ergonómico en formato Word, con los puntajes obtenidos, su clasificación de
severidad y un texto de recomendaciones específico para esa empresa. Lo hace mediante un flujo
de cuatro pasos:

1. El equipo del Dr. Sergio genera, desde un panel privado, un enlace único para una empresa.
2. La empresa recibe ese enlace y llena el cuestionario, sin necesidad de crear una cuenta.
3. El sistema calcula los resultados y ensambla el informe.
4. El equipo del Dr. Sergio revisa el informe generado antes de entregarlo a la empresa.

El resto de este documento se organiza así: la sección 3 explica el estado de avance por etapa
en términos conceptuales; la sección 4 —el corazón de este informe— explica en detalle cómo
funciona el motor que convierte respuestas en diagnóstico; la sección 5 enumera lo que falta
antes de considerar el sistema completo; la sección 6 lista los puntos que requieren una
decisión o validación del Dr. Sergio para poder avanzar.

## 3. Avance por etapa (resumen conceptual)

El desarrollo se organizó en etapas incrementales, cada una con un entregable verificable antes
de pasar a la siguiente. A la fecha de este informe, las primeras cinco etapas están concluidas
para el primero de los cinco criterios del instrumento (identificación y clasificación de los
puestos de trabajo ocupacionalmente expuestos al manejo manual de cargas). Los otros cuatro
criterios comparten exactamente la misma estructura de datos y el mismo motor de cálculo; su
incorporación es, en esencia, un trabajo de carga de contenido y no de desarrollo de software
nuevo (ver sección 5).

- **Fundaciones (Etapa 0).** Se dejó lista la infraestructura sobre la que corre todo lo demás:
  la aplicación web donde vive tanto el formulario público como el panel privado, un servicio
  independiente encargado exclusivamente de generar los documentos Word, y la base de datos
  donde vive el contenido normativo. Sin lógica de negocio todavía, pero con todo desplegado y
  accesible desde el primer momento, para no descubrir problemas de despliegue al final del
  proyecto.

- **Contenido piloto del Criterio 1 (Etapa 1).** Se cargaron a la base de datos los diez ítems
  del primer criterio, tal como aparecen en el instrumento validado, junto con un conjunto de
  respuestas de prueba construido deliberadamente para reproducir el puntaje real que ese mismo
  criterio obtuvo en un informe de prediagnóstico ya elaborado para una empresa real del sector
  textil (17 de 40 puntos posibles). Contar con ese caso real, ya conocido de antemano, es lo que
  permitió validar cada pieza del sistema contra un resultado externo e independiente del propio
  desarrollo, en lugar de solo contra la lógica interna del código.

- **Motor de cálculo y recomendaciones (Etapa 2).** Se construyó, como componente aislado y
  verificable por sí solo, la lógica que convierte un conjunto de respuestas en un puntaje, una
  clasificación de severidad y un texto de recomendaciones. Es el componente que se explica en
  detalle en la sección 4. Al ejecutarlo con las respuestas de prueba de la Etapa 1, reprodujo
  exactamente las cinco clasificaciones del informe real de referencia (regular, aceptable,
  mínimo, mínimo, mínimo) y el resultado global (36.5%, mínimo).

- **Formulario público (Etapa 3).** Se construyó la página que la empresa realmente llena: sin
  necesidad de crear cuenta, con los diez ítems presentados en el mismo formato visual tipo
  semáforo del instrumento original, y con salvaguardas para que un mismo enlace no pueda
  responderse dos veces ni de forma duplicada por un reenvío accidental.

- **Generación del informe en Word (Etapa 4).** Se construyó el componente que toma una
  evaluación ya respondida, ejecuta el motor de la Etapa 2 y produce el documento `.docx` final:
  portada, datos de la empresa, tablas de puntaje y porcentaje, una gráfica comparativa y el
  texto narrativo de recomendaciones. El documento se generó y se comparó, sección por sección,
  contra el informe real de referencia de la Etapa 1.

- **Panel privado del equipo del Dr. Sergio (Etapa 5).** Se construyó la herramienta de trabajo
  del equipo: iniciar sesión, dar de alta una empresa y generar su enlace, ver el listado de
  evaluaciones con su estado (pendiente, completado, revisado), revisar los resultados de una
  evaluación ya respondida antes de aprobarla, y descargar el informe final en Word. Todo el
  ciclo —desde crear el enlace hasta descargar el informe aprobado— se probó de punta a punta
  simulando el uso real de una persona del equipo.

En síntesis: el sistema funciona hoy de extremo a extremo para el Criterio 1, con datos reales
de referencia y con el flujo operativo completo (generar enlace, responder, calcular, redactar,
revisar, entregar) probado en un navegador real, no solo en pruebas de código.

## 4. Del instrumento de Likert al motor de recomendaciones

Esta es la sección técnica de fondo de este informe. El instrumento del Dr. Sergio es, en su
forma original, una herramienta de diagnóstico pensada para ser interpretada por un experto: una
persona con criterio clínico y normativo lee las respuestas y redacta, caso por caso, un
diagnóstico. El reto central del proyecto fue traducir ese criterio experto en un conjunto de
reglas explícitas y fijas, de modo que el sistema pueda producir, sin intervención humana en
cada caso particular, el mismo tipo de diagnóstico razonado que antes solo el experto podía
producir. Esa traducción ocurre en tres niveles, que se describen a continuación de la unidad
más pequeña (el ítem individual) a la más agregada (el resultado global de la empresa).

### 4.1 Nivel ítem: de una respuesta puntual a una recomendación puntual

Cada uno de los cincuenta ítems del instrumento (diez por criterio) se responde en una escala de
cero a cuatro, donde cero representa la ausencia total de la condición evaluada y cuatro su
cumplimiento óptimo. La traducción experta que antes hacía el Dr. Sergio al leer, por ejemplo,
que una empresa respondió "1" en el ítem sobre identificación de tareas con manejo manual de
cargas, se convirtió en un catálogo cerrado: para cada combinación posible de ítem y nivel de
respuesta (diez ítems por cinco niveles, cincuenta combinaciones por criterio) existe un texto de
recomendación redactado de antemano, anclado al numeral específico de la norma que ese ítem
verifica. El sistema no redacta nada en este nivel: cuando recibe una respuesta, únicamente
busca en ese catálogo la recomendación que corresponde exactamente a ese ítem y a ese nivel, y la
recupera tal cual fue escrita. La única "inteligencia" del sistema en este nivel es de búsqueda,
no de generación de texto.

Este catálogo, para el Criterio 1, ya fue redactado en una primera versión —con el numeral de la
norma correspondiente a cada ítem y su clasificación como tema obligatorio u optativo— y está
pendiente de la revisión y validación final del Dr. Sergio antes de usarse en un informe real
(ver sección 6).

### 4.2 Nivel criterio: de diez respuestas puntuales a un porcentaje y un párrafo

El instrumento agrupa los ítems en cinco criterios de diez ítems cada uno. Para cada criterio, el
sistema realiza dos operaciones:

**Cálculo del porcentaje de cumplimiento.** Cada ítem vale un máximo de cuatro puntos, de modo
que un criterio de diez ítems tiene un puntaje máximo posible de cuarenta. El porcentaje de
cumplimiento es, simplemente, el puntaje obtenido dividido entre ese máximo. Por ejemplo, el
Criterio 1 del caso real de referencia obtuvo 17 de 40 puntos, es decir, 17/40 = 42.5% de
cumplimiento. No hay ponderación diferenciada entre ítems ni ajuste alguno: todos los ítems de
un criterio pesan lo mismo.

**Clasificación en una franja de severidad.** Ese porcentaje se ubica luego en una de cinco
franjas de veinte puntos porcentuales cada una —inexistente, mínimo, regular, aceptable y
óptimo—, replicando la misma nomenclatura de severidad que ya usa el Dr. Sergio en sus informes
manuales. El 42.5% del ejemplo anterior cae en la franja "regular" (40% a 60%), que es
exactamente la clasificación que recibió ese criterio en el informe real correspondiente. Esta
franja es, junto con los hallazgos del punto siguiente, uno de los dos elementos que determinan
qué texto narrativo recibe el criterio.

**Composición del párrafo del criterio.** El texto narrativo que describe a un criterio en el
informe final se compone de dos partes concatenadas, y aquí es donde conviene distinguir con
precisión qué es una plantilla y qué es contenido extraído de la autoevaluación:

- Una **plantilla de apertura**, elegida según la franja de severidad del criterio (por ejemplo,
  existe una plantilla de apertura distinta para un criterio "regular" que para uno "óptimo").
  Este texto es fijo: no cambia entre empresas que caigan en la misma franja, del mismo modo en
  que el Dr. Sergio probablemente reutiliza formulaciones similares para introducir un hallazgo
  de severidad comparable en distintos informes manuales.
- Los **hallazgos** de ese criterio: las recomendaciones puntuales (nivel 4.1) de todos los ítems
  cuya respuesta fue igual o menor a un umbral de atención —hipótesis de trabajo: nivel 0 o 1—,
  concatenadas después de la plantilla de apertura. Esta parte sí es enteramente específica de la
  empresa evaluada: dos empresas con el mismo porcentaje global de un criterio pero con
  debilidades en ítems distintos recibirán la misma plantilla de apertura pero un cuerpo de
  hallazgos completamente distinto.

En otras palabras: la plantilla decide el tono y el encuadre del párrafo según qué tan grave es
la situación del criterio; los hallazgos deciden de qué habla específicamente ese párrafo, y se
extraen directamente de las respuestas que dio la empresa.

### 4.3 Nivel global: del perfil de cinco criterios al diagnóstico de la empresa

El mismo razonamiento se repite una vez más, agregando los cinco criterios:

- El **porcentaje global** se calcula sumando el puntaje obtenido y el puntaje máximo posible de
  los cinco criterios, y dividiendo uno entre otro —no es un promedio simple de los cinco
  porcentajes de criterio, sino un porcentaje calculado sobre el total agregado de puntos—. Ese
  porcentaje global se clasifica en la misma escala de cinco franjas que los criterios
  individuales.
- Esa franja global determina, igual que a nivel criterio, una **plantilla de cierre** fija que
  encuadra la conclusión general del informe.
- Además, el sistema arma dos listas que sí varían por completo de una empresa a otra: los
  **temas de atención obligatoria** y los **temas de atención optativa**. Ambas se construyen
  recorriendo los hallazgos de los cinco criterios y separándolos según si el ítem del que
  provienen fue clasificado, en el catálogo normativo, como una exigencia directa de la norma o
  como una buena práctica sugerida. Estas listas son, junto con los hallazgos de criterio, la
  parte del informe que se extrae íntegramente de las respuestas de la empresa; nada en ellas
  proviene de una plantilla fija.

### 4.4 Por qué este diseño y no generación de texto libre

Una alternativa evidente hoy en día habría sido usar un modelo de lenguaje para redactar el
diagnóstico completo a partir de las respuestas. Se descartó deliberadamente por dos razones,
ambas más relevantes para este proyecto que para un uso genérico: el informe cita
recomendaciones ancladas a numerales específicos de una norma oficial, y constituye insumo
directo del artículo académico. Ambos usos exigen que el mismo conjunto de respuestas produzca,
siempre, exactamente el mismo texto, y que cada frase del informe pueda rastrearse hasta la regla
y el dato que la produjeron. El diseño descrito arriba —catálogo cerrado de recomendaciones,
plantillas fijas por franja, composición mecánica de hallazgos— cumple esa condición por
construcción: no hay ningún paso del proceso, entre la respuesta de la empresa y el párrafo
final, que no pueda auditarse línea por línea. El costo de esa garantía es que **todo** el texto
que puede aparecer en un informe —cada plantilla, cada una de las cincuenta recomendaciones por
criterio— debe existir de antemano en el catálogo, redactado y validado. Ese trabajo de redacción
es, precisamente, el que está en curso con el Dr. Sergio y el que condiciona el ritmo de avance
del proyecto (sección 6).

## 5. Qué falta para el sistema completo

Con el motor y el flujo operativo ya probados de extremo a extremo para un criterio, lo que resta
se concentra en tres frentes, en el orden en que conviene abordarlos:

1. **Validación piloto del Criterio 1.** Antes de replicar el patrón a los cuatro criterios
   restantes, conviene correr el flujo completo con una empresa piloto y comparar el informe
   generado contra lo que el Dr. Sergio redactaría manualmente para ese mismo caso, para ajustar
   plantillas o umbrales si hiciera falta antes de escalar el contenido.
2. **Expansión a los cinco criterios completos.** Una vez validado el patrón, el trabajo
   pendiente es sobre todo de contenido —recibir y cargar los ítems, recomendaciones y
   plantillas de los criterios 2 a 5— y no de desarrollo de software nuevo: el formulario, el
   motor de cálculo y la generación del informe ya están diseñados para funcionar sobre
   cualquier número de criterios sin cambios estructurales.
3. **Pulido y seguridad para uso operativo real.** Revisión de seguridad básica sobre los
   endpoints públicos, mejoras de accesibilidad en el formulario, un manual breve de uso del
   panel para el equipo, y la preparación del material de la plataforma para la sección de
   metodología del artículo.

## 6. Puntos que requieren decisión o validación del Dr. Sergio

El avance técnico está, en este momento, condicionado por un conjunto de definiciones de
contenido y de criterio experto que solo el Dr. Sergio puede resolver:

- **Validación del catálogo de recomendaciones del Criterio 1.** Existe una primera versión
  completa —numeral de la norma, texto de recomendación por cada combinación de ítem y nivel, y
  clasificación obligatorio/optativo—, pendiente de su revisión de fondo antes de usarse en un
  informe real.
- **Contenido de los Criterios 2 a 5.** Se cuenta con los nombres de los cinco criterios,
  confirmados contra un informe real ya elaborado, pero falta la lista completa de ítems de los
  cuatro criterios restantes.
- **Cortes exactos de las franjas de severidad.** Se trabajó bajo la hipótesis de franjas fijas
  de veinte puntos porcentuales, validada contra los cinco puntajes del caso de referencia real,
  pero el tratamiento de un valor que cae justo en el límite entre dos franjas (por ejemplo, si
  20% exacto es "mínimo" o "inexistente") es una convención técnica que conviene confirmar
  explícitamente.
- **Umbral de respuesta para considerar un ítem un "hallazgo".** Se usó como hipótesis de trabajo
  un nivel de respuesta de 0 o 1, sin haber podido contrastarlo todavía contra las respuestas
  individuales (no solo el puntaje agregado) del caso real de referencia.
- **Campos del formulario de datos generales de la empresa.** Falta definir con precisión qué
  información de la empresa debe solicitarse en el formulario público, más allá de su nombre.

## 7. Cierre

El proyecto tiene, a la fecha de este informe, un sistema funcional de extremo a extremo para el
primer criterio del instrumento, y un motor de recomendaciones cuyo diseño —determinista,
trazable y anclado en todo momento a las respuestas reales de cada empresa— resuelve el problema
central que motivó su construcción: producir, de forma automática y reproducible, el mismo tipo
de diagnóstico razonado que antes exigía la lectura experta del Dr. Sergio. El paso que sigue no
es de desarrollo de software, sino de contenido y validación normativa, y es ahí donde se
concentra la siguiente fase de colaboración.
