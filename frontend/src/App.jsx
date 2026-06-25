import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ProvidersView from './components/ProvidersView';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [providerCount, setProviderCount] = useState(0);

  // Cargar sesión del usuario al montar el componente
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setActiveTab('dashboard');
  };

  // Si el usuario no ha iniciado sesión, mostrar la pantalla de Login
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Panel lateral de navegación */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* Contenido principal de la página activa */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardView providerCount={providerCount} />
        )}
        {activeTab === 'proveedores' && (
          <ProvidersView onUpdateProviderCount={setProviderCount} />
        )}
      </main>
    </div>
  );
}
