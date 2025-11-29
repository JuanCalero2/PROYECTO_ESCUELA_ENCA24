import React, { useEffect, useState } from 'react';
import '../styles/gestionadorNotas.css'; 
import { Link } from 'react-router-dom';

const GestionarNotas = () => {
    const [notasactuales, setNotasactuales] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    const [notas, setNotas] = useState({});
    const [selectedMateria, setSelectedMateria] = useState(null);
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    const [profesorId, setProfesorId] = useState(null);
    
    //encontrar id del profesor asociado al usuario
    useEffect(() => {
        fetch(`/profesores/profesor_by_userid/${userInfo.id}`)
        .then((res) => res.json())
        .then((data) => {
            console.log("Profesor data:", data);
            setProfesorId(data.id);
            // Aquí puedes actualizar el estado con el ID del profesor si lo deseas
        })
        .catch((error) => {
            console.error("Error al obtener el profesor:", error);
        });
    }, []);

//traer materias del profesor
    useEffect(() => {
        console.log("Profesor ID:", profesorId);
        // Si profesorId no está definido aún, salir (evita hacer fetch con 'undefined' o 'null')
        if (!profesorId) {
            return;
        }

        const pid = Number(profesorId);
        const url = `/profesores/profesor/materias?profesor_id=${encodeURIComponent(pid)}`;
        console.log('Fetch materias URL:', url);
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setMaterias(data);
            })
            .catch((error) => {
                setMaterias([]);
                console.error("Error al obtener las materias:", error);
            });
}, [profesorId]);

//traer estudiantes de la materia seleccionada
useEffect(() => {
    if (!selectedMateria || !selectedMateria.id) return;
        fetch(`/profesores/profesores/estudiantes_por_materia?materia_id=${selectedMateria.id}`)
            .then((res) => res.json())
            .then((data) => {
                setEstudiantes(data);
                console.log(selectedMateria.id);
            })
            .catch((error) => {
                setEstudiantes([]);
                console.error("Error al obtener los estudiantes:", error);
            });

        
    }, [selectedMateria]);

    //traer notas de los estudiantes

    useEffect(() => {
        fetch(`/notas/notas_get`)
            .then((res) => res.json())
            .then((data) => {
                setNotasactuales(data);
                console.log("Notas actuales:", data);
            });
        }, [selectedMateria]);

        // Cuando cambian las notas actuales o la materia seleccionada
        // inicializamos el estado `notas` con las notas ya guardadas para esa materia
        useEffect(() => {
            if (!selectedMateria) {
                setNotas({});
                return;
            }
            const inicial = {};
            notasactuales.forEach(n => {
                if (n.id_materia === selectedMateria.id) {
                    inicial[n.id_estudiante] = {
                        nota1: n.nota1 ?? '',
                        nota2: n.nota2 ?? '',
                        nota3: n.nota3 ?? ''
                    };
                }
            });
            setNotas(inicial);
        }, [selectedMateria, notasactuales]);

const handleMateriaClick = (materiaId) => {
    setSelectedMateria(materias.find(m => m.id === materiaId));
    // Al cambiar de materia, salir del modo edición para cualquier fila
    setEditandoId(null);
    
}

const handleNotaChange = (estudianteId, campo, valor) => {
    setNotas(prev => ({
        ...prev,
        [estudianteId]: {
            ...prev[estudianteId],
            [campo]: valor
        }
    }));
};

const getPromedio = (estudianteId) => {
    const n = notas[estudianteId] || {};
    const suma = (Number(n.nota1) || 0) + (Number(n.nota2) || 0) + (Number(n.nota3) || 0);
    return (suma / 3).toFixed(2);
};

