import React, { useState, useEffect } from 'react';
import { providerService } from '../services/providerService';
import ProviderModal from '../components/ProviderModal';

export default function PanelProveedores() {
  const [providers, setProviders] = useState([]);
  const [stats, setStats] = useState({ total_proveedores: 0, activos: 0, inactivos: 0 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null); // null = register, object = edit

  // Custom Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    providerId: null,
    providerName: ''
  });

  // Load all providers and statistics
  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [providersData, statsData] = await Promise.all([
        providerService.getProviders(),
        providerService.getResumenAnalitica()
      ]);
      
      if (providersData.success) {
        setProviders(providersData.data);
      }
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (err) {
      setError('Error al cargar la información del servidor. Verifica la conexión con la base de datos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenRegister = () => {
    setSelectedProvider(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleSaveProvider = async (formData) => {
    if (selectedProvider) {
      // Edit mode
      await providerService.updateProvider(selectedProvider.id, formData);
    } else {
      // Register mode
      await providerService.createProvider(formData);
    }
    // Reload data
    await loadData();
  };

  const handleOpenConfirmDisable = (id, name) => {
    setConfirmDialog({
      isOpen: true,
      providerId: id,
      providerName: name
    });
  };

  const handleConfirmDisable = async () => {
    try {
      await providerService.disableProvider(confirmDialog.providerId);
      setConfirmDialog({ isOpen: false, providerId: null, providerName: '' });
      await loadData();
    } catch (err) {
      alert(err.message || 'Error al desactivar el proveedor');
    }
  };

  // Filter providers based on search query (NIT or Razón Social)
  const filteredProviders = providers.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.nit.toLowerCase().includes(term) ||
      p.razon_social.toLowerCase().includes(term) ||
      p.contacto_completo.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'white' }}>
            Gestión de Proveedores
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Administra el catálogo de proveedores y audita sus estados de suministro.
          </p>
        </div>
        
        <button onClick={handleOpenRegister} className="btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Registrar Proveedor
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          color: '#f87171',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '0.95rem',
          fontWeight: '500'
        }}>
          {error}
        </div>
      )}

      {/* ANALYTICS / STATS CARDS */}
      <div className="stats-grid">
        {/* Total Card */}
        <div className="glass-panel stat-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div className="stat-info">
            <h3>Total Proveedores</h3>
            <p>{stats.total_proveedores}</p>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--color-primary)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        {/* Active Card */}
        <div className="glass-panel stat-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <div className="stat-info">
            <h3>Proveedores Activos</h3>
            <p>{stats.activos}</p>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>

        {/* Inactive Card */}
        <div className="glass-panel stat-card" style={{ borderLeft: '4px solid var(--color-danger)' }}>
          <div className="stat-info">
            <h3>Proveedores Inactivos</h3>
            <p>{stats.inactivos}</p>
          </div>
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* FILTER & TABLE SECTION */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        
        {/* Search Input */}
        <div style={{ position: 'relative', maxWidth: '360px', marginBottom: '20px' }}>
          <input
            type="text"
            className="input-control"
            placeholder="Buscar por NIT, Nombre o Contacto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* DATA TABLE */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: '15px' }}>
            <svg className="animate-spin" style={{ animation: 'spin 1.2s linear infinite', color: 'var(--color-secondary)' }} width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
              <path d="M4 12a8 8 0 0 1 8-8"></path>
            </svg>
            <span style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>Cargando base de datos...</span>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px', opacity: 0.5 }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <p>No se encontraron proveedores que coincidan con la búsqueda.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>NIT</th>
                  <th>Razón Social</th>
                  <th>Contacto</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: '600', color: 'var(--color-secondary)' }}>{p.nit}</td>
                    <td style={{ fontWeight: '500' }}>{p.razon_social}</td>
                    <td>{p.contacto_completo}</td>
                    <td>{p.telefono || <span style={{ opacity: 0.3 }}>—</span>}</td>
                    <td>{p.correo || <span style={{ opacity: 0.3 }}>—</span>}</td>
                    <td>{p.direccion || <span style={{ opacity: 0.3 }}>—</span>}</td>
                    <td>
                      <span className={`badge ${p.estado === 'ACTIVO' ? 'badge-active' : 'badge-inactive'}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        {/* Edit Button */}
                        <button 
                          onClick={() => handleOpenEdit(p)}
                          className="btn-icon" 
                          title="Editar Proveedor"
                          style={{
                            padding: '6px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--border-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                          }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        
                        {/* Disable Button */}
                        {p.estado === 'ACTIVO' && (
                          <button 
                            onClick={() => handleOpenConfirmDisable(p.id, p.razon_social)}
                            className="btn-icon" 
                            title="Desactivar Proveedor"
                            style={{
                              padding: '6px',
                              borderRadius: '4px',
                              background: 'rgba(239, 68, 68, 0.05)',
                              border: '1px solid rgba(239, 68, 68, 0.15)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s'
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="8" y1="12" x2="16" y2="12"></line>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* POPUP MODAL FOR ADD/EDIT */}
      <ProviderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProvider}
        provider={selectedProvider}
      />

      {/* CUSTOM GLASSMORPHIC CONFIRM DIALOG */}
      {confirmDialog.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(7, 10, 19, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div className="glass-panel-glow" style={{
            width: '90%',
            maxWidth: '400px',
            padding: '24px',
            textAlign: 'center'
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '16px', filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.3))' }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>¿Desactivar Proveedor?</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '24px', lineHeight: '1.4' }}>
              Esta acción modificará el estado de <strong>{confirmDialog.providerName}</strong> a <strong>INACTIVO</strong> de forma lógica. El registro se mantendrá en el historial comercial.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                onClick={() => setConfirmDialog({ isOpen: false, providerId: null, providerName: '' })} 
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmDisable} 
                className="btn-danger"
                style={{ padding: '8px 20px', fontSize: '0.9rem', border: 'none', background: 'var(--color-danger)', color: '#fff' }}
              >
                Sí, Desactivar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
