import { JSX, useEffect, useMemo, useState } from 'react'
import { SajuForm } from './components/SajuForm'
import { SajuResult } from './components/SajuResult'
import { MbtiTest, type MbtiResult } from './components/MbtiTest'
import { CombinedFortuneCard, CombinedLottoCard, CrossInsightCard } from './components/FortuneAndLotto'
import { ResultCardSkeleton } from './components/ResultCard'
import { useSajuCalculator } from './hooks/useSajuCalculator'
import { useResultHistory, type ResultKind, type StoredResultEntry } from './hooks/useResultHistory'
import { useToast } from './components/ToastProvider'

const recommendedFlows = [
  {
    id: 'fortune' as const,
    title: '오늘의 운세',
    description: '사주 정보와 MBTI 성향을 조합한 맞춤 일일 운세로 하루의 리듬을 미리 체크해 보세요.',
    accent: 'border-rose-100 hover:border-rose-200 focus-within:border-rose-300 bg-rose-50/60',
    buttonClass: 'bg-rose-500 hover:bg-rose-600 focus-visible:ring-rose-400'
  },
  {
    id: 'mbti' as const,
    title: 'MBTI 성향',
    description: '20개의 직관적인 질문으로 현재의 심리적 성향과 강점을 파악하고 맞춤형 가이드를 받아 보세요.',
    accent: 'border-indigo-100 hover:border-indigo-200 focus-within:border-indigo-300 bg-indigo-50/60',
    buttonClass: 'bg-indigo-500 hover:bg-indigo-600 focus-visible:ring-indigo-400'
  },
  {
    id: 'saju' as const,
    title: '사주 풀이',
    description: '생년월일과 태어난 시간을 입력하면 자동으로 팔자와 오행 밸런스를 계산해 드립니다.',
    accent: 'border-amber-100 hover:border-amber-200 focus-within:border-amber-300 bg-amber-50/60',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400'
  }
]

