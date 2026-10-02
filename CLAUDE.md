# Proyecto: Automatización de Informes de Diagnóstico Ergonómico (NOM-036-1-STPS-2018)

Este documento es la fuente de verdad del proyecto. Debe leerse al inicio de cualquier sesión
de trabajo con Claude Code. Se actualiza al cerrar cada etapa (marcar checkboxes, anotar
decisiones, mover pendientes).

---

## 1. Contexto (resumen para IA)

Plataforma que automatiza la redacción de informes de prediagnóstico ergonómico bajo la
NOM-036-1-STPS-2018, como continuación del instrumento publicado por el Dr. Sergio Valenzuela
(Physical Ergonomics & Human Factors, Vol. 223, 2026). Objetivo doble: (1) herramienta funcional
en producción, (2) artículo académico derivado, en un horizonte de 2-3 meses.

**Desarrollador:** Moisés (solo, asistido por Claude Code en VS Code).
**Supervisión de contenido/validación:** Dr. Sergio Valenzuela.

**Flujo funcional:**
1. Equipo del Dr. genera un enlace único de autoevaluación para una empresa (panel privado).
2. El responsable de la empresa llena el formulario público (sin login): datos generales +
   cuestionario Likert de 50 ítems (5 criterios × 10 ítems, escala 0-4).
3. El sistema calcula puntajes, clasifica en niveles y genera un informe en `.docx` con
   gráficas y recomendaciones automáticas.
4. El Dr. revisa/aprueba antes de la entrega final a la empresa.

**Modelo de generación de recomendaciones (determinista, NO generación libre por LLM):**
- Nivel 1 (Ítem): 1 recomendación pre-redactada por cada combinación (ítem × nivel 0-4).
- Nivel 2 (Criterio): % de cumplimiento → bucket (quintiles de 20%) → plantilla de apertura +
  hallazgos concatenados de los ítems con nivel bajo.
- Nivel 3 (Global): % global → bucket → plantilla de cierre + lista de "Temas obligatorios" y
  "Temas optativos" (derivados de ítems débiles de todos los criterios).

**Por qué determinista y no LLM libre:** el informe cita una norma oficial y alimenta un
artículo académico; se requiere que sea 100% reproducible, auditable y sin riesgo de
alucinación de cifras o citas normativas. Ver sección 9 (decisiones de arquitectura) para más
contexto.

---

## 2. Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend + backend web | Next.js |
| Base de datos + Auth (panel privado) | Supabase (Postgres) |
| Generación de documentos | Microservicio Python (`python-docx` / `docxtpl`) |
| Gráficas (radar, barras, heatmap) | `matplotlib` / `plotly`, generadas server-side e insertadas como imagen |
| Hosting frontend | Vercel |
| Hosting microservicio Python | Render (free tier; antes Railway, ver sección 7) |

**Explícitamente fuera de alcance (no construir):**
- Sistema de roles complejo o multi-tenant.
- Registro/login para el respondiente de la autoevaluación (solo enlace único).
- Tokens de seguridad personalizados tipo banca (usar Supabase Auth estándar).
- Generación de texto libre por LLM en el motor de recomendaciones v1.
- App móvil o de escritorio nativa.

---

## 3. Glosario

- **Ítem**: pregunta individual del checklist (50 en total).
- **Criterio**: agrupación de 10 ítems (5 criterios en total).
- **Nivel**: calificación de un ítem, escala 0-4 (Nada, Mínimo, Regular, Aceptable, Óptimo).
- **Bucket**: clasificación de un % de cumplimiento en 5 franjas de 20 puntos (Inexistente,
  Mínimo, Regular, Aceptable, Óptimo). Aplica a nivel criterio y a nivel global.
- **Hallazgo**: recomendación de un ítem con nivel bajo (umbral hipótesis: nivel ≤ 1), usado
  para componer el párrafo narrativo del criterio.
- **Tema obligatorio / optativo**: hallazgo etiquetado según si corresponde a una exigencia
  directa de la norma (obligatorio) o a una buena práctica sugerida (optativo).

---

## 4. Preguntas abiertas / bloqueantes con el Dr. Sergio

> No avanzar en el contenido de un criterio sin resolver lo correspondiente aquí.

- [ ] Confirmar escala real: **0-4** (confirmado por imagen del instrumento) — verificar que
      no haya confusión con "0-5" mencionado en conversación inicial.
