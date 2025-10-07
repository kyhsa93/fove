import { JSX, useMemo, useState } from 'react'
import { MbtiTest, type MbtiResult } from '../components/MbtiTest'
import { useResultHistory, type StoredResultEntry } from '../hooks/useResultHistory'
import { navigateTo } from '../lib/router'
import { resultKindToRoute } from '../lib/resultRoutes'

const SUPPORT_LINKS = [
  {
    id: 'saju',
    title: '사주 풀이',
    description: '사주팔자와 오행 밸런스를 확인하고 오늘의 흐름을 이해하세요.',
    accent: 'border-amber-100 hover:border-amber-200 focus-within:border-amber-300 bg-amber-50/60',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400',
    path: '/'
  },
  {
    id: 'fortune',
    title: '오늘의 운세 · 로또',
    description: '사주와 MBTI를 조합해 하루의 에너지와 추천 번호를 받아보세요.',
    accent: 'border-rose-100 hover:border-rose-200 focus-within:border-rose-300 bg-rose-50/60',
    buttonClass: 'bg-rose-500 hover:bg-rose-600 focus-visible:ring-rose-400',
    path: '/fortune'
  }
] as const

const FAQ_ITEMS: Array<{ question: string; answer: string[] }> = [
  {
    question: '20문항 MBTI 검사는 얼마나 정확한가요?',
    answer: [
      'DotImage MBTI 검사는 핵심 성향을 빠르게 파악할 수 있도록 설계된 20문항 간편 버전입니다.',
      '정식 검사처럼 세밀한 지표를 모두 다루지는 않지만, 일상에서 행동 패턴을 확인하기에는 충분한 정보를 제공합니다.',
      '더 깊이 있는 분석이 필요하다면 결과를 참고 자료로 삼고, 전문 상담이나 정식 검사를 병행하는 것을 권장합니다.'
    ]
  },
  {
    question: '답변을 변경하면 결과가 새로 저장되나요?',
    answer: [
      '문항에 답변할 때마다 브라우저 로컬 저장소에 자동으로 저장되기 때문에 다음 방문에서도 이어서 진행할 수 있습니다.',
      '전체 문항을 다시 제출하면 최신 결과가 히스토리에 덮어쓰이므로, 변화된 상태를 기록하기 좋아요.',
      '다만 브라우저의 저장 데이터를 삭제하면 기록이 초기화되니 중요한 변화는 별도로 기록해 두세요.'
    ]
  },
  {
    question: 'MBTI 결과를 어떻게 활용하면 좋을까요?',
    answer: [
      '강점 카드와 성장 포인트를 비교해 오늘 실천할 행동을 1~2가지 선택해 보세요.',
      '현실적인 목표를 정하면 성향의 장점을 활용하고 약점을 보완하는 데 도움이 됩니다.',
      '또한 사주 혹은 오늘의 운세 페이지와 연동해 하루 계획을 세우면 보다 균형 잡힌 인사이트를 얻을 수 있습니다.'
    ]
  },
  {
    question: '팀이나 친구와 함께 사용할 수 있나요?',
    answer: [
      '한 기기에서 여러 사람이 사용할 경우, 제출 직후 히스토리에서 즐겨찾기로 추가해 두면 기록이 섞이지 않습니다.',
      '결과 카드의 요약을 공유하면 서로의 성향을 이해하고 협업 방식에 대해 이야기하기 좋습니다.',
      '공유가 끝난 뒤에는 개인정보 보호를 위해 브라우저 저장소를 정리하는 것을 권장합니다.'
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

export default function MbtiPage(): JSX.Element {
  const { history, favorites } = useResultHistory()
  const [activeResult, setActiveResult] = useState<MbtiResult | null>(null)

  const recentEntries = useMemo(() => history.filter((item) => item.kind === 'mbti').slice(0, 6), [history])
  const favoriteEntries = useMemo(() => favorites.filter((item) => item.kind === 'mbti').slice(0, 6), [favorites])

  const renderSummaryCard = (entry: StoredResultEntry) => {
    const targetPath = resultKindToRoute[entry.kind] ?? '/mbti'
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

  const hasResult = Boolean(activeResult)
  const summaryTitle = hasResult ? `${activeResult?.type} · ${activeResult?.summary.title}` : '모든 문항을 완료하면 결과가 생성됩니다.'
  const summaryDescription = hasResult ? activeResult?.summary.description : '20문항에 모두 응답하면 강점과 성장 포인트를 포함한 상세 분석을 확인할 수 있어요.'

  return (
    <section className="py-8">
      <div className="mx-auto max-w-4xl space-y-8 px-4">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">MBTI 성향 진단</h1>
          <p className="text-sm text-gray-600">직관적인 20문항을 통해 오늘의 심리적 성향과 행동 가이드를 확인하세요.</p>
        </header>

        <article className="rounded-2xl border border-indigo-100 bg-white/80 p-6 text-left shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">SUMMARY</p>
          <h2 className="mt-2 text-lg font-semibold text-gray-900">{summaryTitle}</h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{summaryDescription}</p>
          {!hasResult ? (
            <p className="mt-3 text-xs text-indigo-500">아래 질문에 응답하고 제출하면 결과가 자동으로 저장됩니다.</p>
          ) : null}
        </article>

        {recentEntries.length ? (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">최근 MBTI 결과</h2>
              <span className="text-xs text-gray-500">최대 30개까지 자동 저장됩니다.</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">{recentEntries.map(renderSummaryCard)}</div>
          </section>
        ) : null}

        {favoriteEntries.length ? (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">즐겨찾기</h2>
              <span className="text-xs text-gray-500">하트 버튼으로 주요 결과를 보관하세요.</span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">{favoriteEntries.map(renderSummaryCard)}</div>
          </section>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">다른 기능도 활용해 보세요</h2>
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

        <MbtiTest onResultChange={setActiveResult} />
      </div>
    </section>
  )
}
