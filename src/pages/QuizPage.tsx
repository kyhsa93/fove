import { JSX, useState } from 'react'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'

interface QuizQuestion {
  id: string
  prompt: string
  options: Array<{ label: string; value: string }>
}

interface QuizDef {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
  results: Record<string, { title: string; body: string; advice: string }>
}

const QUIZ_LIST: QuizDef[] = [
  {
    id: 'love_pattern',
    title: '내 연애 패턴 테스트',
    description: '연애할 때 나는 어떤 모습일까? 5가지 질문으로 알아봅니다.',
    questions: [
      {
        id: 'q1',
        prompt: '연락 빈도에 대해 어떻게 생각하나요?',
        options: [
          { label: '자주 연락하는 게 좋아', value: 'A' },
          { label: '적당히, 서로 바쁜 거 알아', value: 'B' },
          { label: '필요할 때만 연락해도 돼', value: 'C' }
        ]
      },
      {
        id: 'q2',
        prompt: '싸웠을 때 나는?',
        options: [
          { label: '바로 얘기하고 해결하고 싶어', value: 'A' },
          { label: '일단 감정 가라앉히고 나서 대화', value: 'B' },
          { label: '상대가 먼저 말 걸어주길 기다려', value: 'C' }
        ]
      },
      {
        id: 'q3',
        prompt: '상대방에게 가장 바라는 것은?',
        options: [
          { label: '감정적인 공감과 표현', value: 'A' },
          { label: '안정감과 신뢰', value: 'B' },
          { label: '자유롭고 독립적인 관계', value: 'C' }
        ]
      },
      {
        id: 'q4',
        prompt: '데이트 계획은 주로 누가 잡나요?',
        options: [
          { label: '내가 챙기는 편', value: 'A' },
          { label: '상대방이 잡아줬으면 해', value: 'C' },
          { label: '반반씩 나누는 편', value: 'B' }
        ]
      },
      {
        id: 'q5',
        prompt: '연애에서 가장 힘든 것은?',
        options: [
          { label: '소통 부재와 오해', value: 'A' },
          { label: '불안감과 확신 부족', value: 'B' },
          { label: '나만의 시간이 줄어드는 것', value: 'C' }
        ]
      }
    ],
    results: {
      A: {
        title: '적극적 표현형',
        body: '감정 표현이 풍부하고 상대에게 먼저 다가가는 스타일입니다. 연애에 에너지를 많이 쏟지만 그만큼 깊은 감정적 교류를 원합니다.',
        advice: '상대의 속도를 존중하는 것이 장기 관계의 열쇠입니다. 내 감정을 솔직히 표현하되 상대의 반응을 기다리는 여유를 가져보세요.'
      },
      B: {
        title: '균형 중심형',
        body: '안정적인 관계를 추구하며 서로의 공간을 존중하는 스타일입니다. 감정보다 신뢰를 더 중시합니다.',
        advice: '때로는 감정을 더 솔직하게 표현해 보세요. 상대는 당신의 내면을 더 보고 싶어할 수 있습니다.'
      },
      C: {
        title: '독립 자유형',
        body: '자기 자신을 잃지 않는 연애를 추구합니다. 서로의 독립성을 존중하며 집착하지 않는 성향입니다.',
        advice: '상대방도 때로는 더 많은 관심과 표현을 원할 수 있습니다. 먼저 작은 표현부터 시작해보는 것도 좋습니다.'
      }
    }
  },
  {
    id: 'money_habit',
    title: '돈이 새는 습관 테스트',
    description: '나도 모르게 돈이 새고 있지는 않을까? 5가지 질문으로 확인합니다.',
    questions: [
      {
        id: 'q1',
        prompt: '쇼핑할 때 나는?',
        options: [
          { label: '필요한 것만 사려다 결국 더 사', value: 'A' },
          { label: '비교하고 또 비교해서 최저가만', value: 'B' },
          { label: '마음에 들면 바로 구매', value: 'C' }
        ]
      },
      {
        id: 'q2',
        prompt: '한 달 용돈/생활비는?',
        options: [
          { label: '계획 세우지만 항상 초과', value: 'A' },
          { label: '엑셀/가계부로 철저히 관리', value: 'B' },
          { label: '그냥 쓰다 보면 어느새 바닥', value: 'C' }
        ]
      },
      {
        id: 'q3',
        prompt: '배달 앱 사용 빈도는?',
        options: [
          { label: '거의 매일', value: 'C' },
          { label: '주 2~3회', value: 'A' },
          { label: '거의 안 써 (직접 해먹거나 밖에서)', value: 'B' }
        ]
      },
      {
        id: 'q4',
        prompt: '구독 서비스는?',
        options: [
          { label: '몇 개 있는데 안 보는 것도 있어', value: 'A' },
          { label: '정기적으로 점검하고 필요없는 건 해지', value: 'B' },
          { label: '뭐 있었지? 잊어버리기도 해', value: 'C' }
        ]
      },
      {
        id: 'q5',
        prompt: '갑작스러운 지출이 생기면?',
        options: [
          { label: '비상금으로 대응 가능', value: 'B' },
          { label: '카드 긁고 나중에 고민', value: 'C' },
          { label: '아껴서 어떻게든 충당', value: 'A' }
        ]
      }
    ],
    results: {
      A: {
        title: '의지 약한 절약형',
        body: '아끼려는 마음은 있지만 실천이 어렵습니다. 계획은 세우지만 작은 소비들이 쌓여 예산을 초과하는 경우가 많습니다.',
        advice: '소비를 기록하는 것만으로도 지출이 줄어듭니다. 스마트폰 가계부 앱을 활용해 매일 5분씩 지출을 확인해 보세요.'
      },
      B: {
        title: '철저한 관리형',
        body: '돈 관리에 체계적인 편입니다. 불필요한 지출을 잘 통제하지만 너무 절약에 집착해 삶의 여유를 놓칠 수도 있습니다.',
        advice: '합리적인 소비는 좋지만 자신을 위한 즐거운 지출도 인생의 일부입니다. 월 예산의 10%는 즐거움을 위해 써보세요.'
      },
      C: {
        title: '즉흥 소비형',
        body: '돈이 손에 들어오면 자연스럽게 쓰이는 타입입니다. 계획 없이 소비하다 보면 월말에 잔고가 걱정될 수 있습니다.',
        advice: '통장을 쪼개는 것이 효과적입니다. 월급날 고정비, 저축, 생활비 통장을 분리해 생활비 통장에서만 쓰는 습관을 만들어보세요.'
      }
    }
  }
]

