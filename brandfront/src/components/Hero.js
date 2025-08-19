import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero-section text-white py-5" style={{ backgroundColor: '#2f2f4d' }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="display-4 fw-bold mb-4">
                ¿Listo para transformar tu marca?
              </h1>
              <p className="lead mb-4">
                Únete a miles de empresas que ya confían en BrandFlow para crear identidades de marca únicas y memorables.
              </p>
              <div className="hero-buttons">
                <Link to="/dashboard" className="btn btn-primary btn-lg me-3 mb-2">
                  Comenzar Gratis
                </Link>
                <Link to="/demo" className="btn btn-outline-light btn-lg mb-2">
                  Ver Demo Completo
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-image text-center">
              <div className="hero-placeholder bg-white bg-opacity-10 rounded-3 p-5">
                <i className="bi bi-palette display-1 text-white-50"></i>
                <p className="mt-3 text-white-50">Visualización de BrandFlow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 