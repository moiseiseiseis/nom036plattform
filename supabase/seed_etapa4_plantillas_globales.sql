-- Plantillas de cierre global (criterio_id NULL), necesarias para que el
-- motor de cálculo (Etapa 2) pueda ensamblar el cierre del informe completo
-- (Etapa 4). Igual que las plantillas de Criterio 1 del seed de la Etapa 1,
-- es contenido DUMMY marcado con "[PLACEHOLDER]", bloqueado por la
-- validación del Dr. Sergio (CLAUDE.md sección 4).

insert into nom036.plantilla_bucket (criterio_id, bucket, tipo, texto)
select null, v.bucket, v.tipo,
    '[PLACEHOLDER] Plantilla de ' || v.tipo || ' global para bucket ' || v.bucket || ' — pendiente de contenido validado por el Dr. Sergio.'
from (values
    ('inexistente', 'apertura'), ('inexistente', 'cierre'),
    ('minimo', 'apertura'), ('minimo', 'cierre'),
    ('regular', 'apertura'), ('regular', 'cierre'),
    ('aceptable', 'apertura'), ('aceptable', 'cierre'),
    ('optimo', 'apertura'), ('optimo', 'cierre')
) as v(bucket, tipo);
