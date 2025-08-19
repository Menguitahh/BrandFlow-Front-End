import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Cerrar dropdown cuando se hace clic fuera
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
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
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/services">
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>
          </ul>

          {/* User Menu */}
          <ul className="navbar-nav">
                         {isAuthenticated() ? (
               <li className="nav-item dropdown">
                 <button
                   className="nav-link dropdown-toggle"
                   type="button"
                   id="navbarDropdown"
                   onClick={toggleDropdown}
                   aria-expanded={isDropdownOpen}
                   style={{ background: 'none', border: 'none', color: 'white' }}
                 >
                   <i className="bi bi-person-circle me-1"></i>
                   {currentUser?.name || 'Usuario'}
                 </button>
                 <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
                   <li>
                     <div className="dropdown-header">
                       <i className="bi bi-person-circle me-2"></i>
                       {currentUser?.name || 'Usuario'}
                     </div>
                   </li>
                   <li><hr className="dropdown-divider" /></li>
                   <li>
                     <Link className="dropdown-item" to="/profile">
                       <i className="bi bi-person me-2"></i>
                       Información Personal
                     </Link>
                   </li>
                   <li>
                     <Link className="dropdown-item" to="/settings">
                       <i className="bi bi-gear me-2"></i>
                       Configuración de Cuenta
                     </Link>
                   </li>
                   <li>
                     <Link className="dropdown-item" to="/dashboard">
                       <i className="bi bi-speedometer2 me-2"></i>
                       Dashboard
                     </Link>
                   </li>
                   <li><hr className="dropdown-divider" /></li>
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
               <li className="nav-item dropdown">
                 <button
                   className="nav-link dropdown-toggle"
                   type="button"
                   id="navbarDropdown2"
                   onClick={toggleDropdown}
                   aria-expanded={isDropdownOpen}
                   style={{ background: 'none', border: 'none', color: 'white' }}
                 >
                   <i className="bi bi-person-circle me-1"></i>
                   Account
                 </button>
                 <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown2">
                   <li>
                     <div className="dropdown-header">
                       <i className="bi bi-person-circle me-2"></i>
                       Cuenta
                     </div>
                   </li>
                   <li><hr className="dropdown-divider" /></li>
                   <li>
                     <Link className="dropdown-item" to="/login">
                       <i className="bi bi-box-arrow-in-right me-2"></i>
                       Iniciar Sesión
                     </Link>
                   </li>
                   <li>
                     <Link className="dropdown-item" to="/register">
                       <i className="bi bi-person-plus me-2"></i>
                       Registrarse
                     </Link>
                   </li>
                 </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header; 