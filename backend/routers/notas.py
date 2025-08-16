from fastapi import APIRouter, HTTPException
from db import get_db_connection
from pydantic import BaseModel
from datetime import datetime
from models.notas import Nota

router = APIRouter()

# Modelo Pydantic
class Nota(BaseModel):
    estudiante_id: int
    materia_id: int
    nota: float
    profesor_id: int


# Crear una nueva nota
@router.post("/notas_create/")
def create_nota(nota: Nota):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO notas (estudiante_id, materia_id, nota, profesor_id, fecha_actualizacion)
            VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP) RETURNING *;
        """, (nota.estudiante_id, nota.materia_id, nota.nota, nota.profesor_id))
        new_nota = cur.fetchone()
        conn.commit()
        if new_nota is None:
            raise HTTPException(status_code=400, detail="Error al crear la nota")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al crear la nota: {e}")
    finally:
        cur.close()
        conn.close()
    return new_nota


# Obtener todas las notas
@router.get("/notas_get/")
def get_notas():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM notas")
        notas = cur.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener las notas: {e}")
    finally:
        cur.close()
        conn.close()
    return notas


# Actualizar una nota por ID
@router.put("/notas_update/{id}")
def update_nota(id: int, nota: Nota):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            UPDATE notas 
            SET estudiante_id = %s, materia_id = %s, nota = %s, profesor_id = %s, fecha_actualizacion = CURRENT_TIMESTAMP
            WHERE id = %s RETURNING *;
        """, (nota.estudiante_id, nota.materia_id, nota.nota, nota.profesor_id, id))
        updated_nota = cur.fetchone()
        conn.commit()
        if updated_nota is None:
            raise HTTPException(status_code=404, detail="Nota no encontrada")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar la nota: {e}")
    finally:
        cur.close()
        conn.close()
    return updated_nota


# Eliminar una nota por ID
@router.delete("/notas_delete/{id}")
def delete_nota(id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM notas WHERE id = %s RETURNING *;", (id,))
        deleted_nota = cur.fetchone()
        conn.commit()
        if deleted_nota is None:
            raise HTTPException(status_code=404, detail="Nota no encontrada")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al eliminar la nota: {e}")
    finally:
        cur.close()
        conn.close()
    return {"message": "Nota eliminada"}