- [x] Lista completa de los 50 ítems. Recibida del Dr. Sergio: `references/Formato de Pre
      Diagnóstico NOM 036-1-STPS-2018 versión 22.09.26.xlsx` (hoja "Diagnóstico B"). Los 40
      ítems de los Criterios 2-5 ya están cargados en `nom036.item` vía
      `supabase/seed_etapa7_items_criterios_2_a_5.sql` (solo el texto de la pregunta — numeral
      NOM y es_obligatorio quedan en NULL/default, pendientes de cruzar contra el texto oficial
      de la norma, igual que se hizo para el Criterio 1). El nombre del Criterio 4 se corrigió
      a "Difusión y promoción de la salud" (el nombre tomado antes del informe JASANA,
      "Difusión, registro y políticas en materia de Ergonomía", no coincide con el instrumento
      oficial — este último es la fuente más directa). Los nombres de los otros 4 criterios sí
      coinciden con los ya confirmados: (1) Identificación y clasificación de los puestos de
      trabajo ocupacionalmente expuestos, (2) Uso de equipos auxiliares y condiciones
      ambientales, (3) Capacitación, adiestramiento y vigilancia a la salud, (5) Medidas de
      prevención y control.
      **Dos erratas del archivo original, no corregidas al cargar (ver comentario en el script
      de seed) — confirmar con el Dr. Sergio antes de usarlas en el formulario público:**
      ítem 1.7 ("...con Manejo manual de Cargas (MMC", falta cerrar el paréntesis) e ítem 5.9
      ("...síntomas musculoesqueléticos que estén posiblemente  con el manejo manual de
      cargas", parece faltar una palabra como "relacionados").
      **Contenido completo de los 5 criterios** (numeral NOM por ítem, 50 recomendaciones y
      apertura por bucket cada uno): `supabase/content_criterio2.sql`, `content_criterio3.sql`,
      `content_criterio4.sql` y `content_criterio5.sql` (Criterio 1 desde
      `content_v1_criterio1.sql`/`content_v2_lenguaje_simple.sql`/`content_v3_...`). Avanzado
      criterio por criterio (decisión de sesión, ver sección 7), no todo de un tirón. El
      Criterio 3 es el primero con ítems marcados `es_obligatorio = false` (3.4, 3.8, 3.10 —
      técnica específica de empuje/tracción, difusión de hábitos posturales y bienestar
      general; no derivan de un numeral puntual, a diferencia del resto). También tiene una
      inconsistencia entre el ítem 3.9 ("cada año") y el numeral 10.3 de la norma ("cada dos
      años") — se redactó la recomendación con el límite real de la norma; confirmar con el Dr.
      Sergio cuál debe prevalecer. El Criterio 4 ("Difusión y promoción de la salud") no mapea
      a un solo capítulo de la norma — 5 de sus 10 ítems (4.1, 4.2, 4.3, 4.6, 4.10) quedaron
      `es_obligatorio = false` por ser prácticas de gestión sin un numeral puntual que las
      respalde (el ítem 4.6, auditorías, es un caso aparte: sí tiene numeral exacto, 11.1, pero
      la propia norma lo define como voluntario — "tendrá la opción de contratar..."). El
      Criterio 5 ("Medidas de prevención y control") es el que mapea más limpio a la norma
      desde el Criterio 1 (Capítulos 7, 8, 9.2 y 10.1); solo 2 de sus 10 ítems quedaron
      optativos (5.7 Cuestionario Nórdico de Kuorinka — el numeral 9.2 dice textualmente que
      "se podrá" aplicar, es una herramienta opcional dentro de una vigilancia que sí es
      obligatoria —, y 5.8 reportes de mejora continua, sin numeral). No se cargaron plantillas
      de "cierre" por criterio para los Criterios 2-5 — `repository.py` nunca las lee (solo
      `tipo = 'apertura'` por criterio); las que existen para el Criterio 1 desde
      `content_v1_criterio1.sql` son contenido inerte, no vale la pena repetirlo.
      **Verificado por primera vez un informe con los 5 criterios completos** (datos
      sintéticos, contenido real de la base): el radar ya no es degenerado (5 ejes, en vez del
      único eje que mostraba con solo Criterio 1), `es_parcial` da `False` como corresponde, y
      el cierre global usa por primera vez la plantilla "informe completo" de
      `content_v3_retroalimentacion_piloto.sql` en vez del texto de alcance acotado — hasta
      ahora esa ruta de código nunca se había ejercitado con datos reales.
- [ ] Cortes de porcentaje exactos por bucket — hipótesis de trabajo: quintiles de 20%,
      validada contra los datos del caso JASANA: 42.5%→Regular, 70%→Aceptable, 22.5%→Mínimo
      (x2), 25%→Mínimo (tabla 2 del informe real). Consistente con franjas de 20 puntos.
      Implementado en `scoring.py::clasificar_bucket` con límite inferior cerrado / superior
      abierto (ej. 20% ya es "Mínimo", no "Inexistente"). Confirmar con el Dr. Sergio si el
      tratamiento del valor límite exacto es el correcto.
- [ ] Umbral de nivel de ítem para considerarlo "hallazgo" — hipótesis de trabajo: nivel ≤ 1.
      Implementado como default en `recomendaciones.py` (`UMBRAL_HALLAZGO_DEFAULT = 1`),
      parametrizable. Retroalimentación de la validación piloto (`retroalimentacion/reporte.txt`,
      hallazgo 2) señala que en franjas altas (ej. "Aceptable") ningún ítem cruza el umbral y la
      narrativa del criterio queda solo con la apertura genérica, sin mencionar ningún ítem
      puntual — a diferencia del informe JASANA de referencia, que siempre cita 1-2 elementos
      concretos. No se implementó el cambio sugerido (mostrar siempre los 1-2 ítems peor
      calificados del criterio, cruce o no el umbral) porque cambia qué cuenta como hallazgo
      para las listas de temas obligatorios/optativos, y este umbral sigue sin confirmación del
      Dr. Sergio.
- [ ] Respuestas individuales de los 50 ítems del caso JASANA (para calibrar el umbral con
      precisión, si están disponibles).
- [ ] Nombre completo y cédula profesional de la persona responsable de la elaboración del
      informe (NOM-036, numeral 7.4 inciso f) — dato obligatorio del informe, no solo de estilo
      (`retroalimentacion/reporte.txt`, hallazgo 4). El informe JASANA de referencia firma como
      "Mtro. Sergio Alberto Valenzuela Gómez"; el motor no puede inventar una cédula profesional
      real. Ya está soportado por variables de entorno
      (`INFORME_RESPONSABLE_NOMBRE`/`INFORME_RESPONSABLE_CEDULA`, `generador.py::_responsable`)
      — mientras no se configuren, el informe sigue firmando como "Equipo de investigación en
      Ergonomía y Factores Humanos".
- [x] Para cada ítem: numeral de la NOM-036 correspondiente + recomendación por nivel (0-4) +
      clasificación obligatorio/optativo. **Primera versión** para el Criterio 1, redactada
      junto con el desarrollador con base en el texto oficial de la norma (Capítulos 7 y 8) y
      la estructura narrativa del informe JASANA real —
      `supabase/content_v1_criterio1.sql`. Los 10 ítems se clasificaron como obligatorios
      (derivan del análisis exigido por el Capítulo 7). Sigue pendiente la revisión y
      validación final del Dr. Sergio antes de usarse en un informe real a una empresa.
- [ ] Campos exactos de "información general de la empresa" a solicitar en el formulario.
      Confirmado como gap por la retroalimentación de la validación piloto
      (`retroalimentacion/reporte.txt`, hallazgo 6): el numeral 7.4 a) 2 de la norma pide
      domicilio completo del centro de trabajo (calle, número, colonia, CP), y el formulario
      público hoy solo captura `empresa_ubicacion` como texto libre (en la práctica, solo
      ciudad/municipio) — falta agregar los campos de domicilio al formulario y al esquema
      (`Empresa`, sección 5) antes de que un informe real cumpla este requisito.

---

## 5. Esquema de datos (referencia)

Todas las tablas viven en el esquema Postgres `nom036` (no `public`), aislado dentro del
proyecto Supabase compartido — ver decisión de sesión 3 en la sección 7. Migraciones en
`supabase/migrations/`, aplicadas por conexión directa (`psql`/`DATABASE_URL`), no por
`supabase db push`, para no tocar el historial de migraciones del proyecto compartido.

```
Normativa       (id, nombre, version)              -- por diseño, no hardcodear "NOM-036"
Criterio        (id, normativa_id, numero, nombre, orden)
Item            (id, criterio_id, numero, texto_pregunta, numeral_nom, es_obligatorio)
Recomendacion   (id, item_id, nivel[0-4], texto)
PlantillaBucket (id, criterio_id NULL para global, bucket, tipo[apertura|cierre], texto)
Empresa         (id, nombre, ubicacion, giro, num_trabajadores, turnos, descripcion_mmh)
Evaluacion      (id, empresa_id, token_publico, estado[pendiente|completado|revisado], fecha)
Respuesta       (id, evaluacion_id, item_id, nivel_seleccionado)
```

---

## 6. Etapas del proyecto

### Etapa 0 — Fundaciones del repositorio
**Objetivo:** ambiente de desarrollo listo, sin lógica de negocio todavía.

- [x] Inicializar repo (Next.js + TypeScript). Repo git local + Next.js 16 (App Router,
      TypeScript, Tailwind, ESLint) en `web/`.
- [x] Configurar Supabase (proyecto, variables de entorno, conexión). Se reutiliza el
      proyecto existente "talleres culturales" (no se creó uno nuevo por límite de 2
      proyectos activos en el plan free), en un esquema Postgres dedicado y aislado
      `nom036` (ver sección 7). Credenciales en `web/.env.local` y `service/.env`
      (gitignored).
- [x] Configurar microservicio Python separado (carpeta o repo aparte) con `docxtpl`,
      `python-docx`, `matplotlib`/`plotly` instalados. FastAPI en `service/`, venv local
      verificado (`/health` responde 200).
- [x] Definir estructura de carpetas del monorepo o de los dos repos. Monorepo: `web/`
      (Next.js), `service/` (Python), `references/` (material del Dr. Sergio).
- [x] Deploy inicial "hola mundo" en Vercel (frontend) y Railway (servicio Python), para
      validar el pipeline de despliegue desde el día uno. `web/` en
      https://web-liard-psi-30.vercel.app (proyecto `moises-garcias-projects/web`),
      `service/` en https://nom036-service-production.up.railway.app (proyecto
      `nom036-service`), ambos con `/health` verificado. **Actualización 2026-09-17:**
      el servicio Python se migró a Render por expiración del trial de Railway (ver
      sección 7); URL vigente: https://nom036-service.onrender.com.

