import http from './http';

// Servicios de branding
export const brandingAPI = {
  // Categorías de servicios
  serviceCategories: {
    list: async () => {
      const response = await http.get('/branding/service-categories/');
      return response.data;
    },
    create: async (categoryData) => {
      const response = await http.post('/branding/service-categories/', categoryData);
      return response.data;
    },
    update: async (id, categoryData) => {
      const response = await http.put(`/branding/service-categories/${id}/`, categoryData);
      return response.data;
    },
    delete: async (id) => {
      const response = await http.delete(`/branding/service-categories/${id}/`);
      // DELETE devuelve 204 (No Content), no hay data
      return response.status === 204 ? { success: true } : response.data;
    },
  },

  // Servicios
  services: {
    list: async () => {
      const response = await http.get('/branding/services/');
      return response.data;
    },
    create: async (serviceData) => {
      const response = await http.post('/branding/services/', serviceData);
      return response.data;
    },
    update: async (id, serviceData) => {
      const response = await http.put(`/branding/services/${id}/`, serviceData);
      return response.data;
    },
    delete: async (id) => {
      const response = await http.delete(`/branding/services/${id}/`);
      // DELETE devuelve 204 (No Content), no hay data
      return response.status === 204 ? { success: true } : response.data;
    },
  },

  // Cotizaciones
  quotes: {
    list: async () => {
      const response = await http.get('/branding/quotes/');
      return response.data;
    },
    create: async (quoteData) => {
      const response = await http.post('/branding/quotes/', quoteData);
      return response.data;
    },
    update: async (id, quoteData) => {
      const response = await http.put(`/branding/quotes/${id}/`, quoteData);
      return response.data;
    },
    approve: async (id, approvalData) => {
      const response = await http.post(`/branding/quotes/${id}/approve/`, approvalData);
      return response.data;
    },
    reject: async (id, rejectionData) => {
      const response = await http.post(`/branding/quotes/${id}/reject/`, rejectionData);
      return response.data;
    },
  },

  // Proyectos
  projects: {
    list: async () => {
      const response = await http.get('/branding/projects/');
      return response.data;
    },
    create: async (projectData) => {
      const response = await http.post('/branding/projects/', projectData);
      return response.data;
    },
    update: async (id, projectData) => {
      const response = await http.put(`/branding/projects/${id}/`, projectData);
      return response.data;
    },
    assignDesigner: async (id, designerData) => {
      const response = await http.post(`/branding/projects/${id}/assign_designer/`, designerData);
      return response.data;
    },
  },

  // Mensajes del proyecto
  messages: {
    list: async (projectId = null) => {
      const url = projectId 
        ? `/branding/projects/messages/?project=${projectId}`
        : '/branding/projects/messages/';
      const response = await http.get(url);
      return response.data;
    },
    create: async (messageData) => {
      const response = await http.post('/branding/projects/messages/', messageData);
      return response.data;
    },
  },

  // Pagos
  payments: {
    simulate: async (paymentData) => {
      const response = await http.post('/branding/payments/simulate/', paymentData);
      return response.data;
    },
    list: async () => {
      const response = await http.get('/branding/payments/');
      return response.data;
    },
  },
};
