import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(formData.identifier, formData.password);
      
      // Redirigir según el rol del usuario
      const userRole = user.role || user.roles;
      switch (userRole) {
        case 'admin':
          navigate('/admin');
          break;
        case 'diseñador':
          navigate('/designer');
          break;
        case 'cliente':
          navigate('/client');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page position-relative min-vh-100 d-flex align-items-center overflow-hidden">
      {/* Background with gradient and animated shapes */}
      <div className="login-bg position-absolute w-100 h-100" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        zIndex: -1
      }}></div>
      
      {/* Animated background elements */}
      <div className="login-shapes position-absolute w-100 h-100" style={{ zIndex: 0 }}>
        <div className="shape shape-1 position-absolute rounded-circle" style={{
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          top: '20%',
          left: '10%',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        <div className="shape shape-2 position-absolute rounded-circle" style={{
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.05)',
          top: '60%',
          right: '15%',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>
        <div className="shape shape-3 position-absolute rounded-circle" style={{
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.08)',
          bottom: '30%',
          left: '70%',
          animation: 'float 7s ease-in-out infinite'
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
                  <p className="text-muted">Inicia sesión en tu cuenta</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="identifier" className="form-label">
                      <i className="bi bi-person me-2"></i>
                      Usuario o Email
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="identifier"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      required
                      placeholder="usuario o tu@email.com"
                      style={{
                        backgroundColor: '#4a5568',
                        color: '#ffffff',
                        borderColor: '#718096'
                      }}
                    />
                    <div className="form-text">
                      Puedes usar tu nombre de usuario o tu dirección de email
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <i className="bi bi-lock me-2"></i>
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Tu contraseña"
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
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Iniciar Sesión
                      </>
                    )}
                  </button>
                </form>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="text-decoration-none">
                      Regístrate aquí
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

export default Login; 