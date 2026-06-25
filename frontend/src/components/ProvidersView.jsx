import React, { useState, useEffect } from 'react';
import { getProvidersAPI, disableProviderAPI } from '../services/api';
import { Search, Plus, Edit2, ShieldAlert, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import ProviderModal from './ProviderModal';

export default function ProvidersView({ onUpdateProviderCount }) {
  const [providers, setProviders] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Deactivate confirmation state
  const [deactivateId, setDeactivateId] = useState(null);
  const [deactivating, setDeactivating] = useState(false);

  const fetchProviders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProvidersAPI();
      if (response.success) {
        setProviders(response.data || []);
        if (onUpdateProviderCount) {
          onUpdateProviderCount(response.data ? response.data.length : 0);
        }
      } else {
        throw new Error(response.message || 'Error al obtener proveedores');
      }
    } catch (err) {
      setError(err.message || 'Error al conectar con la base de datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleOpenCreateModal = () => {
    setSelectedProvider(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProvider(null);
  };

  const handleSaveSuccess = (msg) => {
    setIsModalOpen(false);
    setSelectedProvider(null);
    setSuccessMessage(msg);
    fetchProviders();
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleStartDeactivate = (id) => {
    setDeactivateId(id);
  };

  const handleConfirmDeactivate = async () => {
    if (!deactivateId) return;
    setDeactivating(true);
    try {
      const response = await disableProviderAPI(deactivateId);
      if (response.success) {
        setSuccessMessage('Proveedor desactivado exitosamente (eliminación lógica).');
        fetchProviders();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error(response.message || 'Error al desactivar proveedor');
      }
    } catch (err) {
      setError(err.message || 'Error al desactivar el proveedor');
    } finally {
      setDeactivating(false);
      setDeactivateId(null);
    }
  };

  // Filtrado de proveedores en tiempo real por NIT o Razón Social
  const filteredProviders = providers.filter(p => {
    const term = search.toLowerCase();
    return (
      (p.nit && p.nit.toLowerCase().includes(term)) ||
      (p.razon_social && p.razon_social.toLowerCase().includes(term)) ||
      (p.contacto_completo && p.contacto_completo.toLowerCase().includes(term))
    );
  });

  return (
    <div className="animate-fade-in" style={styles.container}>
      {/* Header del Panel */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Gestión de Proveedores</h1>
          <p style={styles.subtitle}>Catálogo de entidades de suministro y auditoría comercial en Casetech.</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={fetchProviders} className="btn-secondary" disabled={loading} style={styles.refreshBtn}>
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
          </button>
          <button onClick={handleOpenCreateModal} className="btn-primary">
            <Plus size={18} />
            <span>Registrar Proveedor</span>
          </button>
        </div>
      </div>

      {/* Alertas de Éxito / Error */}
      {successMessage && (
        <div style={styles.successBox}>
          <AlertCircle size={18} color="var(--accent-green)" />
          <span style={styles.successText}>{successMessage}</span>
        </div>
      )}

      {error && (
        <div style={styles.errorBox}>
          <AlertCircle size={18} color="var(--accent-red)" />
          <span style={styles.errorText}>{error}</span>
        </div>
      )}

      {/* Buscador */}
      <div style={styles.searchBar}>
        <Search size={18} style={styles.searchIcon} />
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por NIT, Razón Social o Contacto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* Tabla de Resultados */}
      {loading && providers.length === 0 ? (
        <div style={styles.loadingContainer}>
          <Loader2 size={36} color="var(--accent-cyan)" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={styles.loadingText}>Cargando proveedores desde PostgreSQL...</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>NIT</th>
                  <th>Razón Social</th>
                  <th>Contacto Completo</th>
                  <th>Teléfono</th>
                  <th>Correo</th>
                  <th>Dirección</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={styles.emptyCell}>
                      No se encontraron proveedores registrados.
                    </td>
                  </tr>
                ) : (
                  filteredProviders.map((p) => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{p.nit}</td>
                      <td>{p.razon_social}</td>
                      <td>{p.contacto_completo}</td>
                      <td>{p.telefono}</td>
                      <td>{p.correo}</td>
                      <td>{p.direccion}</td>
                      <td>
                        <span 
                          style={{
                            ...styles.statusBadge,
                            ...(p.estado === 'ACTIVO' ? styles.statusActive : styles.statusInactive)
                          }}
                        >
                          {p.estado}
                        </span>
                      </td>
                      <td>
                        <div style={styles.actionsCell}>
                          <button 
                            onClick={() => handleOpenEditModal(p)} 
                            className="btn-secondary" 
                            style={styles.actionBtn}
                            title="Editar Proveedor"
                          >
                            <Edit2 size={14} color="var(--accent-cyan)" />
                          </button>
                          
                          {p.estado === 'ACTIVO' ? (
                            <button 
                              onClick={() => handleStartDeactivate(p.id)} 
                              className="btn-danger" 
                              style={styles.actionBtnDanger}
                              title="Desactivar Proveedor"
                            >
                              <ShieldAlert size={14} />
                            </button>
                          ) : (
                            <button 
                              disabled 
                              style={styles.actionBtnDisabled}
                              title="Proveedor ya inactivo"
                            >
                              <ShieldAlert size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal de Registro / Edición */}
      {isModalOpen && (
        <ProviderModal
          provider={selectedProvider}
          onClose={handleModalClose}
          onSaveSuccess={handleSaveSuccess}
        />
      )}

      {/* Pop-up de Confirmación de Desactivación */}
      {deactivateId && (
        <div style={styles.confirmBackdrop}>
          <div style={styles.confirmModal}>
            <div style={styles.confirmHeader}>
              <AlertCircle size={32} color="var(--accent-red)" />
              <h3 style={styles.confirmTitle}>¿Confirmar Desactivación?</h3>
            </div>
            <p style={styles.confirmBody}>
              Esta acción aplicará un **borrado lógico** al proveedor cambiando su estado a **INACTIVO**. El registro permanecerá en la base de datos para no alterar el historial transaccional.
            </p>
            <div style={styles.confirmActions}>
              <button 
                onClick={() => setDeactivateId(null)} 
                className="btn-secondary"
                disabled={deactivating}
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmDeactivate} 
                className="btn-danger"
                style={styles.confirmBtn}
                disabled={deactivating}
              >
                {deactivating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Desactivando...</span>
                  </>
                ) : (
                  <span>Desactivar</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
  },
  headerActions: {
    display: 'flex',
    gap: '0.75rem',
  },
  refreshBtn: {
    padding: '0.75rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    borderRadius: '8px',
    padding: '0.85rem 1rem',
  },
  successText: {
    color: 'var(--accent-green)',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: '8px',
    padding: '0.85rem 1rem',
  },
  errorText: {
    color: 'var(--accent-red)',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  searchBar: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  searchInput: {
    paddingLeft: '2.75rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '4rem 2rem',
    gap: '1rem',
  },
  loadingText: {
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  emptyCell: {
    textAlign: 'center',
    padding: '3rem 1.5rem',
    color: 'var(--text-muted)',
    fontSize: '0.95rem',
  },
  statusBadge: {
    fontSize: '0.7rem',
    fontWeight: '600',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    letterSpacing: '0.02em',
  },
  statusActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    color: 'var(--accent-green)',
    boxShadow: '0 0 8px rgba(16, 185, 129, 0.15)',
  },
  statusInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-muted)',
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  actionBtn: {
    padding: '0.45rem',
    borderRadius: '6px',
    cursor: 'pointer',
    border: '1px solid var(--border-color)',
    background: 'none',
    transition: 'var(--transition-smooth)',
  },
  actionBtnDanger: {
    padding: '0.45rem',
    borderRadius: '6px',
    cursor: 'pointer',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    background: 'rgba(239, 68, 68, 0.05)',
    color: 'var(--accent-red)',
    transition: 'var(--transition-smooth)',
    display: 'inline-flex',
    alignItems: 'center',
  },
  actionBtnDisabled: {
    padding: '0.45rem',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    background: 'rgba(255,255,255,0.02)',
    color: 'var(--text-muted)',
    opacity: 0.25,
    cursor: 'not-allowed',
    display: 'inline-flex',
    alignItems: 'center',
  },
  confirmBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(5, 8, 16, 0.8)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 200,
  },
  confirmModal: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    padding: '2rem',
    maxWidth: '440px',
    width: '100%',
    boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    alignItems: 'center',
  },
  confirmHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  confirmTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
  },
  confirmBody: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
    lineHeight: '1.5',
  },
  confirmActions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    width: '100%',
    marginTop: '0.5rem',
  },
  confirmBtn: {
    padding: '0.65rem 1.25rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    minWidth: '110px',
    justifyContent: 'center',
  },
};
