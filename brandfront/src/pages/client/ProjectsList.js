import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { brandingAPI } from '../../api/branding';

const ProjectsList = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para el modal de pago
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    cardholder_name: '',
    card_last4: '1234'
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log('🌐 Obteniendo proyectos de la API real...');
        
            const response = await brandingAPI.projects.list();
        const clientProjects = response.filter(project => project.client === currentUser?.id);
        
        console.log('✅ Proyectos obtenidos:', clientProjects.length);
        setProjects(clientProjects);
      } catch (error) {
        setError('Error al cargar los proyectos');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchProjects();
    }
  }, [currentUser]);

  const getStatusBadge = (status) => {
    const badges = {
      quote: 'secondary',
      in_progress: 'info',
      completed: 'success',
      payment_pending: 'warning',
      cancelled: 'danger'
    };
    
    const labels = {
      quote: 'En Cotización',
      in_progress: 'En Progreso',
      completed: 'Completado',
      payment_pending: 'Pendiente de Pago',
      cancelled: 'Cancelado'
    };

    return (
      <span className={`badge bg-${badges[status] || 'secondary'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Función para abrir el modal de pago
  const handlePayProject = (project) => {
    setSelectedProject(project);
    setPaymentData({
      amount: project.quote?.price || 0,
      cardholder_name: '',
      card_last4: '1234'
    });
    setShowPaymentModal(true);
  };

  // Función para procesar el pago
  const handleProcessPayment = async () => {
    if (!selectedProject) return;
    
    setIsProcessingPayment(true);
    try {
      // Simular pago usando la API
      const paymentResponse = await brandingAPI.payments.simulate({
        project_id: selectedProject.id,
        amount: paymentData.amount,
        cardholder_name: paymentData.cardholder_name,
        card_last4: paymentData.card_last4
      });

      console.log('✅ Pago procesado:', paymentResponse);
      
      // Actualizar el proyecto local
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === selectedProject.id 
            ? { ...project, status: 'in_progress' }
            : project
        )
      );

      // Cerrar modal y mostrar éxito
      setShowPaymentModal(false);
      window.alert('¡Pago procesado exitosamente! Tu proyecto ahora está en progreso.');
      
    } catch (error) {
      console.error('❌ Error procesando pago:', error);
      window.alert('Error al procesar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Función para cerrar el modal
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedProject(null);
    setPaymentData({
      amount: '',
      cardholder_name: '',
      card_last4: '1234'
    });
  };

  // Función para manejar cambios en los campos del formulario
  const handlePaymentInputChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 mb-0">Mis Proyectos</h1>
            <Link to="/quote" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Cotización
            </Link>
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="row">
          <div className="col-12">
            <div className="empty-state">
              <div className="empty-icon">
                <i className="bi bi-folder"></i>
              </div>
              <h3>Aún no tienes proyectos</h3>
              <p className="text-muted">Crea una cotización para comenzar un nuevo proyecto.</p>
              <Link to="/quote" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Ir a Cotizaciones
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Proyecto</th>
                        <th>Diseñador Asignado</th>
                        <th>Estado</th>
                        <th>Fecha Entrega</th>
                        <th>Precio</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id}>
                          <td>
                            <div>
                              <h6 className="mb-1">{project.title}</h6>
                            </div>
                          </td>
                          <td>
                            {project.assigned_to ? (
                              <div>
                                <i className="bi bi-person-circle me-1"></i>
                                {project.assigned_to.first_name} {project.assigned_to.last_name}
                              </div>
                            ) : (
                              <span className="text-muted">Sin asignar</span>
                            )}
                          </td>
                          <td>{getStatusBadge(project.status)}</td>
                          <td>{formatDate(project.delivery_date)}</td>
                          <td>{formatCurrency(project.quote?.price || 0)}</td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group">
                              <Link 
                                to={`/client/projects/${project.id}`}
                                className="btn btn-outline-primary btn-view"
                                title="Ver detalles"
                              >
                                <i className="bi bi-eye"></i>
                              </Link>
                              {project.status === 'payment_pending' && (
                                <button 
                                  className="btn btn-success btn-assign"
                                  title="Realizar pago"
                                  onClick={() => handlePayProject(project)}
                                >
                                  <i className="bi bi-credit-card"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-info">
                {projects.filter(p => p.status === 'in_progress').length}
              </h5>
              <p className="card-text text-muted">En Progreso</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-success">
                {projects.filter(p => p.status === 'completed').length}
              </h5>
              <p className="card-text text-muted">Completados</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-warning">
                {projects.filter(p => p.status === 'payment_pending').length}
              </h5>
              <p className="card-text text-muted">Pendientes de Pago</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-primary">
                {formatCurrency(projects.reduce((sum, p) => sum + (p.quote?.price || 0), 0))}
              </h5>
              <p className="card-text text-muted">Inversión Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Pago */}
      {showPaymentModal && selectedProject && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Procesar Pago</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleClosePaymentModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Monto</label>
                  <div className="input-group">
                    <span className="input-group-text">€</span>
                    <input
                      type="number"
                      className="form-control"
                      value={paymentData.amount}
                      onChange={(e) => handlePaymentInputChange('amount', e.target.value)}
                      step="0.01"
                      min="0"
                      readOnly
                    />
                  </div>
                  <small className="text-muted">
                    Proyecto: {selectedProject.title}
                  </small>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Nombre del Titular</label>
                  <input
                    type="text"
                    className="form-control"
                    value={paymentData.cardholder_name}
                    onChange={(e) => handlePaymentInputChange('cardholder_name', e.target.value)}
                    placeholder="Nombre como aparece en la tarjeta"
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Últimos 4 dígitos de la tarjeta</label>
                  <input
                    type="text"
                    className="form-control"
                    value={paymentData.card_last4}
                    onChange={(e) => handlePaymentInputChange('card_last4', e.target.value)}
                    maxLength="4"
                    required
                  />
                </div>
                
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Este es un pago simulado. No se procesará ningún cargo real.
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleClosePaymentModal}
                  disabled={isProcessingPayment}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleProcessPayment}
                  disabled={isProcessingPayment || !paymentData.cardholder_name || !paymentData.card_last4}
                >
                  {isProcessingPayment ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Procesando...
                    </>
                  ) : (
                    'Procesar Pago'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
