import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { brandingAPI } from '../../api/branding';

const ServicesList = () => {
  const { } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        console.log('🌐 Obteniendo servicios de la API real...');
        
            const response = await brandingAPI.services.list();
        
        console.log('✅ Servicios obtenidos:', response.length);
        setServices(response);
      } catch (error) {
        console.error('Error cargando servicios:', error);
        setError('Error al cargar los servicios');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const formatPrice = (price) => {
    if (!price) return 'Consultar precio';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const handleRequestService = (serviceId) => {
    // Redirigir a nueva cotización con el servicio preseleccionado
    window.location.href = `/quote?service=${serviceId}`;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando servicios...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 mb-1">Nuestros Servicios</h1>
              <p className="text-muted">Descubre todos los servicios de branding que ofrecemos</p>
            </div>
            <Link to="/client" className="btn btn-outline-secondary">
              <i className="bi bi-arrow-left me-2"></i>
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {services.length === 0 ? (
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-3">
            <i className="bi bi-briefcase"></i>
          </div>
          <h3 className="text-muted">No hay servicios disponibles</h3>
          <p className="text-muted">Contacta con el administrador para agregar servicios.</p>
        </div>
      ) : (
        <div className="row">
          {services.map((service) => (
            <div key={service.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <div className="text-center mb-3">
                    <div className="display-4 text-primary">
                      {service.icon && (
                        <i className={`bi bi-${service.icon}`}></i>
                      )}
                      {!service.icon && (
                        <i className="bi bi-palette"></i>
                      )}
                    </div>
                  </div>
                  
                  <h5 className="card-title text-center">{service.name}</h5>
                  
                  <p className="card-text flex-grow-1">
                    {service.description || 'Servicio profesional de branding'}
                  </p>
                  
                  {service.features && (
                    <div className="mb-3">
                      <small className="text-muted">
                        <strong>Incluye:</strong> {Array.isArray(service.features) ? service.features.join(', ') : service.features}
                      </small>
                    </div>
                  )}
                  
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="h5 text-primary mb-0">
                        {formatPrice(service.price)}
                      </span>
                    </div>
                    
                    {service.delivery_time && (
                      <div className="mb-3">
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>
                          Tiempo de entrega: {service.delivery_time}
                        </small>
                      </div>
                    )}
                    
                    <div className="d-grid gap-2">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleRequestService(service.id)}
                      >
                        <i className="bi bi-file-text me-2"></i>
                        Solicitar Cotización
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body text-center">
              <h4 className="card-title">¿No encuentras lo que buscas?</h4>
              <p className="card-text">
                Contáctanos para discutir un proyecto personalizado que se adapte a tus necesidades específicas.
              </p>
              <Link to="/quote" className="btn btn-outline-primary">
                <i className="bi bi-envelope me-2"></i>
                Solicitar Cotización Personalizada
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesList;
