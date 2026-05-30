import { JSX } from 'react'
import { SeasonalBanner } from '../components/SeasonalBanner'
import type { RoutePath } from '../routes'
import { ROUTE_PATHS } from '../routes'
import { navigateTo } from '../lib/router'
import { useSajuCalculator } from '../hooks/useSajuCalculator'
import { ELEMENT_LABELS, ELEMENT_KEYWORDS, TEMPERAMENT_BY_ELEMENT } from '../lib/saju'
import type { DailyFortune, SajuResult } from '../lib/saju'

const PRIMARY_ACTIONS: Array<{ path: RoutePath; label: string; description: string }> = [
  {
    path: ROUTE_PATHS.saju,
    label: '사주 풀이 시작하기',
    description: '생년월일과 시간을 입력하고 개인 사주 리포트를 받아보세요.'
  },
  {
    path: ROUTE_PATHS.fortune,
    label: '오늘의 운세 보기',
    description: '사주 정보와 계절 흐름을 조합한 데일리 가이드를 확인하세요.'
  },
  {
    path: ROUTE_PATHS.mbti,
    label: 'MBTI 성향 진단',
    description: '20개의 문항으로 심리적 경향을 측정하고 사주 결과와 함께 분석합니다.'
  },
  {
    path: ROUTE_PATHS.zodiac,
    label: '띠별 운세 보기',
    description: '12간지 띠별 기질·관계·직업·건강 특성을 사주 오행으로 분석합니다.'
  }
]

const HIGHLIGHTS: Array<{ title: string; description: string }> = [
  {
    title: '데이터 기반 사주 해석',
    description:
      '천간·지지·오행 분포를 정량화해 강점과 보완 포인트를 한눈에 제공합니다. 계산 결과는 브라우저에만 저장되어 안전합니다.'
  },
  {
    title: '맞춤 하루 가이드',
    description:
      '사주 흐름과 오늘의 일진을 결합해 컨디션 포인트와 추천 활동을 균형 있게 제안합니다.'
  },
  {
    title: '심리 유형과의 연동',
    description:
      'MBTI 결과를 사주의 음양·오행 흐름과 비교해 협업 방식, 휴식 전략, 집중 시간대를 추천합니다.'
  }
]

interface HomeFortuneProps {
  dailyFortune: DailyFortune
  result: SajuResult
}

function HomeFortune({ dailyFortune, result }: HomeFortuneProps): JSX.Element {
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">오늘의 Fove 리포트</p>
        <p className="text-xs text-white/60">{dailyFortune.dateLabel}</p>
      </div>

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
  const isReturning = Boolean(result && dailyFortune)

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-12 sm:py-16">

        {isReturning && result && dailyFortune ? (
          <HomeFortune dailyFortune={dailyFortune} result={result} />
        ) : (
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur px-4 py-5 text-white shadow-xl space-y-5 sm:px-6 sm:py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">오늘의 Fove 리포트</p>
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
            하루의 흐름을 읽고
            <br className="hidden sm:block" />
            나만의 루틴을 설계하세요
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            Fove는 사주, 오늘의 운세, MBTI를 결합해 균형 잡힌 결정과 휴식을 돕는 인사이트 허브입니다. 필요한 기능을 선택해 바로
            시작해 보세요.
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
