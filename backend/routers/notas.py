from fastapi import APIRouter, HTTPException
from models.notas import Nota
from db import get_db_connection
from typing import List
import json
"tengan en cuenta  la generacion de api es muy parecida a las anteriores solo cambian algunas cosas"
router = APIRouter()

@router.post("/create/", response_model=Nota)
def create_nota(nota: Nota):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute(
            'INSERT INTO notas (estudiante_id, estudio_id, nota, fecha, descripcion, profesor_id) VALUES (%s, %s, %s, %s, %s, %s) RETURNING id, estudiante_id, estudio_id, nota, fecha, descripcion, profesor_id',
            (nota.estudiante_id, nota.estudio_id, nota.nota, nota.fecha, nota.descripcion, nota.profesor_id)
        )
        new_nota_data = cur.fetchone()
        conn.commit()

        if new_nota_data is None:
            raise HTTPException(status_code=400, detail="Error al crear la nota")

        new_nota = Nota(
            id=new_nota_data['id'],
            estudiante_id=new_nota_data['estudiante_id'],
            estudio_id=new_nota_data['estudio_id'],
            nota=new_nota_data['nota'],
            fecha=new_nota_data['fecha'],
            descripcion=new_nota_data['descripcion'],
            profesor_id=new_nota_data['profesor_id']
        )

        return new_nota
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al crear la nota: {str(e)}")
    finally:
        cur.close()
        conn.close()

@router.get("/nota_view")
def get_notas():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('''
            SELECT n.id, n.nota, n.fecha, n.descripcion,
                   n.estudiante_id, e.nombre AS estudiante_nombre, e.apellido AS estudiante_apellido,
                   n.estudio_id, es.nombre AS materia_nombre, es.descripcion AS materia_descripcion,
                   n.profesor_id, p.nombre AS profesor_nombre, p.apellido AS profesor_apellido
            FROM notas n
            JOIN estudiantes e ON n.estudiante_id = e.id
            JOIN estudios es ON n.estudio_id = es.id
            LEFT JOIN profesores p ON n.profesor_id = p.id
            ORDER BY n.id
        ''')
        notas_data = cur.fetchall()

        notas = []
        for row in notas_data:
            nota_dict = {
                "id": row['id'],
                "nota": row['nota'],
                "fecha": row['fecha'],
                "descripcion": row['descripcion'],
                "estudiante_id": row['estudiante_id'],
                "estudiante_nombre": row['estudiante_nombre'],
                "estudiante_apellido": row['estudiante_apellido'],
                "estudio_id": row['estudio_id'],
                "materia_nombre": row['materia_nombre'],
                "materia_descripcion": row['materia_descripcion'],
                "profesor_id": row['profesor_id'],
                "profesor_nombre": row['profesor_nombre'],
                "profesor_apellido": row['profesor_apellido']
            }
            notas.append(nota_dict)

        return notas
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener las notas: {str(e)}")
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

@router.get("/{id}", response_model=Nota)
def get_nota(id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT id, asignacion_id, nota, fecha, descripcion FROM notas WHERE id = %s', (id,))
        nota_data = cur.fetchone()
        
        if nota_data is None:
            raise HTTPException(status_code=404, detail="Nota no encontrada")
        
        nota = Nota(
            id=nota_data['id'],
            asignacion_id=nota_data['asignacion_id'],
            nota=nota_data['nota'],
            fecha=nota_data['fecha'],
            descripcion=nota_data['descripcion']
        )
        
        return nota
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener la nota: {str(e)}")
    finally:
        cur.close()
        conn.close()


"recordando que en las actualizaciones se debe verificar si el id existe antes de actualizar"
@router.put("/update/{id}", response_model=Nota)
def update_nota(id: int, nota: Nota):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute('SELECT id FROM notas WHERE id = %s', (id,))
        existing = cur.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Nota no encontrada")
        
        cur.execute(
            'UPDATE notas SET asignacion_id = %s, nota = %s, fecha = %s, descripcion = %s WHERE id = %s RETURNING id, asignacion_id, nota, fecha, descripcion',
            (nota.asignacion_id, nota.nota, nota.fecha, nota.descripcion, id)
        )
        updated_nota_data = cur.fetchone()
        conn.commit()
        
        if updated_nota_data is None:
            raise HTTPException(status_code=404, detail="Nota no encontrada")
        
        updated_nota = Nota(
            id=updated_nota_data['id'],
            asignacion_id=updated_nota_data['asignacion_id'],
            nota=updated_nota_data['nota'],
            fecha=updated_nota_data['fecha'],
            descripcion=updated_nota_data['descripcion']
        )
        
        return updated_nota
        
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar la nota: {str(e)}")
    finally:
        cur.close()
        conn.close()



"tener cuidado con las eliminaciones tambien verificar si el id existe antes de eliminar"
@router.delete("/delete/{id}")
def delete_nota(id: int):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute('SELECT id FROM notas WHERE id = %s', (id,))
        existing = cur.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Nota no encontrada")
        
        cur.execute('DELETE FROM notas WHERE id = %s', (id,))
        conn.commit()
        
        return {"message": "Nota eliminada exitosamente", "id": id}
        
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar la nota: {str(e)}")
    finally:
        cur.close()
        conn.close()
