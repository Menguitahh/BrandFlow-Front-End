import React, { useState, useEffect } from 'react';
import { brandingAPI } from '../../api/branding';

const ServicesManagement = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    service_type: '',
    base_price: '',
    features: '',
    delivery_time: '',
    category_id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🌐 Obteniendo datos de la API real...');
        
        // Obtener categorías reales del backend
        const categoriesResponse = await brandingAPI.serviceCategories.list();
        console.log('✅ Categorías obtenidas:', categoriesResponse.length);
        setCategories(categoriesResponse);
        
        // Obtener servicios reales del backend
        const servicesResponse = await brandingAPI.services.list();
        console.log('✅ Servicios obtenidos:', servicesResponse.length);
        setServices(servicesResponse);
        
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
        // Mostrar datos vacíos si falla la API
        setCategories([]);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreate = () => {
    setModalType('create');
    setEditingItem(null);
    setFormData({ 
      name: '', 
      description: '', 
      service_type: '',
      base_price: '',
      features: '',
      delivery_time: '',
      category_id: '' 
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalType('edit');
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      service_type: item.service_type || '',
      base_price: item.base_price || '',
      features: Array.isArray(item.features) ? item.features.join(', ') : item.features || '',
      delivery_time: item.delivery_time || '',
      category_id: item.category || item.category_id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (item, type) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar este ${type === 'category' ? 'categoría' : 'servicio'}?`)) {
      try {
        if (type === 'category') {
          console.log('🌐 Eliminando categoría...');
          const result = await brandingAPI.serviceCategories.delete(item.id);
          console.log('✅ Resultado eliminación:', result);
          setCategories(prev => prev.filter(c => c.id !== item.id));
        } else {
          console.log('🌐 Eliminando servicio...');
          const result = await brandingAPI.services.delete(item.id);
          console.log('✅ Resultado eliminación:', result);
          setServices(prev => prev.filter(s => s.id !== item.id));
        }
        
        alert(`${type === 'category' ? 'Categoría' : 'Servicio'} eliminado exitosamente`);
      } catch (error) {
        console.error('❌ Error eliminando:', error);
        console.error('❌ Error response:', error.response?.data);
        console.error('❌ Error status:', error.response?.status);
        
        // Mensaje de error más específico
        const errorMessage = error.response?.data?.detail || 
                           error.response?.data?.message || 
                           error.message || 
                           'Error al eliminar el elemento';
        
        alert(`Error al eliminar: ${errorMessage}`);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalType === 'create') {
        if (activeTab === 'categories') {
          console.log('🌐 Creando categoría...');
          
          const categoryData = {
            name: formData.name,
            description: formData.description
          };
          
          console.log('📤 Enviando datos:', categoryData);
          const newCategory = await brandingAPI.serviceCategories.create(categoryData);
          setCategories(prev => [...prev, newCategory]);
        } else {
          console.log('🌐 Creando servicio...');
          
          // Preparar datos para el backend
          const serviceData = {
            name: formData.name,
            description: formData.description,
            service_type: formData.service_type,
            base_price: parseFloat(formData.base_price),
            features: formData.features.split(',').map(f => f.trim()).filter(f => f),
            delivery_time: formData.delivery_time,
            category_id: parseInt(formData.category_id)
          };
          
          console.log('📤 Enviando datos:', serviceData);
          const newService = await brandingAPI.services.create(serviceData);
          setServices(prev => [...prev, newService]);
        }
      } else {
        if (activeTab === 'categories') {
          console.log('🌐 Actualizando categoría...');
          
          const categoryData = {
            name: formData.name,
            description: formData.description
          };
          
          console.log('📤 Enviando datos:', categoryData);
          const updatedCategory = await brandingAPI.serviceCategories.update(editingItem.id, categoryData);
          setCategories(prev => prev.map(c => c.id === editingItem.id ? updatedCategory : c));
        } else {
          console.log('🌐 Actualizando servicio...');
          
          // Preparar datos para el backend
          const serviceData = {
            name: formData.name,
            description: formData.description,
            service_type: formData.service_type,
            base_price: parseFloat(formData.base_price),
            features: formData.features.split(',').map(f => f.trim()).filter(f => f),
            delivery_time: formData.delivery_time,
            category_id: parseInt(formData.category_id)
          };
          
          console.log('📤 Enviando datos:', serviceData);
          const updatedService = await brandingAPI.services.update(editingItem.id, serviceData);
          setServices(prev => prev.map(s => s.id === editingItem.id ? updatedService : s));
        }
      }
      
      setShowModal(false);
      alert(`${modalType === 'create' ? 'Creado' : 'Actualizado'} exitosamente`);
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error al procesar la solicitud');
    }
  };

  const getCategoryName = (service) => {
    // El servicio puede tener category o category_id
    const categoryId = service.category || service.category_id;
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Sin categoría';
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="h2 mb-0">Gestión de Servicios</h1>
            <button className="btn btn-primary" onClick={handleCreate}>
              <i className="bi bi-plus-circle me-2"></i>
              Crear {activeTab === 'categories' ? 'Categoría' : 'Servicio'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'categories' ? 'active' : ''}`}
                onClick={() => setActiveTab('categories')}
              >
                <i className="bi bi-list-ul me-2"></i>
                Categorías
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
                onClick={() => setActiveTab('services')}
              >
                <i className="bi bi-tools me-2"></i>
                Servicios
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="tab-pane active">
                <div className="card mt-3">
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((category) => (
                            <tr key={category.id}>
                              <td>
                                <strong>{category.name}</strong>
                              </td>
                              <td>{category.description}</td>
                              <td>
                                <div className="btn-group btn-group-sm" role="group">
                                  <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => handleEdit(category)}
                                    title="Editar"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button 
                                    className="btn btn-outline-danger"
                                    onClick={() => handleDelete(category, 'category')}
                                    title="Eliminar"
                                  >
                                    <i className="bi bi-trash"></i>
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
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="tab-pane active">
                <div className="card mt-3">
                  <div className="card-body p-0">
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Precio</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((service) => (
                            <tr key={service.id}>
                              <td>
                                <strong>{service.name}</strong>
                                <br />
                                <small className="text-muted">{service.description}</small>
                              </td>
                              <td>
                                <span className="badge bg-info">
                                  {service.service_type || 'N/A'}
                                </span>
                              </td>
                              <td>
                                <strong>${service.base_price || 'N/A'}</strong>
                              </td>
                              <td>
                                <span className="badge bg-secondary">
                                  {getCategoryName(service)}
                                </span>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm" role="group">
                                  <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => handleEdit(service)}
                                    title="Editar"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </button>
                                  <button 
                                    className="btn btn-outline-danger"
                                    onClick={() => handleDelete(service, 'service')}
                                    title="Eliminar"
                                  >
                                    <i className="bi bi-trash"></i>
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
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === 'create' ? 'Crear' : 'Editar'} {activeTab === 'categories' ? 'Categoría' : 'Servicio'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Descripción *</label>
                    <textarea
                      className="form-control"
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows="3"
                      required
                    />
                  </div>
                  {activeTab === 'services' && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="service_type" className="form-label">Tipo de Servicio *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="service_type"
                          value={formData.service_type}
                          onChange={(e) => setFormData(prev => ({ ...prev, service_type: e.target.value }))}
                          placeholder="Ej: logo, web, branding"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="base_price" className="form-label">Precio Base *</label>
                        <input
                          type="number"
                          className="form-control"
                          id="base_price"
                          value={formData.base_price}
                          onChange={(e) => setFormData(prev => ({ ...prev, base_price: e.target.value }))}
                          placeholder="Ej: 150"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="features" className="form-label">Características *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="features"
                          value={formData.features}
                          onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                          placeholder="Separadas por comas: Logo PNG, 2 revisiones, Guía de colores"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="delivery_time" className="form-label">Tiempo de Entrega *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="delivery_time"
                          value={formData.delivery_time}
                          onChange={(e) => setFormData(prev => ({ ...prev, delivery_time: e.target.value }))}
                          placeholder="Ej: 3-5 días"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="category" className="form-label">Categoría *</label>
                        <select
                          className="form-select"
                          id="category"
                          value={formData.category_id}
                          onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                          required
                        >
                          <option value="">Selecciona una categoría</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {modalType === 'create' ? 'Crear' : 'Actualizar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManagement;