**Entregable:** proyecto vacío mismo desplegado y accesible, con CI/CD básico.

---

### Etapa 1 — Esquema de datos y contenido del Criterio 1 (piloto)
**Objetivo:** base de datos real, cargada con el único criterio ya disponible.

- [x] Crear tablas en Supabase según el esquema de la sección 5. Hecho en Etapa 0
      (esquema `nom036`).
- [x] Cargar los 10 ítems del Criterio 1 (ya disponibles, ver imagen del instrumento).
      Contenido real, cargado vía `supabase/seed_etapa1_criterio1.sql`.
- [x] Cargar recomendaciones por ítem × nivel para Criterio 1 (bloqueado por Dr. Sergio,
      sección 4 — puede avanzarse con contenido ficticio de prueba mientras tanto).
      50 filas dummy (`[PLACEHOLDER]`), pendientes de contenido real.
- [x] Cargar plantillas de apertura/cierre por bucket para Criterio 1 (mismo bloqueo).
      10 filas dummy (`[PLACEHOLDER]`), pendientes de contenido real.
- [x] Semilla de datos de prueba (empresa ficticia + evaluación ficticia + respuestas).
      Respuestas construidas para sumar 17/40, igual que el Criterio 1 real del caso
      JASANA, para poder validar el motor de cálculo (Etapa 2) contra ese dato real.

