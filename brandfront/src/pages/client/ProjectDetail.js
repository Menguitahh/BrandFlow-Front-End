import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { brandingAPI } from '../../api/branding';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    cardholder_name: '',
    card_last4: ''
  });
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log('🌐 Obteniendo proyecto de la API real...');
        
        // Obtener proyecto específico
        const projectsResponse = await brandingAPI.projects.list();
        const projectData = projectsResponse.find(p => p.id === parseInt(id));
        
        if (!projectData) {
          throw new Error('Proyecto no encontrado');
        }
        
        setProject(projectData);

        // Cargar mensajes
        fetchMessages();
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const fetchMessages = async () => {
    try {
      console.log('🌐 Obteniendo mensajes del proyecto de la API real...');
      
      // Usar filtro server-side ?project=ID
      const response = await brandingAPI.messages.list(parseInt(id));
      
      console.log('✅ Mensajes del proyecto obtenidos:', response.length);
      setMessages(response);
      
      // Si no hay mensajes, mostrar mensajes mock para demo
      if (response.length === 0) {
      setMessages([
        {
          id: 1,
          project: parseInt(id),
          message: '¡Hola! He comenzado con el diseño del logo. ¿Te gustaría ver algunas opciones preliminares?',
          sender: {
            id: 2,
            first_name: 'María',
            last_name: 'García'
          },
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          project: parseInt(id),
          message: 'Perfecto, me encantaría ver las opciones. ¿Cuándo crees que podrías tenerlas listas?',
          sender: {
            id: 1,
            first_name: 'Cliente',
            last_name: 'Usuario'
          },
          created_at: '2024-01-15T11:45:00Z'
        },
        {
          id: 3,
          project: parseInt(id),
          message: 'Para mañana por la tarde debería tener al menos 3 opciones diferentes. Te las enviaré por aquí.',
          sender: {
            id: 2,
            first_name: 'María',
            last_name: 'García'
          },
          created_at: '2024-01-15T12:00:00Z'
        }
      ]);
      }
    } catch (error) {
      console.error('❌ Error cargando mensajes:', error);
    }
  };

  // Polling de mensajes cada 7 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 7000);

    return () => clearInterval(interval);
  }, [id]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSendingMessage(true);

    try {
      const messageData = {
        project: parseInt(id),
        message: newMessage.trim()
      };

      console.log('🌐 Enviando mensaje...');
      await brandingAPI.messages.create(messageData);
      
      // Simular envío exitoso
      const tempMessage = {
        id: Date.now(),
        project: parseInt(id),
        message: newMessage.trim(),
        sender: {
          id: 1,
          first_name: 'Cliente',
          last_name: 'Usuario'
        },
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
    } catch (error) {
      console.error('Error enviando mensaje:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Validar que el amount sea mayor a 0
    if (parseFloat(paymentData.amount) <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }
    
    // Validar que card_last4 tenga exactamente 4 dígitos
    if (paymentData.card_last4 && paymentData.card_last4.length !== 4) {
      alert('Los últimos 4 dígitos de la tarjeta deben ser exactamente 4 números');
      return;
    }
    
    setProcessingPayment(true);

    try {
      const paymentPayload = {
        project_id: parseInt(id),
        amount: parseFloat(paymentData.amount),
        ...(paymentData.cardholder_name && { cardholder_name: paymentData.cardholder_name }),
        ...(paymentData.card_last4 && { card_last4: paymentData.card_last4 })
      };

      console.log('🌐 Procesando pago...');
      await brandingAPI.payments.simulate(paymentPayload);
      
      // Simular pago exitoso
      setTimeout(() => {
        setShowPaymentForm(false);
        setPaymentData({ amount: '', cardholder_name: '', card_last4: '' });
        // Actualizar estado del proyecto
        setProject(prev => ({ ...prev, status: 'in_progress' }));
        alert('Pago procesado exitosamente');
      }, 2000);

    } catch (error) {
      console.error('Error procesando pago:', error);
      alert('Error procesando el pago');
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

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

  if (!project) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          Proyecto no encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex align-items-center mb-4">
            <button 
              className="btn btn-outline-secondary me-3"
              onClick={() => navigate('/client/projects')}
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <div>
              <h1 className="h2 mb-1">{project.title}</h1>
              <p className="text-muted mb-0">{project.description}</p>
            </div>
            <div className="ms-auto">
              {getStatusBadge(project.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Chat Section */}
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-chat-dots me-2"></i>
                Chat del Proyecto
              </h5>
            </div>
            <div className="card-body p-0">
              {/* Messages */}
              <div className="chat-container">
                {messages.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">
                      <i className="bi bi-chat"></i>
                    </div>
                    <h6>Sin mensajes todavía</h6>
                    <p className="text-muted">Inicia la conversación con tu diseñador</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`chat-message ${message.sender.id === 1 ? 'own' : 'other'}`}
                    >
                      <div className="message-header">
                        {message.sender.first_name} {message.sender.last_name} - {formatDate(message.created_at)}
                      </div>
                      <div>{message.message}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-3 border-top">
                <form onSubmit={sendMessage}>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Escribe tu mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sendingMessage}
                    />
                    <button 
                      className="btn btn-primary" 
                      type="submit"
                      disabled={sendingMessage || !newMessage.trim()}
                    >
                      {sendingMessage ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <i className="bi bi-send"></i>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Project Info & Actions */}
        <div className="col-lg-4">
          {/* Project Details */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Detalles del Proyecto
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <strong>Diseñador Asignado:</strong>
                <div>
                  <i className="bi bi-person-circle me-1"></i>
                  {project.assigned_to?.first_name} {project.assigned_to?.last_name}
                </div>
              </div>
              <div className="mb-3">
                <strong>Fecha de Entrega:</strong>
                <div>{formatDate(project.delivery_date)}</div>
              </div>
              <div className="mb-3">
                <strong>Precio:</strong>
                <div className="h5 text-primary mb-0">
                  {formatCurrency(project.quote?.price || 0)}
                </div>
              </div>
              <div>
                <strong>Estado:</strong>
                <div>{getStatusBadge(project.status)}</div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          {project.status === 'payment_pending' && (
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  <i className="bi bi-credit-card me-2"></i>
                  Pago Pendiente
                </h5>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Este proyecto está listo para entrega. Realiza el pago para acceder a los archivos finales.
                </p>
                <button 
                  className="btn btn-success w-100"
                  onClick={() => setShowPaymentForm(true)}
                >
                  <i className="bi bi-credit-card me-2"></i>
                  Realizar Pago
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentForm && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Procesar Pago</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowPaymentForm(false)}
                ></button>
              </div>
              <form onSubmit={handlePayment}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Monto</label>
                    <div className="input-group">
                      <span className="input-group-text">€</span>
                      <input
                        type="number"
                        className="form-control"
                        id="amount"
                        value={paymentData.amount}
                        onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                        step="0.01"
                        min="0.01"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cardholder_name" className="form-label">Nombre del Titular</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cardholder_name"
                      value={paymentData.cardholder_name}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, cardholder_name: e.target.value }))}
                      placeholder="Nombre como aparece en la tarjeta"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="card_last4" className="form-label">Últimos 4 dígitos de la tarjeta</label>
                    <input
                      type="text"
                      className="form-control"
                      id="card_last4"
                      value={paymentData.card_last4}
                      onChange={(e) => setPaymentData(prev => ({ ...prev, card_last4: e.target.value }))}
                      placeholder="1234"
                      maxLength="4"
                      pattern="[0-9]{4}"
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
                    onClick={() => setShowPaymentForm(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Procesando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-credit-card me-2"></i>
                        Procesar Pago
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
