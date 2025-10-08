import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, logout, isAuthenticated, getUserRole } = useAuth();
  const navigate = useNavigate();

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          BrandFlow
        </Link>

        {/* Hamburger button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded={!isNavCollapsed ? true : false}
          aria-label="Toggle navigation"
          onClick={handleNavCollapse}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Menu */}
        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Enlaces públicos */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">Servicios</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/quote">Cotizar</Link>
            </li>

            {/* Enlaces autenticados */}
            {isAuthenticated() && (
              <>
                {getUserRole() === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin">Admin</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/services">Gestionar Servicios</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/quotes">Cotizaciones</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/projects">Proyectos</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/users">Usuarios</Link>
                    </li>
                  </>
                )}
                {getUserRole() === 'diseñador' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/designer">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/designer/projects">Mis Proyectos</Link>
                    </li>
                  </>
                )}
                {getUserRole() === 'cliente' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/client">Dashboard</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/client/quotes">Mis Cotizaciones</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/client/projects">Mis Proyectos</Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          {/* User Menu */}
          <ul className="navbar-nav">
            {isAuthenticated() ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  id="navbarDropdown"
                  role="button"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen ? "true" : "false"}
                  style={{ background: 'none', border: 'none', color: 'inherit' }}
                >
                  <i className="bi bi-person-circle me-2"></i>
                  {currentUser?.first_name && currentUser?.last_name
                    ? `${currentUser.first_name} ${currentUser.last_name}`
                    : currentUser?.username || 'Usuario'
                  }
                </button>
                <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
                  <li>
                    <div className="dropdown-header">
                      <i className="bi bi-person-circle me-2"></i>
                      {currentUser?.first_name && currentUser?.last_name
                        ? `${currentUser.first_name} ${currentUser.last_name}`
                        : currentUser?.username || 'Usuario'
                      }
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      <i className="bi bi-gear me-2"></i>
                      Perfil
                    </Link>
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                      style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left' }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Cerrar Sesión
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <div className="d-flex gap-2">
                  <Link className="btn btn-outline-primary" to="/login">
                    Iniciar Sesión
                  </Link>
                  <Link className="btn btn-primary" to="/register">
                    Registrarse
                  </Link>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;