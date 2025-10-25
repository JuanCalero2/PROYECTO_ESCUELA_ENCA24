# routers/estudio.py
from fastapi import APIRouter, HTTPException
from db import get_db_connection
from models.estudios import Estudios

router = APIRouter()

# Ruta para crear un nuevo estudio
@router.post("/")
def create_estudio(estudio: Estudios):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO estudios (nombre, descripcion, profesor_id) VALUES (%s, %s, %s) RETURNING *',
                    (estudio.nombre, estudio.descripcion, estudio.profesor_id))
        new_estudio = cur.fetchone()
        conn.commit()
        if new_estudio is None:
            raise HTTPException(status_code=400, detail="Error al crear el estudio")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear el estudio: {e}")
    finally:
        cur.close()
        conn.close()
    return new_estudio

# Ruta para obtener todos los estudios
@router.get("/")
def get_estudios():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM estudios')
        estudios = cur.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener los estudios: {e}")
    finally:
        cur.close()
        conn.close()
    return estudios

# Ruta para actualizar la información de un estudio por su ID
@router.put("/{id}")
def update_estudio(id: int, estudio: Estudios):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('UPDATE estudios SET nombre = %s, descripcion = %s, profesor_id = %s WHERE id = %s RETURNING *',
                    (estudio.nombre, estudio.descripcion, estudio.profesor_id, id))
        updated_estudio = cur.fetchone()
        conn.commit()
        if updated_estudio is None:
            raise HTTPException(status_code=404, detail="Estudio no encontrado")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar el estudio: {e}")
    finally:
        cur.close()
        conn.close()
    return updated_estudio

# Ruta para eliminar un estudio por su ID
@router.delete("/{id}")
def delete_estudio(id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('DELETE FROM estudios WHERE id = %s RETURNING *', (id,))
        deleted_estudio = cur.fetchone()
        conn.commit()
        if deleted_estudio is None:
            raise HTTPException(status_code=404, detail="Estudio no encontrado")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar el estudio: {e}")
    finally:
        cur.close()
        conn.close()
    return {"message": "Estudio eliminado"}