**Entregable:** base de datos poblada y consultable con datos reales de Criterio 1 (o
ficticios equivalentes si el contenido real no ha llegado).

**Dependencia crítica:** contenido del Dr. Sergio (sección 4). Si no está disponible, usar
contenido dummy con la MISMA estructura para no bloquear el desarrollo técnico.

---

### Etapa 2 — Motor de cálculo y recomendaciones (determinista)
**Objetivo:** lógica pura de negocio, testeable de forma aislada, sin UI todavía.

- [x] Función: calcular suma y % de cumplimiento por criterio a partir de respuestas.
      `service/app/engine/scoring.py::calcular_puntaje` / `calcular_porcentaje`.
- [x] Función: clasificar % en bucket (quintiles). `scoring.py::clasificar_bucket`.
- [x] Función: seleccionar recomendación de ítem según (item_id, nivel).
      `service/app/engine/recomendaciones.py::seleccionar_recomendacion`.
- [x] Función: ensamblar párrafo narrativo de criterio (plantilla de apertura + hallazgos de
      ítems con nivel ≤ umbral). `service/app/engine/narrativa.py` +
      `recomendaciones.py::identificar_hallazgos` (umbral por defecto: nivel ≤ 1).
- [x] Función: calcular % global y bucket global. `scoring.py::calcular_global`.
- [x] Función: ensamblar cierre global + listas de temas obligatorios/optativos.
      `service/app/engine/recomendaciones.py::construir_temas` +
      `engine.py::evaluar_global`.
- [x] Suite de pruebas unitarias, incluyendo el caso de validación contra los datos reales de
      JASANA (17/40, 28/40, 9/40, 9/40, 10/40 → Regular, Aceptable, Mínimo, Mínimo, Mínimo).
      30 tests en `service/tests/`, todos pasando (`pytest`), incluyendo el global (36.5% →
      Mínimo).

**Entregable:** módulo de motor de recomendaciones con cobertura de pruebas, ejecutable de
forma independiente del resto del sistema. Vive en `service/app/engine/`, sin dependencias
de FastAPI ni de la base de datos (recibe listas de respuestas y catálogos ya resueltos).

---

### Etapa 3 — Formulario público de autoevaluación
**Objetivo:** la empresa puede responder el cuestionario sin fricción.

- [x] Página pública `/evaluar/[token]`, sin autenticación. `web/src/app/evaluar/[token]/`.
- [x] Formulario de datos generales de la empresa. La empresa se crea con solo el nombre
      (como lo dejaría el equipo del Dr. al generar el enlace, Etapa 5); el resto de los
      campos (ubicación, giro, num_trabajadores, turnos, descripcion_mmh) los llena el
      formulario público.
- [x] Formulario Likert del Criterio 1 (10 ítems, escala 0-4 visual tipo semáforo, como en el
      instrumento original). Colores rojo/naranja/amarillo/verde/azul, ítems cargados
      dinámicamente desde `nom036.item` (no hardcodeados).
- [x] Guardado de respuestas en Supabase, asociado al token de la evaluación. Server Action
      (`actions.ts`) dentro de una transacción con `select ... for update` sobre la
      evaluación, para evitar doble envío por condición de carrera.
- [x] Validación de token (evaluación existe, no ya completada). **Nota:** el esquema de
      datos (sección 5) no tiene un campo de expiración en `Evaluacion`, así que "no
      expirada" no se implementó — no hay dato que expirar. Si se requiere expiración real,
      falta agregar la columna al esquema.
- [x] Pantalla de confirmación de envío. `/evaluar/[token]/gracias`.

**Entregable:** flujo de autoevaluación funcional end-to-end para Criterio 1, en un dispositivo
móvil y de escritorio. Probado con Playwright (formulario → envío → confirmación,
persistencia verificada en base de datos, sin errores de consola ni requests fallidos) en
viewport móvil (390×844) y de escritorio (1440×900).

---

### Etapa 4 — Generación del informe (.docx)
**Objetivo:** de respuestas guardadas a documento Word descargable.

