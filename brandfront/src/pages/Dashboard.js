import React, { useState } from 'react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Proyectos Activos', value: '12', icon: 'folder', color: 'primary' },
    { title: 'Marcas Creadas', value: '8', icon: 'palette', color: 'success' },
    { title: 'Tasa de Éxito', value: '94%', icon: 'graph-up', color: 'info' },
    { title: 'Ingresos', value: '$15,420', icon: 'currency-dollar', color: 'warning' }
  ];

  const recentProjects = [
    { name: 'TechCorp Brand', status: 'Completado', progress: 100, date: '2024-03-08' },
    { name: 'EcoGreen Logo', status: 'En Progreso', progress: 75, date: '2024-03-07' },
    { name: 'FoodieApp Identity', status: 'Revisión', progress: 50, date: '2024-03-06' },
    { name: 'SportFit Design', status: 'Planificación', progress: 25, date: '2024-03-05' }
  ];

  return (
    <div className="dashboard-page">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3 col-md-4 bg-light sidebar">
            <div className="p-4">
              <h4 className="fw-bold mb-4">BrandFlow</h4>
              <nav className="nav flex-column">
                <button
                  className={`nav-link text-start mb-2 ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  <i className="bi bi-house me-2"></i>
                  Overview
                </button>
                <button
                  className={`nav-link text-start mb-2 ${activeTab === 'brands' ? 'active' : ''}`}
                  onClick={() => setActiveTab('brands')}
                >
                  <i className="bi bi-palette me-2"></i>
                  Gestión de Marcas
                </button>
                <button
                  className={`nav-link text-start mb-2 ${activeTab === 'analytics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analytics')}
                >
                  <i className="bi bi-graph-up me-2"></i>
                  Analytics
                </button>
                <button
                  className={`nav-link text-start mb-2 ${activeTab === 'reports' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reports')}
                >
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Reportes
                </button>
                <button
                  className={`nav-link text-start mb-2 ${activeTab === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveTab('settings')}
                >
                  <i className="bi bi-gear me-2"></i>
                  Configuración
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9 col-md-8">
            <div className="p-4">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="fw-bold mb-1">Dashboard</h2>
                  <p className="text-muted mb-0">Bienvenido de vuelta, administra tus marcas</p>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-plus me-2"></i>
                    Nuevo Proyecto
                  </button>
                  <button className="btn btn-primary">
                    <i className="bi bi-download me-2"></i>
                    Exportar
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="row mb-4">
                {stats.map((stat, index) => (
                  <div key={index} className="col-lg-3 col-md-6 mb-3">
                    <div className="card border-0 shadow-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className={`bg-${stat.color} bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3`}
                               style={{ width: '50px', height: '50px' }}>
                            <i className={`bi bi-${stat.icon} text-${stat.color} fs-4`}></i>
                          </div>
                          <div>
                            <h4 className="fw-bold mb-1">{stat.value}</h4>
                            <p className="text-muted mb-0 small">{stat.title}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Content based on active tab */}
              {activeTab === 'overview' && (
                <div className="row">
                  {/* Chart Section */}
                  <div className="col-lg-8 mb-4">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-transparent">
                        <h5 className="fw-bold mb-0">Rendimiento de Marca</h5>
                      </div>
                      <div className="card-body">
                        <div className="bg-light rounded p-4 text-center">
                          <i className="bi bi-bar-chart display-4 text-muted"></i>
                          <p className="mt-3 text-muted">Gráfico de Rendimiento</p>
                          <small className="text-muted">Visualización de métricas clave de marca</small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="col-lg-4 mb-4">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-transparent">
                        <h5 className="fw-bold mb-0">Actividad Reciente</h5>
                      </div>
                      <div className="card-body">
                        <div className="list-group list-group-flush">
                          <div className="list-group-item d-flex align-items-center px-0">
                            <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                                 style={{ width: '35px', height: '35px' }}>
                              <i className="bi bi-check-circle text-success"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 small">Proyecto completado</h6>
                              <small className="text-muted">TechCorp Brand</small>
                            </div>
                          </div>
                          <div className="list-group-item d-flex align-items-center px-0">
                            <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                                 style={{ width: '35px', height: '35px' }}>
                              <i className="bi bi-palette text-primary"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 small">Nueva marca creada</h6>
                              <small className="text-muted">EcoGreen Logo</small>
                            </div>
                          </div>
                          <div className="list-group-item d-flex align-items-center px-0">
                            <div className="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                                 style={{ width: '35px', height: '35px' }}>
                              <i className="bi bi-graph-up text-info"></i>
                            </div>
                            <div>
                              <h6 className="mb-1 small">Reporte generado</h6>
                              <small className="text-muted">Analytics mensual</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'brands' && (
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold mb-0">Gestión de Marcas</h5>
                    <button className="btn btn-primary btn-sm">
                      <i className="bi bi-plus me-2"></i>
                      Nueva Marca
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Proyecto</th>
                            <th>Estado</th>
                            <th>Progreso</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentProjects.map((project, index) => (
                            <tr key={index}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                                       style={{ width: '35px', height: '35px' }}>
                                    <i className="bi bi-palette text-primary"></i>
                                  </div>
                                  <span className="fw-medium">{project.name}</span>
                                </div>
                              </td>
                              <td>
                                <span className={`badge bg-${project.status === 'Completado' ? 'success' : 
                                                  project.status === 'En Progreso' ? 'primary' : 
                                                  project.status === 'Revisión' ? 'warning' : 'secondary'}`}>
                                  {project.status}
                                </span>
                              </td>
                              <td>
                                <div className="progress" style={{ height: '8px' }}>
                                  <div 
                                    className="progress-bar" 
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                                <small className="text-muted">{project.progress}%</small>
                              </td>
                              <td>{project.date}</td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button className="btn btn-outline-primary">
                                    <i className="bi bi-eye"></i>
                                  </button>
                                  <button className="btn btn-outline-success">
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button className="btn btn-outline-danger">
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="row">
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-transparent">
                        <h5 className="fw-bold mb-0">Analytics de Marca</h5>
                      </div>
                      <div className="card-body">
                        <div className="bg-light rounded p-5 text-center">
                          <i className="bi bi-graph-up display-1 text-muted"></i>
                          <h4 className="mt-3">Analytics Avanzado</h4>
                          <p className="text-muted">
                            Visualiza métricas detalladas de rendimiento de marca, 
                            engagement de usuarios y ROI de tus proyectos.
                          </p>
                          <button className="btn btn-primary">
                            Ver Reportes Detallados
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reports' && (
                <div className="row">
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-transparent">
                        <h5 className="fw-bold mb-0">Reportes</h5>
                      </div>
                      <div className="card-body">
                        <div className="bg-light rounded p-5 text-center">
                          <i className="bi bi-file-earmark-text display-1 text-muted"></i>
                          <h4 className="mt-3">Generación de Reportes</h4>
                          <p className="text-muted">
                            Crea reportes personalizados de rendimiento de marca, 
                            exporta datos y comparte insights con tu equipo.
                          </p>
                          <div className="d-flex justify-content-center gap-2 flex-wrap">
                            <button className="btn btn-primary">
                              Generar Reporte
                            </button>
                            <button className="btn btn-outline-primary">
                              Exportar Datos
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="row">
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-transparent">
                        <h5 className="fw-bold mb-0">Configuración</h5>
                      </div>
                      <div className="card-body">
                        <div className="bg-light rounded p-5 text-center">
                          <i className="bi bi-gear display-1 text-muted"></i>
                          <h4 className="mt-3">Configuración de Cuenta</h4>
                          <p className="text-muted">
                            Gestiona tu perfil, preferencias de notificación, 
                            configuración de privacidad y facturación.
                          </p>
                          <div className="d-flex justify-content-center gap-2 flex-wrap">
                            <button className="btn btn-primary">
                              Editar Perfil
                            </button>
                            <button className="btn btn-outline-primary">
                              Configuración
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 