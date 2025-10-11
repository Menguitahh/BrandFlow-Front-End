import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';
import { brandingAPI } from '../../api/branding';

const ProjectAssignment = () => {
  const [projects, setProjects] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDesigner, setSelectedDesigner] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsData, designersData] = await Promise.all([
        brandingAPI.projects.list(),
        adminAPI.users.listDesigners()
      ]);
      
      setProjects(projectsData);
      setDesigners(designersData.designers || designersData);
      setError(null);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar proyectos y diseñadores');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDesigner = async () => {
    if (!selectedProject || !selectedDesigner) return;

    try {
      setAssigning(true);
      const result = await adminAPI.projects.assignDesigner(selectedProject.id, selectedDesigner);
      
      // Actualizar la lista de proyectos
      await fetchData();
      
      // Cerrar modal y limpiar estado
      setShowAssignmentModal(false);
      setSelectedProject(null);
      setSelectedDesigner('');
      
      alert(result.message || 'Diseñador asignado exitosamente');
    } catch (err) {
      console.error('Error asignando diseñador:', err);
      alert('Error al asignar diseñador al proyecto');
    } finally {
      setAssigning(false);
    }
  };

  const openAssignmentModal = (project) => {
    setSelectedProject(project);
    setSelectedDesigner(project.assigned_to || '');
    setShowAssignmentModal(true);
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'quote': 'bg-secondary',
      'in_progress': 'bg-primary',
      'completed': 'bg-success',
      'payment_pending': 'bg-warning',
      'cancelled': 'bg-danger'
    };
    return statusClasses[status] || 'bg-secondary';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'quote': 'Cotización',
      'in_progress': 'En Progreso',
      'completed': 'Completado',
      'payment_pending': 'Pendiente Pago',
      'cancelled': 'Cancelado'
    };
    return statusTexts[status] || status;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getDesignerName = (designerId) => {
    if (!designerId) return 'Sin asignar';
    const designer = designers.find(d => d.id === designerId);
    if (designer) {
      // Mostrar nombre completo si está disponible, sino solo username
      const fullName = designer.first_name && designer.last_name 
        ? `${designer.first_name} ${designer.last_name}`.trim()
        : designer.username;
      return fullName;
    }
    return `ID: ${designerId}`;
  };

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
            <h1 className="h3 mb-0">Asignación de Proyectos</h1>
            <button className="btn btn-primary" onClick={fetchData}>
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
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{designers.length}</h4>
                      <small>Diseñadores</small>
                    </div>
                    <i className="bi bi-palette display-6"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de proyectos */}
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Cliente</th>
                      <th>Servicio</th>
                      <th>Estado</th>
                      <th>Diseñador Asignado</th>
                      <th>Fecha Creación</th>
                      <th>Fecha Entrega</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="text-center text-muted py-4">
                          No se encontraron proyectos
                        </td>
                      </tr>
                    ) : (
                      projects.map((project) => (
                        <tr key={project.id}>
                          <td>{project.id}</td>
                          <td>
                            <strong>{project.title}</strong>
                          </td>
                          <td>ID: {project.client}</td>
                          <td>ID: {project.service}</td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(project.status)}`}>
                              {getStatusText(project.status)}
                            </span>
                          </td>
                          <td>
                            {project.assigned_to ? (
                              <span className="badge bg-primary">
                                {getDesignerName(project.assigned_to)}
                              </span>
                            ) : (
                              <span className="text-muted">Sin asignar</span>
                            )}
                          </td>
                          <td>{formatDate(project.created_at)}</td>
                          <td>{formatDate(project.delivery_date)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openAssignmentModal(project)}
                              title="Asignar diseñador"
                            >
                              <i className="bi bi-person-plus"></i>
                            </button>
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

      {/* Modal para asignar diseñador */}
      {showAssignmentModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Asignar Diseñador</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAssignmentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Proyecto:</strong> {selectedProject?.title}
                </p>
                <p>
                  <strong>ID:</strong> {selectedProject?.id}
                </p>
                <p>
                  <strong>Estado actual:</strong> 
                  <span className={`badge ${getStatusBadgeClass(selectedProject?.status)} ms-2`}>
                    {getStatusText(selectedProject?.status)}
                  </span>
                </p>
                
                <div className="mb-3">
                  <label className="form-label">Seleccionar Diseñador</label>
                  <select
                    className="form-select"
                    value={selectedDesigner}
                    onChange={(e) => setSelectedDesigner(e.target.value)}
                  >
                    <option value="">Seleccionar diseñador...</option>
                    {designers.map((designer) => (
                      <option key={designer.id} value={designer.id}>
                        {designer.username} ({designer.first_name} {designer.last_name})
                      </option>
                    ))}
                  </select>
                  {designers.length === 0 && (
                    <div className="form-text text-warning">
                      No hay diseñadores disponibles
                    </div>
                  )}
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
                  onClick={() => setShowAssignmentModal(false)}
                  disabled={assigning}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAssignDesigner}
                  disabled={!selectedDesigner || assigning}
                >
                  {assigning ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Asignando...
                    </>
                  ) : (
                    'Asignar Diseñador'
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

export default ProjectAssignment;
