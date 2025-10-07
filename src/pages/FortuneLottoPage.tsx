import { JSX, useEffect, useMemo } from 'react'
import { SajuForm } from '../components/SajuForm'
import { CombinedFortuneCard, CombinedLottoCard } from '../components/FortuneAndLotto'
import { ResultCardSkeleton } from '../components/ResultCard'
import { useSajuCalculator } from '../hooks/useSajuCalculator'
import { useResultHistory, type StoredResultEntry } from '../hooks/useResultHistory'
import { useToast } from '../components/ToastProvider'
import { navigateTo } from '../lib/router'
import { resultKindToRoute } from '../lib/resultRoutes'

const SUPPORT_LINKS = [
  {
    id: 'saju',
    title: '사주 풀이',
    description: '기본 사주 정보를 먼저 계산하면 오늘의 운세를 정확하게 받아볼 수 있어요.',
    accent: 'border-amber-100 hover:border-amber-200 focus-within:border-amber-300 bg-amber-50/60',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400',
    path: '/'
  },
  {
    id: 'mbti',
    title: 'MBTI 성향',
    description: 'MBTI 결과를 저장하면 오늘의 운세와 추천 번호가 성향에 맞춰 정교해집니다.',
    accent: 'border-indigo-100 hover:border-indigo-200 focus-within:border-indigo-300 bg-indigo-50/60',
    buttonClass: 'bg-indigo-500 hover:bg-indigo-600 focus-visible:ring-indigo-400',
    path: '/mbti'
  }
] as const

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

export default function FortuneLottoPage(): JSX.Element {
  const { history, favorites } = useResultHistory()
  const { showToast } = useToast()
  const { birthDate, birthTime, gender, result, error, dailyFortune, isLoading, setBirthDate, setBirthTime, setGender } = useSajuCalculator()

  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error, showToast])

  const recentEntries = useMemo(
    () => history.filter((item) => item.kind === 'fortune' || item.kind === 'lotto' || item.kind === 'cross').slice(0, 6),
    [history]
  )
  const favoriteEntries = useMemo(
    () => favorites.filter((item) => item.kind === 'fortune' || item.kind === 'lotto' || item.kind === 'cross').slice(0, 6),
    [favorites]
  )

  const renderSummaryCard = (entry: StoredResultEntry) => {
    const targetPath = resultKindToRoute[entry.kind] ?? '/fortune'
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

  const renderFortuneSection = () => {
    if (isLoading) {
      return <ResultCardSkeleton />
    }
    if (!result) {
      return (
        <div className="rounded-2xl border border-amber-100 bg-white/60 p-6 text-sm text-gray-700">
          사주 정보를 먼저 입력해 주세요. 기본 정보를 입력하면 오늘의 운세가 자동으로 생성됩니다.
        </div>
      )
    }
    if (!dailyFortune) {
      return (
        <div className="rounded-2xl border border-amber-100 bg-white/60 p-6 text-sm text-gray-700">
          오늘의 운세 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )
    }
    return (
      <div className="space-y-4">
        <CombinedFortuneCard dailyFortune={dailyFortune} mbtiResult={null} />
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm text-indigo-900/80">
          MBTI 페이지에서 검사를 완료하면 성향에 맞춘 교차 인사이트가 함께 제공됩니다.
        </div>
      </div>
    )
  }

  const renderLottoSection = () => {
    if (isLoading) {
      return <ResultCardSkeleton />
    }
    if (!result) {
      return (
        <div className="rounded-2xl border border-emerald-100 bg-white/60 p-6 text-sm text-gray-700">
          사주 정보를 먼저 입력해 주세요. 기본 정보를 입력하면 추천 번호를 생성할 수 있습니다.
        </div>
      )
    }
    if (!dailyFortune) {
      return (
        <div className="rounded-2xl border border-emerald-100 bg-white/60 p-6 text-sm text-gray-700">
          오늘의 일진 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )
    }
    return (
      <div className="space-y-4">
        <CombinedLottoCard dailyFortune={dailyFortune} result={result} mbtiResult={null} />
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm text-indigo-900/80">
          MBTI 성향을 반영한 맞춤 번호는 MBTI 페이지에서 검사를 진행한 뒤 확인할 수 있어요.
        </div>
      </div>
    )
  }

  return (
    <section className="py-8">
      <div className="mx-auto max-w-4xl space-y-8 px-4">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">오늘의 운세 & 로또 추천</h1>
          <p className="text-sm text-gray-600">사주 기반으로 오늘의 흐름을 읽고, 행운의 번호까지 한 번에 받아보세요.</p>
        </header>

        {recentEntries.length ? (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">최근 운세 · 로또 결과</h2>
              <span className="text-xs text-gray-500">최대 30개까지 자동 저장됩니다.</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">{recentEntries.map(renderSummaryCard)}</div>
          </section>
        ) : null}

        {favoriteEntries.length ? (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">즐겨찾기</h2>
              <span className="text-xs text-gray-500">특별한 결과는 하트 버튼으로 저장해 두세요.</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">{favoriteEntries.map(renderSummaryCard)}</div>
          </section>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">다른 기능과 함께 활용하기</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {SUPPORT_LINKS.map((flow) => (
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

        <section className="space-y-5">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">오늘의 운세</h2>
            {renderFortuneSection()}
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">로또 추천 번호</h2>
            {renderLottoSection()}
          </div>
        </section>
      </div>
    </section>
  )
}
