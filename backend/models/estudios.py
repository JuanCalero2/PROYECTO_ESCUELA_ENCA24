from pydantic import BaseModel, validator
#estudios

class Estudios(BaseModel):
    nombre: str
    descripcion: str
    profesor_id: int