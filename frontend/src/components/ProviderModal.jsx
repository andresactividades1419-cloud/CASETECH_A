import React, { useState, useEffect } from 'react';
import { createProviderAPI, updateProviderAPI } from '../services/api';
import { X, Loader2, AlertCircle } from 'lucide-react';

export default function ProviderModal({ provider, onClose, onSaveSuccess }) {
  const isEdit = !!provider;
  
  const [nit, setNit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [contactoCompleto, setContactoCompleto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (provider) {
      setNit(provider.nit || '');
      setRazonSocial(provider.razon_social || '');
      setContactoCompleto(provider.contacto_completo || '');
      setTelefono(provider.telefono || '');
      setCorreo(provider.correo || '');
      setDireccion(provider.direccion || '');
    } else {
      setNit('');
      setRazonSocial('');
      setContactoCompleto('');
      setTelefono('');
      setCorreo('');
      setDireccion('');
    }
    setError(null);
  }, [provider]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validar campos obligatorios
    if (!isEdit && !nit.trim()) {
      setError('El NIT es obligatorio.');
      return;
    }
    if (!razonSocial.trim() || !contactoCompleto.trim() || !telefono.trim() || !correo.trim() || !direccion.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    if (!emailRegex.test(correo)) {
      setError('Formato de correo electrónico inválido.');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        // En modificación no se envía el NIT
        const response = await updateProviderAPI(provider.id, {
          razon_social: razonSocial.trim(),
          contacto_completo: contactoCompleto.trim(),
          telefono: telefono.trim(),
          correo: correo.trim(),
          direccion: direccion.trim()
        });
        if (response.success) {
          onSaveSuccess(response.message || 'Proveedor actualizado exitosamente');
        } else {
          throw new Error(response.message || 'Error al actualizar proveedor');
        }
      } else {
        const response = await createProviderAPI({
          nit: nit.trim(),
          razon_social: razonSocial.trim(),
          contacto_completo: contactoCompleto.trim(),
          telefono: telefono.trim(),
          correo: correo.trim(),
          direccion: direccion.trim(),
          usuario_id: 1 // Id de administrador simulado para compatibilidad API
        });
        if (response.success) {
          onSaveSuccess(response.message || 'Proveedor registrado exitosamente');
        } else {
          throw new Error(response.message || 'Error al registrar proveedor');
        }
      }
    } catch (err) {
      setError(err.message || 'Error al guardar los datos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.backdrop}>
      <div className="animate-fade-in" style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{isEdit ? 'Editar Proveedor' : 'Registrar Proveedor'}</h2>
          <button onClick={onClose} style={styles.closeBtn} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={18} color="var(--accent-red)" />
            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.grid}>
            <div className="form-group">
              <label htmlFor="modal-nit">NIT / Identificación</label>
              <input
                id="modal-nit"
                type="text"
                className="form-control"
                placeholder="890123456-1"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                disabled={isEdit || loading}
                style={isEdit ? styles.disabledInput : {}}
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-rs">Razón Social</label>
              <input
                id="modal-rs"
                type="text"
                className="form-control"
                placeholder="Maderas del Norte S.A."
                value={razonSocial}
                onChange={(e) => setRazonSocial(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-contacto">Contacto Completo</label>
              <input
                id="modal-contacto"
                type="text"
                className="form-control"
                placeholder="Nombre del encargado"
                value={contactoCompleto}
                onChange={(e) => setContactoCompleto(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-tel">Teléfono</label>
              <input
                id="modal-tel"
                type="text"
                className="form-control"
                placeholder="3120000000"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-correo">Correo Electrónico</label>
              <input
                id="modal-correo"
                type="text"
                className="form-control"
                placeholder="contacto@empresa.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="modal-dir">Dirección Física</label>
              <input
                id="modal-dir"
                type="text"
                className="form-control"
                placeholder="Calle 10 #20-30"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div style={styles.actions}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading} style={styles.saveBtn}>
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Proveedor</span>
              )}
            </button>
          </div>
        </form>
      </div>

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
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(5, 8, 16, 0.75)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modal: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    width: '100%',
    maxWidth: '640px',
    padding: '2rem',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.75rem',
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '700',
    letterSpacing: '-0.01em',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '50%',
    transition: 'var(--transition-smooth)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: '8px',
    padding: '0.85rem 1rem',
    marginBottom: '1.5rem',
  },
  errorText: {
    color: 'var(--accent-red)',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.25rem',
  },
  disabledInput: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '1.25rem',
    marginTop: '0.5rem',
  },
  saveBtn: {
    height: '42px',
    justifyContent: 'center',
    minWidth: '160px',
  },
};
