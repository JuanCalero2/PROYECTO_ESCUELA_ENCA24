from pydantic import BaseModel, validator
from typing import Optional

# Modelo para el Profesor
class Profesor(BaseModel):
    id: Optional[int] = None
    nombre: str
    apellido: str
    correo: str
    especialidad: str
    usuario_id: Optional[int] = None

    # Validador para el campo correo
    @validator('correo')
    def validar_correo(cls, v):
        # Verificar si el correo contiene "@" y un dominio
        if "@" not in v or "." not in v:
            raise ValueError('El correo debe ser válido')
        return v