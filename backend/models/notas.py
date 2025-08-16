from pydantic import BaseModel

class Nota(BaseModel):
    estudiante_id: int
    materia_id: int
    nota: float
    profesor_id: int
    fecha_actualizacion: str