function calcResult(quiz: QuizDef, answers: Record<string, string>): string {
  const counts: Record<string, number> = {}
  for (const val of Object.values(answers)) {
    counts[val] = (counts[val] ?? 0) + 1
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'B'
}

export default function QuizPage(): JSX.Element {
  const [selectedQuiz, setSelectedQuiz] = useState<QuizDef | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [finished, setFinished] = useState(false)

  const handleAnswer = (questionId: string, value: string) => {
    const next = { ...answers, [questionId]: value }
    setAnswers(next)
    if (selectedQuiz && Object.keys(next).length === selectedQuiz.questions.length) {
      setFinished(true)
    }
  }

  const handleReset = () => {
    setAnswers({})
    setFinished(false)
    setSelectedQuiz(null)
  }

  if (!selectedQuiz) {
    return (
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-xl px-4 space-y-8">
          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900">운세 심리테스트</h1>
            <p className="text-sm text-gray-600">가벼운 테스트로 나의 성향을 확인하고 결과를 공유해 보세요.</p>
          </header>
          <div className="space-y-3">
            {QUIZ_LIST.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setSelectedQuiz(q)}
                className="w-full rounded-2xl border border-slate-100 bg-white/90 px-5 py-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-base font-semibold text-slate-900">{q.title}</p>
                <p className="mt-1 text-sm text-slate-500">{q.description}</p>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.fortune)}
              className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              오늘의 운세 보기
            </button>
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.insight)}
              className="flex-1 rounded-full bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 transition"
            >
              통합 인사이트 보기
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (finished) {
    const resultKey = calcResult(selectedQuiz, answers)
    const result = selectedQuiz.results[resultKey]
    return (
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-xl px-4 space-y-8">
          <header className="space-y-1 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{selectedQuiz.title} 결과</p>
            <h1 className="text-2xl font-bold text-gray-900">{result?.title}</h1>
          </header>
          {result ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-5 space-y-3">
                <p className="text-sm leading-relaxed text-indigo-900">{result.body}</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-5 py-4 space-y-1.5">
                <p className="text-xs font-semibold text-amber-700">운세 조언</p>
                <p className="text-sm leading-relaxed text-amber-900">{result.advice}</p>
              </div>
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: selectedQuiz.title, text: `${result?.title} — Fove 심리테스트`, url: window.location.href })
                } else if (navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href)
                }
              }}
              className="w-full rounded-full bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 transition"
            >
              결과 공유하기
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              다른 테스트 하기
            </button>
          </div>
        </div>
      </section>
    )
  }

  const currentIdx = selectedQuiz.questions.findIndex((q) => !answers[q.id])
  const currentQuestion = selectedQuiz.questions[currentIdx]
  const progress = Math.round((Object.keys(answers).length / selectedQuiz.questions.length) * 100)

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-xl px-4 space-y-6">
        <header className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{selectedQuiz.title}</p>
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-indigo-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-400">{Object.keys(answers).length} / {selectedQuiz.questions.length}</p>
        </header>

        {currentQuestion ? (
          <div className="space-y-4">
            <p className="text-base font-semibold text-slate-900">{currentQuestion.prompt}</p>
            <div className="space-y-2">
              {currentQuestion.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAnswer(currentQuestion.id, opt.value)}
                  className="w-full rounded-2xl border border-slate-100 bg-white/90 px-5 py-4 text-left text-sm text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/40 hover:text-indigo-700"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2"
        >
          테스트 다시 선택
        </button>
      </div>
    </section>
  )
}
