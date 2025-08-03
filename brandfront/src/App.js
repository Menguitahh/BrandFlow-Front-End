import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/services" element={<div className="container py-5"><h1>Servicios</h1><p>Página de servicios en desarrollo...</p></div>} />
              <Route path="/about" element={<div className="container py-5"><h1>Acerca de</h1><p>Página sobre nosotros en desarrollo...</p></div>} />
              <Route path="/contact" element={<div className="container py-5"><h1>Contacto</h1><p>Página de contacto en desarrollo...</p></div>} />
              <Route path="/profile" element={<div className="container py-5"><h1>Información Personal</h1><p>Página de información personal en desarrollo...</p></div>} />
              <Route path="/settings" element={<div className="container py-5"><h1>Configuración de Cuenta</h1><p>Página de configuración en desarrollo...</p></div>} />
              <Route path="/demo" element={<div className="container py-5"><h1>Demo</h1><p>Página de demo en desarrollo...</p></div>} />
              <Route path="*" element={<div className="container py-5"><h1>404 - Página no encontrada</h1><p>La página que buscas no existe.</p></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
