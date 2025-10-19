import { JSX } from 'react'
import type { RoutePath } from '../routes'
import { ROUTE_PATHS } from '../routes'
import { navigateTo } from '../lib/router'

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

export default function HomePage(): JSX.Element {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-12 sm:py-16">
        <header className="space-y-6 text-center text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
            <span>Fove Insight</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            하루의 흐름을 읽고
            <br className="hidden sm:block" />
            나만의 루틴을 설계하세요
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
            Fove는 사주, 오늘의 운세, MBTI를 결합해 균형 잡힌 결정과 휴식을 돕는 인사이트 허브입니다. 필요한 기능을 선택해 바로
            시작해 보세요.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-3">
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
