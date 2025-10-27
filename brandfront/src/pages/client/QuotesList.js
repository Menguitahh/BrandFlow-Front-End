import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { brandingAPI } from '../../api/branding';

const QuotesList = () => {
  const { currentUser } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados para el modal de pago
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    cardholder_name: '',
    card_last4: '1234'
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        console.log('🌐 Obteniendo cotizaciones de la API real...');
        
            const response = await brandingAPI.quotes.list();
        const clientQuotes = response.filter(quote => quote.client === currentUser?.id);
        
        console.log('✅ Cotizaciones obtenidas:', clientQuotes.length);
        setQuotes(clientQuotes);
      } catch (error) {
        setError('Error al cargar las cotizaciones');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchQuotes();
    }
  }, [currentUser]);

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      in_progress: 'info',
      paid: 'success'
    };
    
    const labels = {
      pending: 'Pendiente',
      approved: 'Aprobada',
      rejected: 'Rechazada',
      in_progress: 'En Progreso',
      paid: 'Pagada'
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

  const handleViewQuote = (quote) => {
    // Mostrar detalles de la cotización en un modal simple
    const details = `
Cotización: ${quote.title}

Descripción: ${quote.description}

Servicio: ${quote.service?.name || 'N/A'}
Presupuesto: ${formatCurrency(quote.budget)}
Estado: ${quote.status}
Fecha: ${formatDate(quote.created_at)}
    `.trim();
    
    window.alert(details);
  };

  const handleViewProject = (quote) => {
    // Navegar a la lista de proyectos del cliente
    window.location.href = '/client/projects';
  };

  // Función para abrir el modal de pago
  const handlePayQuote = (quote) => {
    setSelectedQuote(quote);
    setPaymentData({
      amount: quote.budget,
      cardholder_name: '',
      card_last4: '1234'
    });
    setShowPaymentModal(true);
  };

  // Función para procesar el pago
  const handleProcessPayment = async () => {
    if (!selectedQuote) return;
    
    setIsProcessingPayment(true);
    try {
      console.log('💳 Procesando pago para cotización:', selectedQuote.id);
      console.log('📋 Datos de pago:', paymentData);
      
      // Enviar directamente el quote_id para que el backend cree el proyecto si no existe
      const paymentResponse = await brandingAPI.payments.simulate({
        quote_id: selectedQuote.id, // Enviar el ID de la cotización
        amount: paymentData.amount,
        cardholder_name: paymentData.cardholder_name,
        card_last4: paymentData.card_last4
      });

      console.log('✅ Pago procesado:', paymentResponse);
      
      // Actualizar la cotización local
      setQuotes(prevQuotes => 
        prevQuotes.map(quote => 
          quote.id === selectedQuote.id 
            ? { ...quote, status: 'paid' }
            : quote
        )
      );

      // Cerrar modal y mostrar éxito
      setShowPaymentModal(false);
      window.alert('¡Pago procesado exitosamente! Tu proyecto comenzará pronto.');
      
    } catch (error) {
      console.error('❌ Error procesando pago:', error);
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.error || 
                          error.message || 
                          'Error al procesar el pago. Por favor, inténtalo de nuevo.';
      window.alert(`Error: ${errorMessage}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Función para cerrar el modal
  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedQuote(null);
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
            <h1 className="h2 mb-0">Mis Cotizaciones</h1>
            <Link to="/client/quotes/new" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Cotización
            </Link>
          </div>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="row">
          <div className="col-12">
            <div className="empty-state">
              <div className="empty-icon">
                <i className="bi bi-file-text"></i>
              </div>
              <h3>Aún no tienes cotizaciones</h3>
              <p className="text-muted">Crea tu primera cotización para comenzar un nuevo proyecto.</p>
              <Link to="/client/quotes/new" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Crear Cotización
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
                        <th>Título</th>
                        <th>Servicio</th>
                        <th>Presupuesto</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.map((quote) => (
                        <tr key={quote.id}>
                          <td>
                            <div>
                              <h6 className="mb-1">{quote.title}</h6>
                              <small className="text-muted">{quote.description}</small>
                            </div>
                          </td>
                          <td>{quote.service?.name}</td>
                          <td>{formatCurrency(quote.budget)}</td>
                          <td>{getStatusBadge(quote.status)}</td>
                          <td>{formatDate(quote.created_at)}</td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group">
                              <button 
                                className="btn btn-outline-primary" 
                                title="Ver detalles"
                                onClick={() => handleViewQuote(quote)}
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              {quote.status === 'approved' && (
                                <>
                                  <button 
                                    className="btn btn-outline-success" 
                                    title="Ver proyecto"
                                    onClick={() => handleViewProject(quote)}
                                  >
                                    <i className="bi bi-folder"></i>
                                  </button>
                                  <button 
                                    className="btn btn-success" 
                                    title="Pagar"
                                    onClick={() => handlePayQuote(quote)}
                                  >
                                    <i className="bi bi-credit-card"></i>
                                  </button>
                                </>
                              )}
                              {quote.status === 'paid' && (
                                <span className="badge bg-success">
                                  <i className="bi bi-check-circle me-1"></i>
                                  Pagado
                                </span>
                              )}
                              {quote.status === 'rejected' && (
                                <button 
                                  className="btn btn-outline-danger" 
                                  title="Ver motivo de rechazo"
                                  data-bs-toggle="tooltip"
                                  data-bs-title={quote.rejected_reason}
                                  onClick={() => window.alert(`Motivo de rechazo: ${quote.rejected_reason || 'No especificado'}`)}
                                >
                                  <i className="bi bi-exclamation-circle"></i>
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

      {/* Modal de Pago */}
      {showPaymentModal && selectedQuote && (
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
                    Cotización: {selectedQuote.title}
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

export default QuotesList;
