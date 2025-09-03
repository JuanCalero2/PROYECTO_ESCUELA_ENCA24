// Importaciones principales de React y React Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importación de componentes de la aplicación
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProfesoresManager from './components/ProfesoresManager';
import EstudiantesManager from './components/EstudiantesManager';
import Profile from './components/Profile';

// Importación de estilos globales
import './index.css';

/**
 * Componente ProtectedRoute - Protege rutas que requieren autenticación
 * @param {Object} children - Componentes hijos que se renderizarán si el usuario está autenticado
 * @returns {JSX.Element} - Redirige a login si no hay token, o renderiza los children si está autenticado
 */
const ProtectedRoute = ({ children }) => {
  // Verificar si existe un token de acceso en localStorage
  const token = localStorage.getItem('access_token');
  
  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Si hay token, renderizar los componentes hijos
  return children;
};

/**
 * Componente principal de la aplicación
 * Define todas las rutas y la estructura de navegación
 */
function App() {
  return (
    // Router principal que envuelve toda la aplicación
    <Router>
      <div className="App">
        {/* Sistema de rutas de la aplicación */}
        <Routes>
          
          {/* RUTA PÚBLICA: Login */}
          <Route path="/login" element={
            // Si ya está autenticado, redirigir al dashboard
            // Si no está autenticado, mostrar el formulario de login
            localStorage.getItem('access_token') ? 
              <Navigate to="/dashboard" replace /> : 
              <Login />
          } />
          
          {/* RUTA PÚBLICA: Registro */}
          <Route path="/register" element={
            // Si ya está autenticado, redirigir al dashboard
            // Si no está autenticado, mostrar el formulario de registro
            localStorage.getItem('access_token') ? 
              <Navigate to="/dashboard" replace /> : 
              <Register />
          } />
          
          {/* RUTA RAÍZ: Redirección automática */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                {/* Redirigir al dashboard si está autenticado */}
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } 
          />
          
          {/* RUTAS PROTEGIDAS: Requieren autenticación */}
          
          {/* Dashboard principal - Vista según el rol del usuario */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Gestión de profesores - Solo para administradores */}
          <Route 
            path="/profesores" 
            element={
              <ProtectedRoute>
                <ProfesoresManager />
              </ProtectedRoute>
            } 
          />
          
          {/* Gestión de estudiantes - Solo para administradores */}
          <Route 
            path="/estudiantes" 
            element={
              <ProtectedRoute>
                <EstudiantesManager />
              </ProtectedRoute>
            } 
          />
          
          {/* Perfil de usuario - Accesible para todos los roles */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* RUTA CATCH-ALL: Maneja URLs no encontradas */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
