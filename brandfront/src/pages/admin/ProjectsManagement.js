import React, { useState, useEffect } from 'react';
import { brandingAPI } from '../../api/branding';
import { adminAPI } from '../../api/admin';

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para modales
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Estados para formularios
  const [editData, setEditData] = useState({
    title: '',
    brief: '',
    delivery_date: '',
    total_price: ''
  });
  const [assignData, setAssignData] = useState({
    assigned_to: ''
  });
  const [completeData, setCompleteData] = useState({
    final_price: '',
    notes: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      console.log('🌐 Obteniendo proyectos, cotizaciones y diseñadores de la API...');
      setLoading(true);
      
      const [projectsData, quotesData, usersData] = await Promise.all([
        brandingAPI.projects.list(),
        brandingAPI.quotes.list(),
        adminAPI.users.list()
      ]);
      
      // Filtrar solo diseñadores de la lista de usuarios
      const designersData = usersData.users ? 
        usersData.users.filter(user => user.role === 'diseñador') : 
        usersData.filter(user => user.role === 'diseñador');
      
      // Guardar todos los usuarios para buscar clientes
      const allUsersData = usersData.users || usersData;
      
      console.log('✅ Proyectos obtenidos:', projectsData.length);
      console.log('✅ Cotizaciones obtenidas:', quotesData.length);
      console.log('✅ Diseñadores obtenidos:', designersData.length);
      console.log('✅ Total usuarios obtenidos:', allUsersData.length);
      
      setProjects(projectsData);
      setQuotes(quotesData);
      setDesigners(designersData);
      setAllUsers(allUsersData);
      setError(null);
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError('Error al cargar proyectos, cotizaciones y diseñadores');
      setProjects([]);
      setQuotes([]);
      setDesigners([]);
    } finally {
      setLoading(false);
    }
  };

  // Funciones auxiliares para formateo
  const formatPrice = (price) => {
    if (!price) return '€0.00';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'quote': 'bg-secondary',
      'pending_approval': 'bg-warning',
      'approved': 'bg-info',
      'payment_pending': 'bg-warning',
      'in_progress': 'bg-primary',
      'review': 'bg-info',
      'pending_completion_confirmation': 'bg-warning',
      'delivered': 'bg-success',
      'completed': 'bg-success',
      'cancelled': 'bg-danger',
      'on_hold': 'bg-secondary'
    };
    return classes[status] || 'bg-secondary';
  };

  const getStatusText = (status) => {
    const texts = {
      'quote': 'Cotización',
      'pending_approval': 'Pendiente Aprobación',
      'approved': 'Aprobado',
      'payment_pending': 'Pendiente Pago',
      'in_progress': 'En Progreso',
      'review': 'En Revisión',
      'pending_completion_confirmation': 'Pendiente Confirmación',
      'delivered': 'Entregado',
      'completed': 'Completado',
      'cancelled': 'Cancelado',
      'on_hold': 'En Pausa'
    };
    return texts[status] || status;
  };

  const getDesignerName = (designerData) => {
    // Si designerData es un objeto (del serializer), extraer el ID
    let designerId = designerData;
    if (designerData && typeof designerData === 'object') {
      designerId = designerData.id;
    }
    
    if (!designerId) return 'Sin asignar';
    if (!designers || !Array.isArray(designers)) return `ID: ${designerId}`;
    
    const designer = designers.find(d => d.id === designerId);
    if (designer) {
      const fullName = designer.first_name && designer.last_name 
        ? `${designer.first_name} ${designer.last_name}`.trim()
        : designer.username;
      return fullName;
    }
    return `ID: ${designerId}`;
  };

  const getClientName = (clientId) => {
    if (!clientId) return 'Sin cliente';
    if (!allUsers || !Array.isArray(allUsers)) return `ID: ${clientId}`;
    
    // Buscar en todos los usuarios (incluyendo clientes)
    const client = allUsers.find(user => user.id === clientId);
    if (client) {
      const fullName = client.first_name && client.last_name 
        ? `${client.first_name} ${client.last_name}`.trim()
        : client.username;
      return fullName;
    }
    return `ID: ${clientId}`;
  };

  // Handlers de acciones en UI
  function handleViewDetails(project) {
    setSelectedProject(project);
    setShowDetailsModal(true);
  }

  function handleEdit(project) {
    setSelectedProject(project);
    setEditData({
      title: project.title,
      brief: project.brief || '',
      delivery_date: project.delivery_date || '',
      total_price: project.total_price || ''
    });
    setShowEditModal(true);
  }

  function handleAssign(project) {
    setSelectedProject(project);
    setAssignData({
      assigned_to: project.assigned_to || ''
    });
    setShowAssignModal(true);
  }

  function handleComplete(project) {
    setSelectedProject(project);
    setCompleteData({
      final_price: project.total_price || '',
      notes: ''
    });
    setShowCompleteModal(true);
  }

  function handleOpenChat(project) {
    window.open(`/admin/projects/${project.id}/chat`, '_blank');
  }

  // Acciones con API
  async function submitEdit() {
    try {
      const editPayload = {
        title: editData.title,
        brief: editData.brief,
        delivery_date: editData.delivery_date || null,
        total_price: parseFloat(editData.total_price) || 0,
        service: selectedProject.service
      };
      await brandingAPI.projects.update(selectedProject.id, editPayload);
      setProjects(prev => prev.map(project => 
        project.id === selectedProject.id ? { ...project, ...editPayload } : project
      ));
      setShowEditModal(false);
      alert('Proyecto editado exitosamente');
    } catch (error) {
      console.error('❌ Error editando proyecto:', error);
      alert('Error al editar el proyecto');
    }
  }

  async function submitAssign() {
    try {
      await brandingAPI.projects.assignDesigner(selectedProject.id, { designer_id: assignData.assigned_to });
      setProjects(prev => prev.map(project => 
        project.id === selectedProject.id 
          ? { ...project, assigned_to: parseInt(assignData.assigned_to), status: 'in_progress' }
          : project
      ));
      setShowAssignModal(false);
      alert('Diseñador asignado exitosamente');
    } catch (error) {
      console.error('❌ Error asignando diseñador:', error);
      alert('Error al asignar diseñador');
    }
  }

  async function handleConfirmCompletion(project) {
    if (window.confirm(`¿Estás seguro de que quieres confirmar la finalización del proyecto "${project.title}"?`)) {
      try {
        await brandingAPI.projects.confirmCompletion(project.id);
        setProjects(prev => prev.map(p => p.id === project.id ? { ...p, status: 'completed' } : p));
        alert('Proyecto confirmado como completado exitosamente.');
      } catch (error) {
        console.error('Error confirmando proyecto:', error);
        alert(`Error al confirmar proyecto: ${error.response?.data?.detail || error.message}`);
      }
    }
  }

  async function submitComplete() {
    try {
      if (parseFloat(completeData.final_price) !== selectedProject.total_price) {
        const updatePayload = {
          title: selectedProject.title,
          brief: selectedProject.brief || '',
          total_price: parseFloat(completeData.final_price) || selectedProject.total_price,
          service: selectedProject.service,
          delivery_date: selectedProject.delivery_date || null
        };
        await brandingAPI.projects.update(selectedProject.id, updatePayload);
      }
      await brandingAPI.projects.markCompletedByAdmin(selectedProject.id);
      setProjects(prev => prev.map(project => 
        project.id === selectedProject.id 
          ? { ...project, status: 'completed', total_price: parseFloat(completeData.final_price) || selectedProject.total_price }
          : project
      ));
      setShowCompleteModal(false);
      alert(`Proyecto completado exitosamente por el administrador. Ingresos: €${parseFloat(completeData.final_price) || selectedProject.total_price}`);
      setTimeout(() => { fetchProjects(); }, 1000);
      if (window.parent && window.parent.postMessage) {
        window.parent.postMessage({ type: 'PROJECT_COMPLETED', data: { ...selectedProject, status: 'completed' } }, '*');
      }
    } catch (error) {
      console.error('❌ Error completando proyecto:', error);
      alert(`Error al completar el proyecto: ${error.response?.data?.detail || error.message}`);
    }
  }

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
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
              <h1 className="h3 mb-0">Gestión de Proyectos</h1>
              <p className="text-muted mb-0">Administración de proyectos en desarrollo...</p>
            </div>
            <button 
              className="btn btn-outline-primary"
              onClick={() => {
                console.log('🔄 Actualizando lista de proyectos...');
                fetchProjects();
              }}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Actualizar
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Estadísticas */}
          <div className="row mb-4">
            <div className="col-md-3">
              <div className="card bg-secondary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{projects.length}</h4>
                      <small>Total Proyectos</small>
                    </div>
                    <i className="bi bi-folder display-6"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{projects.filter(p => p.status === 'in_progress').length}</h4>
                      <small>En Progreso</small>
                    </div>
                    <i className="bi bi-clock display-6"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{projects.filter(p => p.status === 'completed').length}</h4>
                      <small>Completados</small>
                    </div>
                    <i className="bi bi-check-circle display-6"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{quotes.length}</h4>
                      <small>Cotizaciones</small>
                    </div>
                    <i className="bi bi-file-text display-6"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de proyectos */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Lista de Proyectos
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive" style={{ overflowX: 'auto', minWidth: '1200px' }}>
                <table className="table table-hover mb-0" style={{ minWidth: '1200px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>ID</th>
                      <th style={{ width: '200px' }}>Título</th>
                      <th style={{ width: '120px' }}>Cliente</th>
                      <th style={{ width: '100px' }}>Servicio</th>
                      <th style={{ width: '100px' }}>Estado</th>
                      <th style={{ width: '120px' }}>Diseñador</th>
                      <th style={{ width: '100px' }}>Precio</th>
                      <th style={{ width: '100px' }}>Fecha Creación</th>
                      <th style={{ width: '100px' }}>Fecha Entrega</th>
                      <th style={{ width: '200px' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan="10" className="text-center text-muted py-4">
                          <i className="bi bi-inbox display-4 d-block mb-3"></i>
                          No se encontraron proyectos
                        </td>
                      </tr>
                    ) : (
                      projects.map((project) => (
                        <tr key={project.id}>
                          <td style={{ width: '60px' }}>
                            <strong>#{project.id}</strong>
                          </td>
                          <td style={{ width: '200px' }}>
                            <div>
                              <strong>{project.title}</strong>
                            </div>
                          </td>
                          <td style={{ width: '120px' }}>
                            <div>
                              <span className="badge bg-info">
                                {getClientName(project.client)}
                              </span>
                              <br />
                              <small className="text-muted">ID: {project.client}</small>
                            </div>
                          </td>
                          <td style={{ width: '100px' }}>
                            <span className="badge bg-secondary">
                              Servicio #{project.service}
                            </span>
                          </td>
                          <td style={{ width: '100px' }}>
                            <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                              {getStatusText(project.status)}
                            </span>
                          </td>
                          <td style={{ width: '120px' }}>
                            {project.assigned_to ? (
                              <span className="badge bg-primary">
                                {getDesignerName(project.assigned_to)}
                              </span>
                            ) : (
                              <span className="text-muted">Sin asignar</span>
                            )}
                          </td>
                          <td style={{ width: '100px' }}>
                            <strong>{formatPrice(project.total_price)}</strong>
                            {project.paid_amount && project.paid_amount > 0 && (
                              <>
                                <br />
                                <small className="text-success">
                                  Pagado: {formatPrice(project.paid_amount)}
                                </small>
                              </>
                            )}
                          </td>
                          <td style={{ width: '100px' }}>{formatDate(project.created_at)}</td>
                          <td style={{ width: '100px' }}>{formatDate(project.delivery_date)}</td>
                          <td style={{ minWidth: '200px', width: '200px' }}>
                            <div className="btn-group btn-group-sm" role="group" style={{ flexWrap: 'wrap', gap: '2px' }}>
                              <button
                                className="btn btn-outline-primary btn-view"
                                onClick={() => handleViewDetails(project)}
                                title="Ver detalles"
                                style={{ marginBottom: '2px' }}
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button
                                className="btn btn-outline-info btn-chat"
                                onClick={() => handleOpenChat(project)}
                                title="Chat con cliente"
                                style={{ marginBottom: '2px' }}
                              >
                                <i className="bi bi-chat-dots"></i>
                              </button>
                              <button
                                className="btn btn-outline-warning btn-edit"
                                onClick={() => handleEdit(project)}
                                title="Editar proyecto"
                                style={{ marginBottom: '2px' }}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-outline-success btn-assign"
                                onClick={() => handleAssign(project)}
                                title="Asignar diseñador"
                                style={{ marginBottom: '2px' }}
                              >
                                <i className="bi bi-person-plus"></i>
                              </button>
                              {project.status === 'pending_completion_confirmation' && (
                                <button
                                  className="btn btn-outline-success btn-assign"
                                  onClick={() => handleConfirmCompletion(project)}
                                  title="Confirmar finalización"
                                  style={{ marginBottom: '2px' }}
                                >
                                  <i className="bi bi-check2-circle"></i>
                                </button>
                              )}
                              {project.status !== 'completed' && project.status !== 'pending_completion_confirmation' && (
                                <button
                                  className="btn btn-outline-secondary btn-complete"
                                  onClick={() => handleComplete(project)}
                                  title="Marcar como completado"
                                  style={{ marginBottom: '2px' }}
                                >
                                  <i className="bi bi-check-circle"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalles */}
      {showDetailsModal && selectedProject && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalles del Proyecto</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowDetailsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Información General</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td><strong>ID:</strong></td>
                          <td>{selectedProject.id}</td>
                        </tr>
                        <tr>
                          <td><strong>Título:</strong></td>
                          <td>{selectedProject.title}</td>
                        </tr>
                        <tr>
                          <td><strong>Estado:</strong></td>
                          <td>{getStatusText(selectedProject.status)}</td>
                        </tr>
                        <tr>
                          <td><strong>Cliente:</strong></td>
                          <td>
                            <div>
                              <strong>{getClientName(selectedProject.client)}</strong>
                              <br />
                              <small className="text-muted">ID: {selectedProject.client}</small>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Servicio:</strong></td>
                          <td>Servicio #{selectedProject.service}</td>
                        </tr>
                        <tr>
                          <td><strong>Precio Total:</strong></td>
                          <td>{formatPrice(selectedProject.total_price)}</td>
                        </tr>
                        <tr>
                          <td><strong>Pagado:</strong></td>
                          <td>{formatPrice(selectedProject.paid_amount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6>Descripción</h6>
                    <div className="border p-3 rounded">
                      <p className="mb-0">{selectedProject.brief || 'Sin descripción'}</p>
                    </div>
                    <h6 className="mt-3">Diseñador Asignado</h6>
                    <p>{getDesignerName(selectedProject.assigned_to)}</p>
                  </div>
                </div>
                
                <div className="row mt-3">
                  <div className="col-12">
                    <h6>Información de Fechas</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <td><strong>Creado:</strong></td>
                          <td>{formatDate(selectedProject.created_at)}</td>
                        </tr>
                        <tr>
                          <td><strong>Actualizado:</strong></td>
                          <td>{formatDate(selectedProject.updated_at)}</td>
                        </tr>
                        <tr>
                          <td><strong>Fecha de Entrega:</strong></td>
                          <td>{formatDate(selectedProject.delivery_date)}</td>
                        </tr>
                        {selectedProject.start_date && (
                          <tr>
                            <td><strong>Fecha de Inicio:</strong></td>
                            <td>{formatDate(selectedProject.start_date)}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Cerrar
                </button>
                <button 
                  type="button" 
                  className="btn btn-warning"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEdit(selectedProject);
                  }}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleAssign(selectedProject);
                  }}
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Asignar Diseñador
                </button>
                {selectedProject.status !== 'completed' && (
                  <button 
                    type="button" 
                    className="btn btn-info"
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleComplete(selectedProject);
                    }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Completar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición */}
      {showEditModal && selectedProject && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Proyecto</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="edit-title" className="form-label">Título *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="edit-title"
                    value={editData.title}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="edit-brief" className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    id="edit-brief"
                    value={editData.brief}
                    onChange={(e) => setEditData(prev => ({ ...prev, brief: e.target.value }))}
                    rows="4"
                  />
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="edit-delivery-date" className="form-label">Fecha de Entrega</label>
                      <input
                        type="date"
                        className="form-control"
                        id="edit-delivery-date"
                        value={editData.delivery_date}
                        onChange={(e) => setEditData(prev => ({ ...prev, delivery_date: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label htmlFor="edit-price" className="form-label">Precio Total *</label>
                      <div className="input-group">
                        <span className="input-group-text">€</span>
                        <input
                          type="number"
                          className="form-control"
                          id="edit-price"
                          value={editData.total_price}
                          onChange={(e) => setEditData(prev => ({ ...prev, total_price: e.target.value }))}
                          step="0.01"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-warning"
                  onClick={submitEdit}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Asignación */}
      {showAssignModal && selectedProject && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Asignar Diseñador</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowAssignModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Proyecto:</strong> {selectedProject.title}</p>
                <p><strong>ID:</strong> {selectedProject.id}</p>
                <p><strong>Estado actual:</strong> {getStatusText(selectedProject.status)}</p>
                
                <div className="mb-3">
                  <label className="form-label">Seleccionar Diseñador</label>
                  <select
                    className="form-select"
                    value={assignData.assigned_to}
                    onChange={(e) => setAssignData(prev => ({ ...prev, assigned_to: e.target.value }))}
                  >
                    <option value="">Seleccionar diseñador...</option>
                    {designers && Array.isArray(designers) && designers.map((designer) => (
                      <option key={designer.id} value={designer.id}>
                        {designer.username} ({designer.first_name} {designer.last_name})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Al asignar un diseñador, el proyecto cambiará automáticamente a estado "En Progreso"
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAssignModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={submitAssign}
                  disabled={!assignData.assigned_to}
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Asignar Diseñador
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Completar */}
      {showCompleteModal && selectedProject && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Completar Proyecto</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowCompleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Proyecto:</strong> {selectedProject.title}</p>
                <p><strong>Cliente:</strong> Cliente #{selectedProject.client}</p>
                <p><strong>Diseñador:</strong> {getDesignerName(selectedProject.assigned_to)}</p>
                
                <div className="mb-3">
                  <label htmlFor="final-price" className="form-label">Precio Final *</label>
                  <div className="input-group">
                    <span className="input-group-text">€</span>
                    <input
                      type="number"
                      className="form-control"
                      id="final-price"
                      value={completeData.final_price}
                      onChange={(e) => setCompleteData(prev => ({ ...prev, final_price: e.target.value }))}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-text">
                    Precio original: {formatPrice(selectedProject.total_price)}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="completion-notes" className="form-label">Notas de Completación</label>
                  <textarea
                    className="form-control"
                    id="completion-notes"
                    value={completeData.notes}
                    onChange={(e) => setCompleteData(prev => ({ ...prev, notes: e.target.value }))}
                    rows="3"
                    placeholder="Notas adicionales sobre la finalización del proyecto..."
                  />
                </div>
                
                <div className="alert alert-success">
                  <i className="bi bi-check-circle me-2"></i>
                  <strong>¡Felicidades!</strong> Este proyecto se marcará como completado y se actualizará el dashboard con los ingresos.
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCompleteModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={submitComplete}
                  disabled={!completeData.final_price}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Completar Proyecto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManagement;
