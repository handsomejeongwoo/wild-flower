import { useState, useEffect } from 'react'
import { getTodayMood } from '../utils/storage'

const greetings = [
  '오늘도 네가 피어있어서 다행이야.',
  '잡초 사이에서도 빛나는 건 너야.',
  '자세히 보아야 예쁘다. 너도 그렇다.',
  '작은 들꽃도 누군가에겐 세상이야.',
  '지금 이 순간, 넌 충분해.',
  '흔들려도 괜찮아. 바람에 흔들리는 꽃이 더 예쁘니까.',
  '아무도 안 봐도, 너는 피어나고 있어.',
  '비 온 뒤에 더 선명해지는 건 꽃잎도, 너도 같아.',
]

export default function Home({ onNavigate }) {
  const [greeting, setGreeting] = useState('')
  const [todayMood, setTodayMood] = useState(null)

  useEffect(() => {
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)])
    setTodayMood(getTodayMood())
  }, [])

  const hour = new Date().getHours()
  const timeGreeting = hour < 12 ? '좋은 아침' : hour < 18 ? '좋은 오후' : '좋은 저녁'

  return (
    <div className="page fade-in" style={{
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      paddingTop: '12px', paddingBottom: 'calc(var(--nav-height) + 12px)',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '48px', marginBottom: '4px' }}>🌸</div>
        <h1 style={{ fontSize: '26px', color: 'var(--primary-dark)', marginBottom: '2px' }}>풀꽃</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>{timeGreeting}이에요</p>
      </div>

      {/* Quote */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-warm), var(--accent-yellow-light))',
        borderRadius: 'var(--radius)',
        textAlign: 'center',
        padding: '20px 16px',
        marginBottom: '12px',
      }}>
        <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'var(--primary-dark)' }}>
          "{greeting}"
        </p>
      </div>

      {/* Today mood or CTA */}
      {todayMood ? (
        <div className="card" style={{ textAlign: 'center', padding: '14px', marginBottom: '12px' }}>
          <span style={{ fontSize: '28px' }}>{todayMood.emoji}</span>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
            {todayMood.label}
          </span>
        </div>
      ) : (
        <button
          onClick={() => onNavigate('mood')}
          style={{
            width: '100%', textAlign: 'center', padding: '14px',
            borderRadius: 'var(--radius)', marginBottom: '12px',
            border: '2px dashed var(--primary-light)', background: 'var(--bg-card)',
          }}
        >
          <span style={{ color: 'var(--primary)', fontSize: '14px' }}>
            🌱 오늘의 감정 기록하기
          </span>
        </button>
      )}

      {/* Main action - 생각 정리하기 */}
      <button
        onClick={() => onNavigate('thought')}
        style={{
          width: '100%', padding: '20px',
          borderRadius: 'var(--radius)',
          background: 'var(--primary)',
          color: 'white',
          fontSize: '17px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: '0 4px 16px rgba(124, 179, 66, 0.3)',
          marginBottom: '10px',
        }}
      >
        🍃 생각 정리하기
      </button>

      {/* Secondary action */}
      <button
        onClick={() => onNavigate('breathing')}
        style={{
          width: '100%', padding: '16px',
          borderRadius: 'var(--radius)',
          background: 'var(--primary-lighter)',
          color: 'var(--primary-dark)',
          fontSize: '15px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}
      >
        🌿 호흡하기
      </button>
    </div>
  )
}
