const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;
  
  if (!response.ok) {
    if (data && data.success === false) {
      throw new Error(data.message || 'Error en el servidor');
    }
    const errorMsg = data?.message || `HTTP Error: ${response.status}`;
    throw new Error(errorMsg);
  }
  
  return data; // Devuelve el formato unificado: { success, message, data, error }
}

export async function loginAPI(correo, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password })
  });
  return handleResponse(response);
}

export async function getProvidersAPI() {
  const response = await fetch(`${API_URL}/api/proveedores`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  return handleResponse(response);
}

export async function createProviderAPI(providerData) {
  const response = await fetch(`${API_URL}/api/proveedores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(providerData)
  });
  return handleResponse(response);
}

export async function updateProviderAPI(id, providerData) {
  const response = await fetch(`${API_URL}/api/proveedores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(providerData)
  });
  return handleResponse(response);
}

export async function disableProviderAPI(id) {
  const response = await fetch(`${API_URL}/api/proveedores/${id}/desactivar`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' }
  });
  return handleResponse(response);
}
