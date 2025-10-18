import { JSX, useEffect, useMemo } from 'react'
import { SajuForm } from '../components/SajuForm'
import { CombinedFortuneCard, CombinedLottoCard } from '../components/FortuneAndLotto'
import { useSajuCalculator } from '../hooks/useSajuCalculator'
import { useResultHistory, type StoredResultEntry } from '../hooks/useResultHistory'
import { useToast } from '../components/ToastProvider'
import { navigateTo } from '../lib/router'
import { resultKindToRoute } from '../lib/resultRoutes'

const SUPPORT_LINKS = [
  {
    id: 'saju',
    title: '사주 풀이',
    description: '기본 사주 정보를 먼저 계산하면 오늘의 운세를 정확하게 받아볼 수 있어요. 초기에는 오늘 날짜와 현재 시간이 자동으로 채워집니다.',
    accent: 'border-amber-100 hover:border-amber-200 focus-within:border-amber-300 bg-amber-50/60',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400',
    path: '/'
  },
  {
    id: 'mbti',
    title: 'MBTI 성향',
    description: 'MBTI 결과를 저장하면 오늘의 운세와 추천 번호가 성향에 맞춰 정교해집니다. 저장된 답변이 없다면 무작위 초기값으로 바로 검사할 수 있습니다.',
    accent: 'border-indigo-100 hover:border-indigo-200 focus-within:border-indigo-300 bg-indigo-50/60',
    buttonClass: 'bg-indigo-500 hover:bg-indigo-600 focus-visible:ring-indigo-400',
    path: '/mbti'
  }
] as const

const FAQ_ITEMS: Array<{ question: string; answer: string[] }> = [
  {
    question: '오늘의 운세는 어떤 기준으로 생성되나요?',
    answer: [
      'Fove의 운세는 사주 계산 결과와 계절, 음양 흐름을 조합해 하루의 에너지 방향을 해석합니다.',
      '전통적인 일진 해석을 기반으로 하되, 현대적인 생활 패턴에 맞게 행동 팁을 재구성했습니다.',
      '날마다 새롭게 계산되므로 중요한 일정이 있을 때는 아침에 확인해 두는 것이 좋습니다.'
    ]
  },
  {
    question: '로또 추천 번호는 어떻게 구성되나요?',
    answer: [
      '사주의 오행 분포와 오늘의 기운을 함께 분석해 균형 잡힌 번호 조합을 추천합니다.',
      'MBTI 결과가 저장되어 있으면 성향 가중치를 적용해 직관형과 분석형에 맞는 패턴을 다르게 제시합니다.',
      '추천 번호는 참고용이므로, 책임 있는 소비 습관과 함께 즐거운 이벤트처럼 활용해 주세요.'
    ]
  },
  {
    question: '사주 정보를 다시 입력해야 하나요?',
    answer: [
      '사주 입력값은 브라우저 로컬 저장소에 보관되므로 같은 기기에서는 자동으로 불러옵니다.',
      '정보가 변경되었거나 초기화하고 싶다면 사주 페이지에서 값을 지운 뒤 새롭게 입력하면 됩니다.',
      '보안이 걱정되는 공용 기기에서는 사용 후 브라우저 저장소를 정리하기를 권장합니다.'
    ]
  },
  {
    question: '운세와 로또 결과를 함께 활용하는 방법이 있을까요?',
    answer: [
      '먼저 운세 카드에서 오늘의 컨디션과 추천 행동을 확인해 하루 계획을 세워보세요.',
      '이후 로또 추천 번호를 참고해 소소한 즐거움을 더하면 하루의 리듬을 더욱 긍정적으로 만들 수 있습니다.',
      '저장된 기록을 주간 단위로 살펴보면 자신에게 맞는 행운 패턴을 발견하는 데 도움이 됩니다.'
    ]
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
        className="flex h-full flex-col justify-between rounded-2xl border border-slate-100 bg-white/85 px-2 py-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:px-4"
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
    if (!result) {
      return (
        <div className="rounded-2xl border border-amber-100 bg-white/60 px-2 py-4 text-sm text-gray-700 sm:px-6 sm:py-6">
          사주 정보를 먼저 입력해 주세요. 기본 정보를 입력하면 오늘의 운세가 자동으로 생성됩니다.
        </div>
      )
    }
    if (!dailyFortune) {
      return (
        <div className="rounded-2xl border border-amber-100 bg-white/60 px-2 py-4 text-sm text-gray-700 sm:px-6 sm:py-6">
          오늘의 운세 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )
    }
    return (
      <div className="space-y-4">
        <CombinedFortuneCard dailyFortune={dailyFortune} sajuResult={result} mbtiResult={null} />
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 px-2 py-4 text-sm text-indigo-900/80 sm:px-4">
          MBTI 페이지에서 검사를 완료하면 성향에 맞춘 교차 인사이트가 함께 제공됩니다.
        </div>
      </div>
    )
  }

  const renderLottoSection = () => {
    if (!result) {
      return (
        <div className="rounded-2xl border border-emerald-100 bg-white/60 px-2 py-4 text-sm text-gray-700 sm:px-6 sm:py-6">
          사주 정보를 먼저 입력해 주세요. 기본 정보를 입력하면 추천 번호를 생성할 수 있습니다.
        </div>
      )
    }
    if (!dailyFortune) {
      return (
        <div className="rounded-2xl border border-emerald-100 bg-white/60 px-2 py-4 text-sm text-gray-700 sm:px-6 sm:py-6">
          오늘의 일진 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
        </div>
      )
    }
    return (
      <div className="space-y-4">
        <CombinedLottoCard dailyFortune={dailyFortune} result={result} mbtiResult={null} />
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 px-2 py-4 text-sm text-indigo-900/80 sm:px-4">
          MBTI 성향을 반영한 맞춤 번호는 MBTI 페이지에서 검사를 진행한 뒤 확인할 수 있어요.
        </div>
      </div>
    )
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-8 px-4">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">오늘의 운세 & 로또 추천</h1>
          <p className="text-sm text-gray-600">
            사주 기반으로 오늘의 흐름을 읽고, 행운의 번호까지 한 번에 받아보세요. 사주 입력값이 비어 있으면 오늘 날짜와 현재 시간이 자동으로 채워지고 성별은 남성으로 시작하므로 바로 확인할 수 있으며, MBTI 결과가 없다면 MBTI 페이지에서 무작위 초깃값으로 빠르게 검사한 뒤 연동해 보세요.
          </p>
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
                className={`rounded-2xl border bg-white/70 px-2 py-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg sm:px-5 sm:py-5 ${flow.accent}`}
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

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">자주 묻는 질문</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <article key={item.question} className="rounded-2xl border border-slate-100 bg-white/80 px-2 py-4 shadow-sm space-y-3 sm:px-5 sm:py-5">
                <h3 className="text-base font-semibold text-gray-900">{item.question}</h3>
                <div className="space-y-2 text-sm leading-relaxed text-gray-600">
                  {item.answer.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
