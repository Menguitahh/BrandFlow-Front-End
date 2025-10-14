import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { brandingAPI } from '../../api/branding';

const QuotesNew = () => {
  const { } = useAuth();
  const [formData, setFormData] = useState({
    service: '',
    title: '',
    description: '',
    budget: ''
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('🌐 Obteniendo servicios de la API real...');
        
            const response = await brandingAPI.services.list();
        
        console.log('✅ Servicios obtenidos:', response.length);
        setServices(response);
      } catch (error) {
        setError('Error al cargar los servicios');
        console.error('Error:', error);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.service) {
      setError('Debes seleccionar un servicio');
      return false;
    }
    if (!formData.title.trim()) {
      setError('El título es requerido');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      return false;
    }
    if (formData.budget && parseFloat(formData.budget) < 0) {
      setError('El presupuesto debe ser mayor o igual a 0');
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
      const quoteData = {
        service: parseInt(formData.service),
        title: formData.title.trim(),
        description: formData.description.trim(),
        ...(formData.budget && { budget: parseFloat(formData.budget) })
      };

      // En modo real, hacer llamada a la API
          await brandingAPI.quotes.create(quoteData);
      
      navigate('/client/quotes', { 
        state: { message: 'Cotización enviada exitosamente' } 
      });

    } catch (error) {
      setError(error.response?.data?.detail || 'Error al enviar la cotización');
    } finally {
      setLoading(false);
    }
  };

  if (servicesLoading) {
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
          <div className="d-flex align-items-center mb-4">
            <button 
              className="btn btn-outline-secondary me-3"
              onClick={() => navigate('/client/quotes')}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <h1 className="h2 mb-0">Nueva Cotización</h1>
          </div>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-file-text me-2"></i>
                Solicitar Cotización
              </h5>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="service" className="form-label">
                    <i className="bi bi-list-ul me-2"></i>
                    Servicio *
                  </label>
                  <select
                    className="form-select"
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un servicio</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  {formData.service && (
                    <div className="form-text">
                      {services.find(s => s.id === parseInt(formData.service))?.description}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    <i className="bi bi-tag me-2"></i>
                    Título del Proyecto *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Logo para mi empresa"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    <i className="bi bi-text-paragraph me-2"></i>
                    Descripción del Proyecto *
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Describe detalladamente lo que necesitas..."
                  />
                  <div className="form-text">
                    Sé específico sobre tus necesidades, preferencias de estilo, colores, etc.
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="budget" className="form-label">
                    <i className="bi bi-currency-euro me-2"></i>
                    Presupuesto Estimado (Opcional)
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">€</span>
                    <input
                      type="number"
                      className="form-control"
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="form-text">
                    Si tienes un presupuesto aproximado, puedes indicarlo aquí
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-md-2"
                    onClick={() => navigate('/client/quotes')}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Enviar Cotización
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotesNew;
