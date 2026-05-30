import { JSX } from 'react'
import { SeasonalBanner } from '../components/SeasonalBanner'
import { StreakBadge } from '../components/StreakBadge'
import type { RoutePath } from '../routes'
import { ROUTE_PATHS } from '../routes'
import { navigateTo } from '../lib/router'
import { useSajuCalculator } from '../hooks/useSajuCalculator'
import { getName } from '../lib/profile'
import { ELEMENT_LABELS, ELEMENT_KEYWORDS, TEMPERAMENT_BY_ELEMENT } from '../lib/saju'
import type { DailyFortune, SajuResult } from '../lib/saju'

const PRIMARY_ACTIONS: Array<{ path: RoutePath; label: string; description: string }> = [
  {
    path: ROUTE_PATHS.saju,
    label: '사주 풀이 시작하기',
    description: '타고난 기질·강점·직업 성향을 생년월일 하나로 바로 확인할 수 있어요.'
  },
  {
    path: ROUTE_PATHS.fortune,
    label: '오늘의 운세 보기',
    description: '오늘 집중할 것, 조심할 것, 행운 요소를 한 카드에서 확인하세요.'
  },
  {
    path: ROUTE_PATHS.mbti,
    label: 'MBTI 성향 진단',
    description: '20문항으로 내 MBTI를 확인하고 사주와 어떻게 연결되는지 바로 분석해드려요.'
  },
  {
    path: ROUTE_PATHS.zodiac,
    label: '띠별 운세 보기',
    description: '내 띠가 가진 기질·인간관계·직업 성향을 오행 분석으로 확인하세요.'
  }
]

const HIGHLIGHTS: Array<{ title: string; description: string }> = [
  {
    title: '내 타고난 기질 파악',
    description:
      '생년월일을 입력하면 오행 에너지 분포로 강점과 보완 포인트를 숫자로 확인할 수 있어요. 개인정보는 기기 밖으로 나가지 않아 안전해요.'
  },
  {
    title: '오늘 뭘 하면 좋을까?',
    description:
      '오늘의 일진과 내 사주를 결합해 지금 집중하면 좋은 활동과 피해야 할 것을 한눈에 알려드려요.'
  },
  {
    title: 'MBTI와 사주를 같이 보면?',
    description:
      'MBTI 성향과 사주 에너지를 함께 분석해 나에게 맞는 협업 스타일, 휴식법, 집중 시간대를 알려드려요.'
  }
]

function getTimeGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return '좋은 아침이에요 ☀️'
  if (hour >= 12 && hour < 14) return '점심은 잘 챙기셨나요?'
  if (hour >= 14 && hour < 18) return '오후도 좋은 흐름이에요'
  if (hour >= 18 && hour < 22) return '오늘 하루 어떠셨나요?'
  return '오늘도 고생하셨어요 🌙'
}

interface HomeFortuneProps {
  dailyFortune: DailyFortune
  result: SajuResult
  name: string
  greeting: string
}

