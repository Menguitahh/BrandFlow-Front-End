import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PublicHome from './pages/PublicHome';
import Services from './pages/Services';
import Quote from './pages/Quote';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import RoleGuard from './components/RoleGuard';
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles/theme.css';
import './styles/public.css';
import './App.css';

// Importar páginas del cliente
import ClientDashboard from './pages/client/ClientDashboard';
import QuotesList from './pages/client/QuotesList';
import QuotesNew from './pages/client/QuotesNew';
import ProjectsList from './pages/client/ProjectsList';
import ProjectDetail from './pages/client/ProjectDetail';
import ServicesList from './pages/client/ServicesList';

// Importar páginas del diseñador
import DesignerDashboard from './pages/designer/DesignerDashboard';
import AssignedProjects from './pages/designer/AssignedProjects';
import DesignerProjectDetail from './pages/designer/DesignerProjectDetail';

// Importar páginas del admin
import AdminDashboard from './pages/admin/AdminDashboard';
import ServicesManagement from './pages/admin/ServicesManagement';
import QuotesReview from './pages/admin/QuotesReview';
import UsersManagement from './pages/admin/UsersManagement';
import ProjectAssignment from './pages/admin/ProjectAssignment';
import ProjectsManagement from './pages/admin/ProjectsManagement';
import ProjectChat from './pages/admin/ProjectChat';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<PublicHome />} />
              <Route path="/services" element={<Services />} />
              <Route path="/quote" element={<Quote />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Ruta de perfil */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Ruta principal con redirección por rol */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <RoleGuard>
                    <Home />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              
              {/* Rutas de Admin */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['admin']}>
                    <AdminDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/admin/services" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['admin']}>
                    <ServicesManagement />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/admin/quotes" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['admin']}>
                    <QuotesReview />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/admin/projects" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['admin']}>
                    <ProjectsManagement />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['admin']}>
                    <UsersManagement />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/admin/assign" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['admin']}>
                    <ProjectAssignment />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/admin/projects/:projectId/chat" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['admin']}>
                    <ProjectChat />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              
              {/* Rutas de Diseñador */}
              <Route path="/designer" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['diseñador']}>
                    <DesignerDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/designer/projects" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['diseñador']}>
                    <AssignedProjects />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/designer/projects/:id" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['diseñador']}>
                    <DesignerProjectDetail />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              
              {/* Rutas de Cliente */}
              <Route path="/client" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['cliente']}>
                    <ClientDashboard />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/client/quotes" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['cliente']}>
                    <QuotesList />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/client/quotes/new" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['cliente']}>
                    <QuotesNew />
                  </RoleGuard>
                </ProtectedRoute>
              } />
              <Route path="/client/projects" element={
                <ProtectedRoute>
                  <RoleGuard allowedRoles={['cliente']}>
                    <ProjectsList />
                  </RoleGuard>
                </ProtectedRoute>
              } />
                  <Route path="/client/projects/:id" element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['cliente']}>
                        <ProjectDetail />
                      </RoleGuard>
                    </ProtectedRoute>
                  } />
                  <Route path="/client/services" element={
                    <ProtectedRoute>
                      <RoleGuard allowedRoles={['cliente']}>
                        <ServicesList />
                      </RoleGuard>
                    </ProtectedRoute>
                  } />
              
              {/* 404 */}
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
