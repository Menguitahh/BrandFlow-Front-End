import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ role: '', search: '' });
  const [searchInput, setSearchInput] = useState(''); // Estado separado para el input
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');

  // Cargar usuarios al montar el componente y cuando cambien los filtros
  useEffect(() => {
    fetchUsers();
  }, [filters]);

  // Debounce para la búsqueda - actualiza el filtro después de 500ms de inactividad
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.users.list(filters);
      setUsers(data.users || data);
      setError(null);
    } catch (err) {
      console.error('Error cargando usuarios:', err);
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await adminAPI.users.setRole(selectedUser.id, newRole);
      
      // Actualizar la lista de usuarios
      await fetchUsers();
      
      // Cerrar modal y limpiar estado
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole('');
      
      alert(`Rol cambiado exitosamente a ${newRole}`);
    } catch (err) {
      console.error('Error cambiando rol:', err);
      alert('Error al cambiar el rol del usuario');
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  const getRoleBadgeClass = (role) => {
    const roleClasses = {
      'admin': 'bg-danger',
      'diseñador': 'bg-primary',
      'cliente': 'bg-success',
      'gerente': 'bg-warning',
      'vendedor': 'bg-info'
    };
    return roleClasses[role] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
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
            <h1 className="h3 mb-0">Gestión de Usuarios</h1>
            <button className="btn btn-primary" onClick={fetchUsers}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Actualizar
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Filtros */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Filtrar por Rol</label>
                  <select
                    className="form-select"
                    value={filters.role}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                  >
                    <option value="">Todos los roles</option>
                    <option value="admin">Admin</option>
                    <option value="diseñador">Diseñador</option>
                    <option value="cliente">Cliente</option>
                    <option value="gerente">Gerente</option>
                    <option value="vendedor">Vendedor</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Buscar Usuario</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por nombre o email..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">&nbsp;</label>
                  <div className="d-grid">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setFilters({ role: '', search: '' });
                        setSearchInput('');
                      }}
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla de usuarios */}
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Usuario</th>
                      <th>Email</th>
                      <th>Nombre</th>
                      <th>Rol</th>
                      <th>Fecha Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-4">
                          No se encontraron usuarios
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>
                            <strong>{user.username}</strong>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : 'N/A'
                            }
                          </td>
                          <td>
                            <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>{formatDate(user.date_joined)}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openRoleModal(user)}
                              title="Cambiar rol"
                            >
                              <i className="bi bi-gear"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="row mt-4">
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{users.length}</h4>
                      <small>Total Usuarios</small>
                    </div>
                    <i className="bi bi-people display-6"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{users.filter(u => u.role === 'cliente').length}</h4>
                      <small>Clientes</small>
                    </div>
                    <i className="bi bi-person display-6"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{users.filter(u => u.role === 'diseñador').length}</h4>
                      <small>Diseñadores</small>
                    </div>
                    <i className="bi bi-palette display-6"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{users.filter(u => u.role === 'admin').length}</h4>
                      <small>Admins</small>
                    </div>
                    <i className="bi bi-shield-check display-6"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para cambiar rol */}
      {showRoleModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cambiar Rol de Usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowRoleModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Usuario:</strong> {selectedUser?.username}
                </p>
                <p>
                  <strong>Email:</strong> {selectedUser?.email}
                </p>
                <p>
                  <strong>Rol actual:</strong> 
                  <span className={`badge ${getRoleBadgeClass(selectedUser?.role)} ms-2`}>
                    {selectedUser?.role}
                  </span>
                </p>
                
                <div className="mb-3">
                  <label className="form-label">Nuevo Rol</label>
                  <select
                    className="form-select"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="cliente">Cliente</option>
                    <option value="diseñador">Diseñador</option>
                    <option value="admin">Admin</option>
                    <option value="gerente">Gerente</option>
                    <option value="vendedor">Vendedor</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowRoleModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRoleChange}
                  disabled={newRole === selectedUser?.role}
                >
                  Cambiar Rol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
