const tabs = [
  { id: 'home', icon: '🌱', label: '홈' },
  { id: 'mood', icon: '🌸', label: '감정일기' },
  { id: 'thought', icon: '🍃', label: '생각기록' },
  { id: 'breathing', icon: '🌿', label: '호흡' },
  { id: 'history', icon: '📖', label: '기록' },
]

export default function Navigation({ current, onChange }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 'var(--nav-height)',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0 4px',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 100,
    }}>
      {tabs.map(tab => {
        const active = current === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '8px 12px',
              borderRadius: '12px',
              background: active ? 'var(--primary-lighter)' : 'transparent',
              transition: 'all 0.2s ease',
              minWidth: '56px',
            }}
          >
            <span style={{ fontSize: '22px', lineHeight: 1 }}>{tab.icon}</span>
            <span style={{
              fontSize: '11px',
              color: active ? 'var(--primary-dark)' : 'var(--text-muted)',
              fontWeight: active ? 600 : 400,
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
