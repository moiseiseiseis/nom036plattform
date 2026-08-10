-- Esquema dedicado y aislado para el proyecto NOM-036, dentro de un proyecto Supabase
-- compartido con otros proyectos del usuario. No toca el esquema "public" ni ningún
-- otro objeto existente, para poder migrarse limpiamente a un proyecto propio después
-- (ver CLAUDE.md, sección 7, registro de decisiones).

create schema if not exists nom036;

create table nom036.normativa (
    id uuid primary key default gen_random_uuid(),
    nombre text not null,
    version text not null
);

create table nom036.criterio (
    id uuid primary key default gen_random_uuid(),
    normativa_id uuid not null references nom036.normativa (id) on delete cascade,
    numero int not null,
    nombre text not null,
    orden int not null,
    unique (normativa_id, numero)
);

create table nom036.item (
    id uuid primary key default gen_random_uuid(),
    criterio_id uuid not null references nom036.criterio (id) on delete cascade,
    numero int not null,
    texto_pregunta text not null,
    numeral_nom text,
    es_obligatorio boolean not null default true,
    unique (criterio_id, numero)
);

create table nom036.recomendacion (
    id uuid primary key default gen_random_uuid(),
    item_id uuid not null references nom036.item (id) on delete cascade,
    nivel int not null check (nivel between 0 and 4),
    texto text not null,
    unique (item_id, nivel)
);

create table nom036.plantilla_bucket (
    id uuid primary key default gen_random_uuid(),
    criterio_id uuid references nom036.criterio (id) on delete cascade,
    bucket text not null check (bucket in ('inexistente', 'minimo', 'regular', 'aceptable', 'optimo')),
    tipo text not null check (tipo in ('apertura', 'cierre')),
    texto text not null
);

create table nom036.empresa (
    id uuid primary key default gen_random_uuid(),
    nombre text not null,
    ubicacion text,
    giro text,
    num_trabajadores int,
    turnos text,
    descripcion_mmh text
);

create table nom036.evaluacion (
    id uuid primary key default gen_random_uuid(),
    empresa_id uuid not null references nom036.empresa (id) on delete cascade,
    token_publico text not null unique,
    estado text not null default 'pendiente' check (estado in ('pendiente', 'completado', 'revisado')),
    fecha timestamptz not null default now()
);

create table nom036.respuesta (
    id uuid primary key default gen_random_uuid(),
    evaluacion_id uuid not null references nom036.evaluacion (id) on delete cascade,
    item_id uuid not null references nom036.item (id) on delete cascade,
    nivel_seleccionado int not null check (nivel_seleccionado between 0 and 4),
    unique (evaluacion_id, item_id)
);

-- RLS habilitado sin policies: nada es accesible salvo con la service role key,
-- usada únicamente server-side. Es el default seguro si este esquema llegara a
-- exponerse por error vía la Data API en el futuro.
alter table nom036.normativa enable row level security;
alter table nom036.criterio enable row level security;
alter table nom036.item enable row level security;
alter table nom036.recomendacion enable row level security;
alter table nom036.plantilla_bucket enable row level security;
alter table nom036.empresa enable row level security;
alter table nom036.evaluacion enable row level security;
alter table nom036.respuesta enable row level security;
