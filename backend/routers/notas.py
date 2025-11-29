from fastapi import APIRouter, HTTPException
from db import get_db_connection
from pydantic import BaseModel
from datetime import datetime
from models.notas import Nota

router = APIRouter()

# Crear una nueva nota
@router.post("/notas_create/")
def create_nota(nota: Nota):
    try:
        # Asegurar que las notas sean números (pueden venir como strings desde el frontend)
        try:
            n1 = float(nota.nota1)
            n2 = float(nota.nota2)
            n3 = float(nota.nota3)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Valores de nota inválidos: {e}")

        nota_final = round((n1 + n2 + n3) / 3, 2)
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO notas (id_estudiante, id_materia, nota1, nota2, nota3, notafinal, fecha_registro)
            VALUES (%s, %s, %s, %s, %s, %s, CURRENT_DATE) RETURNING *;
        """, (nota.estudiante_id, nota.materia_id, n1, n2, n3, nota_final))
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

# Obtener notas por estudiante y materia
@router.get("/notas_get/{materia_id}")
def get_notas_por_estudiante_y_materia(materia_id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT * FROM notas WHERE id_materia = %s", (materia_id,))
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