- [x] Plantilla base `.docx` con `docxtpl` (portada, secciones fijas, huecos Jinja2 para
      variables y bloques narrativos). Generada programáticamente con `python-docx` en
      `service/scripts/generar_plantilla_base.py` → `service/app/templates/informe_base.docx`
      (así se evita el problema clásico de docxtpl de tags Jinja partidos en varios runs de
      Word al escribirlos a mano). Las dos tablas (puntajes y porcentajes) se insertan aparte
      con `python-docx` después del render de docxtpl — más simple y robusto que las
      etiquetas de fila `{%tr%}` de docxtpl para tablas puramente numéricas.
- [x] Generación de gráfica de radar comparativa (aunque sea con 1 solo criterio poblado para
      esta etapa). `service/app/reportes/grafica.py`, con matplotlib; con un solo criterio
      el radar sale degenerado (un solo eje), esperado para esta etapa.
- [x] Endpoint/función que reciba `evaluacion_id`, ejecute el motor (Etapa 2) y produzca el
      `.docx` final. `GET /informes/{evaluacion_id}` en `service/app/routers/informes.py`,
      usando `service/app/reportes/generador.py` (con `service/app/reportes/repository.py`
      para leer de `nom036.*` por conexión directa a Postgres, `psycopg`).
- [x] Prueba de extremo a extremo: datos ficticios → formulario → motor → documento generado,
      comparado visualmente contra la estructura del informe JASANA real. Probado dos veces:
      (1) contra la evaluación real sembrada en la Etapa 1 (`GET /informes/{id}` → 200,
      `.docx` de 114KB, contenido inspeccionado con `python-docx`: datos de empresa,
      narrativa con los 3 hallazgos correctos, tabla 17/40, tabla 42.5%/Regular, 1 gráfica);
      (2) suite automatizada en `service/tests/test_generador_informe.py` con datos
      sintéticos (sin DB) que reproduce el mismo caso.

**Entregable:** informe `.docx` generado automáticamente a partir de una evaluación real de
Criterio 1, con estructura equivalente al informe de referencia.

---

### Etapa 5 — Panel privado (equipo del Dr. Sergio)
**Objetivo:** gestión de evaluaciones sin exponer nada públicamente.

- [x] Autenticación con Supabase Auth (login simple, sin roles complejos). `/panel/login` +
      `web/src/lib/supabase/` (cliente browser/server) + `web/src/proxy.ts` (protege
      `/panel/*`, redirige según haya o no sesión). Cuenta de prueba creada vía Admin API
      para verificar el flujo; cuentas reales del equipo del Dr. se dan de alta desde el
      dashboard de Supabase (Authentication → Users), no hay UI de invitación en la app.
- [x] Vista: crear nueva evaluación (alta de empresa + generación de enlace único).
      `/panel/nueva`: solo pide el nombre; el resto de los datos generales los llena la
      empresa en el formulario público (igual que en los seeds de la Etapa 3).
- [x] Vista: listado de evaluaciones (estado: pendiente / completado / revisado). `/panel`.
- [x] Vista: revisar resultados de una evaluación completada antes de aprobar/generar informe
      final. `/panel/evaluaciones/[id]`: llama a un endpoint JSON nuevo del servicio Python
      (`GET /informes/{id}/resumen`, reutiliza `calcular_resultados` del generador de la
      Etapa 4 sin generar el `.docx`) para mostrar puntajes, narrativa y temas antes de
      aprobar. Botón "Marcar como revisado" (estado `completado` → `revisado`).
- [x] Descarga del `.docx` generado. Vía `/panel/api/informes/[id]`, un Route Handler que
      hace de proxy autenticado hacia el servicio Python — así el endpoint real del servicio
      Python no queda expuesto sin control de acceso más allá de un UUID difícil de adivinar.
- [x] Auto-logout por inactividad (temporizador simple en frontend). `AutoLogout.tsx`
      (cliente): 15 minutos sin mousemove/keydown/click/scroll/touchstart → `signOut()` +
      redirect a `/panel/login`. Verificado con un timeout reducido de prueba.

**Entregable:** panel funcional para operar el ciclo completo sin tocar la base de datos
manualmente. Probado de punta a punta con Playwright: login → crear evaluación → responder
el formulario público con ese enlace → volver a entrar → ver resultados calculados → marcar
como revisado → descargar el `.docx` — sin errores de consola ni requests fallidos, y con el
contenido (incluyendo acentos) verificado en cada paso. Desplegado en
https://web-liard-psi-30.vercel.app/panel.

**Nota de arquitectura descubierta en esta etapa:** el servicio Python en Railway no podía
conectarse a la base de datos con la `DATABASE_URL` de conexión directa
(`db.<ref>.supabase.co:5432`) porque ese host solo resuelve a IPv6 y Railway no tiene salida
IPv6 (`Network is unreachable`). Se cambió a usar el connection pooler de Supabase (mismo que
ya usaba `web/`), ver sección 7.

---

### Etapa 6 — Validación piloto y cierre de MVP (Criterio 1)
**Objetivo:** confirmar que el sistema completo funciona con un caso real o semi-real.

- [x] Ejecutar el flujo completo con una empresa piloto (real o simulada por el Dr.). Corrido
      con la empresa "Grupo Modelo" (Criterio 1, datos reales) — ver
      `retroalimentacion/reporte.txt`.
