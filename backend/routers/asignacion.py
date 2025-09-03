# Importaciones necesarias para FastAPI y manejo de base de datos
from fastapi import APIRouter, HTTPException, Request
from db import get_db_connection
from jose import jwt, JWTError
from config import Config  # Importar la clase Config

# Crear router para las rutas de asignación
router = APIRouter(tags=["asignaciones"])

# Usar las configuraciones de la clase Config
SECRET_KEY = Config.SECRET_KEY
ALGORITHM = Config.ALGORITHM

def decode_token(request: Request):
    """
    Función para decodificar el token JWT y extraer información del usuario
    @param request: Objeto Request de FastAPI
    @return: Diccionario con información del usuario (correo, rol, rol_id)
    @raises HTTPException: Si el token es inválido o no se puede decodificar
    """
    # Obtener el token del header Authorization
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token de acceso requerido")
    
    # Extraer el token (remover "Bearer ")
    token = auth_header.split(" ")[1]
    
    try:
        # Decodificar el token JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        correo = payload.get("sub")
        rol = payload.get("rol")
        rol_id = payload.get("rol_id")
        
        if correo is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        
        return {"correo": correo, "rol": rol, "rol_id": rol_id}
        
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

@router.get("/estudiante")
def get_asignacion_estudiante(request: Request):
    """
    Endpoint para obtener las asignaciones de un estudiante
    Solo accesible para usuarios con rol de Estudiante
    
    @param request: Objeto Request de FastAPI
    @return: Diccionario con información del estudiante y sus asignaciones
    @raises HTTPException: Si el usuario no es estudiante o no se encuentra
    """
    # Decodificar token y verificar que sea un estudiante
    user_data = decode_token(request)
    correo = user_data["correo"]
    rol_id = user_data["rol_id"]
    
    # Verificar que el usuario sea un estudiante
    if rol_id != 2:
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo para estudiantes.")
    
    # Conectar a la base de datos
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Buscar el estudiante por su correo
        cur.execute("""
            SELECT e.id, e.nombre, e.apellido
            FROM estudiantes e
            JOIN usuarios u ON e.usuario_id = u.id
            WHERE u.correo = %s
        """, (correo,))
        estudiante = cur.fetchone()
        
        # Verificar que el estudiante existe
        if not estudiante:
            raise HTTPException(status_code=404, detail="Estudiante no encontrado")
        
        # Obtener todas las asignaciones del estudiante con información detallada
        cur.execute("""
            SELECT
                a.id, a.fecha_inscripcion,
                es.nombre AS materia_nombre, es.descripcion AS materia_descripcion,
                p.nombre AS profesor_nombre, p.apellido AS profesor_apellido,
                p.correo AS profesor_correo, p.especialidad AS profesor_especialidad
            FROM asignacion a
            JOIN estudios es ON a.estudio_id = es.id
            JOIN profesores p ON es.profesor_id = p.id
            WHERE a.estudiante_id = %s
            ORDER BY es.nombre
        """, (estudiante["id"],))
        asignaciones = cur.fetchall()
        
        # Formatear la respuesta
        return {
            "estudiante": {
                "id": estudiante["id"], 
                "nombre": estudiante["nombre"], 
                "apellido": estudiante["apellido"]
            },
            "asignaciones": [
                {
                    "id": a["id"], 
                    "fecha_inscripcion": str(a["fecha_inscripcion"]),
                    "materia": {
                        "nombre": a["materia_nombre"], 
                        "descripcion": a["materia_descripcion"]
                    },
                    "profesor": {
                        "nombre": a["profesor_nombre"], 
                        "apellido": a["profesor_apellido"], 
                        "correo": a["profesor_correo"], 
                        "especialidad": a["profesor_especialidad"]
                    }
                }
                for a in asignaciones
            ]
        }
        
    finally:
        # Cerrar conexiones de base de datos
        cur.close()
        conn.close()

@router.get("/profesor")
def get_asignacion_profesor(request: Request):
    """
    Endpoint para obtener las materias y estudiantes de un profesor
    Solo accesible para usuarios con rol de Profesor
    
    @param request: Objeto Request de FastAPI
    @return: Diccionario con información del profesor y sus materias/estudiantes
    @raises HTTPException: Si el usuario no es profesor o no se encuentra
    """
    # Decodificar token y verificar que sea un profesor
    user_data = decode_token(request)
    correo = user_data["correo"]
    rol_id = user_data["rol_id"]
    
    # Verificar que el usuario sea un profesor
    if rol_id != 1:
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo para profesores.")
    
    # Conectar a la base de datos
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Buscar el profesor por su correo
        cur.execute("""
            SELECT p.id, p.nombre, p.apellido, p.especialidad
            FROM profesores p
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE u.correo = %s
        """, (correo,))
        profesor = cur.fetchone()
        
        # Verificar que el profesor existe
        if not profesor:
            raise HTTPException(status_code=404, detail="Profesor no encontrado")
        
        # Obtener todas las materias del profesor y sus estudiantes
        cur.execute("""
            SELECT
                es.id AS materia_id, es.nombre AS materia_nombre, es.descripcion AS materia_descripcion,
                a.fecha_inscripcion,
                e.id AS estudiante_id, e.nombre AS estudiante_nombre, e.apellido AS estudiante_apellido,
                e.correo AS estudiante_correo, e.edad AS estudiante_edad
            FROM estudios es
            LEFT JOIN asignacion a ON es.id = a.estudio_id
            LEFT JOIN estudiantes e ON a.estudiante_id = e.id
            WHERE es.profesor_id = %s
            ORDER BY es.nombre, e.nombre
        """, (profesor["id"],))
        materias_estudiantes = cur.fetchall()
        
        # Organizar los datos por materia
        materias = {}
        for row in materias_estudiantes:
            materia_id = row["materia_id"]
            
            # Si la materia no existe en el diccionario, crearla
            if materia_id not in materias:
                materias[materia_id] = {
                    "id": materia_id,
                    "nombre": row["materia_nombre"],
                    "descripcion": row["materia_descripcion"],
                    "estudiantes": []
                }
            
            # Agregar estudiante si existe (puede ser None si no hay estudiantes)
            if row["estudiante_id"]:
                materias[materia_id]["estudiantes"].append({
                    "id": row["estudiante_id"],
                    "nombre": row["estudiante_nombre"],
                    "apellido": row["estudiante_apellido"],
                    "correo": row["estudiante_correo"],
                    "edad": row["estudiante_edad"],
                    "fecha_inscripcion": str(row["fecha_inscripcion"])
                })
        
        # Formatear la respuesta
        return {
            "profesor": {
                "id": profesor["id"], 
                "nombre": profesor["nombre"], 
                "apellido": profesor["apellido"], 
                "especialidad": profesor["especialidad"]
            },
            "materias": list(materias.values())
        }
        
    finally:
        # Cerrar conexiones de base de datos
        cur.close()
        conn.close()

