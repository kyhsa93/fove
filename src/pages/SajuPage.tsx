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
    id: 'mbti',
    title: 'MBTI 성향',
    description: '20개의 문항으로 현재의 심리적 성향을 파악하고 맞춤형 가이드를 받아보세요. 저장된 답변이 없으면 모든 문항이 무작위로 선택된 상태로 시작합니다.',
    accent: 'border-indigo-100 hover:border-indigo-200 focus-within:border-indigo-300 bg-indigo-50/60',
    buttonClass: 'bg-indigo-500 hover:bg-indigo-600 focus-visible:ring-indigo-400',
    path: '/mbti'
  },
  {
    id: 'fortune',
    title: '오늘의 운세 · 로또',
    description: '사주 입력값이 비어 있으면 오늘 날짜와 현재 시간, 남성 기본값이 자동으로 적용되어 운세와 로또 추천을 바로 살펴볼 수 있습니다.',
    accent: 'border-rose-100 hover:border-rose-200 focus-within:border-rose-300 bg-rose-50/60',
    buttonClass: 'bg-rose-500 hover:bg-rose-600 focus-visible:ring-rose-400',
    path: '/fortune'
  }
]

const FAQ_ITEMS: Array<{ question: string; answer: string[] }> = [
  {
    question: '사주 계산을 위해 꼭 태어난 시간을 입력해야 하나요?',
    answer: [
      '가능하면 정확한 태어난 시간을 입력하는 것이 가장 좋은데, 사주의 네 가지 기둥 중 시주가 빠지면 디테일한 해석이 제한되기 때문입니다.',
      '다만 시간을 모르는 경우라도 생년월일 정보만으로 기본적인 오행 분포와 음양 흐름은 계산할 수 있습니다.',
      '시간을 모를 때는 가장 가까운 구간을 추정해 입력해 보고, 결과의 변화 폭을 참고 자료로 활용해 주세요.'
    ]
  },
  {
    question: '사주 결과가 매일 달라지나요?',
    answer: [
      '사주는 태어난 순간의 기운을 기반으로 계산되기 때문에 기본적인 구조는 변하지 않습니다.',
      '다만 오늘의 운세와 같이 일진을 반영한 해석은 매일 달라질 수 있어 사주 결과와 함께 확인하는 것이 좋습니다.',
      'DotImage에서는 사주 결과와 오늘의 운세가 연동되므로 두 페이지를 오가며 균형 있게 참고해 보세요.'
    ]
  },
  {
    question: '입력한 사주 정보는 안전하게 보관되나요?',
    answer: [
      '사주 계산을 위해 입력한 정보는 사용자의 브라우저 로컬 저장소에만 보관되며, 서버로 전송되지 않습니다.',
      '브라우저를 바꾸거나 저장 기록을 삭제하면 데이터가 초기화되므로 중요한 내용은 따로 기록하는 것이 좋습니다.',
      '공용 기기를 사용할 때는 개인정보 보호를 위해 결과 확인 후 브라우저 저장소를 비우는 것을 권장합니다.'
    ]
  },
  {
    question: '사주 해석을 어떻게 활용하면 좋을까요?',
    answer: [
      '사주는 특정 결론을 내리기보다는 현재의 에너지 흐름을 이해하는 참고 자료로 활용하는 것이 가장 건강합니다.',
      '강한 오행과 부족한 오행을 비교해 오늘 필요한 활동이나 컨디션 조절에 활용해 보세요.',
      'DotImage의 추천 카드와 함께 메모를 남기면 개인적인 패턴을 발견하는 데 도움이 됩니다.'
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
          <p className="text-sm text-gray-600">
            생년월일과 태어난 시간을 입력하면 사주팔자, 오행 분포, 활용 가이드를 한눈에 확인할 수 있습니다. 저장된 값이 없을 때는 오늘 날짜와 현재 시간이 자동으로 채워지고 성별은 남성으로 기본 설정되어 있으니 필요에 따라 바로 조정하세요.
          </p>
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
          <h2 className="text-lg font-semibold text-gray-900">다른 기능 살펴보기</h2>
          <div className="grid gap-4 md:grid-cols-2">
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

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">자주 묻는 질문</h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <article key={item.question} className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm space-y-3">
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
