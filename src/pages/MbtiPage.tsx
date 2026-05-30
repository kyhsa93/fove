import { JSX, useState } from 'react'
import { MbtiTest, type MbtiResult } from '../components/MbtiTest'
import { navigateTo } from '../lib/router'
import type { RoutePath } from '../routes'
import { ROUTE_PATHS } from '../routes'

const SUPPORT_LINKS: Array<{
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
    description: '사주팔자와 오행 밸런스를 확인하고 오늘의 흐름을 이해하세요. 기본값이 없으면 오늘 날짜와 현재 시간이 자동으로 입력됩니다.',
    accent: 'border-amber-100 hover:border-amber-200 focus-within:border-amber-300 bg-amber-50/60',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400',
    path: ROUTE_PATHS.saju
  },
  {
    id: 'fortune',
    title: '오늘의 운세',
    description: '사주와 MBTI를 조합해 하루의 에너지와 실천 포인트를 받아보세요. 사주 입력이 비어 있으면 오늘 날짜와 시간이 자동으로 채워집니다.',
    accent: 'border-rose-100 hover:border-rose-200 focus-within:border-rose-300 bg-rose-50/60',
    buttonClass: 'bg-rose-500 hover:bg-rose-600 focus-visible:ring-rose-400',
    path: ROUTE_PATHS.fortune
  }
]

const FAQ_ITEMS: Array<{ question: string; answer: string[] }> = [
  {
    question: '20문항 MBTI 검사는 얼마나 정확한가요?',
    answer: [
      'Fove MBTI 검사는 핵심 성향을 빠르게 파악할 수 있도록 설계된 20문항 간편 버전입니다.',
      '정식 검사처럼 세밀한 지표를 모두 다루지는 않지만, 일상에서 행동 패턴을 확인하기에는 충분한 정보를 제공합니다.',
      '더 깊이 있는 분석이 필요하다면 결과를 참고 자료로 삼고, 전문 상담이나 정식 검사를 병행하는 것을 권장합니다.'
    ]
  },
  {
    question: '답변을 변경하면 결과가 다시 계산되나요?',
    answer: [
      '문항에 답변할 때마다 브라우저 로컬 저장소에 자동으로 저장되기 때문에 다음 방문에서도 이어서 진행할 수 있습니다.',
      '전체 문항을 다시 제출하면 최신 결과가 새로 계산됩니다.',
      '다만 브라우저의 저장 데이터를 삭제하면 답변 기록이 초기화됩니다.'
    ]
  },
  {
    question: 'MBTI 결과를 어떻게 활용하면 좋을까요?',
    answer: [
      '강점 카드와 성장 포인트를 비교해 오늘 실천할 행동을 1~2가지 선택해 보세요.',
      '현실적인 목표를 정하면 성향의 장점을 활용하고 약점을 보완하는 데 도움이 됩니다.',
      '검사를 완료하면 오늘의 운세 페이지에서 MBTI 성향이 반영된 교차 인사이트를 확인할 수 있습니다.'
    ]
  },
  {
    question: '팀이나 친구와 함께 사용할 수 있나요?',
    answer: [
      '한 기기에서 여러 사람이 사용할 경우, 결과를 확인한 뒤 화면을 캡처하거나 링크를 공유해 기록으로 남길 수 있습니다.',
      '결과 카드의 요약을 공유하면 서로의 성향을 이해하고 협업 방식에 대해 이야기하기 좋습니다.',
      '공유가 끝난 뒤에는 개인정보 보호를 위해 브라우저 저장소를 정리하는 것을 권장합니다.'
    ]
  }
]

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer.join(' ') },
  })),
}

export default function MbtiPage(): JSX.Element {
  const [activeResult, setActiveResult] = useState<MbtiResult | null>(null)

  const hasResult = Boolean(activeResult)
  const summaryTitle = hasResult ? `${activeResult?.type} · ${activeResult?.summary.title}` : '모든 문항을 완료하면 결과가 생성됩니다.'
  const summaryDescription = hasResult ? activeResult?.summary.description : '20문항에 모두 응답하면 강점과 성장 포인트를 포함한 상세 분석을 확인할 수 있어요.'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-8 px-4">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">MBTI 성향 진단</h1>
          <p className="text-sm text-gray-600">
            직관적인 20문항을 통해 오늘의 심리적 성향과 행동 가이드를 확인하세요. 저장된 답변이 없다면 모든 문항이 무작위로 선택된 상태로 시작되므로, 초깃값을 참고한 뒤 원하는 항목만 빠르게 수정할 수 있습니다.
          </p>
        </header>

        <article className="rounded-2xl border border-indigo-100 bg-white/80 px-2 py-4 text-left shadow-sm sm:px-6 sm:py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500">SUMMARY</p>
          <h2 className="mt-2 text-lg font-semibold text-gray-900">{summaryTitle}</h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{summaryDescription}</p>
        </article>

        <MbtiTest onResultChange={setActiveResult} />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">다른 기능도 활용해 보세요</h2>
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
                    className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 ${flow.buttonClass}`}
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
    </>
  )
}