function HomeFortune({ dailyFortune, result, name, greeting }: HomeFortuneProps): JSX.Element {
  const strongest = result.summary.strongest.element
  const keywords = ELEMENT_KEYWORDS[strongest]
  const { score, categoryScores } = dailyFortune

  const SCORE_META = [
    { key: 'work' as const, label: '일', color: 'text-sky-300', bar: 'bg-sky-400' },
    { key: 'love' as const, label: '관계', color: 'text-rose-300', bar: 'bg-rose-400' },
    { key: 'money' as const, label: '재물', color: 'text-amber-300', bar: 'bg-amber-400' },
    { key: 'health' as const, label: '건강', color: 'text-emerald-300', bar: 'bg-emerald-400' }
  ]

  return (
    <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur px-4 py-5 text-white shadow-xl space-y-4 sm:px-6 sm:py-6">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            {name ? `${name}님의 오늘 리포트` : '오늘의 Fove 리포트'}
          </p>
          <StreakBadge />
        </div>
        <p className="text-xs text-white/60">{dailyFortune.dateLabel}</p>
      </div>
      <p className="text-sm font-medium text-white/70">{greeting}</p>

      <div className="space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-2xl font-bold tracking-wide">{dailyFortune.pillarName}</span>
          <span className="rounded-full bg-white/15 px-3 py-0.5 text-sm font-medium">{ELEMENT_LABELS[strongest]} 기운</span>
          <span className="rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-sm font-semibold">{score}점</span>
        </div>
        <p className="text-sm leading-relaxed text-white/90">{TEMPERAMENT_BY_ELEMENT[strongest]}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {keywords.map((kw) => (
            <span key={kw} className="text-xs rounded-full bg-white/10 border border-white/20 px-2.5 py-0.5 text-white/80">{kw}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {SCORE_META.map(({ key, label, color, bar }) => (
          <div key={key} className="rounded-2xl bg-white/10 border border-white/10 px-2 py-3 text-center space-y-1.5">
            <p className={`text-xs font-semibold ${color}`}>{label}</p>
            <p className="text-lg font-bold tabular-nums">{categoryScores[key]}</p>
            <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
              <div className={`h-full rounded-full ${bar}`} style={{ width: `${categoryScores[key]}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/10 border border-white/10 px-3 py-3 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">오늘 해볼 것</p>
          <p className="text-sm leading-relaxed text-white/90 line-clamp-2">{dailyFortune.actionText}</p>
        </div>
        <div className="rounded-2xl bg-white/10 border border-white/10 px-3 py-3 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-300">주의 포인트</p>
          <p className="text-sm leading-relaxed text-white/90 line-clamp-2">{dailyFortune.cautionText}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigateTo(ROUTE_PATHS.fortune)}
        className="w-full rounded-2xl bg-white/15 border border-white/20 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
      >
        오늘의 운세 전체 보기 →
      </button>
    </div>
  )
}

export default function HomePage(): JSX.Element {
  const { result, dailyFortune } = useSajuCalculator()
  const name = getName()
  const greeting = getTimeGreeting()
  const isReturning = Boolean(result && dailyFortune)

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-12 sm:py-16">

        {isReturning && result && dailyFortune ? (
          <HomeFortune dailyFortune={dailyFortune} result={result} name={name} greeting={greeting} />
        ) : (
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur px-4 py-5 text-white shadow-xl space-y-5 sm:px-6 sm:py-6">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
                {name ? `${name}님의 오늘 리포트` : '오늘의 Fove 리포트'}
              </p>
              <StreakBadge />
            </div>
            <p className="text-sm font-medium text-white/70">{greeting}</p>
            <div className="space-y-2">
              <p className="text-base font-semibold text-white/90">사주 정보를 입력하면 오늘의 개인 운세 리포트가 여기에 표시됩니다.</p>
              <p className="text-sm text-white/60">총운 · 일·업무 · 사랑·관계 · 재물 · 건강 점수와 오늘의 조언을 한눈에 확인하세요.</p>
            </div>
            <ol className="flex items-center gap-0" aria-label="시작 단계">
              {[
                { step: '1', label: '사주 입력' },
                { step: '2', label: '리포트 생성' },
                { step: '3', label: '매일 운세' }
              ].map(({ step, label }, idx) => (
                <li key={step} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-400/60 text-xs font-bold text-white ring-1 ring-indigo-300/40">
                      {step}
                    </span>
                    <span className="text-[10px] text-white/60 whitespace-nowrap">{label}</span>
                  </div>
                  {idx < 2 && (
                    <span className="mx-2 mb-3.5 h-px w-8 bg-white/20 shrink-0" aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.fortune)}
              className="w-full rounded-2xl bg-white/15 border border-white/20 py-3 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              오늘의 운세 시작하기 →
            </button>
          </div>
        )}

        <SeasonalBanner />

        <header className="space-y-6 text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
            <span>Fove Insight</span>
          </div>
          <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl">
            오늘의 흐름을 알면
            <br className="hidden sm:block" />
            하루가 달라져요
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            사주와 MBTI, 오늘의 일진을 한 곳에서 연결해 지금 나에게 맞는 행동과 쉬는 방식을 알려드려요. 복잡한 해석 없이 바로 시작할 수 있어요.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {PRIMARY_ACTIONS.map((action) => (
            <button
              key={action.path}
              type="button"
              onClick={() => navigateTo(action.path)}
              className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-5 text-left text-white shadow-lg backdrop-blur transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/15 hover:shadow-xl"
            >
              <div className="space-y-3">
                <p className="text-lg font-semibold">{action.label}</p>
                <p className="text-sm leading-relaxed text-white/80">{action.description}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-200 transition group-hover:gap-3">
                바로 이동하기
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14" />
                  <path d="M13 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white shadow-xl backdrop-blur">
          <div className="grid gap-6 sm:grid-cols-3">
            {HIGHLIGHTS.map((item) => (
              <article key={item.title} className="space-y-3">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm leading-relaxed text-white/80">{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-indigo-500/40 via-slate-900/20 to-transparent blur-3xl" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-emerald-400/30 via-slate-900/20 to-transparent blur-3xl" />
      </div>
    </section>
  )
}
