import http from './http';

// Servicios de autenticación
export const authAPI = {
  // Login con sesión
  login: async (identifier, password) => {
    const response = await http.post('/user/login/', {
      identifier,
      password,
    });
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await http.post('/user/logout/');
    } catch (error) {
      // Ignorar errores de logout en el servidor
      console.warn('Error en logout:', error);
    }
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    const response = await http.get('/user/profile/');
    return response.data;
  },

  // Actualizar perfil
  updateProfile: async (profileData) => {
    const response = await http.put('/user/profile/', profileData);
    return response.data;
  },

  // Verificar estado de sesión
  getSessionStatus: async () => {
    const response = await http.get('/user/session-status/');
    return response.data;
  },

  // Obtener información básica de usuarios específicos
  getUsersBasicInfo: async (userIds) => {
    const userIdsStr = Array.isArray(userIds) ? userIds.join(',') : userIds.toString();
    const response = await http.get(`/user/users/basic-info/?user_ids=${userIdsStr}`);
    return response.data;
  },

  // Verificar disponibilidad de username
  checkUsername: async (username) => {
    const response = await http.get(`/user/check-username/?username=${encodeURIComponent(username)}`);
    return response.data;
  },

  // Verificar disponibilidad de email
  checkEmail: async (email) => {
    const response = await http.get(`/user/check-email/?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  // Registro de usuario
  register: async (userData) => {
    const response = await http.post('/user/register/', userData);
    return response.data;
  },

  // JWT - Obtener token
  obtainToken: async (username, password) => {
    const response = await http.post('/token/', {
      username,
      password,
    });
    return response.data;
  },

  // JWT - Refrescar token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No hay refresh token disponible');
    }

    const response = await http.post('/token/refresh/', {
      refresh: refreshToken,
    });
    return response.data;
  },

  // Admin - Establecer rol de usuario
  setUserRole: async (userId, role) => {
    const response = await http.post('/user/admin/set-role/', {
      user_id: userId,
      role,
    });
    return response.data;
  },
};
