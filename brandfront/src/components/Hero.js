import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="hero-section bg-gradient-primary text-white py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="hero-content">
              <h1 className="display-4 fw-bold mb-4">
                Transforma tu marca con BrandFlow
              </h1>
              <p className="lead mb-4">
                La plataforma definitiva para crear identidades de marca únicas y memorables. 
                Desde el diseño de logos hasta estrategias completas de branding, 
                BrandFlow es tu compañero ideal para llevar tu marca al siguiente nivel.
              </p>
              <div className="hero-buttons">
                <Link to="/dashboard" className="btn btn-light btn-lg me-3 mb-2">
                  Comenzar Ahora
                </Link>
                <Link to="/demo" className="btn btn-outline-light btn-lg mb-2">
                  Ver Demo
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