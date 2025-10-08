import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Services = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="card border-0 shadow">
              <div className="card-body p-5">
                <i className="bi bi-lock-fill display-1 text-primary mb-4"></i>
                <h2 className="card-title mb-4">Acceso Requerido</h2>
                <p className="card-text text-muted mb-4">
                  Para ver nuestros servicios y solicitar cotizaciones, necesitas iniciar sesión o crear una cuenta.
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  <Link to="/login" className="btn btn-primary">
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" className="btn btn-outline-primary">
                    Crear Cuenta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-4 fw-bold mb-4">Nuestros Servicios</h1>
          <p className="lead text-muted mb-5">
            Descubre todos los servicios de branding que ofrecemos y solicita una cotización personalizada.
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <i className="bi bi-palette-fill display-4 text-primary mb-3"></i>
              <h5 className="card-title">Diseño de Logo</h5>
              <p className="card-text text-muted">
                Logotipos únicos y memorables que representan la esencia de tu marca. Incluye 3 opciones de diseño y revisiones ilimitadas.
              </p>
              <ul className="list-unstyled">
                <li><i className="bi bi-check text-success me-2"></i>3 opciones de diseño</li>
                <li><i className="bi bi-check text-success me-2"></i>Revisiones ilimitadas</li>
                <li><i className="bi bi-check text-success me-2"></i>Formatos vectoriales</li>
                <li><i className="bi bi-check text-success me-2"></i>Manual básico de uso</li>
              </ul>
              <div className="mt-auto">
                <Link to="/client/quotes/new" className="btn btn-primary">
                  Solicitar Cotización
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <i className="bi bi-building display-4 text-primary mb-3"></i>
              <h5 className="card-title">Identidad Corporativa</h5>
              <p className="card-text text-muted">
                Manual de marca completo con aplicaciones en todos los medios. Incluye logo, colores, tipografías y aplicaciones.
              </p>
              <ul className="list-unstyled">
                <li><i className="bi bi-check text-success me-2"></i>Logo + variaciones</li>
                <li><i className="bi bi-check text-success me-2"></i>Paleta de colores</li>
                <li><i className="bi bi-check text-success me-2"></i>Tipografías corporativas</li>
                <li><i className="bi bi-check text-success me-2"></i>Manual completo de marca</li>
              </ul>
              <div className="mt-auto">
                <Link to="/client/quotes/new" className="btn btn-primary">
                  Solicitar Cotización
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <i className="bi bi-globe display-4 text-primary mb-3"></i>
              <h5 className="card-title">Diseño Web</h5>
              <p className="card-text text-muted">
                Sitios web modernos y responsivos que reflejan tu marca. Optimizados para SEO y conversión.
              </p>
              <ul className="list-unstyled">
                <li><i className="bi bi-check text-success me-2"></i>Diseño responsivo</li>
                <li><i className="bi bi-check text-success me-2"></i>Optimización SEO</li>
                <li><i className="bi bi-check text-success me-2"></i>Formularios de contacto</li>
                <li><i className="bi bi-check text-success me-2"></i>Panel de administración</li>
              </ul>
              <div className="mt-auto">
                <Link to="/client/quotes/new" className="btn btn-primary">
                  Solicitar Cotización
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <i className="bi bi-megaphone display-4 text-primary mb-3"></i>
              <h5 className="card-title">Marketing Digital</h5>
              <p className="card-text text-muted">
                Estrategias de marketing digital que potencian tu presencia online y generan leads calificados.
              </p>
              <ul className="list-unstyled">
                <li><i className="bi bi-check text-success me-2"></i>Estrategia de contenido</li>
                <li><i className="bi bi-check text-success me-2"></i>Redes sociales</li>
                <li><i className="bi bi-check text-success me-2"></i>Publicidad online</li>
                <li><i className="bi bi-check text-success me-2"></i>Análisis y reportes</li>
              </ul>
              <div className="mt-auto">
                <Link to="/client/quotes/new" className="btn btn-primary">
                  Solicitar Cotización
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <i className="bi bi-file-earmark-text display-4 text-primary mb-3"></i>
              <h5 className="card-title">Material Gráfico</h5>
              <p className="card-text text-muted">
                Diseño de material publicitario, papelería corporativa y elementos gráficos para tu marca.
              </p>
              <ul className="list-unstyled">
                <li><i className="bi bi-check text-success me-2"></i>Papelería corporativa</li>
                <li><i className="bi bi-check text-success me-2"></i>Material publicitario</li>
                <li><i className="bi bi-check text-success me-2"></i>Presentaciones</li>
                <li><i className="bi bi-check text-success me-2"></i>Banners y displays</li>
              </ul>
              <div className="mt-auto">
                <Link to="/client/quotes/new" className="btn btn-primary">
                  Solicitar Cotización
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <i className="bi bi-shop display-4 text-primary mb-3"></i>
              <h5 className="card-title">Branding Completo</h5>
              <p className="card-text text-muted">
                Solución integral de branding que incluye todos los elementos necesarios para tu marca.
              </p>
              <ul className="list-unstyled">
                <li><i className="bi bi-check text-success me-2"></i>Identidad completa</li>
                <li><i className="bi bi-check text-success me-2"></i>Sitio web</li>
                <li><i className="bi bi-check text-success me-2"></i>Material gráfico</li>
                <li><i className="bi bi-check text-success me-2"></i>Estrategia de marca</li>
              </ul>
              <div className="mt-auto">
                <Link to="/client/quotes/new" className="btn btn-primary">
                  Solicitar Cotización
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12 text-center">
          <div className="card border-0 bg-primary text-white">
            <div className="card-body p-5">
              <h3 className="card-title">¿No encuentras lo que buscas?</h3>
              <p className="card-text">
                Contáctanos para una cotización personalizada según las necesidades específicas de tu proyecto.
              </p>
              <Link to="/client/quotes/new" className="btn btn-light">
                Cotización Personalizada
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
