import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { brandingAPI } from '../../api/branding';
import { adminAPI } from '../../api/admin';
import { authAPI } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

const DesignerProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const fetchAllUsers = useCallback(async () => {
    console.log('🔄 Iniciando fetchAllUsers...');
    try {
      const usersData = await adminAPI.users.list();
      const allUsersData = usersData.users || usersData;
      console.log('✅ Usuarios obtenidos exitosamente (admin):', allUsersData.length);
      setAllUsers(allUsersData);
    } catch (error) {
      console.error('❌ Error obteniendo usuarios (admin):', error);
      console.log('🔄 Intentando obtener usuarios específicos de mensajes...');
      try {
        await fetchUsersFromMessages();
      } catch (profileError) {
        console.error('❌ Error obteniendo usuarios de mensajes:', profileError);
        setAllUsers([]);
      }
    }
  }, [id, fetchUsersFromMessages]);

  const fetchUsersFromMessages = async () => {
    console.log('🔄 Iniciando fetchUsersFromMessages...');
    try {
      // Obtener mensajes para extraer IDs de usuarios únicos
      const messagesData = await brandingAPI.messages.list(parseInt(id));
      console.log('📨 Mensajes obtenidos para extraer usuarios:', messagesData);
      
      const uniqueUserIds = [...new Set(messagesData.map(msg => msg.sender))];
      console.log('👤 IDs únicos de usuarios en mensajes:', uniqueUserIds);
      
      // Agregar también el cliente del proyecto si existe
      if (project && project.client) {
        uniqueUserIds.push(project.client);
        console.log('👤 Agregando cliente del proyecto:', project.client);
      }
      
      console.log('👤 IDs finales de usuarios a buscar:', uniqueUserIds);
      
      if (uniqueUserIds.length > 0) {
        console.log('🌐 Llamando a authAPI.getUsersBasicInfo con IDs:', uniqueUserIds);
        const usersResponse = await authAPI.getUsersBasicInfo(uniqueUserIds);
        console.log('✅ Respuesta de getUsersBasicInfo:', usersResponse);
        console.log('👥 Usuarios específicos obtenidos:', usersResponse.users);
        setAllUsers(usersResponse.users || []);
      } else {
        console.log('⚠️ No hay IDs de usuarios para buscar');
        setAllUsers([]);
      }
    } catch (error) {
      console.error('❌ Error obteniendo usuarios de mensajes:', error);
      setAllUsers([]);
    }
  };

  const fetchMessages = useCallback(async () => {
    try {
      console.log('🌐 Obteniendo mensajes del proyecto de la API real...');
      const response = await brandingAPI.messages.list(parseInt(id));
      console.log('✅ Mensajes del proyecto obtenidos:', response.length);
      setMessages(response);
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
  }, [id]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        console.log('🌐 Obteniendo proyecto del diseñador de la API real...');
        const projectsResponse = await brandingAPI.projects.list();
        const projectData = projectsResponse.find(p => p.id === parseInt(id));
        if (!projectData) {
          throw new Error('Proyecto no encontrado');
        }
        setProject(projectData);
        fetchMessages();
        fetchAllUsers();
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, fetchMessages, fetchAllUsers]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages();
    }, 7000);
    return () => clearInterval(interval);
  }, [id, fetchMessages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    setSendingMessage(true);

    try {
      const messageData = {
        project: parseInt(id),
        message: newMessage.trim() || ''
      };

      console.log('🌐 Enviando mensaje...');
      const response = await brandingAPI.messages.create(messageData, selectedFile);
      
      // Actualizar mensajes con la respuesta real
      setMessages(prev => [...prev, response]);
      setNewMessage('');
      setSelectedFile(null);
      
      // Limpiar el input de archivo
      const fileInput = document.getElementById('file-input');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar el mensaje');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Solo se permiten archivos JPG, PNG, GIF y PDF');
        return;
      }
      
      // Validar tamaño (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo no puede ser mayor a 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = '';
  };

  const markAsCompleted = async () => {
    if (window.confirm('¿Estás seguro de que quieres marcar este proyecto como completado?\n\nNota: El administrador deberá confirmar la finalización.')) {
      try {
        const response = await brandingAPI.projects.markCompletedByDesigner(parseInt(id));
        console.log('Proyecto marcado como completado:', response);
        setProject(response.project);
        alert('Proyecto marcado como completado. Esperando confirmación del administrador.');
      } catch (error) {
        console.error('Error actualizando proyecto:', error);
        alert(`Error al actualizar el proyecto: ${error.response?.data?.detail || error.message}`);
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

  const getUserName = (userId) => {
    if (!userId || !allUsers || !Array.isArray(allUsers)) return `Usuario ${userId}`;
    
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      let displayName;
      
      // Priorizar nombre completo si existe
      if (user.first_name && user.last_name) {
        displayName = `${user.first_name} ${user.last_name}`.trim();
      } else if (user.first_name) {
        displayName = user.first_name;
      } else {
        displayName = user.username;
      }
      
      // Agregar el rol para mayor claridad
      const role = user.role || 'usuario';
      return `${displayName} (${role})`;
    }
    
    return `Usuario ${userId}`;
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
                      className={`chat-message ${message.sender === currentUser?.id ? 'own' : 'other'}`}
                    >
                      <div className="message-header">
                        {getUserName(message.sender)} - {formatDate(message.created_at)}
                      </div>
                      <div className="message-content">
                        {message.message && <div className="message-text">{message.message}</div>}
                        {message.has_attachment && (
                          <div className="attachment-container mt-2">
                            {message.attachment_type === 'image' ? (
                              <div className="image-attachment">
                                <img 
                                  src={message.attachment_url} 
                                  alt={message.attachment_name}
                                  className="img-thumbnail"
                                  style={{ maxWidth: '200px', maxHeight: '200px' }}
                                  onClick={() => window.open(message.attachment_url, '_blank')}
                                />
                                <div className="attachment-name mt-1">
                                  <small className="text-muted">{message.attachment_name}</small>
                                </div>
                              </div>
                            ) : (
                              <div className="file-attachment">
                                <a 
                                  href={message.attachment_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="btn btn-outline-primary btn-sm"
                                >
                                  <i className="bi bi-download me-1"></i>
                                  {message.attachment_type === 'pdf' ? (
                                    <i className="bi bi-file-pdf me-1"></i>
                                  ) : (
                                    <i className="bi bi-file-earmark me-1"></i>
                                  )}
                                  {message.attachment_name}
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-3 border-top">
                <form onSubmit={sendMessage}>
                  {/* File Input */}
                  <div className="mb-2">
                    <input
                      id="file-input"
                      type="file"
                      className="form-control form-control-sm"
                      accept=".jpg,.jpeg,.png,.gif,.pdf"
                      onChange={handleFileChange}
                      disabled={sendingMessage}
                    />
                  </div>
                  
                  {/* Selected File Preview */}
                  {selectedFile && (
                    <div className="mb-2 p-2 bg-light rounded">
                      <div className="d-flex align-items-center justify-content-between">
                        <small className="text-muted">
                          <i className="bi bi-paperclip me-1"></i>
                          {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </small>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={removeSelectedFile}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    </div>
                  )}
                  
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
                      disabled={sendingMessage || (!newMessage.trim() && !selectedFile)}
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
                  {getUserName(project.client)}
                </div>
                <small className="text-muted">{project.client?.email || 'Email no disponible'}</small>
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
              
              {project.status === 'pending_completion_confirmation' && (
                <div className="alert alert-warning">
                  <i className="bi bi-clock me-2"></i>
                  <strong>Esperando confirmación del administrador</strong>
                  <br />
                  <small>El proyecto ha sido marcado como completado y está pendiente de confirmación.</small>
                </div>
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
