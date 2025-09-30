from pydantic import BaseModel, validator
from datetime import date


#asignacion

class Asignacion(BaseModel):
    estudiante_id: int
    estudio_id: int
    fecha_inscripcion: str

class AsignacionCreate(BaseModel):
    estudio_id: int
    fecha_inscripcion: date
    estudiantes: list[int]  # Lista de IDs de estudiantes

