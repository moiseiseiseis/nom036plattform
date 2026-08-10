-- Evaluación de prueba en estado "pendiente", para poder ejercitar el
-- formulario público /evaluar/[token] de punta a punta (Etapa 3). A
-- diferencia del seed de la Etapa 1 (que ya viene "completado" para validar
-- el motor de cálculo), esta empresa solo tiene el nombre cargado —como lo
-- dejaría el equipo del Dr. al generar el enlace— y el resto de los datos
-- generales los llena el formulario público.

insert into nom036.empresa (nombre)
values ('Empresa Demo Etapa 3');

insert into nom036.evaluacion (empresa_id, token_publico, estado)
select id, 'demo-pendiente-etapa3', 'pendiente'
from nom036.empresa
where nombre = 'Empresa Demo Etapa 3';
