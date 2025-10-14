import axios from 'axios';

// Configuración base de axios
const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || 'http://localhost:8000/api',
  timeout: 10000,
  withCredentials: true, // Para sesiones
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para obtener CSRF token
const getCSRFToken = () => {
  const cookies = document.cookie.split(';');
  const csrfCookie = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
  return csrfCookie ? csrfCookie.split('=')[1] : null;
};

// Función para inicializar CSRF token
// const initializeCSRF = async () => {
//   try {
//     // Usar el endpoint de profile que sabemos que existe
//     await http.get('/user/profile/');
//     console.log('✅ CSRF token inicializado correctamente');
//   } catch (error) {
//     console.log('⚠️ No se pudo inicializar CSRF token:', error.message);
//   }
// };

// Inicializar CSRF al cargar el módulo (solo si hay sesión activa)
// No inicializar automáticamente para evitar errores en usuarios no autenticados

// Configuración de axios lista

// Interceptor para agregar token de autorización y CSRF
http.interceptors.request.use(
  (config) => {
    // No enviar Authorization para login y register (usan sesiones)
    const isAuthEndpoint = config.url?.includes('/user/login/') || config.url?.includes('/user/register/');
    
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Agregar CSRF token para operaciones POST/PUT/DELETE
    if (['post', 'put', 'delete', 'patch'].includes(config.method)) {
      const csrfToken = getCSRFToken();
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden - puede ser que la sesión no esté establecida
      console.warn('⚠️ Acceso denegado (403) - verificar autenticación');
    }
    return Promise.reject(error);
  }
);

export default http;
