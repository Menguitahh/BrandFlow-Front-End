import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { brandingAPI } from '../api/branding';

const Quote = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    service: '',
    title: '',
    description: '',
    budget: '',
    deliveryDate: '',
    files: null
  });
  // Servicios estáticos para usuarios no autenticados
  const staticServices = [
    { id: 1, name: "Diseño de Logo" },
    { id: 2, name: "Identidad Corporativa" },
    { id: 3, name: "Diseño Web" },
    { id: 4, name: "Marketing Digital" },
    { id: 5, name: "Material Gráfico" },
    { id: 6, name: "Branding Completo" }
  ];

  const [services, setServices] = useState(staticServices);
  const [loading, setLoading] = useState(false);
  const [servicesLoading] = useState(false);
  const [error] = useState('');

  useEffect(() => {
    // Si el usuario está autenticado, cargar servicios desde la API
    if (isAuthenticated()) {
      const fetchServices = async () => {
        try {
          const response = await brandingAPI.services.list();
          setServices(response);
          
          // Verificar si hay parámetros en la URL para preseleccionar un servicio
          const urlParams = new URLSearchParams(window.location.search);
          const serviceId = urlParams.get('service');
          
          if (serviceId && response.length > 0) {
            const selectedService = response.find(s => s.id === parseInt(serviceId));
            if (selectedService) {
              setFormData(prev => ({
                ...prev,
                service: serviceId,
                title: `Cotización para ${selectedService.name}`,
                description: `Solicito una cotización para el servicio: ${selectedService.name}`
              }));
            }
          }
        } catch (error) {
          setError('Error al cargar los servicios');
          console.error('Error:', error);
        } finally {
          setServicesLoading(false);
        }
      };

      setServicesLoading(true);
      fetchServices();
    } else {
      // Para usuarios no autenticados, usar servicios estáticos
      setServices(staticServices);
      
      // Verificar si hay parámetros en la URL para preseleccionar un servicio
      const urlParams = new URLSearchParams(window.location.search);
      const serviceId = urlParams.get('service');
      
      if (serviceId) {
        const selectedService = staticServices.find(s => s.id === parseInt(serviceId));
        if (selectedService) {
          setFormData(prev => ({
            ...prev,
            service: serviceId,
            title: `Cotización para ${selectedService.name}`,
            description: `Solicito una cotización para el servicio: ${selectedService.name}`
          }));
        }
      }
    }
  }, [isAuthenticated, staticServices]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.service || !formData.title || !formData.description) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
    }

    // Verificar autenticación antes de enviar
    if (!isAuthenticated()) {
      alert('Para enviar la cotización, necesitas crear una cuenta.');
      navigate('/register');
      return;
    }

    setLoading(true);
    try {
      const quoteData = {
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget) || 0,
        service: parseInt(formData.service)
      };

      await brandingAPI.quotes.create(quoteData);
      alert('¡Cotización enviada exitosamente! El administrador la revisará pronto.');
      navigate('/client/quotes');
    } catch (error) {
      console.error('Error enviando cotización:', error);
      alert('Error al enviar la cotización. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="quote-page">
      {/* Hero Section with Background */}
      <section className="quote-hero position-relative py-5 text-white overflow-hidden">
        <div className="quote-hero-bg position-absolute w-100 h-100" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          zIndex: -1
        }}></div>
        
        {/* Animated background elements */}
        <div className="quote-shapes position-absolute w-100 h-100" style={{ zIndex: 0 }}>
          <div className="shape shape-1 position-absolute rounded-circle" style={{
            width: '180px',
            height: '180px',
            background: 'rgba(255,255,255,0.08)',
            top: '25%',
            right: '8%',
            animation: 'float 7s ease-in-out infinite'
          }}></div>
          <div className="shape shape-2 position-absolute rounded-circle" style={{
            width: '120px',
            height: '120px',
            background: 'rgba(255,255,255,0.06)',
            bottom: '25%',
            left: '12%',
            animation: 'float 9s ease-in-out infinite reverse'
          }}></div>
        </div>

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-3 fw-bold mb-4">Solicitar Cotización</h1>
              <p className="lead mb-0" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Describe tu proyecto y obtén una cotización personalizada en menos de 24 horas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-5 bg-light">
        <div className="container">

      <div className="row">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">Información del Proyecto</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold">Tipo de Servicio *</label>
                  <select 
                    className="form-select" 
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un servicio</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Título del Proyecto *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ej: Logo para mi restaurante"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Descripción Detallada *</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Describe tu proyecto, objetivos, público objetivo, estilo que buscas, etc."
                    required
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Presupuesto Estimado (Opcional)</label>
                  <div className="input-group">
                    <span className="input-group-text">€</span>
                    <input
                      type="number"
                      className="form-control"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="Tu presupuesto aproximado"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="form-text">Nos ayuda a entender tus expectativas y ofrecerte la mejor solución.</div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Fecha de Entrega Deseada</label>
                  <input
                    type="date"
                    className="form-control"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Adjuntar Referencias (Opcional)</label>
                  <input
                    type="file"
                    className="form-control"
                    name="files"
                    onChange={handleChange}
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <div className="form-text">Puedes adjuntar imágenes, logos que te gusten, o documentos con referencias.</div>
                </div>

                <div className="d-grid">
                  {isAuthenticated() ? (
                    <button 
                      type="submit" 
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Enviando...
                        </>
                      ) : (
                        'Enviar Solicitud de Cotización'
                      )}
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="alert alert-info mb-3">
                        <i className="bi bi-info-circle me-2"></i>
                        Para enviar tu solicitud, necesitas crear una cuenta
                      </div>
                      <div className="d-grid gap-2">
                        <Link to="/register" className="btn btn-primary btn-lg">
                          Crear Cuenta
                        </Link>
                        <Link to="/login" className="btn btn-outline-primary btn-lg">
                          Ya tengo cuenta
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </form>
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
      </section>
    </div>
  );
};

export default Quote;