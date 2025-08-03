import React, { createContext, useContext, useState, useEffect } from 'react';

// Datos hardcodeados para usuarios
const hardcodedUsers = [
  {
    id: 1,
    email: 'admin@brandflow.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin'
  },
  {
    id: 2,
    email: 'user@brandflow.com',
    password: 'user123',
    name: 'Usuario Demo',
    role: 'user'
  }
];

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

  // Verificar si hay un usuario guardado en localStorage al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem('brandflow_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Función de login
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      // Simular delay de red
      setTimeout(() => {
        const user = hardcodedUsers.find(
          u => u.email === email && u.password === password
        );

        if (user) {
          // No guardar la contraseña en el estado
          const { password, ...userWithoutPassword } = user;
          setCurrentUser(userWithoutPassword);
          localStorage.setItem('brandflow_user', JSON.stringify(userWithoutPassword));
          resolve(userWithoutPassword);
        } else {
          reject(new Error('Credenciales inválidas'));
        }
      }, 1000);
    });
  };

  // Función de registro
  const register = (name, email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Verificar si el email ya existe
        const existingUser = hardcodedUsers.find(u => u.email === email);
        
        if (existingUser) {
          reject(new Error('El email ya está registrado'));
          return;
        }

        // Crear nuevo usuario
        const newUser = {
          id: hardcodedUsers.length + 1,
          name,
          email,
          password,
          role: 'user'
        };

        // Agregar a la lista de usuarios (solo en memoria)
        hardcodedUsers.push(newUser);

        // No guardar la contraseña en el estado
        const { password: pwd, ...userWithoutPassword } = newUser;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem('brandflow_user', JSON.stringify(userWithoutPassword));
        resolve(userWithoutPassword);
      }, 1000);
    });
  };

  // Función de logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('brandflow_user');
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return currentUser !== null;
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 