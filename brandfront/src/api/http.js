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

// Configuración de axios lista

// Interceptor para agregar token de autorización
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
