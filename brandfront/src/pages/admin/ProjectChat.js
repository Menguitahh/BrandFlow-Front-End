import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { brandingAPI } from '../../api/branding';
import { adminAPI } from '../../api/admin';
import { authAPI } from '../../api/auth';

const ProjectChat = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchMessages();
      fetchAllUsers();
      
      // Configurar polling para mensajes cada 5 segundos
      const interval = setInterval(() => {
        fetchMessages();
        // También actualizar usuarios en caso de que haya nuevos mensajes
        fetchUsersFromMessages();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [projectId, fetchAllUsers, fetchMessages, fetchProjectDetails, fetchUsersFromMessages]);

  const fetchProjectDetails = async () => {
    try {
      const projects = await brandingAPI.projects.list();
      console.log('📋 Todos los proyectos:', projects);
      const projectData = projects.find(p => p.id === parseInt(projectId));
      console.log('🎯 Proyecto encontrado:', projectData);
      setProject(projectData);
    } catch (error) {
      console.error('Error obteniendo proyecto:', error);
      setError('Error al cargar el proyecto');
    }
  };

  const fetchAllUsers = async () => {
    console.log('🔄 Iniciando fetchAllUsers...');
    try {
      const usersData = await adminAPI.users.list();
      const allUsersData = usersData.users || usersData;
      console.log('✅ Usuarios obtenidos exitosamente (admin):', allUsersData.length);
      setAllUsers(allUsersData);
    } catch (error) {
      console.error('❌ Error obteniendo usuarios (admin):', error);
      console.log('🔄 Intentando obtener usuarios específicos de mensajes...');
      // Si no tiene permisos de admin, intentar obtener usuarios específicos de los mensajes
      try {
        await fetchUsersFromMessages();
      } catch (profileError) {
        console.error('❌ Error obteniendo usuarios de mensajes:', profileError);
        setAllUsers([]);
      }
    }
  };

  const fetchUsersFromMessages = async () => {
    console.log('🔄 Iniciando fetchUsersFromMessages...');
    try {
      // Obtener mensajes para extraer IDs de usuarios únicos
      const messagesData = await brandingAPI.messages.list(projectId);
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

  const fetchMessages = async () => {
    try {
      const messagesData = await brandingAPI.messages.list(projectId);
      console.log('📨 Mensajes obtenidos:', messagesData);
      console.log('📊 Proyecto actual:', project);
      setMessages(messagesData);
    } catch (error) {
      console.error('Error obteniendo mensajes:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    try {
      await brandingAPI.messages.create({
        project: parseInt(projectId),
        message: newMessage
      }, selectedFile);

      setNewMessage('');
      setSelectedFile(null);
      fetchMessages(); // Refrescar mensajes
    } catch (error) {
      console.error('Error enviando mensaje:', error);
      alert('Error al enviar el mensaje');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validación de archivo
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Solo se permiten archivos JPG, PNG, GIF y PDF');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('El archivo no puede ser mayor a 10MB');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-ES');
  };

  const getClientName = () => {
    if (!project || !project.client) return 'Cliente';
    return getUserName(project.client);
  };

  const getUserName = (userId) => {
    if (!userId) return `Usuario ${userId}`;
    
    // Intentar encontrar en la lista de usuarios actual
    if (allUsers && Array.isArray(allUsers)) {
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
    }
    
    // Si no se encuentra, devolver un formato más amigable
    return `Usuario ${userId}`;
  };

  useEffect(() => {
    setLoading(false);
  }, [project]);

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
          {error}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Proyecto no encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-0">Chat del Proyecto</h1>
              <p className="text-muted mb-0">
                <strong>Proyecto:</strong> {project.title} | 
                <strong> Cliente:</strong> {getClientName()}
              </p>
            </div>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => window.close()}
            >
              <i className="bi bi-x-lg me-2"></i>
              Cerrar
            </button>
          </div>

          {/* Chat Container */}
          <div className="card" style={{ height: '70vh' }}>
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-chat-dots me-2"></i>
                Conversación
              </h5>
            </div>
            
            {/* Messages Area */}
            <div className="card-body overflow-auto" style={{ height: '50vh' }}>
              {messages.length === 0 ? (
                <div className="text-center text-muted py-5">
                  <i className="bi bi-chat display-4 d-block mb-3"></i>
                  <p>No hay mensajes aún. ¡Inicia la conversación!</p>
                </div>
              ) : (
                <div className="messages-container">
                  {messages.map((message) => (
                    <div key={message.id} className="mb-3">
                      <div className={`d-flex ${message.sender === project.client ? 'justify-content-start' : 'justify-content-end'}`}>
                        <div className={`message-bubble ${message.sender === project.client ? 'bg-light' : 'bg-primary text-white'}`}
                             style={{ maxWidth: '70%', padding: '10px 15px', borderRadius: '15px' }}>
                          <div className="message-header">
                            <small className="text-muted">
                              {getUserName(message.sender)} - {formatDate(message.created_at)}
                            </small>
                          </div>
                          <div className="message-content">
                            {message.message}
                          </div>
                          
                          {/* Attachment Display */}
                          {message.has_attachment && (
                            <div className="mt-2">
                              {message.attachment_type === 'image' ? (
                                <div>
                                  <img 
                                    src={message.attachment_url} 
                                    alt="Adjunto"
                                    className="img-thumbnail"
                                    style={{ maxWidth: '200px', cursor: 'pointer' }}
                                    onClick={() => window.open(message.attachment_url, '_blank')}
                                  />
                                  <br />
                                  <small className="text-muted">{message.attachment_name}</small>
                                </div>
                              ) : (
                                <div>
                                  <a 
                                    href={message.attachment_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`btn btn-sm ${message.sender === project.client ? 'btn-outline-primary' : 'btn-light'}`}
                                  >
                                    <i className="bi bi-download me-1"></i>
                                    {message.attachment_name}
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* File Preview */}
            {selectedFile && (
              <div className="card-footer bg-light">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <i className="bi bi-paperclip me-2"></i>
                    <span className="me-2">{selectedFile.name}</span>
                    <small className="text-muted">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </small>
                  </div>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={removeSelectedFile}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Message Input */}
            <div className="card-footer">
              <div className="input-group">
                <input
                  type="file"
                  className="form-control"
                  accept=".jpg,.jpeg,.png,.gif,.pdf"
                  onChange={handleFileChange}
                  style={{ maxWidth: '200px' }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Escribe tu mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button 
                  className="btn btn-primary"
                  onClick={sendMessage}
                  disabled={!newMessage.trim() && !selectedFile}
                >
                  <i className="bi bi-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectChat;
