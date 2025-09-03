// Importaciones de React
import React, { useEffect, useState } from 'react';

// Importación de estilos
import '../styles/EstudiantesManager.css';

/**
 * Componente EstudianteAsignacion - Vista de asignaciones para estudiantes
 * Muestra las materias asignadas al estudiante y sus respectivos profesores
 * Solo visible para usuarios con rol de Estudiante
 */
const EstudianteAsignacion = () => {
    // ESTADO DEL COMPONENTE
    // Datos de las asignaciones del estudiante
    const [asignacionData, setAsignacionData] = useState(null);
    
    // Estados de control de la interfaz
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * useEffect - Se ejecuta al montar el componente
     * Carga las asignaciones del estudiante desde la API
     */
    useEffect(() => {
        // Función para cargar las asignaciones
        const fetchAsignaciones = async () => {
            try {
                // Realizar petición a la API para obtener asignaciones
                const response = await fetch('/asignaciones/estudiante', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json',
                    },
                });

                // Verificar si la petición fue exitosa
                if (!response.ok) {
                    throw new Error('Error al cargar las asignaciones');
                }

                // Procesar la respuesta JSON
                const data = await response.json();
                setAsignacionData(data);
                setLoading(false);
                
            } catch (err) {
                // Manejar errores
                setError(err.message);
                setLoading(false);
            }
        };

        // Ejecutar la función de carga
        fetchAsignaciones();
    }, []); // Array vacío significa que solo se ejecuta al montar el componente

    // ESTADOS DE RENDERIZADO

    // Estado de carga
    if (loading) {
        return (
            <div className="loading">
                Cargando asignaciones...
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

    // Estado sin asignaciones
    if (!asignacionData || !asignacionData.asignaciones || asignacionData.asignaciones.length === 0) {
        return (
            <div className="asignacion-container">
                <h2>Mis Asignaciones</h2>
                <p>No tienes asignaciones de materias registradas.</p>
            </div>
        );
    }

    // RENDERIZADO PRINCIPAL
    return (
        <div className="asignacion-container">
            {/* ENCABEZADO */}
            <h2>Mis Asignaciones</h2>
            
            {/* INFORMACIÓN DEL ESTUDIANTE */}
            <div className="estudiante-info">
                <h3>
                    Estudiante: {asignacionData.estudiante.nombre} {asignacionData.estudiante.apellido}
                </h3>
            </div>

            {/* GRID DE ASIGNACIONES */}
            <div className="asignaciones-grid">
                {/* Iterar sobre cada asignación */}
                {asignacionData.asignaciones.map((asignacion, index) => (
                    <div key={asignacion.id} className="asignacion-card">
                        
                        {/* INFORMACIÓN DE LA MATERIA */}
                        <div className="materia-info">
                            <h4>📚 {asignacion.materia.nombre}</h4>
                            <p className="materia-descripcion">
                                {asignacion.materia.descripcion}
                            </p>
                        </div>

                        {/* INFORMACIÓN DEL PROFESOR */}
                        <div className="profesor-info">
                            <h5>👨‍🏫 Profesor:</h5>
                            <p>
                                <strong>Nombre:</strong> {asignacion.profesor.nombre} {asignacion.profesor.apellido}
                            </p>
                            <p>
                                <strong>Correo:</strong> {asignacion.profesor.correo}
                            </p>
                            <p>
                                <strong>Especialidad:</strong> {asignacion.profesor.especialidad}
                            </p>
                        </div>

                        {/* INFORMACIÓN DE FECHA */}
                        <div className="fecha-info">
                            <p>
                                <strong>Fecha de inscripción:</strong> {asignacion.fecha_inscripcion}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EstudianteAsignacion;
