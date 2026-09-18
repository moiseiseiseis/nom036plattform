-- Da de alta los 4 criterios restantes en el catálogo `nom036.criterio`
-- (solo id/numero/nombre/orden — sin ítems ni contenido todavía, eso sigue
-- bloqueado por el Dr. Sergio, CLAUDE.md sección 4). Los nombres ya están
-- confirmados por el informe JASANA real desde la Etapa 1; lo único
-- pendiente son los ítems 2-5.
--
-- Motivo: `service/app/reportes/repository.py` calcula `total_criterios`
-- como `count(*)` de esta tabla para poder detectar evaluaciones parciales
-- (ver `engine/narrativa.py::construir_cierre_parcial`, retroalimentación de
-- la validación piloto, hallazgo 1). Con un único criterio en el catálogo,
-- toda evaluación de hoy calculaba `total_criterios = 1`, y como esa misma
-- evaluación siempre respondió ese único criterio, `es_parcial` nunca daba
-- `true` — el hallazgo 1 quedaba sin efecto en la base de datos real, aunque
-- sí pasaba en las pruebas (que fijan `total_criterios=5` a mano). Este
-- script corrige eso sin tocar ningún ítem ni criterio_id existente: al
-- pedir el resumen de una evaluación, el repositorio sigue sin encontrar
-- respuestas para los Criterios 2-5 (no tienen ítems) y los omite del
-- cálculo igual que antes — solo cambia el conteo total.
--
-- El formulario público (`web/src/lib/nom036/evaluaciones.ts`) filtra
-- explícitamente `where c.numero = 1`, así que sigue mostrando solo el
-- Criterio 1 sin cambios.

insert into nom036.criterio (normativa_id, numero, nombre, orden)
select n.id, v.numero, v.nombre, v.numero
from nom036.normativa n,
     (values
        (2, 'Uso de equipos auxiliares y condiciones ambientales'),
        (3, 'Capacitación, adiestramiento y vigilancia a la salud'),
        (4, 'Difusión, registro y políticas en materia de Ergonomía'),
        (5, 'Medidas de prevención y control')
     ) as v(numero, nombre)
where n.nombre = 'NOM-036-1-STPS-2018'
  and not exists (
    select 1 from nom036.criterio c where c.numero = v.numero
  );
