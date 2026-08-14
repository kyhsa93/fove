const HISTORY_KEY = 'fove:fortune_history'
const MAX_DAYS = 90

type FortuneHistory = Record<string, number>

function dateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function todayStr(): string {
  return dateStr(new Date())
}

function load(): FortuneHistory {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY)
    return raw ? (JSON.parse(raw) as FortuneHistory) : {}
  } catch {
    return {}
  }
}

function save(history: FortuneHistory): void {
  if (typeof window === 'undefined') return
  const trimmed = Object.fromEntries(
    Object.entries(history)
      .sort(([a], [b]) => b.localeCompare(a))
      .slice(0, MAX_DAYS)
  )
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed))
  } catch {
  }
}

export function recordFortune(score: number): void {
  const history = load()
  history[todayStr()] = score
  save(history)
}

export function getMonthHistory(year: number, month: number): Record<number, number> {
  const history = load()
  const prefix = `${year}-${String(month).padStart(2, '0')}-`
  const result: Record<number, number> = {}
  for (const [key, score] of Object.entries(history)) {
    if (key.startsWith(prefix)) {
      const day = parseInt(key.slice(prefix.length), 10)
      if (!isNaN(day)) result[day] = score
    }
  }
  return result
}

export interface HistoryStats {
  count: number
  avg: number
  best: { day: number; score: number } | null
  worst: { day: number; score: number } | null
}

export function getMonthStats(year: number, month: number): HistoryStats {
  const monthly = getMonthHistory(year, month)
  const entries = Object.entries(monthly).map(([d, s]) => ({ day: Number(d), score: s }))
  if (entries.length === 0) return { count: 0, avg: 0, best: null, worst: null }

  const sorted = [...entries].sort((a, b) => b.score - a.score)
  return {
    count: entries.length,
    avg: Math.round(entries.reduce((s, e) => s + e.score, 0) / entries.length),
    best: sorted[0],
    worst: sorted[sorted.length - 1],
  }
}

export function scoreGrade(score: number): 'good' | 'neutral' | 'caution' {
  if (score >= 78) return 'good'
  if (score >= 62) return 'neutral'
  return 'caution'
}
