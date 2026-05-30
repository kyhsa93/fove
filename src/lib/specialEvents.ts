import { getTodaySolarTerm } from './solarTermUtils'
import type { RoutePath } from '../routes'
import { ROUTE_PATHS } from '../routes'

export interface EventTheme {
  border: string
  bg: string
  text: string
  badge: string
  button: string
}

export interface SpecialEvent {
  name: string
  emoji: string
  subtitle: string
  message: string
  ctaLabel: string
  ctaPath: RoutePath
  theme: EventTheme
}

// ── 설날·추석 양력 날짜 (음력 1/1, 8/15) ─────────────────────────────────
const SEOLLAL_DATES: Record<number, [number, number]> = {
  2024: [2, 10], 2025: [1, 29], 2026: [2, 17],
  2027: [2, 6],  2028: [1, 26], 2029: [2, 13], 2030: [2, 3],
}

const CHUSEOK_DATES: Record<number, [number, number]> = {
  2024: [9, 17], 2025: [10, 6], 2026: [9, 25],
  2027: [9, 15], 2028: [10, 3], 2029: [9, 22], 2030: [9, 12],
}

// ── 고정 날짜 이벤트 (월, 일) ────────────────────────────────────────────
const FIXED_EVENTS: Array<{
  month: number
  day: number
  event: SpecialEvent
}> = [
  {
    month: 2, day: 14,
    event: {
      name: '밸런타인데이', emoji: '💝',
      subtitle: '사랑·연애운',
      message: '오늘은 마음을 전하기 좋은 날이에요. 궁합으로 인연의 흐름을 확인해보세요.',
      ctaLabel: '궁합 보기',
      ctaPath: ROUTE_PATHS.compatibility,
      theme: { border: 'border-rose-300', bg: 'bg-rose-50', text: 'text-rose-900', badge: 'bg-rose-100 text-rose-700', button: 'bg-rose-500 hover:bg-rose-600 text-white' },
    },
  },
  {
    month: 5, day: 5,
    event: {
      name: '어린이날', emoji: '🎈',
      subtitle: '가족운·관계운',
      message: '소중한 인연과 함께하는 날이에요. 오늘의 관계 운세와 궁합을 확인해보세요.',
      ctaLabel: '오늘의 운세 보기',
      ctaPath: ROUTE_PATHS.fortune,
      theme: { border: 'border-sky-300', bg: 'bg-sky-50', text: 'text-sky-900', badge: 'bg-sky-100 text-sky-700', button: 'bg-sky-500 hover:bg-sky-600 text-white' },
    },
  },
  {
    month: 11, day: 11,
    event: {
      name: '빼빼로데이', emoji: '🍫',
      subtitle: '연애운·인연운',
      message: '달콤한 인연의 기운이 흐르는 날이에요. 오늘 나의 연애운과 궁합 점수를 확인해보세요.',
      ctaLabel: '궁합 보기',
      ctaPath: ROUTE_PATHS.compatibility,
      theme: { border: 'border-pink-300', bg: 'bg-pink-50', text: 'text-pink-900', badge: 'bg-pink-100 text-pink-700', button: 'bg-pink-500 hover:bg-pink-600 text-white' },
    },
  },
  {
    month: 12, day: 25,
    event: {
      name: '크리스마스', emoji: '🎄',
      subtitle: '연말운·인연운',
      message: '한 해의 마지막을 빛내는 날이에요. 올해 남은 흐름과 내년 운세를 미리 살펴보세요.',
      ctaLabel: '연간 운세 보기',
      ctaPath: ROUTE_PATHS.fortuneYear,
      theme: { border: 'border-red-300', bg: 'bg-red-50', text: 'text-red-900', badge: 'bg-red-100 text-red-700', button: 'bg-red-500 hover:bg-red-600 text-white' },
    },
  },
]

function kstToday(): { year: number; month: number; day: number } {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000)
  return { year: kst.getUTCFullYear(), month: kst.getUTCMonth() + 1, day: kst.getUTCDate() }
}

function kstDate(offset: number): { year: number; month: number; day: number } {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000 + offset * 86400000)
  return { year: kst.getUTCFullYear(), month: kst.getUTCMonth() + 1, day: kst.getUTCDate() }
}

function getEventForDate(year: number, month: number, day: number): SpecialEvent | null {
  // 설날
  const seollal = SEOLLAL_DATES[year]
  if (seollal && seollal[0] === month && seollal[1] === day) {
    return {
      name: '설날', emoji: '🎊',
      subtitle: '신년운세·가족운',
      message: '새해 첫날, 가족과 함께하는 특별한 날이에요. 올해 12개월의 흐름과 나의 신년 운세를 확인해보세요.',
      ctaLabel: '연간 운세 보기',
      ctaPath: ROUTE_PATHS.fortuneYear,
      theme: { border: 'border-orange-300', bg: 'bg-orange-50', text: 'text-orange-900', badge: 'bg-orange-100 text-orange-700', button: 'bg-orange-500 hover:bg-orange-600 text-white' },
    }
  }

  // 추석
  const chuseok = CHUSEOK_DATES[year]
  if (chuseok && chuseok[0] === month && chuseok[1] === day) {
    return {
      name: '추석', emoji: '🌕',
      subtitle: '풍요운·가족운',
      message: '가을 보름달 아래 감사와 풍요의 기운이 가득해요. 오늘의 운세와 가족 궁합을 확인해보세요.',
      ctaLabel: '오늘의 운세 보기',
      ctaPath: ROUTE_PATHS.fortune,
      theme: { border: 'border-amber-300', bg: 'bg-amber-50', text: 'text-amber-900', badge: 'bg-amber-100 text-amber-700', button: 'bg-amber-500 hover:bg-amber-600 text-white' },
    }
  }

  // 고정 날짜 이벤트
  const fixed = FIXED_EVENTS.find((e) => e.month === month && e.day === day)
  if (fixed) return fixed.event

  return null
}

function solarTermToEvent(term: ReturnType<typeof getTodaySolarTerm>): SpecialEvent | null {
  if (!term || !term.isExactDay) return null
  return {
    name: `${term.nameKr}(${term.meaning})`, emoji: '🌿',
    subtitle: `${term.element} 기운의 전환점`,
    message: term.message,
    ctaLabel: '오늘의 운세 보기',
    ctaPath: ROUTE_PATHS.fortune,
    theme: { border: 'border-emerald-300', bg: 'bg-emerald-50', text: 'text-emerald-900', badge: 'bg-emerald-100 text-emerald-700', button: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
  }
}

// 오늘 특별 이벤트 (명절 > 절기 순)
export function getTodaySpecialEvent(): SpecialEvent | null {
  const { year, month, day } = kstToday()
  return getEventForDate(year, month, day) ?? solarTermToEvent(getTodaySolarTerm())
}

// 내일 특별 이벤트 (알림 예고용)
export function getTomorrowSpecialEvent(): SpecialEvent | null {
  const { year, month, day } = kstDate(1)
  const event = getEventForDate(year, month, day)
  if (event) return event

  // 내일 절기 여부 — solarTermUtils는 today±1까지 커버하므로 내일 날짜로 직접 조회
  const tomorrowDate = new Date(Date.now() + 9 * 60 * 60 * 1000 + 86400000)
  const solarTerm = getTodaySolarTerm(new Date(tomorrowDate.getTime() - 9 * 60 * 60 * 1000))
  return solarTermToEvent(solarTerm)
}
