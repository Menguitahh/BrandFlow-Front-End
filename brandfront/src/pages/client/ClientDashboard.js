import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { brandingAPI } from '../../api/branding';

const ClientDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    quotes: 0,
    projects: 0,
    activeProjects: 0
  });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [quotesResponse, projectsResponse] = await Promise.all([
          brandingAPI.quotes.list(),
          brandingAPI.projects.list()
        ]);
        
        // Filtrar datos del cliente actual
        const quotes = quotesResponse.filter(quote => quote.client === currentUser?.id);
        const projects = projectsResponse.filter(project => project.client === currentUser?.id);
        
        console.log('✅ Datos obtenidos de la API real:', { quotes: quotes.length, projects: projects.length });

        // Calcular estadísticas
        setStats({
          quotes: quotes.length,
          activeProjects: projects.filter(p => p.status === 'in_progress').length,
          completedProjects: projects.filter(p => p.status === 'completed').length
        });

        // Obtener cotizaciones y proyectos recientes
        setRecentQuotes(quotes.slice(0, 3));
        setRecentProjects(projects.slice(0, 3));

          } catch (error) {
            console.error('❌ Error cargando estadísticas:', error);
            
            // Mostrar datos vacíos si falla la API
            setStats({ quotes: 0, activeProjects: 0, completedProjects: 0 });
            setRecentQuotes([]);
            setRecentProjects([]);
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
            <h1 className="h2 mb-0">Dashboard Cliente</h1>
            <Link to="/client/quotes/new" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Cotización
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
                <i className="bi bi-file-text"></i>
              </div>
              <h3 className="card-title">{stats.quotes}</h3>
              <p className="card-text text-muted">Cotizaciones</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="display-4 text-success mb-2">
                <i className="bi bi-folder"></i>
              </div>
              <h3 className="card-title">{stats.projects}</h3>
              <p className="card-text text-muted">Proyectos Totales</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="display-4 text-warning mb-2">
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
                <i className="bi bi-file-text me-2"></i>
                Mis Cotizaciones
              </h5>
            </div>
            <div className="card-body">
              <p className="card-text">Gestiona tus solicitudes de cotización y revisa su estado.</p>
              <Link to="/client/quotes" className="btn btn-outline-primary">
                Ver Todas las Cotizaciones
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-folder me-2"></i>
                Mis Proyectos
              </h5>
            </div>
            <div className="card-body">
              <p className="card-text">Revisa el progreso de tus proyectos y comunícate con el equipo.</p>
              <Link to="/client/projects" className="btn btn-outline-primary">
                Ver Todos los Proyectos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="row mt-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-briefcase me-2"></i>
                Nuestros Servicios
              </h5>
            </div>
            <div className="card-body">
              <p className="card-text">Descubre todos los servicios de branding que ofrecemos y solicita una cotización.</p>
              <Link to="/client/services" className="btn btn-outline-primary">
                Ver Servicios Disponibles
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-plus-circle me-2"></i>
                Nueva Cotización
              </h5>
            </div>
            <div className="card-body">
              <p className="card-text">Solicita una cotización personalizada para tu proyecto de branding.</p>
              <Link to="/client/quotes/new" className="btn btn-primary">
                Crear Nueva Cotización
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
                    <h6 className="mb-1">Nueva cotización enviada</h6>
                    <small className="text-muted">Logo para TechCorp - Hace 2 horas</small>
                  </div>
                  <span className="badge bg-warning">Pendiente</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Proyecto "Branding Startup" en progreso</h6>
                    <small className="text-muted">Diseño de identidad corporativa - Hace 1 día</small>
                  </div>
                  <span className="badge bg-success">En Progreso</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">Cotización aprobada</h6>
                    <small className="text-muted">Rediseño de logo - Hace 3 días</small>
                  </div>
                  <span className="badge bg-info">Aprobada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
