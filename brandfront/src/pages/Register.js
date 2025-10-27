import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    username: { available: null, checking: false },
    email: { available: null, checking: false },
    password: { valid: null, requirements: {} }
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validar teléfono solo números
    if (name === 'phone') {
      const phoneNumber = value.replace(/\D/g, ''); // Solo números
      setFormData(prev => ({
        ...prev,
        [name]: phoneNumber
      }));
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validación en tiempo real
    if (name === 'password') {
      validatePassword(value);
    }
  };

  // Validación de contraseña
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    };
    
    const valid = Object.values(requirements).every(req => req);
    
    setValidation(prev => ({
      ...prev,
      password: { valid, requirements }
    }));
  };

  // Verificar disponibilidad de username
  const checkUsernameAvailability = async (username) => {
    if (username.length < 3) return;
    
    setValidation(prev => ({
      ...prev,
      username: { available: null, checking: true }
    }));
    
    try {
      const response = await authAPI.checkUsername(username);
      setValidation(prev => ({
        ...prev,
        username: { available: response.available, checking: false }
      }));
    } catch (error) {
      setValidation(prev => ({
        ...prev,
        username: { available: false, checking: false }
      }));
    }
  };

  // Verificar disponibilidad de email
  const checkEmailAvailability = async (email) => {
    if (!email.includes('@')) return;
    
    setValidation(prev => ({
      ...prev,
      email: { available: null, checking: true }
    }));
    
    try {
      const response = await authAPI.checkEmail(email);
      setValidation(prev => ({
        ...prev,
        email: { available: response.available, checking: false }
      }));
    } catch (error) {
      setValidation(prev => ({
        ...prev,
        email: { available: false, checking: false }
      }));
    }
  };

  // Debounce para evitar demasiadas llamadas a la API
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.username) {
        checkUsernameAvailability(formData.username);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.email) {
        checkEmailAvailability(formData.email);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('El nombre de usuario es requerido');
      return false;
    }

    if (validation.username.available === false) {
      setError('El nombre de usuario seleccionado no está disponible');
      return false;
    }

    if (!formData.email.trim()) {
      setError('El email es requerido');
      return false;
    }

    if (validation.email.available === false) {
      setError('El email seleccionado ya está registrado');
      return false;
    }

    if (!validation.password.valid) {
      setError('La contraseña no cumple con los requisitos mínimos');
      return false;
    }
    
    if (formData.password !== formData.password2) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // El backend asigna automáticamente el rol 'cliente' a nuevos usuarios
      await register(formData);
      
      // Redirigir según el rol del usuario (siempre será 'cliente' para nuevos registros)
      navigate('/client');
    } catch (err) {
      // Manejo mejorado de errores del backend
      const errorData = err.response?.data || {};
      const errorMessage = errorData.username || errorData.email || errorData.password || errorData.detail || err.message || 'Error al registrarse';
      
      setError(errorMessage);
      
      // Enfocar el campo correspondiente si hay error específico
      if (errorData.username) {
        document.getElementById('username')?.focus();
      } else if (errorData.email) {
        document.getElementById('email')?.focus();
      } else if (errorData.password) {
        document.getElementById('password')?.focus();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page position-relative min-vh-100 d-flex align-items-center overflow-hidden">
      {/* Background with gradient and animated shapes */}
      <div className="register-bg position-absolute w-100 h-100" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        zIndex: -1
      }}></div>
      
      {/* Animated background elements */}
      <div className="register-shapes position-absolute w-100 h-100" style={{ zIndex: 0 }}>
        <div className="shape shape-1 position-absolute rounded-circle" style={{
          width: '250px',
          height: '250px',
          background: 'rgba(255,255,255,0.08)',
          top: '15%',
          right: '10%',
          animation: 'float 7s ease-in-out infinite'
        }}></div>
        <div className="shape shape-2 position-absolute rounded-circle" style={{
          width: '180px',
          height: '180px',
          background: 'rgba(255,255,255,0.06)',
          bottom: '20%',
          left: '8%',
          animation: 'float 9s ease-in-out infinite reverse'
        }}></div>
        <div className="shape shape-3 position-absolute rounded-circle" style={{
          width: '120px',
          height: '120px',
          background: 'rgba(255,255,255,0.1)',
          top: '50%',
          left: '80%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
      </div>

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0 bg-opacity-95 backdrop-blur" style={{ 
              backgroundColor: '#2d3748',
              borderColor: '#4a5568'
            }}>
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary mb-2">BrandFlow</h2>
                  <p className="text-muted">Crea tu cuenta</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Register Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      <i className="bi bi-person me-2"></i>
                      Nombre de usuario *
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        validation.username.available === false ? 'is-invalid' :
                        validation.username.available === true ? 'is-valid' : ''
                      }`}
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      placeholder="Tu nombre de usuario"
                      style={{
                        backgroundColor: '#4a5568',
                        color: '#ffffff',
                        borderColor: '#718096'
                      }}
                    />
                    {validation.username.checking && (
                      <div className="form-text">
                        <i className="bi bi-hourglass-split me-1"></i>
                        Verificando disponibilidad...
                      </div>
                    )}
                    {validation.username.available === false && (
                      <div className="invalid-feedback">
                        <i className="bi bi-x-circle me-1"></i>
                        Este nombre de usuario ya está en uso
                      </div>
                    )}
                    {validation.username.available === true && (
                      <div className="valid-feedback">
                        <i className="bi bi-check-circle me-1"></i>
                        Nombre de usuario disponible
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <i className="bi bi-envelope me-2"></i>
                      Email *
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        validation.email.available === false ? 'is-invalid' :
                        validation.email.available === true ? 'is-valid' : ''
                      }`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="tu@email.com"
                      style={{
                        backgroundColor: '#4a5568',
                        color: '#ffffff',
                        borderColor: '#718096'
                      }}
                    />
                    {validation.email.checking && (
                      <div className="form-text">
                        <i className="bi bi-hourglass-split me-1"></i>
                        Verificando disponibilidad...
                      </div>
                    )}
                    {validation.email.available === false && (
                      <div className="invalid-feedback">
                        <i className="bi bi-x-circle me-1"></i>
                        Este email ya está registrado
                      </div>
                    )}
                    {validation.email.available === true && (
                      <div className="valid-feedback">
                        <i className="bi bi-check-circle me-1"></i>
                        Email disponible
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="first_name" className="form-label">
                        <i className="bi bi-person me-2"></i>
                        Nombre
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="Tu nombre"
                        style={{
                          backgroundColor: '#4a5568',
                          color: '#ffffff',
                          borderColor: '#718096'
                        }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="last_name" className="form-label">
                        <i className="bi bi-person me-2"></i>
                        Apellido
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Tu apellido"
                        style={{
                          backgroundColor: '#4a5568',
                          color: '#ffffff',
                          borderColor: '#718096'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      <i className="bi bi-telephone me-2"></i>
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Solo números (ej: 123456789)"
                      style={{
                        backgroundColor: '#4a5568',
                        color: '#ffffff',
                        borderColor: '#718096'
                      }}
                    />
                    <small className="text-muted">Solo se permiten números</small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">
                      <i className="bi bi-geo-alt me-2"></i>
                      Dirección
                    </label>
                    <textarea
                      className="form-control"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2"
                      placeholder="Tu dirección"
                      style={{
                        backgroundColor: '#4a5568',
                        color: '#ffffff',
                        borderColor: '#718096'
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock me-2"></i>
                      Contraseña *
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        validation.password.valid === false ? 'is-invalid' :
                        validation.password.valid === true ? 'is-valid' : ''
                      }`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Mínimo 6 caracteres"
                      style={{
                        backgroundColor: '#4a5568',
                        color: '#ffffff',
                        borderColor: '#718096'
                      }}
                    />
                    {formData.password && (
                      <div className="mt-2">
                        <small className="text-muted">Requisitos de contraseña:</small>
                        <ul className="list-unstyled mt-1">
                          <li className={`small ${validation.password.requirements.length ? 'text-success' : 'text-danger'}`}>
                            <i className={`bi ${validation.password.requirements.length ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                            Al menos 6 caracteres
                          </li>
                          <li className={`small ${validation.password.requirements.uppercase ? 'text-success' : 'text-danger'}`}>
                            <i className={`bi ${validation.password.requirements.uppercase ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                            Una letra mayúscula
                          </li>
                          <li className={`small ${validation.password.requirements.lowercase ? 'text-success' : 'text-danger'}`}>
                            <i className={`bi ${validation.password.requirements.lowercase ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                            Una letra minúscula
                          </li>
                          <li className={`small ${validation.password.requirements.number ? 'text-success' : 'text-danger'}`}>
                            <i className={`bi ${validation.password.requirements.number ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                            Un número
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password2" className="form-label">
                      <i className="bi bi-lock-fill me-2"></i>
                      Confirmar contraseña *
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password2"
                      name="password2"
                      value={formData.password2}
                      onChange={handleChange}
                      required
                      placeholder="Repite tu contraseña"
                      style={{
                        backgroundColor: '#4a5568',
                        color: '#ffffff',
                        borderColor: '#718096'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Crear Cuenta
                      </>
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-decoration-none">
                      Inicia sesión aquí
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 