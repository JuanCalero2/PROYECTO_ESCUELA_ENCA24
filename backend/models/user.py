from pydantic import BaseModel
from typing import Optional

class User(BaseModel):
    id: Optional[int] = None
    nombre: str
    apellido: str
    correo: str

class UserUpdate(BaseModel):
    nombre: str
    apellido: str
    correo: str

class UserProfile(BaseModel):
    id: int
    nombre: str
    apellido: str
    correo: str
    rol_id: int
    rol: str
    especialidad: Optional[str] = None
    edad: Optional[int] = None
    direccion: Optional[str] = None
    estudiante_id: Optional[int] = None
    profesor_id: Optional[int] = None
