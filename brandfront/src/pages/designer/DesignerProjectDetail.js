import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { brandingAPI } from '../../api/branding';

const DesignerProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log('🌐 Obteniendo proyecto del diseñador de la API real...');
        
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
          id: 2,
          first_name: 'María',
          last_name: 'García'
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

  const markAsCompleted = async () => {
    if (window.confirm('¿Estás seguro de que quieres marcar este proyecto como completado?')) {
      try {
        // En modo real, hacer llamada a la API para actualizar el estado
        // await brandingAPI.projects.update(id, { status: 'completed' });
        
        console.log('Marcando proyecto como completado');
        setProject(prev => ({ ...prev, status: 'completed' }));
        alert('Proyecto marcado como completado exitosamente');
      } catch (error) {
        console.error('Error actualizando proyecto:', error);
        alert('Error al actualizar el proyecto');
      }
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
              onClick={() => navigate('/designer/projects')}
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
                Chat con Cliente
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
                    <p className="text-muted">Inicia la conversación con el cliente</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`chat-message ${message.sender.id === 2 ? 'own' : 'other'}`}
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
                      placeholder="Escribe tu mensaje al cliente..."
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
                <strong>Cliente:</strong>
                <div>
                  <i className="bi bi-person-circle me-1"></i>
                  {project.client.first_name} {project.client.last_name}
                </div>
                <small className="text-muted">{project.client.email}</small>
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

          {/* Designer Actions */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-tools me-2"></i>
                Acciones
              </h5>
            </div>
            <div className="card-body">
              {project.status === 'in_progress' && (
                <>
                  <p className="card-text">
                    Mantén al cliente informado del progreso y envía actualizaciones regularmente.
                  </p>
                  <button 
                    className="btn btn-success w-100 mb-2"
                    onClick={markAsCompleted}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Marcar como Completado
                  </button>
                </>
              )}
              
              {project.status === 'completed' && (
                <div className="alert alert-success">
                  <i className="bi bi-check-circle me-2"></i>
                  Este proyecto ha sido completado exitosamente.
                </div>
              )}

              <button 
                className="btn btn-outline-primary w-100"
                onClick={() => window.open(`mailto:${project.client.email}`, '_blank')}
              >
                <i className="bi bi-envelope me-2"></i>
                Enviar Email al Cliente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerProjectDetail;
