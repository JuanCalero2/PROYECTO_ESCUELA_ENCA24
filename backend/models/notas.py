from pydantic import BaseModel
from typing import Optional
from datetime import date

class Nota(BaseModel):
    id: Optional[int] = None
    estudiante_id: int
    estudio_id: int
    nota: float
    fecha: date
    descripcion: Optional[str] = None
    profesor_id: Optional[int] = None