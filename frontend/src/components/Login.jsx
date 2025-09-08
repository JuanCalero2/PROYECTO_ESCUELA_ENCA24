// Importaciones de React y React Router
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Importación de estilos
import '../styles/Login.css';

/**
 * Componente Login - Formulario de autenticación
 * Permite a los usuarios iniciar sesión en el sistema
 */
const Login = () => {
    const [formData, setFormData] = useState({username: '', password: ''});
    // Estados de control de la interfaz
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();// Hook de navegación

    /**
     * Función para manejar cambios en los campos del formulario
     * @param {Event} e - Evento del input
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar errores cuando el usuario empiece a escribir
        if (error) {
            setError('');
        }
    };

    /**
     * Función para manejar el envío del formulario
     * @param {Event} e - Evento del formulario
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validaciones básicas
        if (!formData.username || !formData.password) {
            setError('Por favor completa todos los campos');
            return;
        }

        // Activar estado de carga
        setLoading(true);
        setError('');

        try {
            // PREPARAR DATOS PARA ENVIAR
            // Crear FormData para enviar como application/x-www-form-urlencoded
            const formDataToSend = new FormData();
            formDataToSend.append('username', formData.username);
            formDataToSend.append('password', formData.password);

            // REALIZAR PETICIÓN DE LOGIN
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formDataToSend)
            });

            // PROCESAR RESPUESTA
            if (response.ok) {
                // Login exitoso
                const data = await response.json();
                
                // GUARDAR DATOS DE AUTENTICACIÓN
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('token_type', data.token_type);
                
                // Guardar información del usuario si está disponible
                if (data.user) {
                    localStorage.setItem('user_info', JSON.stringify(data.user));
                }
                
                // Redirigir al dashboard
                navigate('/dashboard');
                
            } else {
                // Login fallido
                const errorData = await response.json();
                setError(errorData.detail || 'Error al iniciar sesión');
            }
            
        } catch (error) {
            // Error de conexión
            console.error('Error de conexión:', error);
            setError('Error de conexión. Verifica tu conexión a internet.');
        } finally {
            // Desactivar estado de carga
            setLoading(false);
        }
    };

    /**
     * Función para alternar la visibilidad de la contraseña
     */
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // RENDERIZADO DEL COMPONENTE
    return (
        <div className="login-container">
            {/* CONTENEDOR PRINCIPAL DEL FORMULARIO */}
            <div className="login-card">
                {/* ENCABEZADO */}
                <div className="login-header">
                    <h1>🏫 Sistema Escolar</h1>
                    <p>Inicia sesión en tu cuenta</p>
                </div>

                {/* FORMULARIO DE LOGIN */}
                <form onSubmit={handleSubmit} className="login-form">
                    
                    {/* CAMPO DE USUARIO/CORREO */}
                    <div className="form-group">
                        <label htmlFor="username">Correo Electrónico</label>
                        <div className="input-container">
                            <input
                                type="email"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Ingresa tu correo electrónico"
                                required
                                disabled={loading}
                                className="form-input"
                            />
                            <span className="input-icon">📧</span>
                        </div>
                    </div>

                    {/* CAMPO DE CONTRASEÑA */}
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <div className="input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Ingresa tu contraseña"
                                required
                                disabled={loading}
                                className="form-input"
                            />
                            <span className="input-icon">🔒</span>
                            
                            {/* BOTÓN PARA MOSTRAR/OCULTAR CONTRASEÑA */}
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="password-toggle"
                                disabled={loading}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {/* MENSAJE DE ERROR */}
                    {error && (
                        <div className="error-message">
                            <span>⚠️ {error}</span>
                        </div>
                    )}

                    {/* BOTÓN DE ENVÍO */}
                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Iniciando sesión...
                            </>
                        ) : (
                            '🚪 Iniciar Sesión'
                        )}
                    </button>
                </form>

                {/* ENLACE PARA REGISTRO */}
                <div className="register-link">
                    <p>
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register" className="link">
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
