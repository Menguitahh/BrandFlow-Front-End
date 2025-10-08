import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicHome = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-vh-100">
      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-r from-dark to-secondary text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                ¿Listo para transformar tu marca?
              </h1>
              <p className="lead mb-4">
                Únete a miles de empresas que ya confían en BrandFlow para crear identidades de marca únicas y memorables.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                {isAuthenticated() ? (
                  <Link to="/client" className="btn btn-light btn-lg px-4">
                    Ir a Mi Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-light btn-lg px-4">
                      COMENZAR GRATIS
                    </Link>
                    <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                      INICIAR SESIÓN
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-image bg-light rounded p-5">
                <i className="bi bi-palette display-1 text-dark"></i>
                <h3 className="mt-3 text-dark">Diseño Profesional</h3>
                <p className="text-muted">Identidad visual que conecta con tu audiencia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold mb-3">¿Por qué elegir BrandFlow?</h2>
              <p className="lead text-muted">Soluciones de branding que impulsan el crecimiento de tu negocio</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-lightning-charge display-4 text-primary mb-3"></i>
                  <h4 className="card-title">Rápido y Eficiente</h4>
                  <p className="card-text text-muted">
                    Procesos optimizados para entregar resultados en tiempo récord sin comprometer la calidad.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-people display-4 text-primary mb-3"></i>
                  <h4 className="card-title">Equipo Profesional</h4>
                  <p className="card-text text-muted">
                    Diseñadores expertos con años de experiencia en branding y diseño corporativo.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-graph-up display-4 text-primary mb-3"></i>
                  <h4 className="card-title">Resultados Comprobados</h4>
                  <p className="card-text text-muted">
                    Más de 1000 marcas transformadas con resultados medibles en su crecimiento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold mb-3">Nuestros Servicios</h2>
              <p className="lead text-muted">Soluciones completas para tu identidad de marca</p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-palette-fill display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Diseño de Logo</h5>
                  <p className="card-text text-muted small">
                    Logotipos únicos y memorables que representan la esencia de tu marca.
                  </p>
                  {!isAuthenticated() && (
                    <Link to="/login" className="btn btn-primary btn-sm">
                      Solicitar Cotización
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-building display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Identidad Corporativa</h5>
                  <p className="card-text text-muted small">
                    Manual de marca completo con aplicaciones en todos los medios.
                  </p>
                  {!isAuthenticated() && (
                    <Link to="/login" className="btn btn-primary btn-sm">
                      Solicitar Cotización
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-globe display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Diseño Web</h5>
                  <p className="card-text text-muted small">
                    Sitios web modernos y responsivos que reflejan tu marca.
                  </p>
                  {!isAuthenticated() && (
                    <Link to="/login" className="btn btn-primary btn-sm">
                      Solicitar Cotización
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="bi bi-megaphone display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Marketing Digital</h5>
                  <p className="card-text text-muted small">
                    Estrategias de marketing que potencian tu presencia online.
                  </p>
                  {!isAuthenticated() && (
                    <Link to="/login" className="btn btn-primary btn-sm">
                      Solicitar Cotización
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            {isAuthenticated() ? (
              <Link to="/client/services" className="btn btn-outline-primary btn-lg">
                Ver Todos los Servicios
              </Link>
            ) : (
              <Link to="/login" className="btn btn-outline-primary btn-lg">
                Iniciar Sesión para Ver Servicios
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 fw-bold mb-3">¿Listo para comenzar?</h2>
              <p className="lead mb-4">
                Obtén una cotización personalizada para tu proyecto de branding en menos de 24 horas.
              </p>
              {isAuthenticated() ? (
                <Link to="/client/quotes/new" className="btn btn-light btn-lg px-5">
                  Nueva Cotización
                </Link>
              ) : (
                <Link to="/register" className="btn btn-light btn-lg px-5">
                  Comenzar Ahora
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>BrandFlow</h5>
              <p className="text-muted">Transformando marcas, impulsando negocios.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-muted mb-0">&copy; 2024 BrandFlow. Todos los derechos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicHome;
