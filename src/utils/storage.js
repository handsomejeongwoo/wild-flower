const KEYS = {
  MOODS: 'wildflower_moods',
  THOUGHTS: 'wildflower_thoughts',
  SETTINGS: 'wildflower_settings',
}

function load(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function getMoods() {
  return load(KEYS.MOODS)
}

export function saveMood(mood) {
  const moods = load(KEYS.MOODS)
  moods.unshift({ ...mood, id: Date.now(), createdAt: new Date().toISOString() })
  save(KEYS.MOODS, moods)
}

export function getThoughts() {
  return load(KEYS.THOUGHTS)
}

export function saveThought(thought) {
  const thoughts = load(KEYS.THOUGHTS)
  thoughts.unshift({ ...thought, id: Date.now(), createdAt: new Date().toISOString() })
  save(KEYS.THOUGHTS, thoughts)
}

export function getTodayMood() {
  const today = new Date().toISOString().slice(0, 10)
  const moods = load(KEYS.MOODS)
  return moods.find(m => m.createdAt?.startsWith(today))
}

export function deleteMood(id) {
  const moods = load(KEYS.MOODS).filter(m => m.id !== id)
  save(KEYS.MOODS, moods)
}

export function deleteThought(id) {
  const thoughts = load(KEYS.THOUGHTS).filter(t => t.id !== id)
  save(KEYS.THOUGHTS, thoughts)
}
