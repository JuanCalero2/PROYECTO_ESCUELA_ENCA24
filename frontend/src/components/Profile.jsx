import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import '../styles/Profile.css';

const Profile = () => {
    const [userData, setUserData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        rol: '',
        rol_id: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            setMessage(null);

            // Obtener token de autenticación
            const token = localStorage.getItem('access_token');
            
            if (!token) {
                setError('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
                return;
            }

            // Intentar obtener información del usuario desde localStorage primero
            const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
            
            if (userInfo && userInfo.correo) {
                // Si tenemos información básica, la usamos como base
                setUserData({
                    nombre: userInfo.nombre || '',
                    apellido: userInfo.apellido || '',
                    email: userInfo.correo || '',
                    telefono: userInfo.telefono || '',
                    direccion: userInfo.direccion || '',
                    rol: userInfo.rol_nombre || 'Usuario',
                    rol_id: userInfo.rol_id
                });
                
                // Intentar obtener información actualizada desde el servidor
                try {
                    const response = await fetch('http://127.0.0.1:8000/auth/profile', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const serverData = await response.json();
                        setUserData({
                            nombre: serverData.nombre || '',
                            apellido: serverData.apellido || '',
                            email: serverData.correo || '',
                            telefono: serverData.telefono || '',
                            direccion: serverData.direccion || '',
                            rol: serverData.rol_nombre || 'Usuario',
                            rol_id: serverData.rol_id
                        });
                        setMessage('Perfil actualizado desde el servidor.');
                        setTimeout(() => setMessage(null), 3000);
                    } else {
                        console.log('No se pudo obtener datos del servidor, usando datos locales');
                    }
                } catch (serverError) {
                    console.log('Error al conectar con el servidor, usando datos locales:', serverError);
                }
                
            } else {
                setError('No se encontró información del usuario. Por favor, inicia sesión nuevamente.');
            }

        } catch (error) {
            console.error('Error al obtener perfil:', error);
            
            // Si falla, intentar usar datos locales como fallback
            const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
            if (userInfo) {
                setUserData({
                    nombre: userInfo.nombre || '',
                    apellido: userInfo.apellido || '',
                    email: userInfo.correo || '',
                    telefono: userInfo.telefono || '',
                    direccion: userInfo.direccion || '',
                    rol: userInfo.rol_nombre || 'Usuario',
                    rol_id: userInfo.rol_id
                });
                setError('Se cargaron datos locales debido a un error de conexión con el servidor.');
            } else {
                setError('Error al cargar el perfil del usuario. Por favor, inicia sesión nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            
            // Obtener token de autenticación
            const token = localStorage.getItem('access_token');
            
            if (!token) {
                setMessage('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
                setTimeout(() => setMessage(null), 5000);
                return;
            }

            // Preparar datos para enviar al servidor
            const updateData = {
                nombre: userData.nombre,
                apellido: userData.apellido,
                telefono: userData.telefono,
                direccion: userData.direccion
            };

            // Por ahora, solo guardamos localmente ya que el endpoint de actualización no existe
            setMessage('Perfil actualizado localmente. El endpoint del servidor no está disponible.');
            setTimeout(() => setMessage(null), 5000);
            
            setIsEditing(false);
            
            // Guardar en localStorage para persistencia
            const currentUserInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
            if (currentUserInfo) {
                const updatedUserInfo = {
                    ...currentUserInfo,
                    ...updateData
                };
                localStorage.setItem('user_info', JSON.stringify(updatedUserInfo));
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            setMessage('Error al actualizar el perfil. Inténtalo de nuevo.');
            setTimeout(() => setMessage(null), 5000);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Recargar datos originales
        fetchUserProfile();
        setIsEditing(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('user_info');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="loading-spinner"></div>
                <p>Cargando perfil...</p>
                <small>Obteniendo información del servidor...</small>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-error">
                <p>Error: {error}</p>
                <button onClick={fetchUserProfile} className="retry-btn">
                    Reintentar
                </button>
                <button onClick={handleLogout} className="retry-btn" style={{ marginTop: '10px' }}>
                    Ir al Login
                </button>
            </div>
        );
    }

    const fullName = `${userData.nombre} ${userData.apellido}`.trim();
    const userInitial = userData.nombre ? userData.nombre.charAt(0).toUpperCase() : 'U';

    return (
        <div className="profile-container">
            {/* Header con navegación */}
            <div className="profile-header">
                <Link to="/dashboard" className="back-btn">← Volver al Dashboard</Link>
                <h1>Mi Perfil</h1>
                <button onClick={handleLogout} className="logout-btn">
                    🚪 Cerrar Sesión
                </button>
            </div>

            {/* Mensajes de éxito/error */}
            {message && (
                <div className="profile-message success">
                    <span>{message}</span>
                    <button onClick={() => setMessage(null)} className="close-message">×</button>
                </div>
            )}
            
            {error && (
                <div className="profile-message error">
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="close-message">×</button>
                </div>
            )}

            <div className="profile-content">
                {/* Información del perfil */}
                <div className="profile-section">
                    <div className="profile-avatar">
                        <div className="avatar-placeholder">
                            {userInitial}
                        </div>
                        <h2>{fullName}</h2>
                        <p className="user-role">{userData.rol}</p>
                        <p className="user-email">{userData.email}</p>
                    </div>

                    <div className="profile-actions">
                        {!isEditing ? (
                            <div className="action-buttons">
                                <button 
                                    onClick={() => setIsEditing(true)} 
                                    className="edit-btn"
                                >
                                    ✏️ Editar Perfil
                                </button>
                                <button 
                                    onClick={() => {
                                        setMessage('Los datos del perfil se cargan desde el almacenamiento local. El endpoint del servidor no está disponible.');
                                        setTimeout(() => setMessage(null), 5000);
                                    }} 
                                    className="refresh-btn"
                                    disabled={loading}
                                >
                                    ℹ️ Información del Perfil
                                </button>
                            </div>
                        ) : (
                            <div className="edit-actions">
                                <button onClick={handleSave} className="save-btn" disabled={loading}>
                                    {loading ? '⏳ Guardando...' : '💾 Guardar'}
                                </button>
                                <button onClick={handleCancel} className="cancel-btn">
                                    ❌ Cancelar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Formulario de información */}
                <div className="profile-form">
                    <div className="form-group">
                        <label>Nombre</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="nombre"
                                value={userData.nombre}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Ingresa tu nombre"
                            />
                        ) : (
                            <p className="form-value">{userData.nombre || 'No especificado'}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Apellido</label>
                        {isEditing ? (
                            <input
                                type="text"
                                name="apellido"
                                value={userData.apellido}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Ingresa tu apellido"
                            />
                        ) : (
                            <p className="form-value">{userData.apellido || 'No especificado'}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Correo Electrónico</label>
                        <p className="form-value">{userData.email}</p>
                    </div>

                    <div className="form-group">
                        <label>Teléfono</label>
                        {isEditing ? (
                            <input
                                type="tel"
                                name="telefono"
                                value={userData.telefono}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Ingresa tu teléfono"
                            />
                        ) : (
                            <p className="form-value">{userData.telefono || 'No especificado'}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Dirección</label>
                        {isEditing ? (
                            <textarea
                                name="direccion"
                                value={userData.direccion}
                                onChange={handleInputChange}
                                className="form-textarea"
                                rows="3"
                                placeholder="Ingresa tu dirección"
                            />
                        ) : (
                            <p className="form-value">{userData.direccion || 'No especificado'}</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Rol</label>
                        <p className="form-value role-badge">{userData.rol}</p>
                    </div>
                </div>

                {/* Sección de seguridad */}
                <div className="security-section">
                    <h3>🔒 Seguridad</h3>
                    <div className="security-options">
                        <button className="security-btn">
                            🔑 Cambiar Contraseña
                        </button>
                        <button className="security-btn">
                            📱 Autenticación de Dos Factores
                        </button>
                        <button className="security-btn">
                            📧 Notificaciones por Email
                        </button>
                    </div>
                </div>

                {/* Sección de actividad */}
                <div className="activity-section">
                    <h3>📊 Actividad Reciente</h3>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-icon">🔐</div>
                            <div className="activity-content">
                                <p>Inicio de sesión exitoso</p>
                                <small>Hace 2 horas</small>
                            </div>
                        </div>
                        
                        <div className="activity-item">
                            <div className="activity-icon">📝</div>
                            <div className="activity-content">
                                <p>Perfil actualizado</p>
                                <small>Hace 1 día</small>
                            </div>
                        </div>
                        
                        <div className="activity-item">
                            <div className="activity-icon">👥</div>
                            <div className="activity-content">
                                <p>Nuevo estudiante agregado</p>
                                <small>Hace 3 días</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

