import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buildApiUrl, getAuthHeaders, API_CONFIG } from '../config';
import '../styles/EstudiantesManager.css';

const EstudiantesManager = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo: '',
        edad: '',
        direccion: ''
    });



    useEffect(() => {
        fetchEstudiantes();
    }, []);

    const fetchEstudiantes = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('No hay token de acceso. Por favor, inicia sesión.');
            return;
        }

        setLoading(true);
        setError(''); // Limpiar errores anteriores
        try {
            console.log('Obteniendo estudiantes...');
            console.log('Intentando conectar a:', buildApiUrl(API_CONFIG.ESTUDIANTES.GET_ALL));
            const response = await fetch(buildApiUrl(API_CONFIG.ESTUDIANTES.GET_ALL), {
                method: 'GET',
                headers: getAuthHeaders()
            });

            console.log('Respuesta del servidor:', response.status, response.statusText);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Estudiantes obtenidos exitosamente:', data);
                console.log('📊 Cantidad de estudiantes:', data.length);
                setEstudiantes(data);
            } else {
                console.error('❌ Error del servidor:', response.status, response.statusText);
                // Mostrar error específico del backend
                try {
                    const errorData = await response.json();
                    console.error('🔍 Detalle completo del error:', errorData);
                    console.log('📝 Mensaje de error:', errorData.detail);
                    
                    // Mensaje más específico para el error de edad
                    if (errorData.detail && errorData.detail.includes('Error al obtener los estudiantes: 0')) {
                        setError('⚠️ Hay un problema con los datos de estudiantes en la base de datos. El campo edad tiene valores incorrectos. Contacta al administrador.');
                    } else {
                        setError(`Error del backend: ${errorData.detail || 'Error desconocido'} (Status: ${response.status})`);
                    }
                } catch (parseError) {
                    console.error('⚠️ Error al parsear respuesta:', parseError);
                    setError(`Error del backend: ${response.status} ${response.statusText}`);
                }
                setEstudiantes([]);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            if (error.message.includes('Unexpected token')) {
                setError('Error del servidor: El backend está devolviendo HTML en lugar de JSON. Verifica que el servidor esté funcionando correctamente.');
            } else {
                setError(`Error de conexión: ${error.message}`);
            }
            setEstudiantes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre || !formData.apellido || !formData.correo) {
            alert('Por favor completa los campos obligatorios');
            return;
        }

        // Validar que la edad sea un número válido
        if (formData.edad && (isNaN(formData.edad) || parseInt(formData.edad) < 0)) {
            alert('La edad debe ser un número válido');
            return;
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('No hay token de acceso. Por favor, inicia sesión.');
            return;
        }

        try {
            // Convertir edad a número antes de enviar
            const datosParaEnviar = {
                ...formData,
                edad: formData.edad ? parseInt(formData.edad) : null
            };
            
            console.log('Enviando datos:', datosParaEnviar);
            console.log('Headers:', getAuthHeaders());
            
            const response = await fetch(buildApiUrl(API_CONFIG.ESTUDIANTES.CREATE), {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(datosParaEnviar)
            });

            console.log('Respuesta del servidor:', response.status);
            console.log('URL completa:', response.url);

            if (response.ok) {
                const newEstudiante = await response.json();
                console.log('Estudiante creado:', newEstudiante);
                alert('Estudiante creado exitosamente');
                setFormData({
                    nombre: '',
                    apellido: '',
                    correo: '',
                    edad: '',
                    direccion: ''
                });
                setShowForm(false);
                fetchEstudiantes();
            } else {
                try {
                const errorData = await response.json();
                    console.error('Error del servidor:', errorData);
                alert(`Error: ${errorData.detail || 'No se pudo crear el estudiante'}`);
                } catch (parseError) {
                    console.error('Error al parsear respuesta:', parseError);
                    alert('Error al crear el estudiante. Inténtalo de nuevo.');
                }
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            alert(`Error de conexión: ${error.message}`);
        }
    };

    const [editingEstudiante, setEditingEstudiante] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);

    const handleUpdate = async (estudiante) => {
        console.log('🔍 Estudiante recibido para editar:', estudiante);
        console.log('🔍 ID del estudiante:', estudiante?.id);
        console.log('🔍 Campos del estudiante:', {
            nombre: estudiante?.nombre,
            apellido: estudiante?.apellido,
            correo: estudiante?.correo,
            edad: estudiante?.edad,
            direccion: estudiante?.direccion
        });
        
        if (!estudiante?.id) {
            alert('❌ Error: No se pudo obtener el ID del estudiante. Contacta al administrador.');
            return;
        }
        
        setEditingEstudiante(estudiante);
        setFormData({
            nombre: estudiante.nombre || '',
            apellido: estudiante.apellido || '',
            correo: estudiante.correo || '',
            edad: estudiante.edad || '',
            direccion: estudiante.direccion || ''
        });
        setShowEditForm(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre || !formData.apellido || !formData.correo) {
            alert('Por favor completa los campos obligatorios');
            return;
        }

        if (formData.edad && (isNaN(formData.edad) || parseInt(formData.edad) < 0)) {
            alert('La edad debe ser un número válido');
            return;
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
            alert('No hay token de acceso. Por favor, inicia sesión.');
            return;
        }

        try {
            const datosParaEnviar = {
                ...formData,
                edad: formData.edad ? parseInt(formData.edad) : null
            };

            console.log('Actualizando estudiante:', editingEstudiante.id);
            console.log('Datos a enviar:', datosParaEnviar);
            
            const response = await fetch(`/estudiantes/update/${editingEstudiante.id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify(datosParaEnviar)
            });

            if (response.ok) {
                const updatedEstudiante = await response.json();
                console.log('Estudiante actualizado:', updatedEstudiante);
                alert('Estudiante actualizado exitosamente');
                setShowEditForm(false);
                setEditingEstudiante(null);
                setFormData({
                    nombre: '',
                    apellido: '',
                    correo: '',
                    edad: '',
                    direccion: ''
                });
                fetchEstudiantes();
            } else {
                try {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.detail || 'No se pudo actualizar el estudiante'}`);
                } catch (parseError) {
                    alert('Error al actualizar el estudiante. Inténtalo de nuevo.');
                }
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            alert(`Error de conexión: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este estudiante?')) {
            return;
        }

        try {
            const response = await fetch(`/estudiantes/delete/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                alert('Estudiante eliminado exitosamente');
                fetchEstudiantes();
            } else {
                try {
                    const errorData = await response.json();
                    alert(`Error: ${errorData.detail || 'No se pudo eliminar el estudiante'}`);
                } catch (parseError) {
                    console.error('Error al parsear respuesta:', parseError);
                    alert('Error al eliminar el estudiante. Inténtalo de nuevo.');
                }
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            alert(`Error de conexión: ${error.message}`);
        }
    };

    // Filtrado y paginación
    const filteredEstudiantes = estudiantes.filter(estudiante =>
        estudiante.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estudiante.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estudiante.correo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEstudiantes = filteredEstudiantes.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredEstudiantes.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="estudiantes-container">
            {/* Header */}
            <div className="estudiantes-header">
                <Link to="/dashboard" className="back-btn">← Volver al Dashboard</Link>
                <h1>Gestión de Estudiantes</h1>
                {error && (
                    <div className="connection-status" style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                        🔴 Error de Conexión
                    </div>
                )}
                {!error && !loading && (
                    <div className="connection-status" style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                        🟢 Conectado
                    </div>
                )}
                {loading && (
                    <div className="connection-status" style={{
                        backgroundColor: '#ffc107',
                        color: 'black',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}>
                        🟡 Conectando...
                    </div>
                )}
            </div>

            {/* Controles */}
            <div className="estudiantes-controls">
                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Buscar estudiantes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="actions-section">
                <button 
                    onClick={fetchEstudiantes} 
                    disabled={loading}
                        className="refresh-btn"
                >
                        {loading ? '🔄 Cargando...' : '🔄 Actualizar'}
                </button>
                
                <button 
                        onClick={() => setShowForm(!showForm)}
                        className="add-btn"
                >
                        {showForm ? '❌ Cancelar' : '➕ Agregar Estudiante'}
                </button>
                </div>
                
                {/* Mostrar error si existe */}
                {error && (
                    <div className="error-section" style={{
                        backgroundColor: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        borderRadius: '5px',
                        padding: '15px',
                        marginBottom: '20px',
                        color: '#721c24'
                    }}>
                        <p className="error-message" style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                            ⚠️ Error del Servidor
                        </p>
                        <p style={{ margin: '0 0 15px 0' }}>{error}</p>
                        <button 
                            onClick={() => {
                                setError('');
                                fetchEstudiantes();
                            }} 
                            style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            🔄 Reintentar
                        </button>
                    </div>
                )}
                
                {/* Mostrar mensaje si no hay estudiantes y no hay error */}
                {estudiantes.length === 0 && !loading && !error && (
                    <div className="empty-state" style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#6c757d'
                    }}>
                        <p>📚 No hay estudiantes registrados</p>
                        <p>Haz clic en "Agregar Estudiante" para comenzar</p>
                    </div>
                )}
            </div>

            {/* Formulario de creación */}
            {showForm && (
                <div className="form-container">
                    <h3>Nuevo Estudiante</h3>
                    <form onSubmit={handleSubmit} className="estudiante-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Apellido *</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Correo Electrónico *</label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Edad</label>
                                <input
                                    type="number"
                                    name="edad"
                                    value={formData.edad}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    min="0"
                                    max="120"
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Dirección</label>
                            <textarea
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleInputChange}
                                className="form-input"
                                rows="3"
                                placeholder="Ingresa la dirección del estudiante"
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button type="submit" className="submit-btn">
                                💾 Guardar Estudiante
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Formulario de edición */}
            {showEditForm && (
                <div className="form-container">
                    <h3>Editar Estudiante: {editingEstudiante?.nombre} {editingEstudiante?.apellido}</h3>
                    <form onSubmit={handleEditSubmit} className="estudiante-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nombre *</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Apellido *</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Correo Electrónico *</label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleInputChange}
                                    required
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label>Edad</label>
                                <input
                                    type="number"
                                    name="edad"
                                    value={formData.edad}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    min="0"
                                    max="120"
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label>Dirección</label>
                            <textarea
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleInputChange}
                                className="form-input"
                                rows="3"
                                placeholder="Ingresa la dirección del estudiante"
                            />
                        </div>
                        
                        <div className="form-actions">
                            <button type="button" onClick={() => {
                                setShowEditForm(false);
                                setEditingEstudiante(null);
                                setFormData({
                                    nombre: '',
                                    apellido: '',
                                    correo: '',
                                    edad: '',
                                    direccion: ''
                                });
                            }} className="cancel-btn">
                                ❌ Cancelar
                            </button>
                            <button type="submit" className="submit-btn">
                                💾 Actualizar Estudiante
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de estudiantes */}
            <div className="estudiantes-list">
                <div className="list-header">
                    <h3>Estudiantes ({filteredEstudiantes.length})</h3>
                </div>

                {currentEstudiantes.length > 0 ? (
                    <div className="estudiantes-grid">
                        {currentEstudiantes.map((estudiante, index) => (
                            <div key={estudiante.id || index} className="estudiante-card">
                                <div className="estudiante-avatar">
                                    {estudiante.nombre?.charAt(0).toUpperCase()}
                                </div>
                                <div className="estudiante-info">
                                    <h4>{estudiante.nombre} {estudiante.apellido}</h4>
                                    <p className="estudiante-email">{estudiante.correo}</p>
                                    {estudiante.edad && estudiante.edad > 0 ? (
                                        <p className="estudiante-age">🎂 {estudiante.edad} años</p>
                                    ) : (
                                        <p className="estudiante-age">🎂 Edad no especificada</p>
                                    )}
                                    {estudiante.direccion && estudiante.direccion.trim() !== '' ? (
                                        <p className="estudiante-address">📍 {estudiante.direccion}</p>
                                    ) : (
                                        <p className="estudiante-address">📍 Dirección no especificada</p>
                                    )}
                                    {estudiante.id && (
                                        <p className="estudiante-id">ID: {estudiante.id}</p>
                                    )}
                                </div>
                                <div className="estudiante-actions">
                                    <button 
                                        onClick={() => handleUpdate(estudiante)}
                                        className="edit-btn"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(estudiante.id)}
                                        className="delete-btn"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p>No se encontraron estudiantes</p>
                    </div>
                )}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        ← Anterior
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`page-btn ${currentPage === number ? 'active' : ''}`}
                        >
                            {number}
                        </button>
                    ))}
                    
                    <button 
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                    >
                        Siguiente →
                    </button>
                </div>
            )}
        </div>
    );
};

export default EstudiantesManager;
