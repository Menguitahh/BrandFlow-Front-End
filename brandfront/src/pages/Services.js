import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { brandingAPI } from '../api/branding';

const Services = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showCustomizeForm, setShowCustomizeForm] = useState(false);
  const [customDetails, setCustomDetails] = useState({
    title: '',
    description: '',
    budget: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Datos de los servicios
  const services = [
    {
      id: 1,
      name: "Diseño de Logo",
      icon: "bi-palette-fill",
      description: "Logotipos únicos y memorables que representan la esencia de tu marca. Incluye 3 opciones de diseño y revisiones ilimitadas.",
      features: [
        "3 opciones de diseño",
        "Revisiones ilimitadas", 
        "Formatos vectoriales",
        "Manual básico de uso"
      ],
      basePrice: "Desde €150",
      deliveryTime: "5-7 días hábiles",
      category: "Diseño"
    },
    {
      id: 2,
      name: "Identidad Corporativa",
      icon: "bi-building",
      description: "Manual de marca completo con aplicaciones en todos los medios. Incluye logo, colores, tipografías y aplicaciones.",
      features: [
        "Logo + variaciones",
        "Paleta de colores",
        "Tipografías corporativas",
        "Manual completo de marca"
      ],
      basePrice: "Desde €400",
      deliveryTime: "10-14 días hábiles",
      category: "Branding"
    },
    {
      id: 3,
      name: "Diseño Web",
      icon: "bi-globe",
      description: "Sitios web modernos y responsivos que reflejan tu marca. Optimizados para SEO y conversión.",
      features: [
        "Diseño responsivo",
        "Optimización SEO",
        "Formularios de contacto",
        "Panel de administración"
      ],
      basePrice: "Desde €800",
      deliveryTime: "15-20 días hábiles",
      category: "Desarrollo"
    },
    {
      id: 4,
      name: "Marketing Digital",
      icon: "bi-megaphone",
      description: "Estrategias de marketing digital que potencian tu presencia online y generan leads calificados.",
      features: [
        "Estrategia de contenido",
        "Redes sociales",
        "Publicidad online",
        "Análisis y reportes"
      ],
      basePrice: "Desde €300",
      deliveryTime: "7-10 días hábiles",
      category: "Marketing"
    },
    {
      id: 5,
      name: "Material Gráfico",
      icon: "bi-file-earmark-text",
      description: "Diseño de material publicitario, papelería corporativa y elementos gráficos para tu marca.",
      features: [
        "Papelería corporativa",
        "Material publicitario",
        "Presentaciones",
        "Banners y displays"
      ],
      basePrice: "Desde €200",
      deliveryTime: "3-5 días hábiles",
      category: "Diseño"
    },
    {
      id: 6,
      name: "Branding Completo",
      icon: "bi-shop",
      description: "Solución integral de branding que incluye todos los elementos necesarios para tu marca.",
      features: [
        "Identidad completa",
        "Sitio web",
        "Material gráfico",
        "Estrategia de marca"
      ],
      basePrice: "Desde €1200",
      deliveryTime: "20-25 días hábiles",
      category: "Branding"
    }
  ];

  const handleServiceClick = (service) => {
    // Si el usuario no está autenticado, redirigir directamente al registro
    if (!isAuthenticated()) {
      navigate('/register');
      return;
    }
    
    setSelectedService(service);
    setShowServiceModal(true);
    setShowCustomizeForm(false);
    setCustomDetails({
      title: `${service.name} - Personalizado`,
      description: service.description,
      budget: service.basePrice.replace('Desde €', '')
    });
  };

  const handleMakeOrder = async () => {
    console.log('🔍 handleMakeOrder llamado');
    console.log('🔍 selectedService:', selectedService);
    console.log('🔍 currentUser:', currentUser);
    console.log('🔍 customDetails:', customDetails);
    
    // Verificar autenticación antes de continuar
    if (!isAuthenticated()) {
      alert('Para solicitar este servicio, necesitas iniciar sesión o crear una cuenta.');
      // Aquí podrías redirigir al login o mostrar un modal de autenticación
      return;
    }
    
    if (!selectedService) {
      console.log('❌ Faltan datos requeridos');
      alert('Error: No se puede procesar la solicitud. Por favor, recarga la página e inténtalo de nuevo.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Usar datos personalizados si existen, sino usar datos del servicio
      const quoteData = {
        title: customDetails.title || `${selectedService.name} - Solicitud`,
        description: customDetails.description || selectedService.description,
        budget: parseFloat(customDetails.budget) || parseFloat(selectedService.basePrice.replace('Desde €', '')),
        service: selectedService.id
      };

      console.log('🌐 Enviando cotización:', quoteData);
      console.log('🌐 Usuario actual:', currentUser);
      
      const result = await brandingAPI.quotes.create(quoteData);
      console.log('✅ Cotización creada:', result);
      
      alert('¡Cotización enviada exitosamente! El administrador la revisará pronto.');
      setShowServiceModal(false);
      
    } catch (error) {
      console.error('❌ Error enviando cotización:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          'Error al enviar la cotización. Por favor, inténtalo de nuevo.';
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomize = () => {
    setShowCustomizeForm(true);
  };


  const handleInputChange = (field, value) => {
    setCustomDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };



  return (
    <div className="services-page">
      {/* Hero Section with Background */}
      <section className="services-hero position-relative py-5 text-white overflow-hidden">
        <div className="services-hero-bg position-absolute w-100 h-100" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          zIndex: -1
        }}></div>
        
        {/* Animated background elements */}
        <div className="services-shapes position-absolute w-100 h-100" style={{ zIndex: 0 }}>
          <div className="shape shape-1 position-absolute rounded-circle" style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.1)',
            top: '20%',
            left: '5%',
            animation: 'float 8s ease-in-out infinite'
          }}></div>
          <div className="shape shape-2 position-absolute rounded-circle" style={{
            width: '150px',
            height: '150px',
            background: 'rgba(255,255,255,0.05)',
            bottom: '30%',
            right: '10%',
            animation: 'float 10s ease-in-out infinite reverse'
          }}></div>
        </div>

        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row">
            <div className="col-12 text-center">
              <h1 className="display-3 fw-bold mb-4">Nuestros Servicios</h1>
              <p className="lead mb-0" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Descubre todos los servicios de branding que ofrecemos y solicita una cotización personalizada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-5 bg-light">
        <div className="container">

      <div className="row g-4">
        {services.map((service) => (
          <div key={service.id} className="col-lg-4 col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <i className={`bi ${service.icon} display-4 text-primary mb-3`}></i>
                <h5 className="card-title">{service.name}</h5>
                <p className="card-text text-muted">
                  {service.description}
                </p>
                <ul className="list-unstyled">
                  {service.features.map((feature, index) => (
                    <li key={index}><i className="bi bi-check text-success me-2"></i>{feature}</li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <button 
                    className="btn btn-primary w-100"
                    onClick={() => handleServiceClick(service)}
                  >
                    Solicitar Cotización
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
        </div>
      </section>

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

      {/* Modal de Detalles del Servicio */}
      {showServiceModal && selectedService && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`bi ${selectedService.icon} me-2`}></i>
                  {selectedService.name}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowServiceModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {!showCustomizeForm ? (
                  <div className="row">
                    <div className="col-md-8">
                      <h6 className="text-primary mb-3">Descripción del Servicio</h6>
                      <p className="text-muted mb-4">{customDetails.description || selectedService.description}</p>
                      
                      <h6 className="text-primary mb-3">¿Qué incluye?</h6>
                      <ul className="list-unstyled">
                        {selectedService.features.map((feature, index) => (
                          <li key={index} className="mb-2">
                            <i className="bi bi-check-circle-fill text-success me-2"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-4">
                        <div className="card bg-light">
                          <div className="card-body">
                            <h6 className="card-title text-primary">Información del Servicio</h6>
                            <div className="mb-3">
                              <strong>Precio:</strong><br />
                              <span className="text-success h5">
                                {customDetails.budget ? `€${customDetails.budget}` : selectedService.basePrice}
                              </span>
                              {customDetails.budget && (
                                <small className="text-muted d-block">
                                  (Original: {selectedService.basePrice})
                                </small>
                              )}
                            </div>
                            <div className="mb-3">
                              <strong>Tiempo de entrega:</strong><br />
                              <span className="text-muted">{selectedService.deliveryTime}</span>
                            </div>
                            <div className="mb-3">
                              <strong>Categoría:</strong><br />
                              <span className="badge bg-primary">{selectedService.category}</span>
                            </div>
                            {customDetails.budget && customDetails.budget !== selectedService.basePrice.replace('Desde €', '') && (
                              <div className="mb-3">
                                <div className="alert alert-warning p-2 mb-0">
                                  <i className="bi bi-pencil-square me-2"></i>
                                  <small><strong>Personalizado</strong><br />Has modificado este servicio</small>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h6 className="text-primary mb-3">
                      <i className="bi bi-gear me-2"></i>
                      Personalizar Solicitud
                    </h6>
                    
                    <div className="mb-3">
                      <label className="form-label">Título del Proyecto *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={customDetails.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Ej: Logo para mi empresa"
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">Descripción Detallada *</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={customDetails.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe detalladamente lo que necesitas, preferencias de estilo, colores, etc."
                        required
                      />
                      <small className="text-muted">Sé específico sobre tus necesidades y preferencias</small>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label">€ Presupuesto Estimado (Opcional)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={customDetails.budget}
                        onChange={(e) => handleInputChange('budget', e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                      <small className="text-muted">Si tienes un presupuesto aproximado, puedes indicarlo aquí</small>
                    </div>
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>Servicio seleccionado:</strong> {selectedService.name} ({selectedService.basePrice})
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {!showCustomizeForm ? (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => setShowServiceModal(false)}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline-primary" 
                      onClick={handleCustomize}
                    >
                      <i className="bi bi-gear me-2"></i>
                      Personalizar
                    </button>
                    {isAuthenticated() ? (
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={handleMakeOrder}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-2"></i>
                            Solicitar Servicio
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="d-grid gap-2">
                        <div className="alert alert-info mb-2">
                          <i className="bi bi-info-circle me-2"></i>
                          Para solicitar este servicio, necesitas iniciar sesión
                        </div>
                        <div className="d-grid gap-2">
                          <Link to="/login" className="btn btn-primary">
                            Iniciar Sesión
                          </Link>
                          <Link to="/register" className="btn btn-outline-primary">
                            Crear Cuenta
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary" 
                      onClick={() => setShowCustomizeForm(false)}
                    >
                      Volver
                    </button>
                    {isAuthenticated() ? (
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={handleMakeOrder}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Enviando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-2"></i>
                            Enviar Solicitud
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="d-grid gap-2">
                        <div className="alert alert-info mb-2">
                          <i className="bi bi-info-circle me-2"></i>
                          Para enviar esta solicitud, necesitas iniciar sesión
                        </div>
                        <div className="d-grid gap-2">
                          <Link to="/login" className="btn btn-primary">
                            Iniciar Sesión
                          </Link>
                          <Link to="/register" className="btn btn-outline-primary">
                            Crear Cuenta
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
