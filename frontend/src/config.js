/**
 * ARCHIVO DE CONFIGURACIÓN PRINCIPAL
 * Contiene todas las configuraciones de la API y funciones de utilidad
 */

// CONFIGURACIÓN DE LA API
export const API_CONFIG = {
  // URL base de la API - Se puede configurar con variables de entorno
  BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000',
  
  // ENDPOINTS PARA GESTIÓN DE ESTUDIANTES
  ESTUDIANTES: {
    GET_ALL: '/estudiantes/estudiante_view',      // Obtener todos los estudiantes
    CREATE: '/estudiantes/create/',               // Crear nuevo estudiante
    UPDATE: '/estudiantes/update/',               // Actualizar estudiante existente
    DELETE: '/estudiantes/delete/'                // Eliminar estudiante
  },
  
  // ENDPOINTS PARA GESTIÓN DE PROFESORES
  PROFESORES: {
    GET_ALL: '/profesores/profesores_get/',       // Obtener todos los profesores
    ME: '/profesores/me',                         // Obtener profesor asociado al usuario autenticado
    CREATE: '/profesores/profesores_create/',     // Crear nuevo profesor
    UPDATE: '/profesores/profesores_update/',     // Actualizar profesor existente
    DELETE: '/profesores/profesores_delete/'      // Eliminar profesor
  },

  // ENDPOINTS PARA ASIGNACIONES
  ASIGNACIONES: {
    GET_ALL: '/asignaciones_get/',         // Obtener todas las asignaciones (admin)
    GET_POR_ESTUDIANTE: '/asignaciones/estudiante', // Obtener asignaciones del estudiante (requiere auth)
    GET_POR_PROFESOR: '/asignaciones/profesor', // Obtener materias/estudiantes del profesor (requiere auth)
    GET_ADMIN_ALL: '/asignaciones/all',    // Alternativa para admin
  },

  // ENDPOINTS PARA NOTAS
  NOTAS: {
    GET_ALL: '/notas/nota_view',           // Obtener todas las notas (admin/profesor)
    GET_POR_ESTUDIANTE: '/notas_estudiante/', // Obtener notas de un estudiante: /notas_estudiante/{id}
    CREATE: '/notas/create/',              // POST para crear nota (con slash final)
    UPDATE: '/notas/update/',              // PUT para actualizar nota
    DELETE: '/notas/delete/',              // DELETE para eliminar nota
  },
  
  // ENDPOINTS PARA AUTENTICACIÓN
  AUTH: {
    LOGIN: '/auth/login/',                        // Iniciar sesión
    REGISTER: '/auth/register/',                  // Registrarse
    LOGOUT: '/auth/logout/'                       // Cerrar sesión
  }
};

/**
 * Función para construir URLs completas de la API
 * @param {string} endpoint - Endpoint específico de la API
 * @returns {string} - URL completa con la base URL
 * 
 * Ejemplo: buildApiUrl('/estudiantes/estudiante_view')
 * Resultado: 'http://127.0.0.1:8000/estudiantes/estudiante_view'
 */
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

/**
 * Función para obtener headers de autenticación
 * @returns {Object} - Objeto con headers necesarios para peticiones autenticadas
 * 
 * Incluye:
 * - Authorization: Token Bearer para autenticación
 * - Content-Type: application/json para peticiones JSON
 */
export const getAuthHeaders = () => {
  // Obtener token de autenticación desde localStorage
  const token = localStorage.getItem('access_token');
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};
