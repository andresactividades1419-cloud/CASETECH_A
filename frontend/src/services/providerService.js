const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const providerService = {
  getProviders: async () => {
    try {
      const response = await fetch(`${API_URL}/api/proveedores`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Error al obtener los proveedores');
      }
      return data;
    } catch (error) {
      console.error('Error en providerService.getProviders:', error);
      throw error;
    }
  },

  createProvider: async (providerData) => {
    try {
      const response = await fetch(`${API_URL}/api/proveedores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Error al registrar el proveedor');
      }
      return data;
    } catch (error) {
      console.error('Error en providerService.createProvider:', error);
      throw error;
    }
  },

  updateProvider: async (id, providerData) => {
    try {
      const response = await fetch(`${API_URL}/api/proveedores/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Error al actualizar el proveedor');
      }
      return data;
    } catch (error) {
      console.error('Error en providerService.updateProvider:', error);
      throw error;
    }
  },

  disableProvider: async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/proveedores/${id}/desactivar`, {
        method: 'PATCH',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Error al desactivar el proveedor');
      }
      return data;
    } catch (error) {
      console.error('Error en providerService.disableProvider:', error);
      throw error;
    }
  },

  // --- ANALYTICS ---
  getResumenAnalitica: async () => {
    try {
      const response = await fetch(`${API_URL}/api/proveedores/analitica/resumen`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Error al obtener el resumen analítico');
      }
      return data;
    } catch (error) {
      console.error('Error en providerService.getResumenAnalitica:', error);
      throw error;
    }
  },

  getPorUsuarioAnalitica: async () => {
    try {
      const response = await fetch(`${API_URL}/api/proveedores/analitica/por-usuario`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Error al obtener analítica por administrador');
      }
      return data;
    } catch (error) {
      console.error('Error en providerService.getPorUsuarioAnalitica:', error);
      throw error;
    }
  },

  getTendenciaAnalitica: async () => {
    try {
      const response = await fetch(`${API_URL}/api/proveedores/analitica/tendencia`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Error al obtener tendencia de registros');
      }
      return data;
    } catch (error) {
      console.error('Error en providerService.getTendenciaAnalitica:', error);
      throw error;
    }
  }
};