- [x] Comparar el informe generado contra lo que el Dr. redactaría manualmente para el mismo
      set de respuestas. Comparado contra el informe JASANA real y el texto de la
      NOM-036-1-STPS-2018; 8 hallazgos de redacción documentados en
      `retroalimentacion/reporte.txt`.
- [x] Ajustar plantillas/umbrales según retroalimentación. De los 8 hallazgos, 6 ya están
      implementados (ver sección 7): cierre global de alcance acotado en evaluaciones parciales,
      mensaje explícito cuando no hay temas obligatorios/optativos, introducción de 3 párrafos,
      aperturas del Criterio 1 y cierre global homologadas con la etiqueta de bucket, corrección
      del resaltado de `modo_revision` (`w:shd` sin `w:val`), y soporte de firma con
      responsable/cédula. 2 quedan pendientes por requerir datos que este proyecto no puede
      inventar o decisiones del Dr. Sergio: domicilio completo (sección 4) y el umbral de
      "hallazgo" en franjas altas (sección 4).
- [x] Documentar hallazgos de esta validación en la bitácora del proyecto. Ver fila de esta
      sesión en la sección 7 y las referencias a `retroalimentacion/reporte.txt` en la sección 4.

**Entregable:** MVP validado para 1 de 5 criterios — listo para decidir si se replica el
patrón a los 4 criterios restantes o se ajusta el modelo antes de escalar.

---

### Etapa 7 — Expansión a los 5 criterios completos
**Objetivo:** cobertura total del instrumento de 50 ítems.

- [x] Recibir y cargar contenido (ítems + recomendaciones + plantillas) de los Criterios 2-5.
      Ítems, numeral NOM, obligatorio/optativo, recomendaciones y apertura por bucket de los 5
      criterios completos (sección 4). Avanzado criterio por criterio a lo largo de varias
      sesiones, no todo de un tirón. Sigue pendiente la revisión y validación final del Dr.
      Sergio sobre todo el contenido (es contenido de trabajo, igual que el del Criterio 1).
- [ ] Extender formulario público a los 50 ítems. El formulario (`web/src/lib/nom036/evaluaciones.ts`)
      sigue filtrando explícitamente `where c.numero = 1` — el contenido ya está listo en la
      base de datos, pero la UI de autoevaluación todavía no lo usa.
- [x] Extender generación de gráficas: radar completo de 5 ejes — verificado con un informe de
      5 criterios completos (sección 7, entrada 2026-10-02), ya no degenerado. [ ] Heatmap de
      50 ítems: pendiente, no existe todavía.
- [ ] Prueba de extremo a extremo con el caso JASANA completo, comparando el informe generado
      contra el informe real ya analizado.

**Entregable:** sistema funcional para el instrumento completo (50 ítems, 5 criterios).

---

### Etapa 8 — Pulido, seguridad y entrega
**Objetivo:** listo para uso con empresas reales de forma sostenida.

- [ ] Revisión de seguridad básica: HTTPS, rate limiting en endpoints públicos, expiración de
      tokens, logs de auditoría (quién generó/aprobó cada informe).
- [ ] Pulido de UI del formulario público (accesibilidad, responsive).
- [ ] Manual breve de uso del panel para el equipo del Dr.
- [ ] Preparar material de la plataforma para la sección de metodología del artículo
      académico.

**Entregable:** plataforma en producción, lista para uso operativo real.

---

## 7. Registro de decisiones (actualizar según avance el proyecto)

