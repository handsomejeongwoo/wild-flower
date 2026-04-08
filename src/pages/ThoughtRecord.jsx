import { useState, useRef, useCallback } from 'react'
import { saveThought } from '../utils/storage'

const distortions = [
  { id: 'all-or-nothing', label: '흑백 사고', desc: '"완벽하지 않으면 실패야"' },
  { id: 'overgeneralization', label: '과잉 일반화', desc: '"항상 이렇게 돼"' },
  { id: 'mind-reading', label: '독심술', desc: '"저 사람은 분명 나를 싫어해"' },
  { id: 'catastrophizing', label: '파국화', desc: '"이제 다 끝났어"' },
  { id: 'emotional-reasoning', label: '감정적 추론', desc: '"불안하니까 위험한 거야"' },
  { id: 'should', label: '당위적 사고', desc: '"~해야만 해"' },
  { id: 'labeling', label: '낙인 찍기', desc: '"나는 쓸모없는 사람이야"' },
  { id: 'personalization', label: '개인화', desc: '"다 내 탓이야"' },
]

const steps = ['situation', 'thought', 'emotion', 'distortion', 'alternative']

export default function ThoughtRecord() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState({
    situation: '',
    thought: '',
    emotion: '',
    emotionIntensity: 5,
    distortions: [],
    alternative: '',
  })
  const [saved, setSaved] = useState(false)
  const pageRef = useRef(null)

  const update = (key, value) => setData(prev => ({ ...prev, [key]: value }))

  const toggleDistortion = (id) => {
    setData(prev => ({
      ...prev,
      distortions: prev.distortions.includes(id)
        ? prev.distortions.filter(d => d !== id)
        : [...prev.distortions, id],
    }))
  }

  const handleFocus = useCallback((e) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 300)
  }, [])

  const handleSave = () => {
    saveThought(data)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setStep(0)
      setData({
        situation: '', thought: '', emotion: '',
        emotionIntensity: 5, distortions: [], alternative: '',
      })
    }, 3000)
  }

  const canNext = () => {
    if (step === 0) return data.situation.trim()
    if (step === 1) return data.thought.trim()
    if (step === 2) return data.emotion.trim()
    if (step === 3) return data.distortions.length > 0
    if (step === 4) return data.alternative.trim()
    return false
  }

  if (saved) {
    return (
      <div className="page fade-in" style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🌻</div>
        <h2 style={{ color: 'var(--primary-dark)', marginBottom: '8px', fontSize: '22px' }}>
          생각을 잘 정리했어요
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, textAlign: 'center' }}>
          같은 상황도 다르게 볼 수 있다는 걸<br />
          이미 알고 있는 너는 대단해
        </p>
      </div>
    )
  }

  return (
    <div className="page fade-in" ref={pageRef} style={{
      display: 'flex', flexDirection: 'column',
    }}>
      <h2 className="page-title">생각 기록 🍃</h2>
      <p className="page-subtitle">마음속 잡초를 정리하고, 꽃을 심어봐요</p>

      {/* Progress */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', flexShrink: 0 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: '4px', borderRadius: '2px',
            background: i <= step ? 'var(--primary)' : 'var(--primary-lighter)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
          {step === 0 && (
            <div className="fade-in">
              <label className="label">어떤 상황이었어?</label>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                감정이 올라온 그 순간을 떠올려봐
              </p>
              <textarea
                className="input textarea"
                placeholder="예: 카톡을 보냈는데 읽씹당했어..."
                value={data.situation}
                onChange={e => update('situation', e.target.value)}
                onFocus={handleFocus}
                autoFocus
              />
            </div>
          )}

          {step === 1 && (
            <div className="fade-in">
              <label className="label">그때 어떤 생각이 들었어?</label>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                머릿속에 떠오른 생각을 그대로 적어봐
              </p>
              <textarea
                className="input textarea"
                placeholder="예: 나한테 관심이 없나봐. 나는 중요하지 않은 사람인가봐..."
                value={data.thought}
                onChange={e => update('thought', e.target.value)}
                onFocus={handleFocus}
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <label className="label">어떤 감정이 느껴졌어?</label>
              <input
                className="input"
                placeholder="예: 불안, 서운함, 외로움..."
                value={data.emotion}
                onChange={e => update('emotion', e.target.value)}
                onFocus={handleFocus}
                autoFocus
              />
              <div style={{ marginTop: '16px' }}>
                <label className="label">
                  감정 강도: {data.emotionIntensity}/10
                </label>
                <input
                  type="range"
                  min="1" max="10"
                  value={data.emotionIntensity}
                  onChange={e => update('emotionIntensity', Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--primary)' }}
                />
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '12px', color: 'var(--text-muted)',
                }}>
                  <span>약함</span><span>강함</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              <label className="label">혹시 이런 생각의 함정에 빠진 건 아닐까?</label>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                해당되는 것을 골라봐 (여러 개 선택 가능)
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {distortions.map(d => {
                  const active = data.distortions.includes(d.id)
                  return (
                    <button
                      key={d.id}
                      onClick={() => toggleDistortion(d.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '12px', borderRadius: 'var(--radius-sm)',
                        background: active ? 'var(--primary-lighter)' : 'var(--bg)',
                        border: active ? '1.5px solid var(--primary-light)' : '1.5px solid var(--border)',
                        textAlign: 'left', transition: 'all 0.2s',
                      }}
                    >
                      <span style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        background: active ? 'var(--primary)' : 'var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontSize: '12px', flexShrink: 0,
                      }}>
                        {active && '✓'}
                      </span>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{d.label}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{d.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="fade-in">
              <label className="label">다르게 생각해본다면?</label>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
                같은 상황을 친한 친구가 겪었다면 뭐라고 해줄 것 같아?
              </p>
              <textarea
                className="input textarea"
                style={{ minHeight: '100px' }}
                placeholder="예: 바쁠 수도 있지. 읽씹이 꼭 관심 없다는 뜻은 아니야..."
                value={data.alternative}
                onChange={e => update('alternative', e.target.value)}
                onFocus={handleFocus}
                autoFocus
              />
            </div>
          )}
        </div>

        <div style={{
          display: 'flex', gap: '8px', paddingTop: '16px',
          flexShrink: 0, borderTop: '1px solid var(--border)', marginTop: '16px',
        }}>
          {step > 0 && (
            <button
              className="btn btn-secondary"
              onClick={() => setStep(s => s - 1)}
              style={{ flex: 1, padding: '14px' }}
            >
              이전
            </button>
          )}
          {step < 4 ? (
            <button
              className="btn btn-primary"
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext()}
              style={{ flex: 1, opacity: canNext() ? 1 : 0.5, padding: '14px' }}
            >
              다음
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!canNext()}
              style={{ flex: 1, opacity: canNext() ? 1 : 0.5, padding: '14px' }}
            >
              🌻 정리 완료
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
