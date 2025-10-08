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
    category: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🌐 Obteniendo servicios de la API real...');
        
        const servicesResponse = await brandingAPI.services.list();
        
        console.log('✅ Servicios obtenidos:', servicesResponse.length);

        // TODO: Implementar endpoint de categorías
        setCategories([
          { id: 1, name: 'Diseño Gráfico', description: 'Servicios de diseño visual' },
          { id: 2, name: 'Identidad Corporativa', description: 'Desarrollo de marca completa' },
          { id: 3, name: 'Marketing Digital', description: 'Servicios de marketing online' }
        ]);

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
    setFormData({ name: '', description: '', category: '' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalType('edit');
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (item, type) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar este ${type === 'category' ? 'categoría' : 'servicio'}?`)) {
      try {
        if (type === 'category') {
          // TODO: Implementar endpoint de categorías
          console.log('Eliminando categoría:', item);
          alert('Endpoint de categorías no implementado aún');
        } else {
          console.log('🌐 Eliminando servicio...');
          await brandingAPI.services.delete(item.id);
          setServices(prev => prev.filter(s => s.id !== item.id));
        }
        
        alert(`${type === 'category' ? 'Categoría' : 'Servicio'} eliminado exitosamente`);
      } catch (error) {
        console.error('❌ Error eliminando:', error);
        alert('Error al eliminar el elemento');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (modalType === 'create') {
        if (activeTab === 'categories') {
          // TODO: Implementar endpoint de categorías
          console.log('Creando categoría:', formData);
          alert('Endpoint de categorías no implementado aún');
        } else {
          console.log('🌐 Creando servicio...');
          const newService = await brandingAPI.services.create(formData);
          setServices(prev => [...prev, newService]);
        }
      } else {
        if (activeTab === 'categories') {
          // TODO: Implementar endpoint de categorías
          console.log('Actualizando categoría:', formData);
          alert('Endpoint de categorías no implementado aún');
        } else {
          console.log('🌐 Actualizando servicio...');
          const updatedService = await brandingAPI.services.update(editingItem.id, formData);
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

  const getCategoryName = (categoryId) => {
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
                            <th>Descripción</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map((service) => (
                            <tr key={service.id}>
                              <td>
                                <strong>{service.name}</strong>
                              </td>
                              <td>{service.description}</td>
                              <td>
                                <span className="badge bg-secondary">
                                  {getCategoryName(service.category)}
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
                    <div className="mb-3">
                      <label htmlFor="category" className="form-label">Categoría *</label>
                      <select
                        className="form-select"
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
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
