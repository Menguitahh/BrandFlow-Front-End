import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { brandingAPI } from '../../api/branding';

const QuotesList = () => {
  const { currentUser } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        setLoading(true);
        console.log('🌐 Obteniendo cotizaciones de la API real...');
        
            const response = await brandingAPI.quotes.list();
        const clientQuotes = response.filter(quote => quote.client === currentUser?.id);
        
        console.log('✅ Cotizaciones obtenidas:', clientQuotes.length);
        setQuotes(clientQuotes);
      } catch (error) {
        setError('Error al cargar las cotizaciones');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchQuotes();
    }
  }, [currentUser]);

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger',
      in_progress: 'info'
    };
    
    const labels = {
      pending: 'Pendiente',
      approved: 'Aprobada',
      rejected: 'Rechazada',
      in_progress: 'En Progreso'
    };

    return (
      <span className={`badge bg-${badges[status] || 'secondary'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
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

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 mb-0">Mis Cotizaciones</h1>
            <Link to="/client/quotes/new" className="btn btn-primary">
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Cotización
            </Link>
          </div>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="row">
          <div className="col-12">
            <div className="empty-state">
              <div className="empty-icon">
                <i className="bi bi-file-text"></i>
              </div>
              <h3>Aún no tienes cotizaciones</h3>
              <p className="text-muted">Crea tu primera cotización para comenzar un nuevo proyecto.</p>
              <Link to="/client/quotes/new" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Crear Cotización
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Servicio</th>
                        <th>Presupuesto</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotes.map((quote) => (
                        <tr key={quote.id}>
                          <td>
                            <div>
                              <h6 className="mb-1">{quote.title}</h6>
                              <small className="text-muted">{quote.description}</small>
                            </div>
                          </td>
                          <td>{quote.service?.name}</td>
                          <td>{formatCurrency(quote.budget)}</td>
                          <td>{getStatusBadge(quote.status)}</td>
                          <td>{formatDate(quote.created_at)}</td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group">
                              <button className="btn btn-outline-primary" title="Ver detalles">
                                <i className="bi bi-eye"></i>
                              </button>
                              {quote.status === 'approved' && (
                                <button className="btn btn-outline-success" title="Ver proyecto">
                                  <i className="bi bi-folder"></i>
                                </button>
                              )}
                              {quote.status === 'rejected' && (
                                <button 
                                  className="btn btn-outline-danger" 
                                  title="Ver motivo de rechazo"
                                  data-bs-toggle="tooltip"
                                  data-bs-title={quote.rejected_reason}
                                >
                                  <i className="bi bi-exclamation-circle"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotesList;