@router.get("/all")
def get_asignaciones(request: Request):
    """
    Endpoint para obtener todas las asignaciones (solo para administradores)
    Muestra todas las asignaciones con información detallada de estudiantes, materias y profesores
    
    @param request: Objeto Request de FastAPI
    @return: Lista de todas las asignaciones con información completa
    @raises HTTPException: Si el usuario no es administrador
    """
    # Decodificar token y verificar que sea un administrador
    user_data = decode_token(request)
    rol_id = user_data["rol_id"]
    
    # Verificar que el usuario sea un administrador
    if rol_id != 3:
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo para administradores.")
    
    # Conectar a la base de datos
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        # Obtener todas las asignaciones con información completa
        cur.execute("""
            SELECT
                a.id, a.fecha_inscripcion,
                e.nombre AS estudiante_nombre, e.apellido AS estudiante_apellido,
                e.correo AS estudiante_correo, e.edad AS estudiante_edad,
                es.nombre AS materia_nombre, es.descripcion AS materia_descripcion,
                p.nombre AS profesor_nombre, p.apellido AS profesor_apellido,
                p.correo AS profesor_correo, p.especialidad AS profesor_especialidad
            FROM asignacion a
            JOIN estudiantes e ON a.estudiante_id = e.id
            JOIN estudios es ON a.estudio_id = es.id
            JOIN profesores p ON es.profesor_id = p.id
            ORDER BY e.nombre, es.nombre
        """)
        asignaciones = cur.fetchall()
        
        # Formatear la respuesta
        return [
            {
                "id": a["id"],
                "fecha_inscripcion": str(a["fecha_inscripcion"]),
                "estudiante": {
                    "nombre": a["estudiante_nombre"],
                    "apellido": a["estudiante_apellido"],
                    "correo": a["estudiante_correo"],
                    "edad": a["estudiante_edad"]
                },
                "materia": {
                    "nombre": a["materia_nombre"],
                    "descripcion": a["materia_descripcion"]
                },
                "profesor": {
                    "nombre": a["profesor_nombre"],
                    "apellido": a["profesor_apellido"],
                    "correo": a["profesor_correo"],
                    "especialidad": a["profesor_especialidad"]
                }
            }
            for a in asignaciones
        ]
        
    finally:
        # Cerrar conexiones de base de datos
        cur.close()
        conn.close()

# Endpoints adicionales para CRUD de asignaciones (solo para administradores)
@router.post("/create")
def create_asignacion(request: Request, estudiante_id: int, estudio_id: int):
    """
    Endpoint para crear una nueva asignación (solo para administradores)
    
    @param request: Objeto Request de FastAPI
    @param estudiante_id: ID del estudiante
    @param estudio_id: ID de la materia/estudio
    @return: Mensaje de confirmación
    @raises HTTPException: Si el usuario no es administrador o hay errores
    """
    # Verificar que sea administrador
    user_data = decode_token(request)
    if user_data["rol_id"] != 3:
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo para administradores.")
    
    # Lógica para crear asignación...
    return {"message": "Asignación creada exitosamente"}

@router.put("/update/{id}")
def update_asignacion(request: Request, id: int):
    """
    Endpoint para actualizar una asignación (solo para administradores)
    
    @param request: Objeto Request de FastAPI
    @param id: ID de la asignación a actualizar
    @return: Mensaje de confirmación
    @raises HTTPException: Si el usuario no es administrador
    """
    # Verificar que sea administrador
    user_data = decode_token(request)
    if user_data["rol_id"] != 3:
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo para administradores.")
    
    # Lógica para actualizar asignación...
    return {"message": "Asignación actualizada exitosamente"}

@router.delete("/delete/{id}")
def delete_asignacion(request: Request, id: int):
    """
    Endpoint para eliminar una asignación (solo para administradores)
    
    @param request: Objeto Request de FastAPI
    @param id: ID de la asignación a eliminar
    @return: Mensaje de confirmación
    @raises HTTPException: Si el usuario no es administrador
    """
    # Verificar que sea administrador
    user_data = decode_token(request)
    if user_data["rol_id"] != 3:
        raise HTTPException(status_code=403, detail="Acceso denegado. Solo para administradores.")
    
    # Lógica para eliminar asignación...
    return {"message": "Asignación eliminada exitosamente"}
