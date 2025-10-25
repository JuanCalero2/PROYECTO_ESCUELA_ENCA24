// Importaciones de React y React Router
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// Importación de componentes específicos por rol
import ApiTester from './ApiTester';
import EstudianteAsignacion from './EstudianteAsignacion';
import ProfesorEstudiantes from './ProfesorEstudiantes';

// Importación de estilos
import '../styles/Dashboard.css';

/**
 * Componente Dashboard - Panel principal de la aplicación
 * Renderiza contenido diferente según el rol del usuario (Admin, Profesor, Estudiante)
 */
const Dashboard = () => {
    // ESTADO DEL COMPONENTE
    // Datos del usuario autenticado
    const [userData, setUserData] = useState(null);
    
    // Estadísticas para el panel de administrador
    const [stats, setStats] = useState({
        estudiantes: 0,
        profesores: 0,
        cursos: 0
    });
    
    // Hooks de navegación
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * useEffect - Se ejecuta al montar el componente
     * Verifica autenticación y carga datos del usuario
     */
    useEffect(() => {
        // Verificar si existe token de autenticación
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
            return;
        }

        // CARGAR DATOS DEL USUARIO
        // Intentar obtener información del usuario desde localStorage
        const userInfo = localStorage.getItem('user_info');
        if (userInfo) {
            const user = JSON.parse(userInfo);
            setUserData({
                nombre: user.nombre || 'Usuario',
                email: user.email || 'usuario@ejemplo.com',
                rol: user.rol || 'Usuario',
                rol_id: user.rol_id || 2
            });
        } else {
            // Datos por defecto si no hay información del usuario
            setUserData({
                nombre: 'Usuario',
                email: 'usuario@ejemplo.com',
                rol: 'Usuario',
                rol_id: 2
            });
        }

        // CARGAR ESTADÍSTICAS (simuladas)
        // En un caso real, estas estadísticas vendrían de la API
        setStats({
            estudiantes: 150,
            profesores: 25,
            cursos: 45
        });
    }, [navigate]);

    /**
     * Función para cerrar sesión
     * Limpia todos los datos de autenticación y redirige al login
     */
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('user_info');
        navigate('/login');
    };

    /**
     * Función para verificar si una ruta está activa
     * @param {string} path - Ruta a verificar
     * @returns {boolean} - True si la ruta está activa
     */
    const isActiveRoute = (path) => {
        return location.pathname === path;
    };

    /**
     * Función para renderizar contenido según el rol del usuario
     * @returns {JSX.Element} - Componente específico según el rol
     */
    const renderContentByRole = () => {
        if (!userData) return null;

        // Renderizar contenido diferente según el rol_id
        switch (userData.rol_id) {
            case 1: // PROFESOR
                return <ProfesorEstudiantes />;
                
            case 2: // ESTUDIANTE
                return <EstudianteAsignacion />;
                
            case 3: // ADMIN
                return (
                    <div className="admin-content">
                        {/* PANEL DE ESTADÍSTICAS */}
                        <div className="stats-grid">
                            {/* Tarjeta de estudiantes */}
                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-info">
                                    <h3>{stats.estudiantes}</h3>
                                    <p>Estudiantes</p>
                                </div>
                            </div>
                            
                            {/* Tarjeta de profesores */}
                            <div className="stat-card">
                                <div className="stat-icon">👨‍🏫</div>
                                <div className="stat-info">
                                    <h3>{stats.profesores}</h3>
                                    <p>Profesores</p>
                                </div>
                            </div>
                            
                            {/* Tarjeta de cursos */}
                            <div className="stat-card">
                                <div className="stat-icon">📚</div>
                                <div className="stat-info">
                                    <h3>{stats.cursos}</h3>
                                    <p>Cursos</p>
                                </div>
                            </div>
                        </div>

                        {/* ACCIONES RÁPIDAS PARA ADMIN */}
                        <div className="quick-actions">
                            <h2>Acciones Rápidas</h2>
                            <div className="actions-grid">
                                {/* Enlace para agregar estudiantes */}
                                <Link to="/estudiantes" className="action-card">
                                    <div className="action-icon">➕</div>
                                    <h3>Agregar Estudiante</h3>
                                    <p>Registrar nuevo estudiante</p>
                                </Link>
                                
                                {/* Enlace para agregar profesores */}
                                <Link to="/profesores" className="action-card">
                                    <div className="action-icon">➕</div>
                                    <h3>Agregar Profesor</h3>
                                    <p>Registrar nuevo profesor</p>
                                </Link>
                                
                                {/* Enlace para configuración */}
                                <Link to="/profile" className="action-card">
                                    <div className="action-icon">⚙️</div>
                                    <h3>Configuración</h3>
                                    <p>Gestionar perfil</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                );
                
            default:
                return <div>Rol no reconocido</div>;
        }
    };

    /**
     * Función para renderizar la navegación según el rol
     * @returns {JSX.Element} - Menú de navegación específico por rol
     */
    const renderNavigation = () => {
        if (!userData) return null;

        return (
            <nav className="sidebar-nav">
                {/* Enlace al dashboard - Visible para todos */}
                <Link 
                    to="/dashboard" 
                    className={`nav-item ${isActiveRoute('/dashboard') ? 'active' : ''}`}
                >
                    📊 Dashboard
                </Link>
                
                {/* Enlaces solo para ADMINISTRADORES */}
                {userData.rol_id === 3 && (
                    <>
                        {/* Gestión de estudiantes */}
                        <Link 
                            to="/estudiantes" 
                            className={`nav-item ${isActiveRoute('/estudiantes') ? 'active' : ''}`}
                        >
                            👥 Gestionar Estudiantes
                        </Link>
                        
                        {/* Gestión de profesores */}
                        <Link 
                            to="/profesores" 
                            className={`nav-item ${isActiveRoute('/profesores') ? 'active' : ''}`}
                        >
                            👨‍🏫 Gestionar Profesores
                        </Link>
                    </>
                )}
                
                {/* Enlace a Notas - solo estudiantes y profesores */}
                {(userData.rol_id === 1 || userData.rol_id === 2) && (
                 <Link 
                      to="/notas" 
                     className={`nav-item ${isActiveRoute('/notas') ? 'active' : ''}`}
                 >
                    📝 Notas
                </Link>
                )}


                {/* Enlace al perfil - Visible para todos */}
                <Link 
                    to="/profile" 
                    className={`nav-item ${isActiveRoute('/profile') ? 'active' : ''}`}
                >
                    👤 Perfil
                </Link>
            </nav>
        );
    };

    // ESTADO DE CARGA
    if (!userData) {
        return <div className="loading">Cargando...</div>;
    }

    // RENDERIZADO PRINCIPAL
    return (
        <div className="dashboard-container">
            {/* BARRA LATERAL (SIDEBAR) */}
            <div className="sidebar">
                {/* Encabezado del sidebar */}
                <div className="sidebar-header">
                    <h2>🏫 Escuela</h2>
                    <p>Sistema de Gestión</p>
                    {/* Badge que muestra el rol del usuario */}
                    <div className="user-role">
                        <span className="role-badge">{userData.rol}</span>
                    </div>
                </div>
                
                {/* Menú de navegación */}
                {renderNavigation()}

                {/* Pie del sidebar con botón de logout */}
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="main-content">
                {/* Encabezado del contenido principal */}
                <header className="dashboard-header">
                    <h1>Dashboard - {userData.rol}</h1>
                    <div className="user-info">
                        <span>Bienvenido, {userData.nombre}</span>
                    </div>
                </header>

                {/* Contenido dinámico según el rol */}
                <div className="dashboard-content">
                    {/* Renderizar contenido específico por rol */}
                    {renderContentByRole()}
                    
                    {/* SECCIÓN DE TESTING DE API (solo para desarrollo) */}
                    <div className="api-tester-section">
                        <h2>🧪 Probador de API</h2>
                        <p>Prueba la conectividad con el backend</p>
                        <ApiTester />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
