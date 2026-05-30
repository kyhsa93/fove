const STREAK_COUNT_KEY = 'fove_streak_count'
const STREAK_LAST_KEY = 'fove_streak_last'

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function todayKey(): string {
  return dateKey(new Date())
}

function yesterdayKey(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return dateKey(d)
}

export interface StreakInfo {
  count: number
  isFirstToday: boolean
}

export function recordVisit(): StreakInfo {
  if (typeof window === 'undefined') return { count: 1, isFirstToday: false }

  const today = todayKey()
  const yesterday = yesterdayKey()
  const last = window.localStorage.getItem(STREAK_LAST_KEY)
  const stored = Number(window.localStorage.getItem(STREAK_COUNT_KEY)) || 0

  if (last === today) {
    return { count: stored || 1, isFirstToday: false }
  }

  const count = last === yesterday ? stored + 1 : 1
  window.localStorage.setItem(STREAK_COUNT_KEY, String(count))
  window.localStorage.setItem(STREAK_LAST_KEY, today)
  return { count, isFirstToday: true }
}

export function getStreakCount(): number {
  if (typeof window === 'undefined') return 0

  const last = window.localStorage.getItem(STREAK_LAST_KEY)
  if (!last) return 0

  const today = todayKey()
  const yesterday = yesterdayKey()
  if (last !== today && last !== yesterday) return 0

  return Number(window.localStorage.getItem(STREAK_COUNT_KEY)) || 0
}
