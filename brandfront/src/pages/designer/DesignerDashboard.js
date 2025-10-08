import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brandingAPI } from '../../api/branding';
import { useAuth } from '../../context/AuthContext';

const DesignerDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    assignedProjects: 0,
    completedProjects: 0,
    activeProjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('🌐 Obteniendo proyectos del diseñador de la API real...');
        
        const response = await brandingAPI.projects.list();
        // Filtrar proyectos asignados al diseñador actual (client-side filtering)
        const assignedProjects = response.filter(p => p.assigned_to === currentUser?.id);
        
        console.log('✅ Proyectos del diseñador obtenidos:', assignedProjects.length);

        setStats({
          assignedProjects: assignedProjects.length,
          completedProjects: assignedProjects.filter(p => p.status === 'completed').length,
          activeProjects: assignedProjects.filter(p => p.status === 'in_progress').length
        });
      } catch (error) {
        console.error('❌ Error cargando estadísticas:', error);
        // Mostrar datos vacíos si falla la API
        setStats({
          assignedProjects: 0,
          completedProjects: 0,
          activeProjects: 0
        });
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchStats();
    }
  }, [currentUser]);

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

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h2 mb-1">Dashboard Diseñador</h1>
              <p className="text-muted mb-0">
                Bienvenido, {currentUser?.first_name || currentUser?.username}
              </p>
            </div>
            <Link to="/designer/projects" className="btn btn-primary">
              <i className="bi bi-folder me-2"></i>
              Ver Mis Proyectos
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="display-4 text-primary mb-2">
                <i className="bi bi-folder"></i>
              </div>
              <h3 className="card-title">{stats.assignedProjects}</h3>
              <p className="card-text text-muted">Proyectos Asignados</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="display-4 text-success mb-2">
                <i className="bi bi-check-circle"></i>
              </div>
              <h3 className="card-title">{stats.completedProjects}</h3>
              <p className="card-text text-muted">Proyectos Completados</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="display-4 text-info mb-2">
                <i className="bi bi-gear"></i>
              </div>
              <h3 className="card-title">{stats.activeProjects}</h3>
              <p className="card-text text-muted">Proyectos Activos</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-folder me-2"></i>
                Mis Proyectos
              </h5>
            </div>
            <div className="card-body">
              <p className="card-text">Gestiona los proyectos que tienes asignados y comunícate con los clientes.</p>
              <Link to="/designer/projects" className="btn btn-outline-primary">
                Ver Todos los Proyectos
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-chat-dots me-2"></i>
                Comunicación
              </h5>
            </div>
            <div className="card-body">
              <p className="card-text">Mantén contacto directo con tus clientes a través del chat de cada proyecto.</p>
              <Link to="/designer/projects" className="btn btn-outline-primary">
                Ir a Proyectos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-clock me-2"></i>
                Actividad Reciente
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Nuevo mensaje en "Branding TechCorp"</h6>
                    <small className="text-muted">Cliente solicitó ver opciones preliminares - Hace 1 hora</small>
                  </div>
                  <Link to="/designer/projects/1" className="btn btn-sm btn-outline-primary">
                    Ver Proyecto
                  </Link>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Proyecto "Logo Restaurante" completado</h6>
                    <small className="text-muted">Entregado exitosamente - Hace 2 días</small>
                  </div>
                  <span className="badge bg-success">Completado</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Asignado nuevo proyecto</h6>
                    <small className="text-muted">"Material Gráfico Consultora" - Hace 5 días</small>
                  </div>
                  <Link to="/designer/projects/3" className="btn btn-sm btn-outline-primary">
                    Ver Proyecto
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerDashboard;
