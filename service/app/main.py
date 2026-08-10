from fastapi import FastAPI

from app.routers import informes

app = FastAPI(title="Servicio de generación de informes NOM-036")
app.include_router(informes.router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "informes-nom036", "status": "ok"}
