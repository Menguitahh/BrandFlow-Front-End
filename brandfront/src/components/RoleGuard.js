import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleGuard = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, getUserRole, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario tiene el rol necesario
  const userRole = getUserRole();
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirigir según el rol del usuario
    switch (userRole) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'diseñador':
        return <Navigate to="/designer" replace />;
      case 'cliente':
        return <Navigate to="/client" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  // Renderizar el contenido si tiene el rol correcto
  return children;
};

export default RoleGuard;
