import { JSX } from 'react'
import { navigateTo } from '../lib/router'
import type { RoutePath } from '../routes'
import { ROUTE_PATHS } from '../routes'
import { getTodaySpecialEvent } from '../lib/specialEvents'
import type { SpecialEvent } from '../lib/specialEvents'

interface SeasonalContent {
  title: string
  subtitle: string
  tags: string[]
  cta: string
  path: RoutePath
  border: string
  bg: string
  text: string
  badge: string
  button: string
}

function getMonthlyContent(month: number): SeasonalContent | null {
  switch (month) {
    case 1:
      return {
        title: '신년운세 · 올해의 키워드',
        subtitle: '새해 12개월 흐름과 나에게 맞는 올해의 방향을 미리 확인하세요.',
        tags: ['신년운세', '올해의 키워드'],
        cta: '연간 운세 보기', path: ROUTE_PATHS.fortuneYear,
        border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-900',
        badge: 'bg-amber-100 text-amber-700', button: 'bg-amber-500 hover:bg-amber-600 text-white',
      }
    case 2:
      return {
        title: '설날 특집 · 가족운',
        subtitle: '명절을 앞두고 가족운과 올해의 흐름을 살펴보세요.',
        tags: ['토정비결', '가족운'],
        cta: '연간 운세 보기', path: ROUTE_PATHS.fortuneYear,
        border: 'border-orange-200', bg: 'bg-orange-50', text: 'text-orange-900',
        badge: 'bg-orange-100 text-orange-700', button: 'bg-orange-500 hover:bg-orange-600 text-white',
      }
    case 3:
      return {
        title: '봄 학업운 · 이직운',
        subtitle: '새 학기, 새 출발 앞에서 내 사주의 흐름과 성향을 점검해보세요.',
        tags: ['학업운', '이직운'],
        cta: '인사이트 보기', path: ROUTE_PATHS.insight,
        border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-900',
        badge: 'bg-green-100 text-green-700', button: 'bg-green-500 hover:bg-green-600 text-white',
      }
    case 5:
      return {
        title: '가정의 달 · 연애운 · 결혼운',
        subtitle: '5월, 소중한 인연과의 궁합과 연애운을 확인해보세요.',
        tags: ['연애운', '결혼운'],
        cta: '궁합 보기', path: ROUTE_PATHS.compatibility,
        border: 'border-rose-200', bg: 'bg-rose-50', text: 'text-rose-900',
        badge: 'bg-rose-100 text-rose-700', button: 'bg-rose-500 hover:bg-rose-600 text-white',
      }
    case 7:
    case 8:
      return {
        title: '여름 여행운',
        subtitle: '여름 휴가 전, 지금 방향과 운의 흐름을 먼저 점검하세요.',
        tags: ['여행운'],
        cta: '오늘의 운세 보기', path: ROUTE_PATHS.fortune,
        border: 'border-sky-200', bg: 'bg-sky-50', text: 'text-sky-900',
        badge: 'bg-sky-100 text-sky-700', button: 'bg-sky-500 hover:bg-sky-600 text-white',
      }
    case 9:
      return {
        title: '하반기 취업운 · 시험운',
        subtitle: '하반기 공채와 시험 시즌, 내 성향에 맞는 전략을 사주로 확인하세요.',
        tags: ['취업운', '시험운'],
        cta: '인사이트 보기', path: ROUTE_PATHS.insight,
        border: 'border-violet-200', bg: 'bg-violet-50', text: 'text-violet-900',
        badge: 'bg-violet-100 text-violet-700', button: 'bg-violet-500 hover:bg-violet-600 text-white',
      }
    case 11:
    case 12:
      return {
        title: '연말 운세 · 내년 미리보기',
        subtitle: '올해를 마무리하고 내년 12개월 흐름을 미리 살펴보세요.',
        tags: ['연말 운세', '내년 미리보기'],
        cta: '연간 운세 보기', path: ROUTE_PATHS.fortuneYear,
        border: 'border-indigo-200', bg: 'bg-indigo-50', text: 'text-indigo-900',
        badge: 'bg-indigo-100 text-indigo-700', button: 'bg-indigo-500 hover:bg-indigo-600 text-white',
      }
    default:
      return null
  }
}

function SpecialEventBanner({ event }: { event: SpecialEvent }): JSX.Element {
  const { theme } = event
  return (
    <div className={`rounded-2xl border px-4 py-4 space-y-3 ${theme.border} ${theme.bg}`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl shrink-0">{event.emoji}</span>
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${theme.badge}`}>
              ✨ 오늘의 특별 이벤트
            </span>
            <span className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${theme.badge}`}>
              #{event.subtitle}
            </span>
          </div>
          <p className={`text-base font-bold leading-snug ${theme.text}`}>
            오늘은 {event.name}이에요!
          </p>
        </div>
      </div>
      <p className={`text-sm leading-relaxed ${theme.text} opacity-80`}>{event.message}</p>
      <button
        type="button"
        onClick={() => navigateTo(event.ctaPath)}
        className={`rounded-full px-5 py-2 text-sm font-medium shadow-sm transition ${theme.button}`}
      >
        {event.ctaLabel} →
      </button>
    </div>
  )
}

export function SeasonalBanner(): JSX.Element | null {
  const now = new Date()
  const month = now.getMonth() + 1

  // 특별 이벤트 (명절·절기·기념일) 우선
  const specialEvent = getTodaySpecialEvent()
  if (specialEvent) {
    return <SpecialEventBanner event={specialEvent} />
  }

  // 월별 기본 배너
  const content = getMonthlyContent(month)
  if (!content) return null

  return (
    <div className={`rounded-2xl border px-4 py-4 space-y-3 ${content.border} ${content.bg}`}>
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {content.tags.map((tag) => (
              <span key={tag} className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${content.badge}`}>
                #{tag}
              </span>
            ))}
          </div>
          <p className={`text-base font-bold leading-snug ${content.text}`}>{content.title}</p>
        </div>
      </div>
      <p className={`text-sm leading-relaxed ${content.text} opacity-80`}>{content.subtitle}</p>
      <button
        type="button"
        onClick={() => navigateTo(content.path)}
        className={`rounded-full px-5 py-2 text-sm font-medium shadow-sm transition ${content.button}`}
      >
        {content.cta} →
      </button>
    </div>
  )
}
