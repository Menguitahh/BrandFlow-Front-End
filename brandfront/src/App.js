import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/services" element={<div className="container py-5"><h1>Servicios</h1><p>Página de servicios en desarrollo...</p></div>} />
            <Route path="/about" element={<div className="container py-5"><h1>Acerca de</h1><p>Página sobre nosotros en desarrollo...</p></div>} />
            <Route path="/contact" element={<div className="container py-5"><h1>Contacto</h1><p>Página de contacto en desarrollo...</p></div>} />
            <Route path="/login" element={<div className="container py-5"><h1>Iniciar Sesión</h1><p>Página de login en desarrollo...</p></div>} />
            <Route path="/register" element={<div className="container py-5"><h1>Registrarse</h1><p>Página de registro en desarrollo...</p></div>} />
            <Route path="/profile" element={<div className="container py-5"><h1>Perfil</h1><p>Página de perfil en desarrollo...</p></div>} />
            <Route path="/demo" element={<div className="container py-5"><h1>Demo</h1><p>Página de demo en desarrollo...</p></div>} />
            <Route path="*" element={<div className="container py-5"><h1>404 - Página no encontrada</h1><p>La página que buscas no existe.</p></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