| Fecha | Decisión | Motivo |
|---|---|---|
| Sesión 1 | Motor de recomendaciones determinista (no LLM libre) | Reproducibilidad, sin riesgo de alucinación, defendible en el paper |
| Sesión 1 | Cortes de bucket por quintiles de 20% (hipótesis) | Validado contra 5 datos reales del caso JASANA |
| Sesión 1 | Sin roles/multi-tenant, sin login para autoevaluador | Alcance real es herramienta interna simple, no SaaS multiempresa |
| Sesión 2 | Se descarta explorar negocio multi-NOM por ahora | Foco en entregar MVP + paper en 2-3 meses; ver bitácora sesión 2 para el análisis de mercado si se retoma a futuro |
| Sesión 3 | Monorepo con `web/` (Next.js) y `service/` (Python) en un solo repositorio Git | Un solo desarrollador; simplifica mantener un único CLAUDE.md como fuente de verdad |
| Sesión 3 | Se reutiliza el proyecto Supabase "talleres culturales" (no uno nuevo) para NOM-036, con todas las tablas dentro de un esquema Postgres dedicado `nom036` (no `public`) | Límite de 2 proyectos activos en el plan free de Supabase; el esquema propio permite migrar limpio (`pg_dump --schema=nom036`) a un proyecto dedicado cuando se pase a un plan de pago, sin tocar ni mezclarse con las tablas de la otra plataforma |
| Sesión 3 | El esquema `nom036` NO se agrega a "Exposed schemas" de la Data API/PostgREST del proyecto compartido | Evitar tocar la configuración de API del proyecto ajeno ("talleres culturales" ya tiene una web conectada); en su lugar, `web/` y `service/` usan conexión directa a Postgres (`DATABASE_URL`) en vez de `supabase-js`/PostgREST para leer y escribir datos. Supabase Auth (Etapa 5, panel privado) sigue disponible normalmente vía `SUPABASE_SERVICE_ROLE_KEY`, ya que `auth.users` es un esquema estándar aparte, no `nom036` |
| Sesión 3 | Deploy en cuentas ya existentes: Vercel (team `moises-garcias-projects`, proyecto `web`) y Railway (proyecto `nom036-service`) | Cuentas que el usuario ya tenía configuradas; se reutilizan en vez de crear nuevas |
| Sesión 5 | `service/` (Railway) usa el connection pooler de Supabase (`aws-0-*.pooler.supabase.com:6543`) para `DATABASE_URL`, igual que `web/` (Vercel), en vez de la conexión directa (`db.<ref>.supabase.co:5432`) | La conexión directa solo resuelve a una IP IPv6, y Railway no tiene salida IPv6 — falla con `Network is unreachable`. Se descubrió al probar el endpoint `/informes/{id}/resumen` de la Etapa 5 en producción; corrige también la suposición original de la Etapa 0 de que la conexión directa era mejor por ser un proceso persistente |
| 2026-09-17 | Se migra el hosting del microservicio Python de Railway a Render (free tier), vía `render.yaml` en la raíz del repo | El trial de 30 días de Railway expiró y ya no ofrece nivel gratis sin tarjeta; se necesita mantener el costo en $0 hasta el lanzamiento oficial del proyecto. Contrapartida aceptada: el servicio se duerme tras ~15 min sin tráfico y el primer request tras eso tarda ~30-50s (cold start) |
| 2026-09-17 | Repo publicado en GitHub (`https://github.com/moiseiseiseis/nom036plattform`), rama `master` | Antes solo existía en local; requerido para que Render (deploy vía Blueprint conectado a GitHub) pueda desplegar el servicio |
| 2026-09-18 | Pulido visual del `.docx` (tipografía, color de marca, tablas, portada, pie de página con numeración) en `service/app/reportes/estilos.py`; toggle `?revision=true\|false` en `GET /informes/{id}` para descargar la versión de debug o la limpia | El informe seguía usando el formato por defecto de python-docx; el panel solo podía descargar la versión con resaltado de debug, sin forma de bajar la versión "cuasi-final" |
| 2026-09-18 | Rediseño de las gráficas (`grafica.py`) y ajustes de redacción a partir de retroalimentación real sobre un informe piloto (`retroalimentacion/`, empresa "Grupo Modelo"): cierre global con alcance acotado cuando la evaluación es parcial (`engine/narrativa.py::construir_cierre_parcial`), mensaje explícito si no hay temas obligatorios/optativos, introducción de 3 párrafos, aperturas homologadas con la etiqueta de bucket (`content_v3_retroalimentacion_piloto.sql`, aplicado a la base de datos), y corrección de un bug real de `docxtpl.RichText.add(highlight=...)` (genera `w:shd` sin `w:val`, que Word no pinta) | Es la primera retroalimentación sobre un informe real generado por el motor, no solo contra los datos de referencia JASANA; de los 8 hallazgos, 2 quedan pendientes por requerir datos reales que el proyecto no puede inventar (cédula profesional del responsable, domicilio completo) o una decisión de umbral del Dr. Sergio — ver sección 4. `ETIQUETA_POR_BUCKET` se movió de `reportes/estilos.py` a `engine/scoring.py` en el mismo cambio, para que `engine/` (capa pura, sin dependencias de `reportes/`) pudiera generar el texto de cierre parcial sin invertir la dirección de dependencia del paquete |
| 2026-09-18 | Se agrega el catálogo completo de `nom036.criterio` (5 filas) aunque solo el Criterio 1 tuviera ítems, y un botón de borrado permanente de evaluaciones en el panel (`/panel/evaluaciones/[id]`, con confirmación en cliente) | `repository.py` calcula `total_criterios` como `count(*)` de esa tabla para detectar evaluaciones parciales (sección anterior); con una sola fila, `es_parcial` nunca se activaba fuera de los tests. El borrado usa el `ON DELETE CASCADE` ya existente en `respuesta.evaluacion_id`, sin tocar la empresa — para limpiar evaluaciones de prueba mal capturadas sin editar la base a mano |
| 2026-09-18 | Vercel (`web/`) no tiene activado el auto-deploy por GitHub — a diferencia de Render (`service/`), que sí despliega solo con cada push a `master`. Hubo que correr `vercel --prod` manualmente para publicar varios commits de esta sesión | Se descubrió al verificar en producción un cambio ya pusheado que no aparecía en el panel. Pendiente: conectar el repo de GitHub al proyecto de Vercel (Project Settings → Git) para que no vuelva a pasar |
| 2026-10-02 | Se reciben y cargan los 50 ítems completos del instrumento (`references/Formato de Pre Diagnóstico NOM 036-1-STPS-2018 versión 22.09.26.xlsx`) — los 40 de los Criterios 2-5 vía `supabase/seed_etapa7_items_criterios_2_a_5.sql`. Se corrige el nombre del Criterio 4 a "Difusión y promoción de la salud" (el instrumento oficial no coincide con el nombre tomado antes del informe JASANA) | Desbloquea la pregunta abierta más grande de la sección 4. Solo se cargó el texto de la pregunta — numeral NOM, `es_obligatorio`, recomendaciones por ítem × nivel y plantillas de apertura/cierre de estos 4 criterios siguen pendientes (ver sección 4), es el trabajo de contenido más grande que queda antes de cerrar la Etapa 7. Durante esta sesión el proyecto Supabase compartido ("talleres culturales") se pausó por inactividad (plan free) y el pooler de Postgres tardó unos minutos en volver a registrar el tenant después de reactivarlo manualmente — si vuelve a pasar, no es una base de datos rota, solo esperar o revisar el dashboard de Supabase |
| 2026-10-02 | Se redacta y carga el contenido real del Criterio 2 (`supabase/content_criterio2.sql`: numeral NOM por ítem, 50 recomendaciones, apertura por bucket), siguiendo el mismo registro homologado que `content_v3_retroalimentacion_piloto.sql` dejó para el Criterio 1. Se decide avanzar los Criterios 3-5 uno a la vez (no todos juntos) | Petición explícita del usuario, para poder revisar cada criterio antes de seguir con el siguiente. De paso se confirma que `repository.py` nunca lee `plantilla_bucket` con `tipo='cierre'` a nivel criterio (ver sección 4) — las filas de "cierre" del Criterio 1 son contenido inerte desde `content_v1_criterio1.sql`; no se repitió ese patrón para el Criterio 2. El ítem 2.6 (señalización de rampas) no tiene un numeral exacto en la norma, así que sus recomendaciones no citan ninguno, en vez de forzar uno impreciso |
| 2026-10-02 | Se redacta y carga el contenido real del Criterio 3 (`supabase/content_criterio3.sql`), mismo registro que el Criterio 2. Por primera vez se marcan ítems como optativos (`es_obligatorio = false`: 3.4, 3.8, 3.10) en vez de obligatorios | Hasta este criterio, todos los ítems cargados (1 y 2) eran obligatorios por derivar de un numeral puntual — estos 3 ítems de Criterio 3 no tienen ese respaldo directo (técnica de empuje/tracción, difusión de hábitos posturales, bienestar general), así que es la primera vez que el sistema puede repartir hallazgos entre "Temas obligatorios" y "Temas optativos" con contenido real, no solo con la paridad sintética de los tests. Verificado generando un criterio de prueba con hallazgos en ambas categorías. El ítem 3.9 pide reforzar la capacitación "cada año", pero el numeral 10.3 de la norma dice "cada dos años" — se redactó con el límite real de la norma; queda para que el Dr. Sergio confirme cuál debe prevalecer (sección 4) |
| 2026-10-02 | Se redacta y carga el contenido real del Criterio 4, "Difusión y promoción de la salud" (`supabase/content_criterio4.sql`) | A diferencia de los Criterios 1-3, este criterio no mapea a un solo capítulo de la norma (no existe un "Capítulo de difusión" en la NOM-036-1-STPS-2018): 5 de sus 10 ítems (4.1, 4.2, 4.3, 4.6, 4.10) quedaron sin numeral y marcados optativos, por ser prácticas de gestión sin un requisito puntual que las respalde, en vez de forzar una cita imprecisa. El ítem 4.6 (auditorías) es un caso distinto: sí tiene un numeral exacto (11.1), pero ese numeral dice textualmente que el patrón "tendrá la opción" de contratar una unidad de verificación — es la propia norma la que lo define como voluntario, no una interpretación nuestra. Verificado con un criterio de prueba (5 obligatorios + 5 optativos, reparto correcto) |
| 2026-10-02 | Se redacta y carga el contenido real del Criterio 5, "Medidas de prevención y control" (`supabase/content_criterio5.sql`) — con esto, los 5 criterios del instrumento completo ya tienen contenido real | Es el criterio que mapea más directo a la norma desde el Criterio 1 (Capítulos 7, 8, 9.2 y 10.1); solo 2 de 10 ítems quedaron optativos. El ítem 5.7 (Cuestionario Nórdico de Kuorinka) es un caso nuevo: tiene numeral exacto (9.2), pero ese numeral dice que la detección de síntomas "se podrá" realizar con esa herramienta — la vigilancia a la salud en sí es obligatoria, pero este instrumento específico es una opción entre varias, no la única. Se generó por primera vez un informe con los 5 criterios completos (datos sintéticos, contenido real de la base): el radar deja de ser degenerado (5 ejes), `es_parcial` da `False`, y se ejercitó por primera vez con datos reales la plantilla de cierre "informe completo" que quedó lista desde la retroalimentación piloto pero nunca se había podido probar. Pendiente de aquí en adelante (Etapa 7): extender el formulario público a los 50 ítems (sigue filtrado a Criterio 1), el heatmap de 50 ítems, y la prueba de extremo a extremo contra el caso JASANA completo |

---

## 8. Cómo usar este documento con Claude Code

- Al iniciar una sesión nueva, referenciar este archivo primero.
- Al completar una tarea, marcar el checkbox correspondiente.
- Si una decisión de arquitectura cambia, actualizar la sección 7 antes de continuar.
- No avanzar el contenido de un criterio nuevo sin resolver sus bloqueos en la sección 4.
