from datetime import date
from typing import Optional
from pydantic import BaseModel


class Nota(BaseModel):
    estudiante_id: int
    materia_id: int
    nota1: float
    nota2: float
    nota3: float
    notafinal: Optional[float] = None
    fecha_registro: Optional[date] = None