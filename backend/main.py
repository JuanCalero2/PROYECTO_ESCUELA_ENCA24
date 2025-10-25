import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers.login import router as login_router 
from routers.rol_usero import router as rol_user
from routers.user import router as user_router  
from routers import asignacion, estudiante, estudios, profesores, notas 
from db import get_db_connection

# Crear la aplicación FastAPI
app = FastAPI(
    title="API Escuela",
    description="API para gestión escolar",
    version="1.0.0"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar los routers
app.include_router(estudiante.router, prefix="/estudiantes", tags=["Estudiantes"])
app.include_router(profesores.router, prefix="/profesores", tags=["Profesores"])
app.include_router(estudios.router, prefix="/estudios", tags=["Estudios"])
app.include_router(asignacion.router, tags=["Asignaciones"])
app.include_router(login_router, prefix="/login", tags=["Autenticación"])
app.include_router(rol_user, prefix="/usuarios", tags=["Usuarios"])  
app.include_router(user_router, prefix="/auth", tags=["Auth"])
app.include_router(notas.router, prefix="/notas", tags=["Notas"])

@app.get("/")
def read_root():
    return {"message": "Bienvenido a la API de la Escuela", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {"status": "OK", "message": "La API está funcionando correctamente"}
