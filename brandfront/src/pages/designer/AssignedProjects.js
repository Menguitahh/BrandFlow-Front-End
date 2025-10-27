import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brandingAPI } from '../../api/branding';
import { useAuth } from '../../context/AuthContext';

const AssignedProjects = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('🌐 Obteniendo proyectos asignados de la API real...');
        
        const response = await brandingAPI.projects.list();
        // Filtrar proyectos asignados al diseñador actual (client-side filtering)
        const assignedProjects = response.filter(p => p.assigned_to === currentUser?.id);
        
        console.log('✅ Proyectos asignados obtenidos:', assignedProjects.length);

        setProjects(assignedProjects);
      } catch (error) {
        setError('Error al cargar los proyectos');
        console.error('❌ Error:', error);
        // Mostrar lista vacía si falla la API
        setProjects([]);
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
            <h1 className="h2 mb-0">Mis Proyectos Asignados</h1>
            <span className="badge bg-primary fs-6">
              {projects.length} proyecto{projects.length !== 1 ? 's' : ''}
            </span>
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
              <h3>No tienes proyectos asignados</h3>
              <p className="text-muted">Los administradores te asignarán proyectos cuando estén disponibles.</p>
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
                        <th>Cliente</th>
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
                            <div>
                              <div>
                                <i className="bi bi-person-circle me-1"></i>
                                {project.client.first_name} {project.client.last_name}
                              </div>
                              <small className="text-muted">{project.client.email}</small>
                            </div>
                          </td>
                          <td>{getStatusBadge(project.status)}</td>
                          <td>{formatDate(project.delivery_date)}</td>
                          <td>{formatCurrency(project.quote?.price || 0)}</td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group">
                              <Link 
                                to={`/designer/projects/${project.id}`}
                                className="btn btn-outline-primary btn-view"
                                title="Ver detalles y chat"
                              >
                                <i className="bi bi-eye"></i>
                              </Link>
                              {project.status === 'in_progress' && (
                                <button 
                                  className="btn btn-outline-success btn-complete"
                                  title="Marcar como completado"
                                >
                                  <i className="bi bi-check-circle"></i>
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
              <p className="card-text text-muted">Valor Total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedProjects;
