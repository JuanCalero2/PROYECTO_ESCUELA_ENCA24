
from fastapi import APIRouter, HTTPException
from db import get_db_connection
from models.profesores import Profesor

router = APIRouter()

# Endpoint para listar profesores
@router.get("/profesores/list")
def listar_profesores():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, nombre, apellido FROM profesores')
    profesores = cur.fetchall()
    cur.close(); conn.close()
    return profesores

@router.get("/profesor/materias")
def obtener_materias_profesor(profesor_id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT m.id, m.nombre 
            FROM estudios m
            JOIN profesores p ON m.profesor_id = p.id
            WHERE p.id = %s
        """, (profesor_id,))
        materias = cur.fetchall()
        if not materias:
            raise HTTPException(status_code=404, detail="No se encontraron materias para el profesor dado")
        return materias
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener las materias: {e}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()


@router.get("/profesores/estudiantes_por_materia")
def obtener_estudiantes_por_materia(materia_id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            select e.id, e.nombre as nombre, m.nombre as materia
            from asignacion a
            inner join estudios m on m.id= a.estudio_id
            inner join estudiantes e on e.id = a.estudiante_id
            where m.id= %s
        """, (materia_id,))
        estudiantes = cur.fetchall()
        if not estudiantes:
            raise HTTPException(status_code=404, detail="No se encontraron estudiantes para la materia dada")
        return estudiantes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener los estudiantes: {e}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

# Ruta para crear un nuevo profesor
@router.post("/profesores_create/", response_model=Profesor)
def create_profesor(profesor: Profesor):
    conn = None
    cur = None
    try:
        # Conexión a la base de datos
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si el correo ya existe en la base de datos
        cur.execute('SELECT id FROM profesores WHERE correo = %s', (profesor.correo,))
        existing_profesor = cur.fetchone()
        if existing_profesor:
            raise HTTPException(status_code=400, detail="El correo ya está registrado")
        
        # Insertar nuevo profesor en la base de datos
        cur.execute('INSERT INTO profesores (nombre, apellido, correo, especialidad, usuario_id) VALUES (%s, %s, %s, %s, %s) RETURNING id, nombre, apellido, correo, especialidad, usuario_id',
                    (profesor.nombre, profesor.apellido, profesor.correo, profesor.especialidad, profesor.usuario_id))
        new_profesor_data = cur.fetchone()
        conn.commit()
        
        if new_profesor_data is None:
            raise HTTPException(status_code=400, detail="Error al crear el profesor")
        
        # Crear objeto Profesor con los datos retornados
        new_profesor = Profesor(
            id=new_profesor_data['id'],
            nombre=new_profesor_data['nombre'],
            apellido=new_profesor_data['apellido'],
            correo=new_profesor_data['correo'],
            especialidad=new_profesor_data['especialidad'],
            usuario_id=new_profesor_data['usuario_id']
        )
        
        return new_profesor
        
    except HTTPException:
        # Relevamos el error específico
        raise 
    except Exception as e:
        # Manejamos cualquier otro error
        raise HTTPException(status_code=500, detail=f"Error al crear el profesor: {e}")
    finally:
        # Cerramos el cursor y la conexión
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()

# Ruta para obtener todos los profesores
@router.get("/profesores_get/")
def get_profesores():
    conn = None
    cur = None
    try:
        # Conexión a la base de datos
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT id, nombre, apellido, correo, especialidad, usuario_id FROM profesores ORDER BY id')
        profesores_data = cur.fetchall()
        
        # Convertir los datos a lista de diccionarios
        profesores = []
        for row in profesores_data:
            profesor_dict = {
                "id": row['id'],
                "nombre": row['nombre'],
                "apellido": row['apellido'],
                "correo": row['correo'],
                "especialidad": row['especialidad'],
                "usuario_id": row['usuario_id']
            }
            profesores.append(profesor_dict)
        
        return profesores
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener los profesores: {e}")
    finally:
        # Cerramos el cursor y la conexión
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()

