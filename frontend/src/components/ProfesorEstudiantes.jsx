// Importaciones de React
import React, { useEffect, useState } from 'react';

// Importación de estilos
import '../styles/EstudiantesManager.css';

/**
 * Componente ProfesorEstudiantes - Vista de estudiantes para profesores
 * Muestra las materias que imparte el profesor y los estudiantes inscritos en cada una
 * Solo visible para usuarios con rol de Profesor
 */
const ProfesorEstudiantes = () => {
    // ESTADO DEL COMPONENTE
    // Datos del profesor y sus materias/estudiantes
    const [profesorData, setProfesorData] = useState(null);
    
    // Estados de control de la interfaz
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * useEffect - Se ejecuta al montar el componente
     * Carga los datos del profesor y sus estudiantes desde la API
     */
    useEffect(() => {
        // Función para cargar los datos del profesor
        const fetchProfesorData = async () => {
            try {
                // Realizar petición a la API para obtener datos del profesor
                const response = await fetch('/asignaciones/profesor', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                // Verificar si la petición fue exitosa
                if (!response.ok) {
                    throw new Error('Error al cargar los datos del profesor');
                }

                // Procesar la respuesta JSON
                const data = await response.json();
                setProfesorData(data);
                setLoading(false);
                
            } catch (err) {
                // Manejar errores
                setError(err.message);
                setLoading(false);
            }
        };

        // Ejecutar la función de carga
        fetchProfesorData();
    }, []); // Array vacío significa que solo se ejecuta al montar el componente

    // ESTADOS DE RENDERIZADO

    // Estado de carga
    if (loading) {
        return (
            <div className="loading">
                Cargando datos del profesor...
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div className="error">
                {error}
            </div>
        );
    }

    // Estado sin datos del profesor
    if (!profesorData) {
        return (
            <div className="error">
                No se pudieron cargar los datos del profesor.
            </div>
        );
    }

    // RENDERIZADO PRINCIPAL
    return (
        <div className="profesor-container">
            {/* ENCABEZADO DEL PROFESOR */}
            <div className="profesor-header">
                <h2>👨‍🏫 Panel del Profesor</h2>
                
                {/* INFORMACIÓN DEL PROFESOR */}
                <div className="profesor-info">
                    <h3>
                        Profesor: {profesorData.profesor.nombre} {profesorData.profesor.apellido}
                    </h3>
                    <p>
                        <strong>Especialidad:</strong> {profesorData.profesor.especialidad}
                    </p>
                </div>
            </div>

            {/* SECCIÓN DE MATERIAS Y ESTUDIANTES */}
            <div className="materias-section">
                <h3>📚 Mis Materias y Estudiantes</h3>

                {/* Verificar si el profesor tiene materias asignadas */}
                {profesorData.materias.length === 0 ? (
                    <p>No tienes materias asignadas.</p>
                ) : (
                    /* GRID DE MATERIAS */
                    <div className="materias-grid">
                        {/* Iterar sobre cada materia del profesor */}
                        {profesorData.materias.map((materia) => (
                            <div key={materia.id} className="materia-card">
                                
                                {/* ENCABEZADO DE LA MATERIA */}
                                <div className="materia-header">
                                    <h4>📖 {materia.nombre}</h4>
                                    <p className="materia-descripcion">
                                        {materia.descripcion}
                                    </p>
                                </div>

                                {/* SECCIÓN DE ESTUDIANTES */}
                                <div className="estudiantes-section">
                                    <h5>👥 Estudiantes ({materia.estudiantes.length})</h5>

                                    {/* Verificar si hay estudiantes inscritos */}
                                    {materia.estudiantes.length === 0 ? (
                                        <p className="no-estudiantes">
                                            No hay estudiantes inscritos en esta materia.
                                        </p>
                                    ) : (
                                        /* LISTA DE ESTUDIANTES */
                                        <div className="estudiantes-list">
                                            {/* Iterar sobre cada estudiante */}
                                            {materia.estudiantes.map((estudiante) => (
                                                <div key={estudiante.id} className="estudiante-item">
                                                    {/* INFORMACIÓN DEL ESTUDIANTE */}
                                                    <div className="estudiante-info">
                                                        <p>
                                                            <strong>Nombre:</strong> {estudiante.nombre} {estudiante.apellido}
                                                        </p>
                                                        <p>
                                                            <strong>Correo:</strong> {estudiante.correo}
                                                        </p>
                                                        <p>
                                                            <strong>Edad:</strong> {estudiante.edad} años
                                                        </p>
                                                        <p>
                                                            <strong>Inscrito:</strong> {estudiante.fecha_inscripcion}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfesorEstudiantes;
