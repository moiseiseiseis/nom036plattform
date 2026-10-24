from dataclasses import dataclass, field


@dataclass(frozen=True)
class RespuestaItem:
    item_id: str
    numero: int
    nivel: int
    es_obligatorio: bool

    def __post_init__(self) -> None:
        if not 0 <= self.nivel <= 4:
            raise ValueError(f"nivel fuera de rango (0-4): {self.nivel}")


@dataclass(frozen=True)
class Hallazgo:
    item_id: str
    numero: int
    nivel: int
    es_obligatorio: bool
    texto_recomendacion: str


@dataclass(frozen=True)
class SegmentoNarrativa:
    """Una frase del párrafo narrativo de un criterio. `origen` distingue el
    texto fijo por franja ("plantilla": apertura e implicación) del texto que
    depende de la respuesta a un ítem ("observacion": la descripción del
    nivel respondido) — el generador los resalta distinto en modo revisión."""

    texto: str
    origen: str


@dataclass(frozen=True)
class ResultadoCriterio:
    criterio_id: str
    numero: int
    nombre: str
    puntaje: int
    puntaje_maximo: int
    porcentaje: float
    bucket: str
    narrativa: str
    plantilla_apertura: str
    hallazgos: list[Hallazgo] = field(default_factory=list)
    segmentos: list[SegmentoNarrativa] = field(default_factory=list)


@dataclass(frozen=True)
class ResultadoGlobal:
    puntaje: int
    puntaje_maximo: int
    porcentaje: float
    bucket: str
    es_parcial: bool
    cierre: str
    temas_obligatorios: list[str] = field(default_factory=list)
    temas_optativos: list[str] = field(default_factory=list)
