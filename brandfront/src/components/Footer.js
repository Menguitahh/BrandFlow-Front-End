import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">BrandFlow</h5>
            <p className="text-muted mb-3">
              La plataforma definitiva para crear y gestionar identidades de marca únicas. 
              Transformamos visiones en experiencias visuales impactantes.
            </p>
            <div className="contact-info">
              <p className="mb-1">
                <i className="bi bi-envelope me-2"></i>
                contacto@brandflow.com
              </p>
              <p className="mb-1">
                <i className="bi bi-telephone me-2"></i>
                +1 (555) 123-4567
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Enlaces Rápidos</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/services" className="text-muted text-decoration-none">
                  Servicios
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-muted text-decoration-none">
                  Nosotros
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/blog" className="text-muted text-decoration-none">
                  Blog
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/support" className="text-muted text-decoration-none">
                  Soporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Servicios</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/design" className="text-muted text-decoration-none">
                  Diseño de Marca
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/strategy" className="text-muted text-decoration-none">
                  Estrategia
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/analytics" className="text-muted text-decoration-none">
                  Analytics
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/consulting" className="text-muted text-decoration-none">
                  Consultoría
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Síguenos</h6>
            <div className="social-links mb-3">
              <a href="#" className="text-muted me-3 fs-5">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-muted me-3 fs-5">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-muted me-3 fs-5">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-muted me-3 fs-5">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
            <p className="text-muted small">
              Suscríbete a nuestro newsletter para recibir las últimas noticias y tips de branding.
            </p>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Tu email"
                aria-label="Email para newsletter"
              />
              <button className="btn btn-primary" type="button">
                Suscribirse
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <hr className="my-4" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-muted">
              © 2024 BrandFlow. Todos los derechos reservados.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <Link to="/privacy" className="text-muted text-decoration-none small">
                  Privacidad
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/terms" className="text-muted text-decoration-none small">
                  Términos
                </Link>
              </li>
              <li className="list-inline-item">
                <Link to="/cookies" className="text-muted text-decoration-none small">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 