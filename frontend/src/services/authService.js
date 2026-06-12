const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const authService = {
  login: async (correo, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Error en las credenciales');
      }
      
      if (data.success && data.data) {
        localStorage.setItem('casetech_user', JSON.stringify(data.data));
      }
      
      return data;
    } catch (error) {
      console.error('Error en authService.login:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('casetech_user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('casetech_user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return localStorage.getItem('casetech_user') !== null;
  }
};
