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

const flowers = ['🌸', '🌼', '🌻', '🌺', '🌷', '💐', '🌿', '🍀']

function FlowerDecoration() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      margin: '16px 0',
      fontSize: '28px',
    }}>
      {['🌿', '🌸', '🌱', '🌼', '🌿'].map((f, i) => (
        <span key={i} style={{
          animation: `sway 3s ease-in-out ${i * 0.3}s infinite`,
          display: 'inline-block',
        }}>{f}</span>
      ))}
    </div>
  )
}

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
    <div className="page fade-in">
      <div style={{ textAlign: 'center', padding: '20px 0 12px' }}>
        <div style={{ fontSize: '64px', marginBottom: '8px' }}>🌸</div>
        <h1 style={{
          fontSize: '28px',
          color: 'var(--primary-dark)',
          marginBottom: '4px',
        }}>풀꽃</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          {timeGreeting}이에요
        </p>
      </div>

      <FlowerDecoration />

      <div className="card" style={{
        background: 'linear-gradient(135deg, var(--bg-warm), var(--accent-yellow-light))',
        textAlign: 'center',
        padding: '28px 20px',
      }}>
        <p style={{
          fontSize: '18px',
          lineHeight: 1.7,
          color: 'var(--primary-dark)',
        }}>
          "{greeting}"
        </p>
      </div>

      {todayMood ? (
        <div className="card" style={{ marginTop: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            오늘의 감정
          </p>
          <span style={{ fontSize: '36px' }}>{todayMood.emoji}</span>
          <p style={{ fontSize: '15px', marginTop: '4px', color: 'var(--text-secondary)' }}>
            {todayMood.label}
          </p>
        </div>
      ) : (
        <button
          className="card"
          onClick={() => onNavigate('mood')}
          style={{
            marginTop: '12px',
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px dashed var(--primary-light)',
            background: 'var(--bg-card)',
          }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            아직 오늘의 감정을 기록하지 않았어요
          </p>
          <p style={{ color: 'var(--primary)', fontSize: '15px' }}>
            🌱 감정 기록하러 가기
          </p>
        </button>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginTop: '12px',
      }}>
        <button className="card" onClick={() => onNavigate('thought')} style={{
          textAlign: 'center', cursor: 'pointer', padding: '16px',
        }}>
          <span style={{ fontSize: '28px', display: 'block', marginBottom: '6px' }}>🍃</span>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>생각 정리하기</span>
        </button>
        <button className="card" onClick={() => onNavigate('breathing')} style={{
          textAlign: 'center', cursor: 'pointer', padding: '16px',
        }}>
          <span style={{ fontSize: '28px', display: 'block', marginBottom: '6px' }}>🌿</span>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>호흡하기</span>
        </button>
      </div>

      <style>{`
        @keyframes sway {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  )
}
