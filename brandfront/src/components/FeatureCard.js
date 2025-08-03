import React from 'react';

const FeatureCard = ({ icon, title, description, color = 'primary' }) => {
  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card h-100 border-0 shadow-sm">
        <div className="card-body text-center p-4">
          <div className={`feature-icon bg-${color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} 
               style={{ width: '80px', height: '80px' }}>
            <i className={`bi bi-${icon} fs-2 text-${color}`}></i>
          </div>
          <h5 className="card-title fw-bold mb-3">{title}</h5>
          <p className="card-text text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard; 