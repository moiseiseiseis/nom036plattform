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


@dataclass(frozen=True)
class ResultadoGlobal:
    puntaje: int
    puntaje_maximo: int
    porcentaje: float
    bucket: str
    cierre: str
    temas_obligatorios: list[str] = field(default_factory=list)
    temas_optativos: list[str] = field(default_factory=list)
