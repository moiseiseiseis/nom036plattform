# Etapa 2 — Motor de cálculo y recomendaciones determinista

## 1. Propósito de este documento

Se documenta el diseño e implementación del componente central de la plataforma: el módulo
encargado de transformar las respuestas de una autoevaluación en un puntaje, una clasificación
de severidad y un texto narrativo de recomendaciones. Dada la relevancia de este componente
para la validez del informe generado, se detalla tanto su arquitectura como la estrategia
seguida para su verificación.

## 2. Objetivo de la etapa

El objetivo de esta etapa fue implementar la lógica de negocio central del sistema como un
módulo autocontenido, verificable de manera aislada y sin dependencia de interfaz de usuario,
del framework HTTP que lo expone ni de la base de datos. Este aislamiento responde a un
criterio de diseño explícito: al tratarse del componente que determina, de manera
reproducible, qué recomendación recibe cada empresa evaluada, su corrección debe poder
verificarse de forma independiente de cualquier otra capa del sistema.

## 3. Arquitectura del módulo

El motor se organiza en cuatro responsabilidades diferenciadas:

- **Cálculo de puntajes.** A partir de la lista de niveles de respuesta de un criterio, se
  obtiene el puntaje obtenido, el puntaje máximo posible y el porcentaje de cumplimiento
  correspondiente. La misma operación se generaliza a nivel global, agregando los puntajes de
  los cinco criterios.
- **Clasificación por franjas de severidad.** Cada porcentaje de cumplimiento, tanto a nivel de
  criterio como a nivel global, se clasifica en una de cinco franjas de veinte puntos
  porcentuales (inexistente, mínimo, regular, aceptable, óptimo). El tratamiento de los valores
  en el límite exacto entre dos franjas se resolvió con un criterio de intervalo semiabierto
  (límite inferior incluido, límite superior excluido), a falta de una definición normativa
  explícita al respecto; esta decisión queda documentada como hipótesis de trabajo sujeta a
  confirmación por el equipo investigador.
- **Identificación de hallazgos y selección de recomendaciones.** Se define como "hallazgo" a
  todo ítem cuyo nivel de respuesta se encuentra en o por debajo de un umbral configurable
  (hipótesis de trabajo: nivel igual o menor a uno, en una escala de cero a cuatro). Para cada
  hallazgo se selecciona, de un catálogo previamente cargado, la recomendación correspondiente
  a la combinación específica de ítem y nivel de respuesta.
- **Ensamblado narrativo.** El texto descriptivo de cada criterio se compone concatenando una
  plantilla de apertura, condicionada por su franja de cumplimiento, con las recomendaciones de
  sus hallazgos. A nivel global, se ensambla de manera análoga un cierre general junto con dos
  listas derivadas de los hallazgos de todos los criterios: temas de atención obligatoria y
  temas de atención optativa, según la clasificación normativa de cada ítem.

Un principio de diseño constante en las cuatro responsabilidades anteriores es que ninguna de
ellas accede a la base de datos ni conoce el medio de transporte por el cual llegarán sus
datos de entrada: reciben estructuras de datos ya resueltas (respuestas, catálogos de
recomendaciones, plantillas) y devuelven estructuras de datos igualmente puras, lo que permite
su verificación mediante pruebas unitarias convencionales, sin necesidad de infraestructura
adicional.

## 4. Estrategia de verificación

La verificación del módulo combinó pruebas unitarias de cada función individual con una prueba
de integración que reproduce, de extremo a extremo, el caso de un informe de prediagnóstico
real elaborado previamente por el equipo investigador para una empresa del sector textil. Los
cinco criterios de dicho informe obtuvieron puntajes de diecisiete, veintiocho, nueve, nueve y
diez puntos sobre un máximo de cuarenta cada uno, clasificados en el informe original como
regular, aceptable, mínimo, mínimo y mínimo respectivamente. La ejecución del motor sobre un
conjunto de respuestas construido para reproducir esos mismos puntajes arrojó exactamente las
mismas clasificaciones, y el cálculo global —de setenta y tres puntos sobre doscientos,
equivalente a un treinta y seis punto cinco por ciento de cumplimiento— se clasificó
consistentemente en la franja mínima. Este resultado constituye la primera validación externa,
independiente de la propia implementación, de la lógica de clasificación adoptada.

## 5. Entregable y estado al cierre de la etapa

Al cierre de esta etapa, el sistema cuenta con un motor de cálculo y recomendaciones completo,
determinista y cubierto por una batería de pruebas automatizadas que incluye la validación
contra el caso real referido. El módulo permanece desacoplado de cualquier interfaz de usuario
y de la capa de persistencia, condición que se preservará al integrarlo, en etapas
posteriores, tanto en el flujo de generación de informes como, eventualmente, en cualquier
vista de previsualización de resultados dentro del panel privado.