export default function App(): JSX.Element {
  const [activeTool, setActiveTool] = useState<'saju' | 'mbti' | 'fortune' | 'lotto'>('saju')
  const [mbtiResult, setMbtiResult] = useState<MbtiResult | null>(null)
  const { history, favorites } = useResultHistory()
  const { showToast } = useToast()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const toolParam = params.get('tool')
    if (toolParam && ['saju', 'mbti', 'fortune', 'lotto'].includes(toolParam)) {
      setActiveTool(toolParam as typeof activeTool)
    }
  }, [])
  const {
    birthDate,
    birthTime,
    gender,
    result,
    error,
    elementBars,
    interpretation,
    dailyFortune,
    isLoading,
    setBirthDate,
    setBirthTime,
    setGender
  } = useSajuCalculator()

  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error, showToast])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    params.set('tool', activeTool)
    const nextUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState({}, '', nextUrl)
  }, [activeTool])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const metaMap = {
      saju: {
        title: '사주 풀이 · 오행 밸런스 가이드',
        description: '생년월일과 태어난 시간으로 사주팔자와 오행 분포, 활용 가이드를 확인하세요.',
        image: 'https://kyhsa93.github.io/social-card-saju.png'
      },
      mbti: {
        title: 'MBTI 성향 진단 · 강점과 성장 포인트',
        description: '20문항 MBTI 검사로 성향, 강점, 성장 포인트와 실천 카드를 받아보세요.',
        image: 'https://kyhsa93.github.io/social-card-mbti.png'
      },
      fortune: {
        title: '오늘의 운세 · 사주+MBTI 교차 해석',
        description: '사주와 MBTI를 조합한 오늘의 운세와 맞춤 행동 가이드를 확인하세요.',
        image: 'https://kyhsa93.github.io/social-card-fortune.png'
      },
      lotto: {
        title: '사주 기반 로또 번호 추천',
        description: '사주 오행과 오늘의 기운을 반영한 맞춤 로또 번호를 확인하세요.',
        image: 'https://kyhsa93.github.io/social-card-lotto.png'
      }
    } as const
    const data = metaMap[activeTool]
    const setMeta = (key: string, value: string, attr: 'name' | 'property' = 'property') => {
      if (!value) return
      let element = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attr, key)
        document.head.appendChild(element)
      }
      element.setAttribute('content', value)
    }
    setMeta('og:title', data.title)
    setMeta('og:description', data.description)
    setMeta('og:image', data.image)
    if (typeof window !== 'undefined') {
      setMeta('og:url', window.location.href)
    }
    setMeta('twitter:title', data.title, 'name')
    setMeta('twitter:description', data.description, 'name')
    setMeta('twitter:image', data.image, 'name')
  }, [activeTool])

  const kindToTool: Record<ResultKind, typeof activeTool> = {
    saju: 'saju',
    mbti: 'mbti',
    fortune: 'fortune',
    lotto: 'lotto',
    cross: 'fortune'
  }

  const handleEntryNavigate = (entry: StoredResultEntry) => {
    const next = kindToTool[entry.kind] ?? 'saju'
    setActiveTool(next)
  }

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

  const recentEntries = useMemo(() => history.slice(0, 6), [history])
  const favoriteEntries = useMemo(() => favorites.slice(0, 6), [favorites])

  const renderSummaryCard = (entry: StoredResultEntry) => (
    <button
      key={entry.id}
      type="button"
      onClick={() => handleEntryNavigate(entry)}
      className="flex h-full flex-col justify-between rounded-2xl border border-slate-100 bg-white/80 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
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

  const toolHeadline =
    activeTool === 'saju'
      ? '사주팔자 간편 조회'
      : activeTool === 'mbti'
        ? 'MBTI 성향 진단'
        : activeTool === 'fortune'
          ? '오늘의 운세'
          : '로또 번호 추천'
  const toolDescription =
    activeTool === 'saju'
      ? '양력 생년월일과 태어난 시간을 입력하면 사주팔자(연·월·일·시주의 천간과 지지)를 자동으로 계산해 드립니다.'
      : activeTool === 'mbti'
        ? '20개의 질문으로 자신에게 가까운 MBTI 성향을 확인해 보세요. 직관적인 설명과 함께 강점과 성장 포인트를 안내합니다.'
        : activeTool === 'fortune'
          ? '사주 결과와 MBTI 성향을 조합한 맞춤 오늘의 운세를 확인해 보세요.'
          : '사주 기반 추천 번호에 MBTI 성향 가중치를 더한 로또 번호를 제공합니다.'

  const renderFortuneView = () => {
    if (isLoading) {
      return <ResultCardSkeleton />
    }
    if (!result) {
      return (
        <div className="rounded-2xl border border-amber-100 bg-white/60 p-6 text-sm text-gray-700">
          사주 정보를 먼저 입력해 주세요. 사주 계산 탭에서 생년월일과 시간을 입력하면 오늘의 운세를 생성할 수 있습니다.
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
    const showCross = Boolean(mbtiResult)
    return (
      <div className="space-y-4">
        <CombinedFortuneCard dailyFortune={dailyFortune} mbtiResult={mbtiResult} />
        {showCross && mbtiResult ? (
          <CrossInsightCard dailyFortune={dailyFortune} mbtiResult={mbtiResult} />
        ) : (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm text-indigo-900/80">
            MBTI 검사를 완료하면 에너지와 행동 가이드가 성향에 맞춰 더 정교하게 제공됩니다.
          </div>
        )}
      </div>
    )
  }

  const renderLottoView = () => {
    if (isLoading) {
      return <ResultCardSkeleton />
    }
    if (!result) {
      return (
        <div className="rounded-2xl border border-amber-100 bg-white/60 p-6 text-sm text-gray-700">
          사주 정보를 먼저 입력해 주세요. 사주 계산 탭에서 기본 정보를 입력하면 추천 번호를 생성할 수 있습니다.
        </div>
      )
    }
    if (!dailyFortune) {
      return (
        <div className="rounded-2xl border border-amber-100 bg-white/60 p-6 text-sm text-gray-700">
          오늘의 일진 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )
    }
    return (
      <div className="space-y-4">
        <CombinedLottoCard dailyFortune={dailyFortune} result={result} mbtiResult={mbtiResult} />
        {!mbtiResult ? (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-sm text-indigo-900/80">
            MBTI 검사를 완료하면 성향 가중치를 반영한 맞춤 번호를 받을 수 있습니다.
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{toolHeadline}</h1>
          <p className="text-sm text-gray-600">{toolDescription}</p>
        </header>

        {recentEntries.length ? (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">최근 결과</h2>
              <span className="text-xs text-gray-500">최대 30개가 자동 저장됩니다.</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {recentEntries.map(renderSummaryCard)}
            </div>
          </section>
        ) : null}

        {favoriteEntries.length ? (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">내 즐겨찾기</h2>
              <span className="text-xs text-gray-500">하트 버튼으로 빠르게 저장할 수 있어요.</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {favoriteEntries.map(renderSummaryCard)}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">추천 흐름</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {recommendedFlows.map((flow) => (
              <article
                key={flow.id}
                className={`rounded-2xl border bg-white/70 p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg ${flow.accent}`}
              >
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">{flow.title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{flow.description}</p>
                  <button
                    type="button"
                    onClick={() => setActiveTool(flow.id)}
                    className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${flow.buttonClass}`}
                  >
                    바로 시작
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <nav className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTool('saju')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTool === 'saju'
                ? 'bg-amber-500/90 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            사주 계산기
          </button>
          <button
            type="button"
            onClick={() => setActiveTool('mbti')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTool === 'mbti'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            MBTI 검사
          </button>
          <button
            type="button"
            onClick={() => setActiveTool('fortune')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTool === 'fortune'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-rose-300 hover:text-rose-600'
            }`}
          >
            오늘의 운세
          </button>
          <button
            type="button"
            onClick={() => setActiveTool('lotto')}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              activeTool === 'lotto'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            로또 추천
          </button>
        </nav>

        {activeTool === 'saju' ? (
          <>
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

            <SajuResult
              result={result}
              elementBars={elementBars}
              interpretation={interpretation}
              mbtiResult={mbtiResult}
              isLoading={isLoading}
            />
          </>
        ) : null}

        {activeTool === 'mbti' ? <MbtiTest onResultChange={setMbtiResult} /> : null}

        {activeTool === 'fortune' ? renderFortuneView() : null}

        {activeTool === 'lotto' ? renderLottoView() : null}
      </div>
    </div>
  )
}
