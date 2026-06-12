import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <aside className="glass-panel" style={{
      width: '260px',
      margin: '20px 0 20px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      borderRight: '1px solid var(--border-light)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {/* Brand/Logo Section in Sidebar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(6, 182, 212, 0.3)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', letterSpacing: '0.5px' }}>CASETECH</h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Módulos del Sistema</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div 
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.95rem',
              color: 'var(--color-text-main)',
              background: 'rgba(6, 182, 212, 0.1)',
              borderLeft: '4px solid var(--color-secondary)',
              boxShadow: 'inset 0 0 8px rgba(6, 182, 212, 0.05)',
              transition: 'all 0.2s'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Proveedores
          </div>
        </nav>
      </div>

      {/* Logout Button */}
      <button 
        onClick={handleLogout}
        className="btn-danger" 
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '12px',
          fontSize: '0.95rem',
          fontWeight: '500'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Cerrar Sesión
      </button>
    </aside>
  );
}
