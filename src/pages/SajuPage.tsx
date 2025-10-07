import { JSX, useEffect, useMemo } from 'react'
import { SajuForm } from '../components/SajuForm'
import { SajuResult } from '../components/SajuResult'
import { useSajuCalculator } from '../hooks/useSajuCalculator'
import { useResultHistory, type StoredResultEntry } from '../hooks/useResultHistory'
import { useToast } from '../components/ToastProvider'
import type { RoutePath } from '../routes'
import { navigateTo } from '../lib/router'
import { resultKindToRoute } from '../lib/resultRoutes'

const FEATURE_LINKS: Array<{
  id: string
  title: string
  description: string
  accent: string
  buttonClass: string
  path: RoutePath
}> = [
  {
    id: 'saju',
    title: '사주 풀이',
    description: '양력 생년월일과 태어난 시간을 입력하면 사주팔자와 오행 밸런스를 자동 계산합니다.',
    accent: 'border-amber-100 hover:border-amber-200 focus-within:border-amber-300 bg-amber-50/60',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400',
    path: '/'
  },
  {
    id: 'mbti',
    title: 'MBTI 성향',
    description: '20개의 문항으로 현재의 심리적 성향을 파악하고 맞춤형 가이드를 받아보세요.',
    accent: 'border-indigo-100 hover:border-indigo-200 focus-within:border-indigo-300 bg-indigo-50/60',
    buttonClass: 'bg-indigo-500 hover:bg-indigo-600 focus-visible:ring-indigo-400',
    path: '/mbti'
  },
  {
    id: 'fortune',
    title: '오늘의 운세 · 로또',
    description: '사주 기반 오늘의 운세와 로또 번호 추천을 한 번에 확인할 수 있습니다.',
    accent: 'border-rose-100 hover:border-rose-200 focus-within:border-rose-300 bg-rose-50/60',
    buttonClass: 'bg-rose-500 hover:bg-rose-600 focus-visible:ring-rose-400',
    path: '/fortune'
  }
]

const formatTimestamp = (value: number) => {
  if (!value) return '방금'
  try {
    return new Intl.DateTimeFormat('ko-KR', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value))
  } catch {
    return ''
  }
}

export default function SajuPage(): JSX.Element {
  const { history, favorites } = useResultHistory()
  const { showToast } = useToast()
  const { birthDate, birthTime, gender, result, error, elementBars, interpretation, isLoading, setBirthDate, setBirthTime, setGender } =
    useSajuCalculator()

  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error, showToast])

  const recentEntries = useMemo(() => history.slice(0, 6), [history])
  const favoriteEntries = useMemo(() => favorites.slice(0, 6), [favorites])

  const renderSummaryCard = (entry: StoredResultEntry) => {
    const targetPath = resultKindToRoute[entry.kind] ?? '/'
    return (
      <button
        key={entry.id}
        type="button"
        onClick={() => navigateTo(targetPath)}
        className="flex h-full flex-col justify-between rounded-2xl border border-slate-100 bg-white/85 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
      >
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{entry.badge ?? entry.kind.toUpperCase()}</p>
          <p className="text-sm font-semibold text-slate-900">{entry.title}</p>
          {entry.subtitle ? <p className="text-xs text-slate-500">{entry.subtitle}</p> : null}
          <p className="text-xs leading-relaxed text-slate-600">{entry.summary}</p>
        </div>
        <p className="mt-3 text-[10px] text-slate-400">{formatTimestamp(entry.timestamp)}</p>
      </button>
    )
  }

  return (
    <section className="py-8">
      <div className="mx-auto max-w-4xl space-y-8 px-4">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">사주팔자 간편 조회</h1>
          <p className="text-sm text-gray-600">생년월일과 태어난 시간을 입력하면 사주팔자, 오행 분포, 활용 가이드를 한눈에 확인할 수 있습니다.</p>
        </header>

        {recentEntries.length ? (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">최근 결과</h2>
              <span className="text-xs text-gray-500">최대 30개까지 자동 저장됩니다.</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">{recentEntries.map(renderSummaryCard)}</div>
          </section>
        ) : null}

        {favoriteEntries.length ? (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">내 즐겨찾기</h2>
              <span className="text-xs text-gray-500">하트 버튼으로 주요 결과를 보관하세요.</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">{favoriteEntries.map(renderSummaryCard)}</div>
          </section>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">DotImage 기능 살펴보기</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {FEATURE_LINKS.map((flow) => (
              <article
                key={flow.id}
                className={`rounded-2xl border bg-white/70 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg ${flow.accent}`}
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">{flow.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{flow.description}</p>
                  <button
                    type="button"
                    onClick={() => navigateTo(flow.path)}
                    className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${flow.buttonClass}`}
                  >
                    바로 이동
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <SajuForm
          birthDate={birthDate}
          birthTime={birthTime}
          gender={gender}
          onBirthDateChange={setBirthDate}
          onBirthTimeChange={setBirthTime}
          onGenderChange={setGender}
        />
        <span className="sr-only" aria-live="assertive">
          {error}
        </span>

        <SajuResult result={result} elementBars={elementBars} interpretation={interpretation} mbtiResult={null} isLoading={isLoading} />
      </div>
    </section>
  )
}
