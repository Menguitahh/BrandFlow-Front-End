import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { brandingAPI } from '../../api/branding';
import { adminAPI } from '../../api/admin';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalQuotes: 0,
    pendingQuotes: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalDesigners: 0,
    totalEarnings: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para generar actividades recientes basadas en datos reales
  const generateRecentActivities = useCallback((quotes, projects, users) => {
    const activities = [];
    
    // Obtener cotizaciones recientes (pendientes y aprobadas)
    const recentQuotes = quotes
      .filter(q => q.status === 'pending' || q.status === 'submitted' || q.status === 'approved')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 2);
    
    recentQuotes.forEach(quote => {
      activities.push({
        id: `quote-${quote.id}`,
        type: 'quote',
        title: quote.status === 'approved' ? 'Cotización aprobada' : 'Nueva cotización recibida',
        description: `${quote.title} - ${formatTimeAgo(quote.created_at)}`,
        status: quote.status === 'approved' ? 'success' : 'warning',
        statusText: quote.status === 'approved' ? 'Aprobada' : 'Pendiente',
        timestamp: quote.created_at
      });
    });
    
    // Obtener proyectos recientes (en progreso y completados)
    const recentProjects = projects
      .filter(p => p.status === 'in_progress' || p.status === 'completed')
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 3);
    
    recentProjects.forEach(project => {
      if (project.status === 'completed') {
        activities.push({
          id: `project-completed-${project.id}`,
          type: 'project_completed',
          title: `Proyecto "${project.title}" completado`,
          description: `Entregado exitosamente - ${formatTimeAgo(project.updated_at)}`,
          status: 'success',
          statusText: 'Completado',
          timestamp: project.updated_at
        });
      } else if (project.assigned_to) {
        const designer = users.find(u => u.id === project.assigned_to);
        const designerName = designer ? 
          `${designer.first_name || ''} ${designer.last_name || ''}`.trim() || designer.username :
          `Diseñador #${project.assigned_to}`;
        
        activities.push({
          id: `project-assigned-${project.id}`,
          type: 'project_assigned',
          title: `Proyecto "${project.title}" asignado`,
          description: `Asignado a ${designerName} - ${formatTimeAgo(project.updated_at)}`,
          status: 'info',
          statusText: 'En Progreso',
          timestamp: project.updated_at
        });
      }
    });
    
    // Ordenar por timestamp y tomar los 3 más recientes
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 3);
  }, []);

  // Función para formatear tiempo relativo
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minutos`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }
  };

  const fetchStats = useCallback(async () => {
    try {
      console.log('🌐 Obteniendo estadísticas de la API real...');
      const [quotesResponse, projectsResponse, usersResponse, designersResponse] = await Promise.all([
        brandingAPI.quotes.list(),
        brandingAPI.projects.list(),
        adminAPI.users.list(),
        adminAPI.users.listDesigners()
      ]);
      const users = usersResponse.users || usersResponse;
      const designers = designersResponse.designers || designersResponse;
      const totalEarnings = projectsResponse
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + parseFloat(p.total_price || 0), 0);
      const recent = generateRecentActivities(quotesResponse, projectsResponse, users);
      setStats({
        totalUsers: users.length,
        totalProjects: projectsResponse.length,
        totalQuotes: quotesResponse.length,
        pendingQuotes: quotesResponse.filter(q => q.status === 'pending' || q.status === 'submitted').length,
        activeProjects: projectsResponse.filter(p => p.status === 'in_progress').length,
        completedProjects: projectsResponse.filter(p => p.status === 'completed').length,
        totalDesigners: designers.length,
        totalEarnings: totalEarnings
      });
      setRecentActivities(recent);
    } catch (error) {
      console.error('❌ Error cargando estadísticas:', error);
      setStats({
        totalUsers: 0,
        totalProjects: 0,
        totalQuotes: 0,
        pendingQuotes: 0,
        activeProjects: 0,
        completedProjects: 0,
        totalDesigners: 0,
        totalEarnings: 0
      });
    } finally {
      setLoading(false);
    }
  }, [generateRecentActivities]);

  useEffect(() => {
    const handleProjectCompleted = (event) => {
      if (event.data && event.data.type === 'PROJECT_COMPLETED') {
        console.log('🔄 Proyecto completado, actualizando dashboard...');
        fetchStats();
      }
    };
    window.addEventListener('message', handleProjectCompleted);
    fetchStats();
    return () => {
      window.removeEventListener('message', handleProjectCompleted);
    };
  }, [fetchStats]);


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
          <h1 className="h2 mb-4">Dashboard Administrador</h1>
        </div>
      </div>


      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <div className="display-6 text-primary mb-2">
                <i className="bi bi-people"></i>
              </div>
              <h4 className="card-title">{stats.totalUsers}</h4>
              <p className="card-text text-muted small">Usuarios</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <div className="display-6 text-info mb-2">
                <i className="bi bi-file-text"></i>
              </div>
              <h4 className="card-title">{stats.totalQuotes}</h4>
              <p className="card-text text-muted small">Cotizaciones</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <div className="display-6 text-warning mb-2">
                <i className="bi bi-clock"></i>
              </div>
              <h4 className="card-title">{stats.pendingQuotes}</h4>
              <p className="card-text text-muted small">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <div className="display-6 text-secondary mb-2">
                <i className="bi bi-folder"></i>
              </div>
              <h4 className="card-title">{stats.totalProjects}</h4>
              <p className="card-text text-muted small">Proyectos</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <div className="display-6 text-success mb-2">
                <i className="bi bi-gear"></i>
              </div>
              <h4 className="card-title">{stats.activeProjects}</h4>
              <p className="card-text text-muted small">Activos</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <div className="display-6 text-dark mb-2">
                <i className="bi bi-check-circle"></i>
              </div>
              <h4 className="card-title">{stats.completedProjects}</h4>
              <p className="card-text text-muted small">Completados</p>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="card text-center">
            <div className="card-body">
              <div className="display-6 text-primary mb-2">
                <i className="bi bi-palette"></i>
              </div>
              <h4 className="card-title">{stats.totalDesigners}</h4>
              <p className="card-text text-muted small">Diseñadores</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-list-ul me-2"></i>
                Servicios
              </h5>
            </div>
            <div className="card-body">
              <p className="card-text">Gestiona las categorías y servicios disponibles.</p>
              <a href="/admin/services" className="btn btn-outline-primary btn-sm">
                Administrar Servicios
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-file-text me-2"></i>
                Cotizaciones
              </h5>
            </div>
            <div className="card-body">
              <p className="card-text">Revisa y aprueba las cotizaciones pendientes.</p>
              <a href="/admin/quotes" className="btn btn-outline-primary btn-sm">
                Revisar Cotizaciones
              </a>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-folder me-2"></i>
                Proyectos
              </h5>
            </div>
            <div className="card-body">
              <p className="card-text">Gestiona todos los proyectos y asigna diseñadores.</p>
              <Link to="/admin/projects" className="btn btn-outline-primary btn-sm">
                Gestionar Proyectos
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-people me-2"></i>
                Usuarios
              </h5>
            </div>
            <div className="card-body">
              <p className="card-text">Gestiona usuarios y cambia roles.</p>
              <Link to="/admin/users" className="btn btn-outline-primary btn-sm">
                Gestionar Usuarios
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Admin Actions */}
      <div className="row mt-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-person-plus me-2"></i>
                Asignar Diseñadores
              </h5>
            </div>
            <div className="card-body">
              <p className="card-text">Asigna diseñadores a proyectos específicos.</p>
              <Link to="/admin/assign" className="btn btn-outline-success btn-sm">
                Asignar Diseñadores
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-people me-2"></i>
                Usuarios
              </h5>
            </div>
            <div className="card-body">
              <p className="card-text">Administra usuarios y asigna roles.</p>
              <a href="/admin/users" className="btn btn-outline-primary btn-sm">
                Gestionar Usuarios
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-clock me-2"></i>
                Actividad Reciente
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{activity.title}</h6>
                        <small className="text-muted">{activity.description}</small>
                      </div>
                      <span className={`badge bg-${activity.status}`}>{activity.statusText}</span>
                    </div>
                  ))
                ) : (
                  <div className="list-group-item">
                    <div className="text-center text-muted py-3">
                      <i className="fas fa-info-circle me-2"></i>
                      No hay actividades recientes
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Resumen del Mes
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <div className="border-end">
                    <h4 className="text-primary mb-1">{stats.totalProjects}</h4>
                    <small className="text-muted">Total Proyectos</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border-end">
                    <h4 className="text-success mb-1">
                      €{stats.totalEarnings ? stats.totalEarnings.toFixed(2) : '0.00'}
                    </h4>
                    <small className="text-muted">Ingresos Totales</small>
                  </div>
                </div>
                <div className="col-4">
                  <h4 className="text-info mb-1">{stats.completedProjects}</h4>
                  <small className="text-muted">Completados</small>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Proyectos Completados:</span>
                <strong>{stats.totalProjects > 0 ? Math.round((stats.completedProjects / stats.totalProjects) * 100) : 0}%</strong>
              </div>
              <div className="progress mt-2">
                <div 
                  className="progress-bar" 
                  style={{ width: `${stats.totalProjects > 0 ? (stats.completedProjects / stats.totalProjects) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
