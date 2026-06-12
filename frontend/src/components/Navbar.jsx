import React from 'react';
import { authService } from '../services/authService';

export default function Navbar() {
  const user = authService.getCurrentUser();

  return (
    <header className="glass-panel" style={{
      padding: '12px 30px',
      margin: '20px 20px 0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid var(--border-light)'
    }}>
      <div style={{ display: 'flex', alignRows: 'center', gap: '10px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px var(--color-secondary))' }}>
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '1px', background: 'linear-gradient(90deg, #fff 0%, var(--color-secondary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CASETECH
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {user && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--color-text-main)' }}>
              {user.nombre}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {user.rol}
            </div>
          </div>
        )}
        
        {/* Animated 3D Styrofoam Casetón Block */}
        <div className="caseton-container" title="Casetón Casetech 3D - Expanded Polystyrene Block">
          <div className="caseton-cube">
            <div className="caseton-face face-front"></div>
            <div className="caseton-face face-back"></div>
            <div className="caseton-face face-left"></div>
            <div className="caseton-face face-right"></div>
            <div className="caseton-face face-top"></div>
            <div className="caseton-face face-bottom"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