const handleGuardarCambios = async (estudianteId) => {
    try {
        const notaObj = notas[estudianteId] || {};
        const nota1 = Number(notaObj.nota1) || 0;
        const nota2 = Number(notaObj.nota2) || 0;
        const nota3 = Number(notaObj.nota3) || 0;


        // Buscar si ya existe una nota para ese estudiante y materia
        const existing = notasactuales.find(n => n.id_estudiante === estudianteId && n.id_materia === selectedMateria.id);

        // Si existe, eliminarla primero (la ruta DELETE devuelve el registro eliminado)
        if (existing && existing.id) {
            await fetch(`/notas/notas_delete/${existing.id}`, { method: 'DELETE' });
        }

        // Crear la nueva nota
        const body = {
            estudiante_id: estudianteId,
            materia_id: selectedMateria.id,
            nota1: nota1,
            nota2: nota2,
            nota3: nota3,
        };

        const res = await fetch('/notas/notas_create/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('Error al guardar nota:', err);
            alert('No se pudo guardar la nota');
            return;
        }

        // Refrescar notas desde el servidor
        const refrescar = await fetch('/notas/notas_get/');
        if (refrescar.ok) {
            const data = await refrescar.json();
            setNotasactuales(data);
        }

        setEditandoId(null);
    } catch (error) {
        console.error('Error en handleGuardarCambios:', error);
        alert('Error al guardar cambios');
    }
};

// removed unused handleeditar - use setEditandoId directly
    
    return (
        <div className="gestion-notas-container">
            <div className='header'>
                <Link to="/dashboard" className="back-btn">← Volver al Dashboard</Link>
                <h1 className='titulo'>Gestionar Notas</h1> 
            </div>
            
            <ul className='lista-materias'>
                {materias.map((materia) => (
                    <button className='back-btn-materia' key={materia.id} onClick={() => handleMateriaClick(materia.id)}>
                        {materia.nombre}
                    </button>
                ))}
            </ul>
            {/* Mostrar solo la materia seleccionada */}
            {selectedMateria && (
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Estudiante</th>
                        <th>Materia</th>
                        <th>Nota 1</th>
                        <th>Nota 2</th>
                        <th>Nota 3</th>
                        <th>Nota Final</th>
                        <th>Fecha de Registro</th>
                        <th>Accion</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Aquí puedes mapear las notas y mostrarlas en filas */}
                    {
                        estudiantes.map((estudiante) => (
                        <tr key={estudiante.id}>
                            <td>{estudiante.id}</td>
                            <td>{estudiante.nombre}</td>
                            <td>{selectedMateria?.nombre}</td>
                            <td>
                                <input
                                    type="number"
                                    value={notas[estudiante.id]?.nota1 ?? ''}
                                    disabled={editandoId !== estudiante.id}
                                    onChange={e => handleNotaChange(estudiante.id, "nota1", e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={notas[estudiante.id]?.nota2 ?? ''}
                                    disabled={editandoId !== estudiante.id}
                                    onChange={e => handleNotaChange(estudiante.id, "nota2", e.target.value)}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={notas[estudiante.id]?.nota3 ?? ''}
                                    disabled={editandoId !== estudiante.id}
                                    onChange={e => handleNotaChange(estudiante.id, "nota3", e.target.value)}
                                />
                            </td>
                            <td>{getPromedio(estudiante.id)}</td>
                            <td>2023-03-15</td>
                            <td>
                                {editandoId === estudiante.id ? (
                                    <button onClick={() => handleGuardarCambios(estudiante.id)}>Guardar</button>
                                ) : (
                                    <button onClick={() => setEditandoId(estudiante.id)}>Editar</button>
                                )}
                            </td>
                        </tr>
                        ))
                    }
                </tbody>
            </table>
            )}
            {/*
                notasactuales.map(nota => (
                    <div key={nota.id}>
                        <h2>Notas de {estudiantes.find(e => e.id === nota.id_estudiante)?.nombre}</h2>
                        <p>Materia: {materias.find(m => m.id === nota.id_materia)?.nombre}</p>
                        <p>Nota 1: {nota.nota1}</p>
                        <p>Nota 2: {nota.nota2}</p>
                        <p>Nota 3: {nota.nota3}</p>
                        <p>Nota Final: {nota.notafinal}</p>
                    </div>
                ))
            */}
            {/* Aquí puedes agregar la lógica y los componentes necesarios para gestionar las notas */}
        </div>
    );
};

export default GestionarNotas;
