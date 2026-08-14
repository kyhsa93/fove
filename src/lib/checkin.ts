const CHECKIN_KEY = 'fove:checkin'
const MAX_DAYS = 90

export type CheckinMood = 'great' | 'okay' | 'bad'

type CheckinHistory = Record<string, CheckinMood>

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function load(): CheckinHistory {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(CHECKIN_KEY)
    return raw ? (JSON.parse(raw) as CheckinHistory) : {}
  } catch {
    return {}
  }
}

function save(history: CheckinHistory): void {
  if (typeof window === 'undefined') return
  const trimmed = Object.fromEntries(
    Object.entries(history).sort(([a], [b]) => b.localeCompare(a)).slice(0, MAX_DAYS)
  )
  try {
    window.localStorage.setItem(CHECKIN_KEY, JSON.stringify(trimmed))
  } catch {}
}

export function recordCheckin(mood: CheckinMood): void {
  const history = load()
  history[todayStr()] = mood
  save(history)
}

export function getTodayCheckin(): CheckinMood | null {
  return load()[todayStr()] ?? null
}

export function getMonthCheckin(year: number, month: number): Record<number, CheckinMood> {
  const history = load()
  const prefix = `${year}-${String(month).padStart(2, '0')}-`
  const result: Record<number, CheckinMood> = {}
  for (const [key, mood] of Object.entries(history)) {
    if (key.startsWith(prefix)) {
      const day = parseInt(key.slice(prefix.length), 10)
      if (!isNaN(day)) result[day] = mood
    }
  }
  return result
}

export function getCheckinStats(year: number, month: number): { great: number; okay: number; bad: number; total: number } {
  const monthly = getMonthCheckin(year, month)
  const stats = { great: 0, okay: 0, bad: 0, total: 0 }
  for (const mood of Object.values(monthly)) {
    stats[mood]++
    stats.total++
  }
  return stats
}

export const MOOD_META: Record<CheckinMood, { emoji: string; label: string; color: string }> = {
  great: { emoji: '😄', label: '좋았어요', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  okay:  { emoji: '😐', label: '보통이에요', color: 'text-slate-600 bg-slate-50 border-slate-200' },
  bad:   { emoji: '😢', label: '별로였어요', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
}
