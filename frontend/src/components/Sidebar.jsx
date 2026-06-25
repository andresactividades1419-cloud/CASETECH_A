import React from 'react';
import { LayoutDashboard, Users, FileText, Package, LogOut, User } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard / Reportes', icon: LayoutDashboard },
    { id: 'proveedores', label: 'Proveedores', icon: Users },
    { id: 'pedidos', label: 'Pedidos y Compras', icon: FileText, disabled: true },
    { id: 'inventarios', label: 'Control de Inventarios', icon: Package, disabled: true }
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <div style={styles.logoBadge}>
            <Package size={20} color="var(--bg-primary)" />
          </div>
          <div>
            <h2 style={styles.logoText}>CASETECH</h2>
            <p style={styles.logoSubtext}>MÓDULOS DEL SISTEMA</p>
          </div>
        </div>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => !item.disabled && setActiveTab(item.id)}
              style={{
                ...styles.navBtn,
                ...(isActive ? styles.navBtnActive : {}),
                ...(item.disabled ? styles.navBtnDisabled : {})
              }}
              title={item.disabled ? 'Disponible en siguientes Sprints' : ''}
            >
              <Icon size={20} style={isActive ? styles.activeIcon : styles.icon} />
              <span>{item.label}</span>
              {item.disabled && (
                <span style={styles.pill}>SP2</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            <User size={18} color="var(--accent-cyan)" />
          </div>
          <div style={styles.userDetails}>
            <h4 style={styles.userName}>{user?.correo?.split('@')[0]}</h4>
            <p style={styles.userRole}>{user?.rol || 'ADMINISTRADOR'}</p>
          </div>
        </div>

        <button onClick={onLogout} style={styles.logoutBtn}>
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: '280px',
    backgroundColor: 'var(--bg-secondary)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
  },
  header: {
    padding: '2rem 1.5rem',
    borderBottom: '1px solid var(--border-color)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-cyan-hover))',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 8px var(--accent-cyan-glow)',
  },
  logoText: {
    fontSize: '1.15rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  logoSubtext: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  nav: {
    flex: 1,
    padding: '2rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  navBtn: {
    background: 'none',
    border: 'none',
    outline: 'none',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-title)',
    fontSize: '0.95rem',
    fontWeight: '500',
    padding: '0.85rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    transition: 'var(--transition-smooth)',
    textAlign: 'left',
    width: '100%',
    position: 'relative',
  },
  navBtnActive: {
    color: 'var(--accent-cyan)',
    backgroundColor: 'rgba(0, 180, 216, 0.06)',
    fontWeight: '600',
    borderLeft: '3px solid var(--accent-cyan)',
    paddingLeft: 'calc(1rem - 3px)',
  },
  navBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  icon: {
    color: 'var(--text-muted)',
  },
  activeIcon: {
    color: 'var(--accent-cyan)',
  },
  pill: {
    position: 'absolute',
    right: '1rem',
    fontSize: '0.65rem',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '0.15rem 0.4rem',
    borderRadius: '4px',
    color: 'var(--text-muted)',
    border: '1px solid var(--border-color)',
  },
  footer: {
    padding: '1.5rem',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 180, 216, 0.08)',
    border: '1px solid rgba(0, 180, 216, 0.15)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetails: {
    overflow: 'hidden',
  },
  userName: {
    fontSize: '0.9rem',
    fontWeight: '600',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  userRole: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: '8px',
    color: 'var(--accent-red)',
    fontFamily: 'var(--font-title)',
    fontWeight: '600',
    fontSize: '0.85rem',
    padding: '0.65rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'var(--transition-smooth)',
    width: '100%',
  },
  logoutBtn: {
    background: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: '8px',
    color: 'var(--accent-red)',
    fontFamily: 'var(--font-title)',
    fontWeight: '600',
    fontSize: '0.85rem',
    padding: '0.65rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'var(--transition-smooth)',
    width: '100%',
  },
};
// Quick style fix duplication cleanup
styles.logoutBtn = {
  background: 'rgba(239, 68, 68, 0.05)',
  border: '1px solid rgba(239, 68, 68, 0.15)',
  borderRadius: '8px',
  color: 'var(--accent-red)',
  fontFamily: 'var(--font-title)',
  fontWeight: '600',
  fontSize: '0.85rem',
  padding: '0.65rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  transition: 'var(--transition-smooth)',
  width: '100%',
};
styles.logoutBtnHover = {
  background: 'var(--accent-red)',
  color: 'var(--text-main)'
};
