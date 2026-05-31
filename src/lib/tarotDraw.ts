import { ALL_CARDS } from '../data/tarot'
import type { TarotCard } from '../data/tarot'

const DRAW_DATE_KEY = 'fove:tarot_date'
const DRAW_RESULT_KEY = 'fove:tarot_draw'

export interface TarotDrawResult {
  cards: [TarotCard, TarotCard, TarotCard]
  reversed: [boolean, boolean, boolean]
  dateStr: string
}

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 날짜 기반 결정론적 LCG 난수 생성기
function makeLcg(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0
    return state
  }
}

function drawForDate(dateStr: string): TarotDrawResult {
  const [y, m, d] = dateStr.split('-').map(Number)
  const seed = y * 10000 + m * 100 + d
  const rng = makeLcg(seed)

  // Fisher-Yates shuffle으로 78장 중 3장 선택
  const pool = ALL_CARDS.map((c) => c.id)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = rng() % (i + 1)
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  const ids = [pool[0], pool[1], pool[2]]
  const reversed: [boolean, boolean, boolean] = [
    rng() % 2 === 0,
    rng() % 2 === 0,
    rng() % 2 === 0,
  ]

  return {
    cards: ids.map((id) => ALL_CARDS[id]) as [TarotCard, TarotCard, TarotCard],
    reversed,
    dateStr,
  }
}

export function getDailyDraw(): TarotDrawResult {
  const today = todayStr()

  if (typeof window !== 'undefined') {
    const savedDate = window.localStorage.getItem(DRAW_DATE_KEY)
    const savedDraw = window.localStorage.getItem(DRAW_RESULT_KEY)
    if (savedDate === today && savedDraw) {
      try {
        const parsed = JSON.parse(savedDraw) as { ids: number[]; reversed: boolean[] }
        return {
          cards: parsed.ids.map((id) => ALL_CARDS[id]) as [TarotCard, TarotCard, TarotCard],
          reversed: parsed.reversed as [boolean, boolean, boolean],
          dateStr: today,
        }
      } catch {}
    }
  }

  const result = drawForDate(today)

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DRAW_DATE_KEY, today)
    window.localStorage.setItem(DRAW_RESULT_KEY, JSON.stringify({
      ids: result.cards.map((c) => c.id),
      reversed: result.reversed,
    }))
  }

  return result
}
