// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [rol, setRol] = useState('Estudiante');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        
        if (nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }
        
        if (apellido.trim().length < 2) {
            newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
        }
        
        if (!correo.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            newErrors.correo = 'Ingresa un correo electrónico válido';
        }
        
        if (contrasena.length < 6) {
            newErrors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        if (contrasena !== confirmarContrasena) {
            newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            // Mapear rol a rol_id según tu base de datos
            const rol_id = rol === 'Estudiante' ? 3 : (rol === 'Profesor' ? 1 : 2); // 3=Estudiante, 1=Profesor, 2=admin
            
            const response = await fetch('/usuarios/registro/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    nombre, 
                    apellido, 
                    correo, 
                    contrasena, 
                    rol_id 
                }),
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Registro exitoso:', data);
                if (data.access_token) {
                    localStorage.setItem('access_token', data.access_token);
                    localStorage.setItem('token_type', data.token_type);
                    alert('¡Registro exitoso! Tu cuenta ha sido creada.');
                    navigate('/profile');
                } else {
                    alert('¡Registro exitoso! Ya puedes iniciar sesión.');
                    navigate('/login');
                }
            } else {
                const errorData = await response.json();
                console.error('Error de registro:', errorData);
                alert(`Error en el registro: ${errorData.detail || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            alert(`Error de conexión: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const getRoleDescription = () => {
        return rol === 'Estudiante' 
            ? 'Accede a cursos, tareas y recursos educativos'
            : 'Gestiona cursos, calificaciones y contenido educativo';
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h1>Crear Cuenta</h1>
                    <p>Únete a nuestra plataforma educativa</p>
                </div>
                
                <form onSubmit={handleRegister} className="register-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                id="nombre"
                                type="text"
                                placeholder="Tu nombre"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                                disabled={isLoading}
                                className={errors.nombre ? 'error' : ''}
                            />
                            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="apellido">Apellido</label>
                            <input
                                id="apellido"
                                type="text"
                                placeholder="Tu apellido"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                required
                                disabled={isLoading}
                                className={errors.apellido ? 'error' : ''}
                            />
                            {errors.apellido && <span className="error-message">{errors.apellido}</span>}
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="correo">Correo Electrónico</label>
                        <input
                            id="correo"
                            type="email"
                            placeholder="tu@correo.com"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                            disabled={isLoading}
                            className={errors.correo ? 'error' : ''}
                        />
                        {errors.correo && <span className="error-message">{errors.correo}</span>}
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="rol">Tipo de Usuario</label>
                        <div className="role-selector">
                            <div 
                                className={`role-option ${rol === 'Estudiante' ? 'active' : ''}`}
                                onClick={() => setRol('Estudiante')}
                            >
                                <div className="role-icon">👨‍🎓</div>
                                <div className="role-info">
                                    <div className="role-title">Estudiante</div>
                                    <div className="role-description">Accede a cursos y recursos</div>
                                </div>
                            </div>
                            
                            <div 
                                className={`role-option ${rol === 'Profesor' ? 'active' : ''}`}
                                onClick={() => setRol('Profesor')}
                            >
                                <div className="role-icon">👨‍🏫</div>
                                <div className="role-info">
                                    <div className="role-title">Profesor</div>
                                    <div className="role-description">Gestiona cursos y contenido</div>
                                </div>
                            </div>
                        </div>
                        <p className="role-description-text">{getRoleDescription()}</p>
                    </div>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="contrasena">Contraseña</label>
                            <input
                                id="contrasena"
                                type="password"
                                placeholder="••••••••"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                                disabled={isLoading}
                                className={errors.contrasena ? 'error' : ''}
                            />
                            {errors.contrasena && <span className="error-message">{errors.contrasena}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="confirmarContrasena">Confirmar Contraseña</label>
                            <input
                                id="confirmarContrasena"
                                type="password"
                                placeholder="••••••••"
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                                required
                                disabled={isLoading}
                                className={errors.confirmarContrasena ? 'error' : ''}
                            />
                            {errors.confirmarContrasena && <span className="error-message">{errors.confirmarContrasena}</span>}
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="register-submit-btn"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>
                </form>
                
                <div className="register-footer">
                    <p>¿Ya tienes una cuenta?</p>
                    <button 
                        type="button" 
                        className="back-to-login-btn"
                        onClick={handleBackToLogin}
                        disabled={isLoading}
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register;
