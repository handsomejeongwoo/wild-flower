import { useState, useEffect } from 'react'
import { getMoods, getThoughts, deleteMood, deleteThought } from '../utils/storage'

const tabs = ['감정', '생각']

function formatDate(iso) {
  const d = new Date(iso)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hours = d.getHours()
  const mins = String(d.getMinutes()).padStart(2, '0')
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  return `${month}/${day} (${dayNames[d.getDay()]}) ${hours}:${mins}`
}

function MoodCard({ mood, onDelete }) {
  return (
    <div className="card" style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px',
    }}>
      <span style={{ fontSize: '32px', lineHeight: 1 }}>{mood.emoji}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '15px', fontWeight: 500 }}>{mood.label}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {formatDate(mood.createdAt)}
          </span>
        </div>
        {mood.note && (
          <p style={{
            fontSize: '14px', color: 'var(--text-secondary)',
            marginTop: '6px', lineHeight: 1.5,
          }}>
            {mood.note}
          </p>
        )}
      </div>
      <button
        onClick={() => onDelete(mood.id)}
        style={{ fontSize: '14px', color: 'var(--text-muted)', padding: '4px' }}
      >
        ×
      </button>
    </div>
  )
}

function ThoughtCard({ thought, onDelete }) {
  const [open, setOpen] = useState(false)
  const distortionLabels = {
    'all-or-nothing': '흑백 사고',
    'overgeneralization': '과잉 일반화',
    'mind-reading': '독심술',
    'catastrophizing': '파국화',
    'emotional-reasoning': '감정적 추론',
    'should': '당위적 사고',
    'labeling': '낙인 찍기',
    'personalization': '개인화',
  }

  return (
    <div className="card">
      <div
        onClick={() => setOpen(!open)}
        style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
      >
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: '14px', color: 'var(--text-secondary)',
            marginBottom: '4px',
          }}>
            {formatDate(thought.createdAt)}
          </div>
          <p style={{ fontSize: '15px', lineHeight: 1.5 }}>
            {thought.situation.length > 60
              ? thought.situation.slice(0, 60) + '...'
              : thought.situation}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '12px',
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s',
          }}>▼</span>
          <button
            onClick={e => { e.stopPropagation(); onDelete(thought.id) }}
            style={{ fontSize: '14px', color: 'var(--text-muted)', padding: '4px' }}
          >
            ×
          </button>
        </div>
      </div>

      {open && (
        <div className="fade-in" style={{
          marginTop: '12px', paddingTop: '12px',
          borderTop: '1px solid var(--border)',
          fontSize: '14px', lineHeight: 1.7,
        }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: 'var(--text-muted)' }}>자동적 사고</span>
            <p>{thought.thought}</p>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: 'var(--text-muted)' }}>
              감정: {thought.emotion} ({thought.emotionIntensity}/10)
            </span>
          </div>
          {thought.distortions?.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              <span style={{ color: 'var(--text-muted)' }}>인지 왜곡</span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                {thought.distortions.map(d => (
                  <span key={d} style={{
                    fontSize: '12px', padding: '2px 8px',
                    borderRadius: '12px', background: 'var(--primary-lighter)',
                    color: 'var(--primary-dark)',
                  }}>
                    {distortionLabels[d] || d}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div style={{
            padding: '10px 12px', borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-warm)',
          }}>
            <span style={{ color: 'var(--primary-dark)', fontSize: '13px' }}>
              대안적 사고 🌻
            </span>
            <p style={{ marginTop: '4px' }}>{thought.alternative}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function MoodChart({ moods }) {
  const recent = moods.slice(0, 14).reverse()
  if (recent.length < 2) return null

  const maxVal = 5
  const chartHeight = 120
  const chartWidth = Math.max(280, recent.length * 40)

  return (
    <div className="card" style={{ marginBottom: '12px', overflowX: 'auto' }}>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
        최근 감정 추이
      </p>
      <svg width={chartWidth} height={chartHeight + 30} style={{ display: 'block' }}>
        {/* Grid lines */}
        {[1, 2, 3, 4, 5].map(v => (
          <line key={v}
            x1="0" x2={chartWidth}
            y1={chartHeight - (v / maxVal) * chartHeight}
            y2={chartHeight - (v / maxVal) * chartHeight}
            stroke="var(--border)" strokeWidth="1"
          />
        ))}
        {/* Line */}
        <polyline
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={recent.map((m, i) => {
            const x = 20 + i * ((chartWidth - 40) / (recent.length - 1))
            const y = chartHeight - (m.value / maxVal) * chartHeight
            return `${x},${y}`
          }).join(' ')}
        />
        {/* Dots & labels */}
        {recent.map((m, i) => {
          const x = 20 + i * ((chartWidth - 40) / (recent.length - 1))
          const y = chartHeight - (m.value / maxVal) * chartHeight
          const date = new Date(m.createdAt)
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="5" fill="var(--primary)" />
              <text x={x} y={y - 10} textAnchor="middle" fontSize="14">
                {m.emoji}
              </text>
              <text
                x={x} y={chartHeight + 18}
                textAnchor="middle" fontSize="10"
                fill="var(--text-muted)"
              >
                {date.getMonth() + 1}/{date.getDate()}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function History() {
  const [tab, setTab] = useState(0)
  const [moods, setMoods] = useState([])
  const [thoughts, setThoughts] = useState([])

  useEffect(() => {
    setMoods(getMoods())
    setThoughts(getThoughts())
  }, [])

  const handleDeleteMood = (id) => {
    deleteMood(id)
    setMoods(getMoods())
  }

  const handleDeleteThought = (id) => {
    deleteThought(id)
    setThoughts(getThoughts())
  }

  return (
    <div className="page fade-in">
      <h2 className="page-title">기록 보기 📖</h2>
      <p className="page-subtitle">네가 걸어온 길을 돌아봐요</p>

      <div style={{
        display: 'flex', gap: '4px', marginBottom: '16px',
        background: 'var(--primary-lighter)', borderRadius: 'var(--radius-sm)',
        padding: '3px',
      }}>
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            style={{
              flex: 1, padding: '8px',
              borderRadius: '8px', fontSize: '14px',
              background: tab === i ? 'var(--bg-card)' : 'transparent',
              color: tab === i ? 'var(--primary-dark)' : 'var(--text-muted)',
              boxShadow: tab === i ? '0 1px 3px var(--shadow)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div>
          <MoodChart moods={moods} />
          {moods.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '32px', marginBottom: '8px' }}>🌱</p>
              <p>아직 기록이 없어요</p>
              <p style={{ fontSize: '13px' }}>감정 일기를 시작해봐요</p>
            </div>
          ) : (
            moods.map(mood => (
              <MoodCard key={mood.id} mood={mood} onDelete={handleDeleteMood} />
            ))
          )}
        </div>
      )}

      {tab === 1 && (
        <div>
          {thoughts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '32px', marginBottom: '8px' }}>🍃</p>
              <p>아직 기록이 없어요</p>
              <p style={{ fontSize: '13px' }}>생각 기록을 시작해봐요</p>
            </div>
          ) : (
            thoughts.map(thought => (
              <ThoughtCard key={thought.id} thought={thought} onDelete={handleDeleteThought} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
