import React from 'react';
import { Link } from 'react-router-dom';

const PublicHome = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section text-white position-relative overflow-hidden">
        <div className="hero-bg position-absolute w-100 h-100" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          zIndex: -1
        }}></div>
        
        {/* Animated background elements */}
        <div className="hero-shapes position-absolute w-100 h-100" style={{ zIndex: 0 }}>
          <div className="shape shape-1 position-absolute rounded-circle" style={{
            width: '300px',
            height: '300px',
            background: 'rgba(255,255,255,0.1)',
            top: '10%',
            left: '10%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div className="shape shape-2 position-absolute rounded-circle" style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.05)',
            top: '60%',
            right: '15%',
            animation: 'float 8s ease-in-out infinite reverse'
          }}></div>
          <div className="shape shape-3 position-absolute rounded-circle" style={{
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.08)',
            bottom: '20%',
            left: '60%',
            animation: 'float 7s ease-in-out infinite'
          }}></div>
        </div>

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <div className="hero-content">
                <div className="badge bg-white bg-opacity-20 text-white px-3 py-2 rounded-pill mb-4">
                  <i className="bi bi-star-fill me-2"></i>
                  #1 en Diseño de Marcas
                </div>
                
                <h1 className="display-2 fw-bold mb-4" style={{ 
                  background: 'linear-gradient(45deg, #fff, #f0f8ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: '1.2'
                }}>
                  Transforma tu marca en una experiencia memorable
                </h1>
                
                <p className="lead mb-4 text-white-75" style={{ fontSize: '1.25rem' }}>
                  Creamos identidades visuales únicas que conectan emocionalmente con tu audiencia y 
                  impulsan el crecimiento de tu negocio con estrategias de branding innovadoras.
                </p>
                
                <div className="hero-stats d-flex gap-4 mb-5">
                  <div className="stat-item">
                    <div className="h3 fw-bold text-white">500+</div>
                    <small className="text-white-50">Proyectos Completados</small>
                  </div>
                  <div className="stat-item">
                    <div className="h3 fw-bold text-white">98%</div>
                    <small className="text-white-50">Satisfacción Cliente</small>
                  </div>
                  <div className="stat-item">
                    <div className="h3 fw-bold text-white">24h</div>
                    <small className="text-white-50">Tiempo Respuesta</small>
                  </div>
                </div>
                
                <div className="hero-buttons d-flex flex-wrap gap-3">
                  <Link to="/services" className="btn btn-light btn-lg px-4 py-3 rounded-pill shadow-lg">
                    <i className="bi bi-arrow-right me-2"></i>
                    Explorar Servicios
                  </Link>
                  <Link to="/quote" className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill border-2">
                    <i className="bi bi-chat-quote me-2"></i>
                    Solicitar Cotización
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="hero-visual text-center">
                <div className="hero-card-container position-relative">
                  <div className="hero-main-card bg-white rounded-4 shadow-lg p-4 position-relative" style={{ transform: 'rotate(-5deg)' }}>
                    <div className="card-header bg-primary bg-gradient rounded-3 p-3 mb-3">
                      <div className="d-flex align-items-center">
                        <div className="brand-icon bg-white rounded-circle p-2 me-3">
                          <i className="bi bi-palette text-primary fs-4"></i>
                        </div>
                        <div>
                          <h6 className="text-white mb-0">BrandFlow</h6>
                          <small className="text-white-50">Diseño Profesional</small>
                        </div>
                      </div>
                    </div>
                    <div className="brand-preview">
                      <div className="logo-placeholder bg-light rounded-3 p-4 mb-3">
                        <div className="logo-design d-flex align-items-center justify-content-center">
                          <div className="logo-circle bg-primary rounded-circle me-3" style={{ width: '40px', height: '40px' }}></div>
                          <div>
                            <div className="logo-text bg-dark rounded" style={{ width: '80px', height: '8px', marginBottom: '4px' }}></div>
                            <div className="logo-text bg-dark rounded" style={{ width: '60px', height: '6px' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="color-palette d-flex gap-2 justify-content-center">
                        <div className="color-swatch rounded" style={{ width: '20px', height: '20px', backgroundColor: '#667eea' }}></div>
                        <div className="color-swatch rounded" style={{ width: '20px', height: '20px', backgroundColor: '#764ba2' }}></div>
                        <div className="color-swatch rounded" style={{ width: '20px', height: '20px', backgroundColor: '#f093fb' }}></div>
                        <div className="color-swatch rounded" style={{ width: '20px', height: '20px', backgroundColor: '#f5576c' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating cards */}
                  <div className="floating-card bg-white rounded-3 shadow position-absolute" style={{
                    top: '10%',
                    right: '-10%',
                    transform: 'rotate(10deg)',
                    padding: '1rem',
                    width: '120px',
                    animation: 'float 3s ease-in-out infinite'
                  }}>
                    <i className="bi bi-heart-fill text-danger fs-5"></i>
                    <small className="d-block text-muted">Cliente Feliz</small>
                  </div>
                  
                  <div className="floating-card bg-success text-white rounded-3 shadow position-absolute" style={{
                    bottom: '20%',
                    left: '-15%',
                    transform: 'rotate(-8deg)',
                    padding: '1rem',
                    width: '100px',
                    animation: 'float 4s ease-in-out infinite reverse'
                  }}>
                    <i className="bi bi-check-circle-fill fs-5"></i>
                    <small className="d-block">Proyecto OK</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-4 fw-bold mb-4">Nuestros Servicios</h2>
              <p className="lead text-muted">
                Ofrecemos soluciones completas de branding para llevar tu marca al siguiente nivel
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="service-card h-100 bg-white rounded-4 shadow-sm border-0 p-4 text-center hover-lift">
                <div className="service-icon bg-primary bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-palette text-white fs-2"></i>
                </div>
                <h5 className="fw-bold mb-3">Diseño de Logo</h5>
                <p className="text-muted mb-4">Logotipos únicos y memorables que representan la esencia de tu marca</p>
                <Link to="/services" className="btn btn-outline-primary rounded-pill">
                  Ver Detalles <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="service-card h-100 bg-white rounded-4 shadow-sm border-0 p-4 text-center hover-lift">
                <div className="service-icon bg-success bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-building text-white fs-2"></i>
                </div>
                <h5 className="fw-bold mb-3">Identidad Corporativa</h5>
                <p className="text-muted mb-4">Manual de marca completo con aplicaciones en todos los medios</p>
                <Link to="/services" className="btn btn-outline-success rounded-pill">
                  Ver Detalles <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
            
            <div className="col-lg-4 col-md-6">
              <div className="service-card h-100 bg-white rounded-4 shadow-sm border-0 p-4 text-center hover-lift">
                <div className="service-icon bg-info bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-globe text-white fs-2"></i>
                </div>
                <h5 className="fw-bold mb-3">Diseño Web</h5>
                <p className="text-muted mb-4">Sitios web modernos y responsivos que reflejan tu marca</p>
                <Link to="/services" className="btn btn-outline-info rounded-pill">
                  Ver Detalles <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">¿Por qué elegir BrandFlow?</h2>
              <p className="lead text-muted mb-5">
                Somos más que una agencia de diseño. Somos tu socio estratégico para crear una marca que genere conexiones reales.
              </p>
              
              <div className="features-list">
                <div className="feature-item d-flex align-items-start mb-4">
                  <div className="feature-icon bg-primary bg-gradient rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', minWidth: '50px' }}>
                    <i className="bi bi-lightning-charge text-white"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-2">Entrega Rápida</h6>
                    <p className="text-muted mb-0">Proyectos completados en tiempo récord sin comprometer la calidad</p>
                  </div>
                </div>
                
                <div className="feature-item d-flex align-items-start mb-4">
                  <div className="feature-icon bg-success bg-gradient rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', minWidth: '50px' }}>
                    <i className="bi bi-people text-white"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-2">Equipo Experto</h6>
                    <p className="text-muted mb-0">Diseñadores profesionales con años de experiencia en branding</p>
                  </div>
                </div>
                
                <div className="feature-item d-flex align-items-start mb-4">
                  <div className="feature-icon bg-warning bg-gradient rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', minWidth: '50px' }}>
                    <i className="bi bi-shield-check text-white"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-2">Garantía de Calidad</h6>
                    <p className="text-muted mb-0">Revisiones ilimitadas hasta que quedes 100% satisfecho</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="stats-grid">
                <div className="row g-3">
                  <div className="col-6">
                    <div className="stat-card bg-white rounded-4 p-4 text-center shadow-sm">
                      <div className="stat-number text-primary fw-bold fs-1">500+</div>
                      <div className="stat-label text-muted">Proyectos</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-card bg-white rounded-4 p-4 text-center shadow-sm">
                      <div className="stat-number text-success fw-bold fs-1">98%</div>
                      <div className="stat-label text-muted">Satisfacción</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-card bg-white rounded-4 p-4 text-center shadow-sm">
                      <div className="stat-number text-info fw-bold fs-1">24h</div>
                      <div className="stat-label text-muted">Respuesta</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="stat-card bg-white rounded-4 p-4 text-center shadow-sm">
                      <div className="stat-number text-warning fw-bold fs-1">5★</div>
                      <div className="stat-label text-muted">Calificación</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 position-relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="container position-relative text-center">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="display-4 fw-bold text-white mb-4">
                ¿Listo para comenzar tu proyecto?
              </h2>
              <p className="lead text-white-75 mb-5">
                Únete a cientos de empresas que ya confían en nosotros para crear marcas excepcionales
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center">
                <Link to="/quote" className="btn btn-light btn-lg px-5 py-3 rounded-pill shadow-lg">
                  <i className="bi bi-chat-quote me-2"></i>
                  Solicitar Cotización Gratis
                </Link>
                <Link to="/services" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill border-2">
                  <i className="bi bi-eye me-2"></i>
                  Ver Nuestros Trabajos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default PublicHome;