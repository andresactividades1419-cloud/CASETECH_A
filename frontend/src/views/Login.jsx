import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validations
    if (!correo.trim() || !password.trim()) {
      setError('Por favor, ingresa todos los campos.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);
    try {
      await authService.login(correo, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas o error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(7, 10, 19, 1) 90%)',
      padding: '20px'
    }}>
      <div className="glass-panel-glow" style={{
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        boxShadow: '0 15px 35px rgba(0,0,0,0.4), var(--shadow-neon-indigo)',
        border: '1px solid rgba(99, 102, 241, 0.2)'
      }}>
        {/* Animated Styrofoam Casetón Icon in Login Card */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div className="caseton-container" style={{ width: '60px', height: '60px', perspective: '300px' }}>
            <div className="caseton-cube" style={{ width: '40px', height: '40px', transform: 'rotateX(-20deg) rotateY(-30deg)' }}>
              <div className="caseton-face face-front" style={{ width: '40px', height: '40px', transform: 'rotateY(0deg) translateZ(20px)' }}></div>
              <div className="caseton-face face-back" style={{ width: '40px', height: '40px', transform: 'rotateY(180deg) translateZ(20px)' }}></div>
              <div className="caseton-face face-left" style={{ width: '40px', height: '40px', transform: 'rotateY(-90deg) translateZ(20px)' }}></div>
              <div className="caseton-face face-right" style={{ width: '40px', height: '40px', transform: 'rotateY(90deg) translateZ(20px)' }}></div>
              <div className="caseton-face face-top" style={{ width: '40px', height: '40px', transform: 'rotateX(90deg) translateZ(20px)' }}></div>
              <div className="caseton-face face-bottom" style={{ width: '40px', height: '40px', transform: 'rotateX(-90deg) translateZ(20px)' }}></div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            letterSpacing: '1px',
            marginBottom: '6px',
            background: 'linear-gradient(90deg, #ffffff 30%, var(--color-secondary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CASETECH
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            Panel de Administración de Casetones
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            color: '#f87171',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="input-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="admin@casetech.com"
                required
                style={{ paddingLeft: '42px' }}
              />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label className="form-label">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="input-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ paddingLeft: '42px' }}
              />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? (
              <>
                <svg className="animate-spin" style={{ animation: 'spin 1s linear infinite', marginRight: '8px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                  <path d="M4 12a8 8 0 0 1 8-8"></path>
                </svg>
                Ingresando...
              </>
            ) : (
              'Ingresar al Panel'
            )}
          </button>
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
