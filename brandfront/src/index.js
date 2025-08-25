import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ========================================
// BrandFlow Frontend - Aplicación Principal
// ========================================
// Sistema de gestión de marcas con React + Bootstrap
// Incluye: Autenticación, Dashboard, Gestión de proyectos
// Framework: React 19 + Bootstrap 5 + React Router
// ========================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