@router.get("/estadistica")
def get_teacher_count():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('select count(*) from  profesores')
        count = cur.fetchone()
        return {"count": count['count']}
    except Exception as e:
        print(f"Error en get_teacher_count: {type(e)} - {e}")  # Muestra tipo y mensaje real
        raise HTTPException(status_code=500, detail=f"Error al obtener la estadística: {str(e)}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

#ruta para encontrar el id del profesor con el id del usuario
@router.get("/profesor_by_userid/{usuario_id}")
def get_profesor_by_userid(usuario_id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, nombre, apellido, correo, especialidad, usuario_id FROM profesores WHERE usuario_id = %s", (usuario_id,))
        profesor_data = cur.fetchone()

        if profesor_data is None:
            raise HTTPException(status_code=404, detail="Profesor no encontrado")

        profesor = Profesor(
            id=profesor_data['id'],
            nombre=profesor_data['nombre'],
            apellido=profesor_data['apellido'],
            correo=profesor_data['correo'],
            especialidad=profesor_data['especialidad'],
            usuario_id=profesor_data['usuario_id']
        )
        return profesor

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener el profesor: {str(e)}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

@router.get("/getiduser")
def get_user_id_by_correo(correo: str):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("select id FROM usuarios WHERE correo = %s", (correo,))
        usuario_data = cur.fetchone()

        if usuario_data is None:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        cur.execute("UPDATE profesores SET usuario_id = %s WHERE correo = %s", (usuario_data['id'], correo))
        conn.commit()
        return {"id": usuario_data['id']}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener el ID del usuario: {str(e)}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

# Ruta para actualizar la información de un profesor por su ID
@router.put("/profesores_update/{id}", response_model=Profesor)
def update_profesor(id: int, profesor: Profesor):
    conn = None
    cur = None
    try:
        # Conexión a la base de datos
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si el profesor existe
        cur.execute('SELECT id FROM profesores WHERE id = %s', (id,))
        existing = cur.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Profesor no encontrado")
        
        # Verificar si el correo ya existe en otro profesor
        cur.execute('SELECT id FROM profesores WHERE correo = %s AND id != %s', (profesor.correo, id))
        duplicate = cur.fetchone()
        if duplicate:
            raise HTTPException(status_code=400, detail="Ya existe otro profesor con este correo")
        
        # Actualizar el profesor
        cur.execute('UPDATE profesores SET nombre = %s, apellido = %s, correo = %s, especialidad = %s, usuario_id = %s WHERE id = %s RETURNING id, nombre, apellido, correo, especialidad, usuario_id',
                    (profesor.nombre, profesor.apellido, profesor.correo, profesor.especialidad, profesor.usuario_id, id))
        updated_profesor_data = cur.fetchone()
        conn.commit()

        if updated_profesor_data is None:
            raise HTTPException(status_code=404, detail="Profesor no encontrado")
        
        updated_profesor = Profesor(
            id=updated_profesor_data['id'],
            nombre=updated_profesor_data['nombre'],
            apellido=updated_profesor_data['apellido'],
            correo=updated_profesor_data['correo'],
            especialidad=updated_profesor_data['especialidad'],
            usuario_id=updated_profesor_data['usuario_id']
        )
        
        return updated_profesor
            
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar el profesor: {e}")
    finally:
        # Cerramos el cursor y la conexión
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()

# Ruta para eliminar un profesor por su ID
@router.delete("/profesores_delete/{id}")
def delete_profesor(id: int):
    conn = None
    cur = None
    try:
        # Conexión a la base de datos
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM profesores WHERE id = %s RETURNING *', (id,))
        deleted_profesor = cur.fetchone()
        conn.commit()

        if deleted_profesor is None:
            raise HTTPException(status_code=404, detail="Profesor no encontrado")
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar el profesor: {e}")
    finally:
        # Cerramos el cursor y la conexión
        if cur is not None:
            cur.close()
        if conn is not None:
            conn.close()

    return {"message": "Profesor eliminado"}
