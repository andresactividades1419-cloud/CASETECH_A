import React from 'react';
import { ClipboardList, Settings, Users, AlertTriangle, Calendar } from 'lucide-react';

export default function DashboardView({ providerCount }) {
  const currentDate = new Date().toISOString().slice(0, 10);

  const stats = [
    { label: 'TOTAL PEDIDOS', value: 3, icon: ClipboardList, glow: 'rgba(56, 189, 248, 0.1)' },
    { label: 'EN PRODUCCIÓN', value: 1, icon: Settings, glow: 'rgba(0, 180, 216, 0.2)', color: 'var(--accent-cyan)' },
    { label: 'PROVEEDORES ACTIVOS', value: providerCount || 2, icon: Users, glow: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-green)' },
    { label: 'ALERTAS STOCK BAJO', value: 1, icon: AlertTriangle, glow: 'rgba(239, 68, 68, 0.2)', color: 'var(--accent-red)', alert: true }
  ];

  const orderStates = [
    { label: 'Pendiente', count: 1, pct: 33, color: 'var(--text-muted)' },
    { label: 'En producción', count: 1, pct: 33, color: 'var(--accent-cyan)' },
    { label: 'En proceso de entrega', count: 0, pct: 0, color: '#f59e0b' },
    { label: 'Entregado', count: 1, pct: 33, color: 'var(--accent-green)' },
    { label: 'Cancelado', count: 0, pct: 0, color: 'var(--accent-red)' }
  ];

  return (
    <div className="animate-fade-in" style={styles.container}>
      {/* Header del Panel */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard General</h1>
          <p style={styles.subtitle}>Resumen del estado operacional de la fábrica, control de inventario y pedidos.</p>
        </div>
        <div style={styles.headerInfo}>
          <div style={styles.alertBadge}>
            <AlertTriangle size={14} color="var(--accent-red)" />
            <span>1 Alerta de Stock</span>
          </div>
          <div style={styles.dateBadge}>
            <Calendar size={14} color="var(--text-muted)" />
            <span>Fecha: {currentDate}</span>
          </div>
        </div>
      </div>

      {/* Grid de Tarjetas de Métricas */}
      <div style={styles.statsGrid}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              style={{
                ...styles.statCard,
                boxShadow: `0 8px 30px ${stat.glow}`,
                border: stat.alert ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid var(--border-color)'
              }}
            >
              <div>
                <span style={styles.statLabel}>{stat.label}</span>
                <h2 style={styles.statValue}>{stat.value}</h2>
              </div>
              <div 
                style={{
                  ...styles.iconBadge,
                  backgroundColor: stat.color ? `rgba(255,255,255,0.02)` : 'rgba(56, 189, 248, 0.05)',
                  border: `1px solid ${stat.color || 'var(--border-color)'}`
                }}
              >
                <Icon size={20} color={stat.color || 'var(--accent-cyan)'} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Secciones de Gráficas e Insumos */}
      <div style={styles.bottomSection}>
        {/* Proporción de Estados de Pedidos */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <ClipboardList size={18} color="var(--accent-cyan)" />
            <h3 style={styles.panelTitle}>PROPORCIÓN DE ESTADOS DE PEDIDOS</h3>
          </div>
          <div style={styles.statesList}>
            {orderStates.map((state, idx) => (
              <div key={idx} style={styles.stateRow}>
                <div style={styles.stateMeta}>
                  <span style={styles.stateLabelText}>{state.label}</span>
                  <span style={styles.stateCount}>{state.count} Pedidos ({state.pct}%)</span>
                </div>
                <div style={styles.progressContainer}>
                  <div 
                    style={{
                      ...styles.progressBar,
                      width: `${state.pct}%`,
                      backgroundColor: state.color,
                      boxShadow: state.pct > 0 ? `0 0 10px ${state.color}` : 'none'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insumos Críticos / Bajo Stock */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <AlertTriangle size={18} color="var(--accent-red)" />
            <h3 style={styles.panelTitle}>INSUMOS CRÍTICOS / BAJO STOCK</h3>
          </div>
          <div style={styles.alertList}>
            <div style={styles.alertItem}>
              <div>
                <h4 style={styles.itemName}>Lona</h4>
                <p style={styles.itemCategory}>Categoría: Cubiertas</p>
              </div>
              <div style={styles.alertValueContainer}>
                <span style={styles.alertValue}>12 / 20 m²</span>
                <span style={styles.alertBadgeText}>CRÍTICO</span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  headerInfo: {
    display: 'flex',
    gap: '1rem',
  },
  alertBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: '6px',
    padding: '0.4rem 0.8rem',
    color: 'var(--accent-red)',
    fontSize: '0.8rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  dateBadge: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    padding: '0.4rem 0.8rem',
    color: 'var(--text-main)',
    fontSize: '0.8rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'var(--transition-smooth)',
  },
  statLabel: {
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    fontWeight: '600',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: '800',
    marginTop: '0.25rem',
    fontFamily: 'var(--font-title)',
  },
  iconBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  panelCard: {
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    minHeight: '280px',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.75rem',
  },
  panelTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  statesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  stateRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  stateMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
  },
  stateLabelText: {
    color: 'var(--text-main)',
    fontWeight: '500',
  },
  stateCount: {
    color: 'var(--text-muted)',
  },
  progressContainer: {
    width: '100%',
    height: '8px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease-in-out',
  },
  alertList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  alertItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.03)',
    border: '1px solid rgba(239, 68, 68, 0.1)',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: '0.9rem',
    fontWeight: '600',
  },
  itemCategory: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '0.15rem',
  },
  alertValueContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.25rem',
  },
  alertValue: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--accent-red)',
    fontFamily: 'var(--font-title)',
  },
  alertBadgeText: {
    fontSize: '0.65rem',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    padding: '0.15rem 0.4rem',
    borderRadius: '4px',
    color: 'var(--accent-red)',
    fontWeight: '600',
  },
};
