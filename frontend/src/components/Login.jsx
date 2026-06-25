import React, { useState } from 'react';
import { loginAPI } from '../services/api';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setShake(false);

    // Validaciones básicas de cliente
    if (!correo.trim() || !password.trim()) {
      setError('Por favor diligencie todos los campos.');
      setShake(true);
      return;
    }

    const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
    if (!emailRegex.test(correo)) {
      setError('Formato de correo electrónico inválido.');
      setShake(true);
      return;
    }

    setLoading(true);
    try {
      const response = await loginAPI(correo.trim(), password);
      if (response.success) {
        localStorage.setItem('user', JSON.stringify(response.data));
        onLoginSuccess(response.data);
      } else {
        throw new Error(response.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      setShake(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glow} />
      
      <div className={`animate-fade-in ${shake ? 'animate-shake' : ''}`} style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoBadge}>C</div>
          <h1 style={styles.title}>CASETECH</h1>
          <p style={styles.subtitle}>Gestión de Casetones & Suministros</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={18} color="var(--accent-red)" />
            <span style={styles.errorText}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <div style={styles.inputWrapper}>
              <Mail size={18} style={styles.inputIcon} />
              <input
                id="correo"
                type="text"
                className="form-control"
                placeholder="ejemplo@casetech.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                disabled={loading}
                style={styles.input}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div style={styles.inputWrapper}>
              <Lock size={18} style={styles.inputIcon} />
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={styles.input}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={styles.submitBtn}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Validando...</span>
              </>
            ) : (
              <span>Ingresar al Sistema</span>
            )}
          </button>
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
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: 'var(--bg-primary)',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 180, 216, 0.08) 0%, rgba(0,0,0,0) 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  card: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    backdropFilter: 'var(--glass-backdrop)',
    zIndex: 2,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  logoBadge: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-cyan-hover))',
    color: 'var(--bg-primary)',
    fontSize: '24px',
    fontWeight: '800',
    fontFamily: 'var(--font-title)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1rem',
    boxShadow: '0 8px 16px var(--accent-cyan-glow)',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '0.85rem',
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
    gap: '1.25rem',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  input: {
    paddingLeft: '2.75rem',
  },
  submitBtn: {
    marginTop: '0.5rem',
    width: '100%',
    justifyContent: 'center',
    height: '46px',
  },
};
