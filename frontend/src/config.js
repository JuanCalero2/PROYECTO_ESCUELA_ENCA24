// Configuración de la API
export const API_CONFIG = {
  // URLs base
  BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
  
  // Endpoints de estudiantes
  ESTUDIANTES: {
    GET_ALL: '/estudiantes/estudiante_view',
    CREATE: '/estudiantes/create/',
    UPDATE: '/estudiantes/update/',
    DELETE: '/estudiantes/delete/'
  },
  
  // Endpoints de profesores
  PROFESORES: {
    GET_ALL: '/profesores/profesores_get/',
    CREATE: '/profesores/profesores_create/',
    UPDATE: '/profesores/profesores_update/',
    DELETE: '/profesores/profesores_delete/'
  },
  
  // Endpoints de autenticación
  AUTH: {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    LOGOUT: '/auth/logout/'
  }
};

// Función para construir URLs completas
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Función para obtener headers de autenticación
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
