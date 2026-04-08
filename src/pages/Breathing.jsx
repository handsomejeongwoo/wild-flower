import { useState, useEffect, useRef } from 'react'

const phases = [
  { name: '들이쉬기', duration: 4, color: '#AED581', icon: '🌱' },
  { name: '멈추기', duration: 7, color: '#FFE082', icon: '🌸' },
  { name: '내쉬기', duration: 8, color: '#C5E1A5', icon: '🍃' },
]

export default function Breathing() {
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState(0)
  const [count, setCount] = useState(0)
  const [cycles, setCycles] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!running) return

    timerRef.current = setInterval(() => {
      setCount(prev => {
        const maxCount = phases[phase].duration
        if (prev >= maxCount) {
          setPhase(p => {
            const next = (p + 1) % phases.length
            if (next === 0) setCycles(c => c + 1)
            return next
          })
          return 1
        }
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(timerRef.current)
  }, [running, phase])

  const start = () => {
    setRunning(true)
    setPhase(0)
    setCount(1)
    setCycles(0)
  }

  const stop = () => {
    setRunning(false)
    clearInterval(timerRef.current)
  }

  const currentPhase = phases[phase]
  const progress = count / currentPhase.duration

  return (
    <div className="page fade-in" style={{ textAlign: 'center' }}>
      <h2 className="page-title" style={{ textAlign: 'left' }}>호흡 🌿</h2>
      <p className="page-subtitle" style={{ textAlign: 'left' }}>
        4-7-8 호흡법으로 마음을 가라앉혀봐요
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '280px',
        position: 'relative',
      }}>
        {/* Outer ring */}
        <svg width="220" height="220" style={{ position: 'absolute' }}>
          <circle
            cx="110" cy="110" r="100"
            fill="none"
            stroke="var(--primary-lighter)"
            strokeWidth="6"
          />
          {running && (
            <circle
              cx="110" cy="110" r="100"
              fill="none"
              stroke={currentPhase.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 100}`}
              strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress)}`}
              transform="rotate(-90 110 110)"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          )}
        </svg>

        {/* Center content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 1,
          animation: running ? `breathe ${currentPhase.duration}s ease-in-out infinite` : 'none',
        }}>
          <span style={{ fontSize: '48px' }}>
            {running ? currentPhase.icon : '🌿'}
          </span>
          {running ? (
            <>
              <span style={{
                fontSize: '20px',
                color: 'var(--primary-dark)',
              }}>
                {currentPhase.name}
              </span>
              <span style={{
                fontSize: '36px',
                color: 'var(--primary)',
                fontWeight: 300,
              }}>
                {count}
              </span>
            </>
          ) : (
            <span style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
            }}>
              준비됐으면 시작해봐
            </span>
          )}
        </div>
      </div>

      {running && (
        <p style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          marginBottom: '16px',
        }}>
          {cycles > 0 ? `${cycles}번째 사이클 완료` : '첫 번째 사이클'}
        </p>
      )}

      <button
        className="btn btn-primary btn-full"
        onClick={running ? stop : start}
        style={{ maxWidth: '240px' }}
      >
        {running ? '멈추기' : '🌬️ 시작하기'}
      </button>

      {!running && (
        <div className="card" style={{ marginTop: '20px', textAlign: 'left' }}>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: 1.8,
          }}>
            <strong style={{ color: 'var(--primary-dark)' }}>4-7-8 호흡법</strong><br />
            코로 4초 들이쉬고, 7초 멈추고, 입으로 8초 내쉬어요.
            불안할 때, 잠이 안 올 때, 마음이 복잡할 때 해보면 좋아요.
            3~4 사이클이면 마음이 한결 편안해질 거예요.
          </p>
        </div>
      )}

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
      `}</style>
    </div>
  )
}
