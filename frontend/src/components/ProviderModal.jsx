import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export default function ProviderModal({ isOpen, onClose, onSave, provider }) {
  const isEdit = !!provider;
  const currentUser = authService.getCurrentUser();

  const [formData, setFormData] = useState({
    nit: '',
    razon_social: '',
    contacto_completo: '',
    telefono: '',
    correo: '',
    direccion: '',
    estado: 'ACTIVO',
    usuario_id: currentUser ? currentUser.id : 1
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state with the provider prop when opening the modal
  useEffect(() => {
    if (provider) {
      setFormData({
        nit: provider.nit || '',
        razon_social: provider.razon_social || '',
        contacto_completo: provider.contacto_completo || '',
        telefono: provider.telefono || '',
        correo: provider.correo || '',
        direccion: provider.direccion || '',
        estado: provider.estado || 'ACTIVO',
        usuario_id: provider.usuario_id || (currentUser ? currentUser.id : 1)
      });
    } else {
      setFormData({
        nit: '',
        razon_social: '',
        contacto_completo: '',
        telefono: '',
        correo: '',
        direccion: '',
        estado: 'ACTIVO',
        usuario_id: currentUser ? currentUser.id : 1
      });
    }
    setError('');
  }, [provider, isOpen, currentUser]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!formData.nit.trim()) {
      setError('El NIT es requerido.');
      return;
    }
    if (!formData.razon_social.trim()) {
      setError('La Razón Social es requerida.');
      return;
    }
    if (!formData.contacto_completo.trim()) {
      setError('El Nombre Completo del Contacto es requerido.');
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Ocurrió un error al guardar el proveedor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(7, 10, 19, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel-glow" style={{
        width: '100%',
        maxWidth: '550px',
        padding: '30px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="btn-icon" 
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            fontSize: '1.5rem'
          }}
        >
          &times;
        </button>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '24px',
          background: 'linear-gradient(90deg, #fff 0%, var(--color-secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {isEdit ? 'Modificar Proveedor' : 'Registrar Nuevo Proveedor'}
        </h2>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* NIT Field */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">NIT / Identificación *</label>
              <input
                type="text"
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                disabled={isEdit}
                className="input-control"
                placeholder="Ej: 900.999.888-1"
                required
              />
              {isEdit && (
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                  El NIT no puede ser modificado por requerimiento fiscal.
                </span>
              )}
            </div>

            {/* Razón Social */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Razón Social *</label>
              <input
                type="text"
                name="razon_social"
                value={formData.razon_social}
                onChange={handleChange}
                className="input-control"
                placeholder="Nombre de la empresa"
                required
              />
            </div>

            {/* Contacto Completo */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Contacto Comercial Completo *</label>
              <input
                type="text"
                name="contacto_completo"
                value={formData.contacto_completo}
                onChange={handleChange}
                className="input-control"
                placeholder="Nombre completo del asesor comercial"
                required
              />
            </div>

            {/* Teléfono */}
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="input-control"
                placeholder="Ej: 3154445555"
              />
            </div>

            {/* Correo */}
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="input-control"
                placeholder="Ej: correo@empresa.com"
              />
            </div>

            {/* Dirección */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="input-control"
                placeholder="Dirección comercial"
              />
            </div>

            {/* Estado (Only visible/editable in edit mode, as new providers default to ACTIVO) */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="input-control"
                style={{ appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
              >
                <option value="ACTIVO" style={{ backgroundColor: 'var(--bg-dark-panel)' }}>ACTIVO</option>
                <option value="INACTIVO" style={{ backgroundColor: 'var(--bg-dark-panel)' }}>INACTIVO</option>
              </select>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px',
            borderTop: '1px solid var(--border-light)',
            paddingTop: '20px'
          }}>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <svg className="animate-spin" style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M4 12a8 8 0 0 1 8-8"></path>
                  </svg>
                  Guardando...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  {isEdit ? 'Guardar Cambios' : 'Registrar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
