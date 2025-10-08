import http from './http';

// Servicios de administración
export const adminAPI = {
  // Gestión de usuarios
  users: {
    // Listar todos los usuarios con filtros
    list: async (filters = {}) => {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.search) params.append('search', filters.search);
      
      const response = await http.get(`/user/admin/users/?${params}`);
      return response.data;
    },

    // Listar solo diseñadores
    listDesigners: async () => {
      const response = await http.get('/user/admin/designers/');
      return response.data;
    },

    // Cambiar rol de usuario
    setRole: async (userId, newRole) => {
      const response = await http.post('/user/admin/set-role/', {
        user_id: userId,
        role: newRole
      });
      return response.data;
    }
  },

  // Gestión de proyectos
  projects: {
    // Asignar diseñador a proyecto
    assignDesigner: async (projectId, designerId) => {
      const response = await http.post(`/branding/projects/${projectId}/assign_designer/`, {
        designer_id: designerId
      });
      return response.data;
    }
  },

  // Gestión de servicios
  services: {
    // Crear nuevo servicio
    create: async (serviceData) => {
      const response = await http.post('/branding/services/', {
        name: serviceData.name,
        description: serviceData.description,
        service_type: serviceData.type,
        base_price: serviceData.price,
        features: serviceData.features,
        delivery_time: serviceData.delivery,
        category: serviceData.categoryId
      });
      return response.data;
    },

    // Obtener categorías de servicios
    getCategories: async () => {
      const response = await http.get('/branding/service-categories/');
      return response.data;
    }
  }
};
