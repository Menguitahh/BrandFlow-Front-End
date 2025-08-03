import React from 'react';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';

const Home = () => {
  const features = [
    {
      icon: 'palette',
      title: 'Diseño Personalizado',
      description: 'Crea logos únicos que reflejen tu identidad de marca con herramientas profesionales y plantillas personalizables.',
      color: 'primary'
    },
    {
      icon: 'graph-up',
      title: 'Estrategia de Marca',
      description: 'Desarrolla una estrategia coherente que conecte con tu audiencia y fortalezca tu presencia en el mercado.',
      color: 'success'
    },
    {
      icon: 'bar-chart',
      title: 'Analytics Avanzado',
      description: 'Mide el impacto de tu marca con métricas detalladas y reportes que te ayuden a tomar decisiones informadas.',
      color: 'info'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">¿Por qué elegir BrandFlow?</h2>
              <p className="lead text-muted">
                Nuestras herramientas te ayudan a crear una identidad de marca sólida y memorable
              </p>
            </div>
          </div>
          <div className="row">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h2 className="display-5 fw-bold mb-3">Vista previa del Dashboard</h2>
              <p className="lead text-muted">
                Descubre cómo BrandFlow te ayuda a gestionar tu marca de manera eficiente
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card border-0 shadow-lg">
                <div className="card-body p-4">
                  <div className="row">
                    {/* Stats Cards */}
                    <div className="col-md-4 mb-4">
                      <div className="text-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                             style={{ width: '60px', height: '60px' }}>
                          <i className="bi bi-folder text-primary fs-4"></i>
                        </div>
                        <h4 className="fw-bold mb-1">150+</h4>
                        <p className="text-muted mb-0">Proyectos Completados</p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="text-center">
                        <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                             style={{ width: '60px', height: '60px' }}>
                          <i className="bi bi-people text-success fs-4"></i>
                        </div>
                        <h4 className="fw-bold mb-1">2,500+</h4>
                        <p className="text-muted mb-0">Usuarios Activos</p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="text-center">
                        <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                             style={{ width: '60px', height: '60px' }}>
                          <i className="bi bi-graph-up text-info fs-4"></i>
                        </div>
                        <h4 className="fw-bold mb-1">98%</h4>
                        <p className="text-muted mb-0">Tasa de Éxito</p>
                      </div>
                    </div>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="bg-light rounded p-4 text-center">
                        <i className="bi bi-bar-chart display-4 text-muted"></i>
                        <p className="mt-3 text-muted">Gráfico de Rendimiento de Marca</p>
                        <small className="text-muted">Visualización interactiva de métricas clave</small>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <h5 className="fw-bold mb-3">Actividad Reciente</h5>
                      <div className="list-group list-group-flush">
                        <div className="list-group-item d-flex align-items-center">
                          <div className="bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                               style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-check-circle text-success"></i>
                          </div>
                          <div>
                            <h6 className="mb-1">Nuevo proyecto "TechCorp" completado</h6>
                            <small className="text-muted">Hace 2 horas</small>
                          </div>
                        </div>
                        <div className="list-group-item d-flex align-items-center">
                          <div className="bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                               style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-palette text-primary"></i>
                          </div>
                          <div>
                            <h6 className="mb-1">Actualización de paleta de colores</h6>
                            <small className="text-muted">Hace 1 día</small>
                          </div>
                        </div>
                        <div className="list-group-item d-flex align-items-center">
                          <div className="bg-info bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3"
                               style={{ width: '40px', height: '40px' }}>
                            <i className="bi bi-graph-up text-info"></i>
                          </div>
                          <div>
                            <h6 className="mb-1">Reporte de analytics generado</h6>
                            <small className="text-muted">Hace 3 días</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-6 fw-bold mb-4">
                ¿Listo para transformar tu marca?
              </h2>
              <p className="lead mb-4">
                Únete a miles de empresas que ya confían en BrandFlow para crear 
                identidades de marca únicas y memorables.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <button className="btn btn-light btn-lg">
                  Comenzar Gratis
                </button>
                <button className="btn btn-outline-light btn-lg">
                  Ver Demo Completo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 