import React, { useState, useEffect } from 'react';
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
    totalDesigners: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('🌐 Obteniendo estadísticas de la API real...');
        
        const [quotesResponse, projectsResponse, usersResponse, designersResponse] = await Promise.all([
          brandingAPI.quotes.list(),
          brandingAPI.projects.list(),
          adminAPI.users.list(),
          adminAPI.users.listDesigners()
        ]);
        
        console.log('✅ Estadísticas obtenidas:', { quotes: quotesResponse.length, projects: projectsResponse.length });

        // Calcular estadísticas
        const users = usersResponse.users || usersResponse;
        const designers = designersResponse.designers || designersResponse;
        
        setStats({
          totalUsers: users.length,
          totalProjects: projectsResponse.length,
          totalQuotes: quotesResponse.length,
          pendingQuotes: quotesResponse.filter(q => q.status === 'pending').length,
          activeProjects: projectsResponse.filter(p => p.status === 'in_progress').length,
          completedProjects: projectsResponse.filter(p => p.status === 'completed').length,
          totalDesigners: designers.length
        });
      } catch (error) {
        console.error('❌ Error cargando estadísticas:', error);
        // Mostrar datos vacíos si falla la API
        setStats({
          totalUsers: 0,
          totalProjects: 0,
          totalQuotes: 0,
          pendingQuotes: 0,
          activeProjects: 0,
          completedProjects: 0,
          totalDesigners: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Nueva cotización recibida</h6>
                    <small className="text-muted">Logo para TechCorp - Hace 2 horas</small>
                  </div>
                  <span className="badge bg-warning">Pendiente</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Proyecto "Branding Startup" asignado</h6>
                    <small className="text-muted">Asignado a María García - Hace 1 día</small>
                  </div>
                  <span className="badge bg-info">En Progreso</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Proyecto "Logo Restaurante" completado</h6>
                    <small className="text-muted">Entregado exitosamente - Hace 3 días</small>
                  </div>
                  <span className="badge bg-success">Completado</span>
                </div>
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
                    <h4 className="text-primary mb-1">8</h4>
                    <small className="text-muted">Nuevos Proyectos</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border-end">
                    <h4 className="text-success mb-1">€12,500</h4>
                    <small className="text-muted">Ingresos</small>
                  </div>
                </div>
                <div className="col-4">
                  <h4 className="text-info mb-1">5</h4>
                  <small className="text-muted">Clientes Activos</small>
                </div>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Proyectos Completados:</span>
                <strong>75%</strong>
              </div>
              <div className="progress mt-2">
                <div className="progress-bar" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
