import { useState, useCallback } from 'react'
import { saveMood } from '../utils/storage'

const moods = [
  { emoji: '😊', label: '좋아', value: 5, color: '#AED581' },
  { emoji: '🙂', label: '괜찮아', value: 4, color: '#C5E1A5' },
  { emoji: '😐', label: '그냥 그래', value: 3, color: '#FFE082' },
  { emoji: '😔', label: '좀 힘들어', value: 2, color: '#FFCC80' },
  { emoji: '😢', label: '많이 힘들어', value: 1, color: '#EF9A9A' },
]

const prompts = [
  '오늘 하루 어땠어?',
  '지금 무슨 생각이 들어?',
  '오늘 고마웠던 순간이 있었어?',
  '지금 네 마음에 어떤 바람이 불고 있어?',
]

export default function MoodJournal() {
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [prompt] = useState(() => prompts[Math.floor(Math.random() * prompts.length)])

  const handleFocus = useCallback((e) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
  }, [])

  const handleSave = () => {
    if (!selected) return
    saveMood({
      emoji: selected.emoji,
      label: selected.label,
      value: selected.value,
      note,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setSelected(null)
    setNote('')
  }

  return (
    <div className="page fade-in">
      <h2 className="page-title">감정 일기 🌸</h2>
      <p className="page-subtitle">지금 네 마음은 어떤 꽃을 닮았을까?</p>

      <div className="card">
        <p style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          {prompt}
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '20px',
        }}>
          {moods.map(mood => (
            <button
              key={mood.value}
              onClick={() => setSelected(mood)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '10px 8px',
                borderRadius: '12px',
                background: selected?.value === mood.value ? mood.color + '30' : 'transparent',
                border: selected?.value === mood.value
                  ? `2px solid ${mood.color}`
                  : '2px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: '32px' }}>{mood.emoji}</span>
              <span style={{
                fontSize: '12px',
                color: selected?.value === mood.value ? 'var(--text)' : 'var(--text-muted)',
              }}>
                {mood.label}
              </span>
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label className="label">한 줄 메모</label>
          <textarea
            className="input textarea"
            placeholder="오늘의 마음을 자유롭게 적어봐..."
            value={note}
            onChange={e => setNote(e.target.value)}
            onFocus={handleFocus}
          />
        </div>

        <button
          className="btn btn-primary btn-full"
          onClick={handleSave}
          disabled={!selected}
          style={{ opacity: selected ? 1 : 0.5 }}
        >
          🌱 기록하기
        </button>
      </div>

      {saved && (
        <div className="card fade-in" style={{
          marginTop: '12px',
          textAlign: 'center',
          background: 'var(--bg-warm)',
        }}>
          <p style={{ fontSize: '24px', marginBottom: '4px' }}>🌼</p>
          <p style={{ color: 'var(--primary-dark)', fontSize: '15px' }}>
            오늘의 마음, 잘 기록했어요
          </p>
        </div>
      )}
    </div>
  )
}
