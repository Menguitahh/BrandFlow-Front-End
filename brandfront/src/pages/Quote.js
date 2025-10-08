import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Quote = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <div className="card border-0 shadow">
              <div className="card-body p-5">
                <i className="bi bi-chat-quote-fill display-1 text-primary mb-4"></i>
                <h2 className="card-title mb-4">Solicitar Cotización</h2>
                <p className="card-text text-muted mb-4">
                  Para solicitar una cotización personalizada, necesitas iniciar sesión o crear una cuenta.
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
          <h1 className="display-4 fw-bold mb-4">Solicitar Cotización</h1>
          <p className="lead text-muted mb-5">
            Describe tu proyecto y obtén una cotización personalizada en menos de 24 horas.
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">Información del Proyecto</h3>
              
              <div className="mb-4">
                <label className="form-label fw-bold">Tipo de Servicio</label>
                <select className="form-select" aria-label="Tipo de servicio">
                  <option value="">Selecciona un servicio</option>
                  <option value="logo">Diseño de Logo</option>
                  <option value="identidad">Identidad Corporativa</option>
                  <option value="web">Diseño Web</option>
                  <option value="marketing">Marketing Digital</option>
                  <option value="material">Material Gráfico</option>
                  <option value="completo">Branding Completo</option>
                  <option value="personalizado">Proyecto Personalizado</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Título del Proyecto</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Logo para mi restaurante"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Descripción Detallada</label>
                <textarea
                  className="form-control"
                  rows="6"
                  placeholder="Describe tu proyecto, objetivos, público objetivo, estilo que buscas, etc."
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Presupuesto Estimado (Opcional)</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Tu presupuesto aproximado"
                  />
                </div>
                <div className="form-text">Nos ayuda a entender tus expectativas y ofrecerte la mejor solución.</div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Fecha de Entrega Deseada</label>
                <input
                  type="date"
                  className="form-control"
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Adjuntar Referencias (Opcional)</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                />
                <div className="form-text">Puedes adjuntar imágenes, logos que te gusten, o documentos con referencias.</div>
              </div>

              <div className="d-grid">
                <Link to="/client/quotes/new" className="btn btn-primary btn-lg">
                  Enviar Solicitud de Cotización
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 bg-light">
            <div className="card-body p-4">
              <h5 className="card-title">¿Por qué elegir BrandFlow?</h5>
              <ul className="list-unstyled">
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Respuesta Rápida:</strong> Cotización en menos de 24 horas
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Precios Competitivos:</strong> Mejor relación calidad-precio
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Equipo Profesional:</strong> Diseñadores con experiencia
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Seguimiento Personal:</strong> Comunicación directa durante el proyecto
                </li>
                <li className="mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <strong>Garantía:</strong> Revisiones ilimitadas hasta quedar satisfecho
                </li>
              </ul>
            </div>
          </div>

          <div className="card border-0 mt-4">
            <div className="card-body p-4">
              <h5 className="card-title">Proceso de Trabajo</h5>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker bg-primary"></div>
                  <div className="timeline-content">
                    <h6>1. Solicitud</h6>
                    <p className="small text-muted">Envías tu solicitud con los detalles</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-primary"></div>
                  <div className="timeline-content">
                    <h6>2. Cotización</h6>
                    <p className="small text-muted">Recibes la cotización en 24 horas</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-primary"></div>
                  <div className="timeline-content">
                    <h6>3. Aprobación</h6>
                    <p className="small text-muted">Aprobas y comenzamos el proyecto</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-marker bg-primary"></div>
                  <div className="timeline-content">
                    <h6>4. Entrega</h6>
                    <p className="small text-muted">Recibes tu proyecto finalizado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;
