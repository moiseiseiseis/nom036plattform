from fastapi import FastAPI

app = FastAPI(title="Servicio de generación de informes NOM-036")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/")
def root() -> dict[str, str]:
    return {"service": "informes-nom036", "status": "ok"}
