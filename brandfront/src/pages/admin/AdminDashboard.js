import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { brandingAPI } from '../../api/branding';
import { adminAPI } from '../../api/admin';
import { testAdminEndpoints, testPostOperations } from '../../utils/adminTest';
import { testLoginCredentials, showAvailableCredentials } from '../../utils/loginTest';
import { runAuthDiagnostics } from '../../utils/authTest';
import { verifyExistingUsers, testOnlyExistingUsers } from '../../utils/userVerification';

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
  const [testingEndpoints, setTestingEndpoints] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [loginTestResults, setLoginTestResults] = useState(null);
  const [authDiagnostics, setAuthDiagnostics] = useState(null);
  const [userVerification, setUserVerification] = useState(null);

  // Función para generar actividades recientes basadas en datos reales
  const generateRecentActivities = (quotes, projects, users) => {
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
  };

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

  useEffect(() => {
    // Escuchar eventos de proyectos completados
    const handleProjectCompleted = (event) => {
      if (event.data && event.data.type === 'PROJECT_COMPLETED') {
        console.log('🔄 Proyecto completado, actualizando dashboard...');
        fetchStats(); // Refrescar estadísticas
      }
    };
    
    window.addEventListener('message', handleProjectCompleted);
    
    const fetchStats = async () => {
      try {
        console.log('🌐 Obteniendo estadísticas de la API real...');
        
        const [quotesResponse, projectsResponse, usersResponse, designersResponse] = await Promise.all([
          brandingAPI.quotes.list(),
          brandingAPI.projects.list(),
          adminAPI.users.list(),
          adminAPI.users.listDesigners()
        ]);
        
        // Calcular ingresos totales de proyectos completados
        const totalEarnings = projectsResponse
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + parseFloat(p.total_price || 0), 0);
        
        // Generar actividades recientes basadas en datos reales
        const recentActivities = generateRecentActivities(quotesResponse, projectsResponse, users);
        
        console.log('✅ Estadísticas obtenidas:', { quotes: quotesResponse.length, projects: projectsResponse.length });

        // Calcular estadísticas
        const users = usersResponse.users || usersResponse;
        const designers = designersResponse.designers || designersResponse;
        
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
        
        // Actualizar actividades recientes
        setRecentActivities(recentActivities);
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
          totalDesigners: 0,
          totalEarnings: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Cleanup del event listener
    return () => {
      window.removeEventListener('message', handleProjectCompleted);
    };
  }, []);

  const handleTestEndpoints = async () => {
    setTestingEndpoints(true);
    try {
      const result = await testAdminEndpoints();
      setTestResults(result);
      if (result.success) {
        alert('✅ Todas las pruebas GET pasaron exitosamente! Revisa la consola para más detalles.');
      } else {
        alert('❌ Algunas pruebas fallaron. Revisa la consola para más detalles.');
      }
    } catch (error) {
      console.error('Error en pruebas:', error);
      alert('❌ Error ejecutando pruebas');
    } finally {
      setTestingEndpoints(false);
    }
  };

  const handleTestPostOperations = async () => {
    setTestingEndpoints(true);
    try {
      const result = await testPostOperations();
      if (result.success) {
        alert('✅ Todas las pruebas POST pasaron exitosamente! Revisa la consola para más detalles.');
      } else {
        alert('❌ Algunas pruebas POST fallaron. Revisa la consola para más detalles.');
      }
    } catch (error) {
      console.error('Error en pruebas POST:', error);
      alert('❌ Error ejecutando pruebas POST');
    } finally {
      setTestingEndpoints(false);
    }
  };

  const handleTestLogin = async () => {
    setTestingEndpoints(true);
    try {
      showAvailableCredentials();
      const result = await testLoginCredentials();
      setLoginTestResults(result);
      
      if (result.successful === result.total) {
        alert(`✅ Todas las credenciales funcionan correctamente! (${result.successful}/${result.total})`);
      } else {
        alert(`⚠️ Algunas credenciales fallaron. (${result.successful}/${result.total}) Revisa la consola.`);
      }
    } catch (error) {
      console.error('Error en pruebas de login:', error);
      alert('❌ Error ejecutando pruebas de login');
    } finally {
      setTestingEndpoints(false);
    }
  };

  const handleAuthDiagnostics = async () => {
    setTestingEndpoints(true);
    try {
      const results = await runAuthDiagnostics();
      setAuthDiagnostics(results);
      
      if (results.allSuccess) {
        alert('✅ Diagnóstico de autenticación exitoso! Revisa la consola para detalles.');
      } else {
        alert('⚠️ Algunos problemas detectados en la autenticación. Revisa la consola.');
      }
    } catch (error) {
      console.error('Error en diagnóstico de autenticación:', error);
      alert('❌ Error ejecutando diagnóstico de autenticación');
    } finally {
      setTestingEndpoints(false);
    }
  };

  const handleVerifyUsers = async () => {
    setTestingEndpoints(true);
    try {
      const result = await verifyExistingUsers();
      setUserVerification(result);
      
      if (result.success) {
        alert(`✅ Verificación de usuarios completada! Encontrados ${result.totalUsers} usuarios. Revisa la consola para detalles.`);
      } else {
        alert('❌ Error verificando usuarios. Revisa la consola.');
      }
    } catch (error) {
      console.error('Error verificando usuarios:', error);
      alert('❌ Error ejecutando verificación de usuarios');
    } finally {
      setTestingEndpoints(false);
    }
  };

  const handleTestExistingUsers = async () => {
    setTestingEndpoints(true);
    try {
      const result = await testOnlyExistingUsers();
      setLoginTestResults(result);
      
      if (result.successful === result.total) {
        alert(`✅ Todas las credenciales de usuarios existentes funcionan! (${result.successful}/${result.total})`);
      } else {
        alert(`⚠️ Algunas credenciales fallaron. (${result.successful}/${result.total}) Revisa la consola.`);
      }
    } catch (error) {
      console.error('Error probando usuarios existentes:', error);
      alert('❌ Error ejecutando pruebas de usuarios existentes');
    } finally {
      setTestingEndpoints(false);
    }
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

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 mb-0">Dashboard Administrador</h1>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-success btn-sm"
                onClick={handleTestEndpoints}
                disabled={testingEndpoints}
              >
                {testingEndpoints ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Probando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Probar GET
                  </>
                )}
              </button>
              <button 
                className="btn btn-outline-warning btn-sm"
                onClick={handleTestPostOperations}
                disabled={testingEndpoints}
              >
                {testingEndpoints ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Probando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-gear me-2"></i>
                    Probar POST
                  </>
                )}
              </button>
              <button 
                className="btn btn-outline-info btn-sm"
                onClick={handleTestLogin}
                disabled={testingEndpoints}
              >
                {testingEndpoints ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Probando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-key me-2"></i>
                    Probar Login
                  </>
                )}
              </button>
              <button 
                className="btn btn-outline-danger btn-sm"
                onClick={handleAuthDiagnostics}
                disabled={testingEndpoints}
              >
                {testingEndpoints ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Probando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-shield-check me-2"></i>
                    Diagnóstico
                  </>
                )}
              </button>
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={handleVerifyUsers}
                disabled={testingEndpoints}
              >
                {testingEndpoints ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Probando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-people me-2"></i>
                    Verificar Usuarios
                  </>
                )}
              </button>
              <button 
                className="btn btn-outline-dark btn-sm"
                onClick={handleTestExistingUsers}
                disabled={testingEndpoints}
              >
                {testingEndpoints ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Probando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-check me-2"></i>
                    Probar Existentes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {testResults && (
        <div className="row mb-4">
          <div className="col-12">
            <div className={`alert ${testResults.success ? 'alert-success' : 'alert-danger'}`} role="alert">
              <h5 className="alert-heading">
                {testResults.success ? '✅ Pruebas Exitosas' : '❌ Pruebas Fallidas'}
              </h5>
              {testResults.success ? (
                <p>Los endpoints están funcionando correctamente. Revisa la consola para ver los datos obtenidos.</p>
              ) : (
                <p>Error: {testResults.error}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {loginTestResults && (
        <div className="row mb-4">
          <div className="col-12">
            <div className={`alert ${loginTestResults.successful === loginTestResults.total ? 'alert-success' : 'alert-warning'}`} role="alert">
              <h5 className="alert-heading">
                {loginTestResults.successful === loginTestResults.total ? '✅ Login Tests Exitosos' : '⚠️ Algunos Login Tests Fallaron'}
              </h5>
              <p>
                <strong>Resultados:</strong> {loginTestResults.successful}/{loginTestResults.total} credenciales funcionan correctamente
              </p>
              <p className="mb-0">
                <strong>Detalles:</strong> Revisa la consola para ver el resultado de cada credencial probada.
              </p>
            </div>
          </div>
        </div>
      )}

      {authDiagnostics && (
        <div className="row mb-4">
          <div className="col-12">
            <div className={`alert ${authDiagnostics.allSuccess ? 'alert-success' : 'alert-warning'}`} role="alert">
              <h5 className="alert-heading">
                {authDiagnostics.allSuccess ? '✅ Diagnóstico de Autenticación Exitoso' : '⚠️ Problemas Detectados en Autenticación'}
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Autenticación:</strong> {authDiagnostics.results.authentication.success ? '✅' : '❌'}</p>
                  <p><strong>CSRF Token:</strong> {authDiagnostics.results.csrf.success ? '✅' : '❌'}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>Sesión:</strong> {authDiagnostics.results.session.success ? '✅' : '❌'}</p>
                  <p><strong>Permisos Admin:</strong> {authDiagnostics.results.adminPermissions.success ? '✅' : '❌'}</p>
                </div>
              </div>
              <p className="mb-0">
                <strong>Detalles:</strong> Revisa la consola para ver el diagnóstico completo.
              </p>
            </div>
          </div>
        </div>
      )}

      {userVerification && (
        <div className="row mb-4">
          <div className="col-12">
            <div className={`alert ${userVerification.success ? 'alert-info' : 'alert-danger'}`} role="alert">
              <h5 className="alert-heading">
                {userVerification.success ? '📊 Verificación de Usuarios Completada' : '❌ Error en Verificación de Usuarios'}
              </h5>
              {userVerification.success ? (
                <>
                  <p><strong>Total de usuarios:</strong> {userVerification.totalUsers}</p>
                  <div className="row">
                    {Object.entries(userVerification.usersByRole).map(([role, users]) => (
                      <div key={role} className="col-md-6">
                        <p><strong>{role.toUpperCase()}:</strong> {users.length} usuarios</p>
                      </div>
                    ))}
                  </div>
                  <p className="mb-0">
                    <strong>Detalles:</strong> Revisa la consola para ver la lista completa de usuarios.
                  </p>
                </>
              ) : (
                <p className="mb-0">Error: {userVerification.error}</p>
              )}
            </div>
          </div>
        </div>
      )}

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
