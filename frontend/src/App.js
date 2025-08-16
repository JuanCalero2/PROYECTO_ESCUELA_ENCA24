import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProfesoresManager from './components/ProfesoresManager';
import EstudiantesManager from './components/EstudiantesManager';
import Profile from './components/Profile';
import './App.css';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta pública de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Ruta pública de registro */}
          <Route path="/register" element={<Register />} />
          
          {/* Ruta raíz - redirige a dashboard si está autenticado, sino a login */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } 
          />
          
          {/* Rutas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profesores" 
            element={
              <ProtectedRoute>
                <ProfesoresManager />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/estudiantes" 
            element={
              <ProtectedRoute>
                <EstudiantesManager />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta para cualquier URL no encontrada */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
