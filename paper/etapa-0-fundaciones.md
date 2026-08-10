# Etapa 0 — Fundaciones del sistema

## 1. Propósito de este documento

El presente documento describe, en un registro cuasi-formal apto para su incorporación
posterior a la sección de metodología del artículo académico derivado de este proyecto, el
flujo funcional general de la plataforma y el alcance técnico cubierto durante su fase
fundacional (Etapa 0). Su objetivo es dejar constancia de las decisiones de diseño adoptadas
y de su justificación, de modo que puedan ser referidas y auditadas en etapas posteriores del
desarrollo.

## 2. Flujo funcional general de la plataforma

La plataforma automatiza la elaboración de informes de prediagnóstico ergonómico conforme a
la NOM-036-1-STPS-2018, a partir de un instrumento de autoevaluación validado previamente por
el equipo investigador. El flujo operativo se compone de cuatro etapas secuenciales:

1. **Generación del enlace de evaluación.** El equipo responsable, desde un panel privado con
   autenticación, da de alta una empresa y genera un enlace único asociado a una evaluación
   pendiente.
2. **Autoevaluación por parte de la empresa.** El responsable designado por la empresa accede
   al enlace, sin necesidad de registro ni autenticación, y completa un formulario de datos
   generales seguido de un cuestionario tipo Likert de cinco criterios y diez ítems por
   criterio (escala 0-4).
3. **Cálculo y generación del informe.** Una vez recibidas las respuestas, el sistema calcula
   el grado de cumplimiento por criterio y a nivel global, clasifica los resultados en franjas
   de severidad y ensambla, mediante un motor de reglas determinista, un informe en formato
   `.docx` con gráficas de apoyo y recomendaciones.
4. **Revisión y entrega.** El equipo investigador revisa el informe generado, lo aprueba y lo
   entrega a la empresa evaluada.

Un principio de diseño transversal a todo el sistema es que el motor de recomendaciones **no
emplea generación de texto libre por modelos de lenguaje**. La selección de cada recomendación
—a nivel de ítem, de criterio o global— responde a reglas deterministas sobre catálogos de
contenido previamente validados. Esta decisión responde a que el informe resultante cita una
norma oficial y constituye insumo directo para un artículo académico, por lo que se privilegió
la reproducibilidad y la auditabilidad de cada recomendación emitida, eliminando el riesgo de
alucinación de cifras o de referencias normativas inexistentes.

## 3. Alcance de la Etapa 0

La Etapa 0 no incorpora lógica de negocio ni contenido normativo; su objetivo exclusivo es
dejar un ambiente de desarrollo y despliegue operativo sobre el cual construir las etapas
subsecuentes. Concretamente, comprendió:

- **Arquitectura del repositorio.** Se adoptó un esquema de monorepo con dos componentes
  independientes: una aplicación web (interfaz pública de autoevaluación e interfaz privada de
  gestión) y un microservicio dedicado a la generación de documentos. La separación responde a
  que la composición de documentos `.docx` con gráficas incrustadas es una tarea mejor resuelta
  en un entorno con bibliotecas maduras para ese fin, y a que dicho procesamiento excede los
  límites de tiempo y memoria razonables para una función serverless del componente web.
- **Selección y validación del stack tecnológico.** La aplicación web se implementó sobre un
  framework full-stack de React con renderizado híbrido; la persistencia de datos se resolvió
  sobre una base de datos relacional gestionada con capacidades de autenticación integradas; el
  microservicio de generación documental se implementó como una API HTTP ligera en Python. Cada
  componente fue desplegado de manera preliminar ("hola mundo") en su plataforma de hospedaje
  correspondiente, con el fin de validar el flujo de despliegue continuo desde el inicio del
  proyecto y no dejar su verificación para etapas tardías del desarrollo.
- **Modelado preliminar del esquema de datos.** Se definió y desplegó el esquema relacional que
  habrá de sostener el catálogo normativo (normativas, criterios, ítems y recomendaciones), el
  contenido narrativo condicionado por rangos de cumplimiento, y las entidades operativas
  (empresas, evaluaciones y respuestas). El diseño evita acoplar el modelo de datos al nombre
  de una norma específica, anticipando una eventual extensión del sistema a otros instrumentos
  normativos.
- **Aislamiento de los datos del proyecto.** Por restricciones del plan de servicio contratado,
  la base de datos del proyecto se aprovisionó dentro de infraestructura cloud ya en uso por el
  desarrollador para otros fines, en un espacio de nombres (esquema) dedicado y completamente
  separado de cualquier otro dato preexistente. Esta decisión permite migrar el conjunto de
  datos a un proyecto de base de datos dedicado en el futuro sin pérdida de información ni
  reestructuración del modelo, y sin haber comprometido en ningún momento la integridad de los
  demás sistemas alojados en esa misma infraestructura compartida.

## 4. Entregable y estado al cierre de la etapa

Al cierre de la Etapa 0, la plataforma cuenta con: (i) un repositorio de control de versiones
inicializado y estructurado; (ii) los dos componentes de software (web y microservicio)
desplegados en producción y respondiendo correctamente a verificaciones de salud (*health
checks*); y (iii) el esquema de base de datos aprovisionado, aislado y listo para recibir
contenido normativo. No se incorporó, en esta etapa, ningún dato correspondiente al instrumento
de evaluación, a las recomendaciones asociadas ni a la lógica de cálculo, los cuales son objeto
de las etapas subsecuentes descritas en el documento rector del proyecto.
