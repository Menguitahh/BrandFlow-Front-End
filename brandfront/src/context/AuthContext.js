import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';
import http from '../api/http';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay una sesión activa al cargar
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Verificar estado de sesión con el nuevo endpoint
        const sessionStatus = await authAPI.getSessionStatus();
        
        if (sessionStatus.authenticated && sessionStatus.user) {
          console.log('✅ Usuario autenticado por sesión:', sessionStatus.user);
          setCurrentUser(sessionStatus.user);
        } else {
          // Si no hay sesión, verificar si hay token JWT como fallback
          const token = localStorage.getItem('access_token');
          if (token) {
            try {
              const profile = await authAPI.getProfile();
              console.log('✅ Usuario autenticado por JWT:', profile);
              setCurrentUser(profile);
            } catch (error) {
              console.warn('⚠️ Token JWT inválido, limpiando...');
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              localStorage.removeItem('brandflow_user');
            }
          }
        }
      } catch (error) {
        console.warn('⚠️ Error inicializando autenticación:', error.message);
        // No limpiar todo, puede ser que simplemente no haya sesión
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Función de login
  const login = async (identifier, password) => {
    try {
      const response = await authAPI.login(identifier, password);
      
      if (response.access) {
        // JWT auth (fallback)
        localStorage.setItem('access_token', response.access);
        if (response.refresh) {
          localStorage.setItem('refresh_token', response.refresh);
        }
        
        // Obtener perfil del usuario
        const profile = await authAPI.getProfile();
        setCurrentUser(profile);
        return profile;
      } else {
        // Session auth - el backend establece la sesión automáticamente
        setCurrentUser(response.user);
        
        // Inicializar CSRF token después del login exitoso
        try {
          await http.get('/user/profile/');
          console.log('✅ CSRF token inicializado después del login');
        } catch (error) {
          console.log('⚠️ No se pudo inicializar CSRF token:', error.message);
        }
        
        return response.user;
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      throw new Error(error.response?.data?.detail || 'Error al iniciar sesión');
    }
  };

  // Función de registro
  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      // El backend ahora establece la sesión automáticamente y devuelve el usuario
      const user = response.user || response;
      
      // El backend ya hizo login automático, solo establecer el usuario
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error('❌ Error en registro:', error);
      // Re-lanzar el error original para que el componente pueda acceder a response.data
      throw error;
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn('Error en logout:', error);
    } finally {
      // Limpiar estado local
      setCurrentUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('brandflow_user');
    }
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return currentUser !== null;
  };

  // Obtener el rol del usuario actual
  const getUserRole = () => {
    return currentUser?.role || currentUser?.roles || null;
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    const userRole = currentUser?.role || currentUser?.roles;
    return userRole === role;
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    isAuthenticated,
    getUserRole,
    hasRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};