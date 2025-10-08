import React, { useState, useEffect } from 'react';
import { brandingAPI } from '../../api/branding';

const QuotesReview = () => {
  const [quotes, setQuotes] = useState([]);
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [approvalData, setApprovalData] = useState({
    price: '',
    assigned_to: ''
  });
  const [rejectionData, setRejectionData] = useState({
    rejected_reason: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🌐 Obteniendo cotizaciones de la API real...');
        
        const quotesResponse = await brandingAPI.quotes.list();
        
        console.log('✅ Cotizaciones obtenidas:', quotesResponse.length);

        setQuotes(quotesResponse);

        // TODO: Implementar endpoint para obtener diseñadores
        setDesigners([
          { id: 2, first_name: 'María', last_name: 'García' },
          { id: 3, first_name: 'Carlos', last_name: 'López' },
          { id: 4, first_name: 'Laura', last_name: 'Rodríguez' }
        ]);
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
        // Mostrar datos vacíos si falla la API
        setQuotes([]);
        setDesigners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = (quote) => {
    setSelectedQuote(quote);
    setApprovalData({
      price: quote.budget || '',
      assigned_to: ''
    });
    setShowApproveModal(true);
  };

  const handleReject = (quote) => {
    setSelectedQuote(quote);
    setRejectionData({ rejected_reason: '' });
    setShowRejectModal(true);
  };

  const submitApproval = async () => {
    try {
      const approvalPayload = {
        price: parseFloat(approvalData.price),
        assigned_to: approvalData.assigned_to ? parseInt(approvalData.assigned_to) : undefined
      };

      console.log('🌐 Aprobando cotización...');
      await brandingAPI.quotes.approve(selectedQuote.id, approvalPayload);
      
      // Actualizar estado local
      setQuotes(prev => prev.map(quote => 
        quote.id === selectedQuote.id 
          ? { ...quote, status: 'approved', approved_price: approvalPayload.price }
          : quote
      ));
      
      setShowApproveModal(false);
      alert('Cotización aprobada exitosamente');
    } catch (error) {
      console.error('❌ Error aprobando cotización:', error);
      alert('Error al aprobar la cotización');
    }
  };

  const submitRejection = async () => {
    try {
      const rejectionPayload = {
        rejected_reason: rejectionData.rejected_reason
      };

      console.log('🌐 Rechazando cotización...');
      await brandingAPI.quotes.reject(selectedQuote.id, rejectionPayload);
      
      // Actualizar estado local
      setQuotes(prev => prev.map(quote => 
        quote.id === selectedQuote.id 
          ? { ...quote, status: 'rejected', rejected_reason: rejectionPayload.rejected_reason }
          : quote
      ));
      
      setShowRejectModal(false);
      alert('Cotización rechazada');
    } catch (error) {
      console.error('❌ Error rechazando cotización:', error);
      alert('Error al rechazar la cotización');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'warning',
      approved: 'success',
      rejected: 'danger'
    };
    
    const labels = {
      pending: 'Pendiente',
      approved: 'Aprobada',
      rejected: 'Rechazada'
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

  const getDesignerName = (designerId) => {
    const designer = designers.find(d => d.id === designerId);
    return designer ? `${designer.first_name} ${designer.last_name}` : '';
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
          <h1 className="h2 mb-4">Revisión de Cotizaciones</h1>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Cliente</th>
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
                        <td>
                          <div>
                            <div>{quote.client.first_name} {quote.client.last_name}</div>
                            <small className="text-muted">{quote.client.email}</small>
                          </div>
                        </td>
                        <td>{quote.service.name}</td>
                        <td>{formatCurrency(quote.budget)}</td>
                        <td>{getStatusBadge(quote.status)}</td>
                        <td>{formatDate(quote.created_at)}</td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            {quote.status === 'pending' && (
                              <>
                                <button 
                                  className="btn btn-outline-success"
                                  onClick={() => handleApprove(quote)}
                                  title="Aprobar"
                                >
                                  <i className="bi bi-check-circle"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-danger"
                                  onClick={() => handleReject(quote)}
                                  title="Rechazar"
                                >
                                  <i className="bi bi-x-circle"></i>
                                </button>
                              </>
                            )}
                            <button 
                              className="btn btn-outline-primary"
                              title="Ver detalles"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
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

      {/* Approval Modal */}
      {showApproveModal && selectedQuote && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Aprobar Cotización</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowApproveModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">Precio Final *</label>
                  <div className="input-group">
                    <span className="input-group-text">€</span>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      value={approvalData.price}
                      onChange={(e) => setApprovalData(prev => ({ ...prev, price: e.target.value }))}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-text">
                    Presupuesto solicitado: {formatCurrency(selectedQuote.budget)}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="assigned_to" className="form-label">Asignar a Diseñador (Opcional)</label>
                  <select
                    className="form-select"
                    id="assigned_to"
                    value={approvalData.assigned_to}
                    onChange={(e) => setApprovalData(prev => ({ ...prev, assigned_to: e.target.value }))}
                  >
                    <option value="">Seleccionar diseñador</option>
                    {designers.map((designer) => (
                      <option key={designer.id} value={designer.id}>
                        {designer.first_name} {designer.last_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowApproveModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={submitApproval}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Aprobar Cotización
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectModal && selectedQuote && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Rechazar Cotización</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowRejectModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="rejected_reason" className="form-label">Motivo del Rechazo *</label>
                  <textarea
                    className="form-control"
                    id="rejected_reason"
                    value={rejectionData.rejected_reason}
                    onChange={(e) => setRejectionData(prev => ({ ...prev, rejected_reason: e.target.value }))}
                    rows="4"
                    placeholder="Explica el motivo del rechazo..."
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={submitRejection}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Rechazar Cotización
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotesReview;
