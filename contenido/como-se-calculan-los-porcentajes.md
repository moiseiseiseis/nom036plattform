# Cómo se calculan los porcentajes de cumplimiento

**Propósito:** desglosar, número por número, cómo se llega del nivel de respuesta de un ítem
(0-4) hasta el porcentaje de cumplimiento de un criterio y el porcentaje global de la empresa —
para que el Dr. Sergio pueda revisar y confirmar cada corte con casos concretos, no solo con la
fórmula en abstracto.

**Estado:** hipótesis de trabajo, validada contra los 5 puntajes reales de un informe ya
elaborado para una empresa real del sector textil (caso de referencia). Pendiente de
confirmación del Dr. Sergio en los puntos marcados al final de este documento.

---

## 1. El recorrido completo, de un vistazo

```
Ítem (0-4)  →  suma de 10 ítems = puntaje de criterio (0-40)
            →  puntaje de criterio / 40 = % de criterio
            →  % de criterio → franja de severidad del criterio

suma de puntajes de los 5 criterios / 200 = % global
% global → franja de severidad global
```

Ningún porcentaje se calcula promediando otros porcentajes. Siempre se calcula dividiendo una
suma de puntos entre una suma de puntos máximos posibles — esto importa para el % global (ver
sección 4).

---

## 2. Nivel ítem: la unidad mínima

Cada ítem se responde en una escala de 0 a 4:

| Nivel | Etiqueta | Puntos |
|---|---|---|
| 0 | Nada | 0 |
| 1 | Mínimo | 1 |
| 2 | Regular | 2 |
| 3 | Aceptable | 3 |
| 4 | Óptimo | 4 |

Todos los ítems valen lo mismo (no hay ítems "más importantes" que pesen más en la suma). El
puntaje máximo de un ítem es 4.

---

## 3. Nivel criterio: de 10 respuestas a un porcentaje y una franja

Cada criterio tiene 10 ítems, así que su puntaje va de 0 a 40 (10 × 4).

**Fórmula:**

```
% del criterio = (suma de los niveles de sus 10 ítems / 40) × 100
```

**Ejemplo real** (Criterio 1 del caso de referencia, ítems con niveles
2, 1, 2, 2, 2, 1, 2, 2, 1, 2):

```
suma = 2+1+2+2+2+1+2+2+1+2 = 17
% = 17 / 40 × 100 = 42.5%
```

Ese porcentaje se ubica luego en una de cinco franjas de 20 puntos porcentuales cada una:

| Franja | Rango | 42.5% cae en... |
|---|---|---|
| Inexistente | 0% – 19.9% | |
| **Mínimo** | 20% – 39.9% | |
| **Regular** | **40% – 59.9%** | ✅ 42.5% |
| Aceptable | 60% – 79.9% | |
| Óptimo | 80% – 100% | |

El límite inferior de cada franja está incluido y el superior no (ej. si el porcentaje fuera
exactamente 40%, ya cuenta como "Regular", no como "Mínimo"). **Este tratamiento del valor
límite exacto es una convención técnica adoptada por el desarrollador, no un dato confirmado
por el Dr. Sergio** — ver sección 6.

---

## 4. Nivel global: de 5 criterios a un porcentaje y una franja de empresa

Con los 5 criterios cargados, el puntaje máximo global es 200 (5 × 40).

**Fórmula — importante:** el % global **no es el promedio de los 5 porcentajes de criterio**.
Es la suma de los puntajes obtenidos entre la suma de los puntajes máximos:

```
% global = (suma de los puntajes de los 5 criterios / 200) × 100
```

En la práctica, cuando los 5 criterios tienen el mismo número de ítems (10 cada uno, como en
este instrumento), el resultado es matemáticamente idéntico al promedio simple de los 5
porcentajes. La razón para calcularlo como suma-sobre-suma y no como promedio es que así el
cálculo sigue siendo correcto sin cambios si en el futuro algún criterio tuviera un número
distinto de ítems.

**Ejemplo real** (los 5 criterios del caso de referencia, con puntajes 17, 28, 9, 9 y 10 sobre
40 cada uno):

```
suma de puntajes = 17 + 28 + 9 + 9 + 10 = 73
suma de máximos  = 40 + 40 + 40 + 40 + 40 = 200
% global = 73 / 200 × 100 = 36.5%  →  franja "Mínimo"
```

---

## 5. Tabla resumen de las 5 franjas de severidad

Aplica exactamente igual a nivel criterio y a nivel global — es la misma escala de 20 puntos:

| Franja | Rango (límite inferior incluido) |
|---|---|
| Inexistente | 0% a menos de 20% |
| Mínimo | 20% a menos de 40% |
| Regular | 40% a menos de 60% |
| Aceptable | 60% a menos de 80% |
| Óptimo | 80% a 100% |

---

## 6. Qué es un "hallazgo" y por qué no es lo mismo que el porcentaje

El porcentaje y la franja de severidad describen el criterio **en conjunto**. Por separado, el
sistema decide qué ítems puntuales se mencionan por su nombre en el párrafo del criterio y en
las listas de "temas obligatorios/optativos" del cierre del informe: eso se llama un
**hallazgo**, y se define como cualquier ítem cuya respuesta fue de nivel 0 o 1.

Esto significa que dos criterios con el mismo porcentaje pueden mencionar un número distinto de
hallazgos si sus 10 respuestas se distribuyen de forma diferente. Por ejemplo, un criterio con
niveles [4,4,4,4,4,0,0,0,0,0] suma 20/40 (50%, "Regular") con 5 hallazgos, mientras que uno con
niveles [2,2,2,2,2,2,2,2,2,2] también suma 20/40 (50%, "Regular") pero con 0 hallazgos.

---

## 7. Puntos pendientes de confirmar con el Dr. Sergio

- **El corte exacto en el límite de cada franja.** Se adoptó la convención "límite inferior
  incluido" (20% ya es "Mínimo", no "Inexistente") por ser la más común en este tipo de escalas,
  pero no está confirmada explícitamente. Con los 5 datos de referencia disponibles no hay
  ningún caso que caiga justo en un límite exacto, así que esta convención nunca se ha puesto a
  prueba contra un caso real.
- **El umbral de 0-1 para considerar un ítem "hallazgo".** Es una hipótesis de trabajo; no se ha
  podido contrastar contra las respuestas individuales (ítem por ítem, no solo el puntaje
  agregado) del caso de referencia, porque esas respuestas individuales no están disponibles.
- **Si debiera existir alguna ponderación entre ítems o criterios.** Este documento asume que
  todos los ítems y los 5 criterios pesan lo mismo. Si el criterio experto del Dr. Sergio indica
  que algún ítem o criterio debería pesar más que otro en el cálculo, el modelo actual necesita
  ajustarse antes de escalar a los 5 criterios completos.
