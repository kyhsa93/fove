import { JSX, useEffect, useState } from 'react'
import { SajuForm } from '../components/SajuForm'
import { SajuResult } from '../components/SajuResult'
import { useSajuCalculator } from '../hooks/useSajuCalculator'
import { useToast } from '../components/ToastProvider'
import { getName, setName } from '../lib/profile'
import type { RoutePath } from '../routes'
import { ROUTE_PATHS } from '../routes'
import { navigateTo } from '../lib/router'

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
    description: '20개의 문항으로 현재의 심리적 성향을 파악하고 맞춤형 가이드를 받아보세요.',
    accent: 'border-indigo-100 hover:border-indigo-200 focus-within:border-indigo-300 bg-indigo-50/60',
    buttonClass: 'bg-indigo-500 hover:bg-indigo-600 focus-visible:ring-indigo-400',
    path: ROUTE_PATHS.mbti
  },
  {
    id: 'fortune',
    title: '오늘의 운세',
    description: '사주와 MBTI를 조합해 하루의 에너지와 실천 포인트를 받아보세요.',
    accent: 'border-rose-100 hover:border-rose-200 focus-within:border-rose-300 bg-rose-50/60',
    buttonClass: 'bg-rose-500 hover:bg-rose-600 focus-visible:ring-rose-400',
    path: ROUTE_PATHS.fortune
  }
]

const FAQ_ITEMS: Array<{ question: string; answer: string[] }> = [
  {
    question: '사주 계산을 위해 꼭 태어난 시간을 입력해야 하나요?',
    answer: [
      '가능하면 정확한 태어난 시간을 입력하는 것이 가장 좋습니다.',
      '시간을 모르는 경우라도 생년월일 정보만으로 기본적인 오행 흐름은 계산할 수 있습니다.'
    ]
  },
  {
    question: '입력한 사주 정보는 저장되나요?',
    answer: [
      '입력한 생년월일·시간·성별은 브라우저 로컬 저장소에 자동으로 저장됩니다.',
      '같은 기기에서 페이지를 다시 열면 이전에 입력한 값이 자동으로 불러와집니다.',
      '브라우저 저장 데이터를 삭제하면 입력값이 초기화됩니다.'
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

export default function SajuPage(): JSX.Element {
  const { showToast } = useToast()
  const { birthDate, birthTime, gender, result, error, elementBars, interpretation, isLoading, setBirthDate, setBirthTime, setGender } =
    useSajuCalculator()
  const [name, setNameState] = useState(() => getName())

  const handleNameChange = (value: string) => {
    setNameState(value)
    setName(value)
  }

  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error, showToast])

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="lg:grid lg:grid-cols-[360px_1fr] lg:gap-10 lg:items-start">

          {/* 왼쪽: 입력 폼 (sticky) */}
          <div className="space-y-6 lg:sticky lg:top-[72px]">
            <header className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">사주팔자 간편 조회</h1>
              <p className="text-sm text-gray-600">
                생년월일과 태어난 시간을 입력하면 사주팔자와 오행 분포를 확인할 수 있습니다.
              </p>
            </header>

            <SajuForm
              birthDate={birthDate}
              birthTime={birthTime}
              gender={gender}
              name={name}
              onBirthDateChange={setBirthDate}
              onBirthTimeChange={setBirthTime}
              onGenderChange={setGender}
              onNameChange={handleNameChange}
            />

            <span className="sr-only" aria-live="assertive">
              {error}
            </span>
          </div>

          {/* 오른쪽: 결과 */}
          <div className="mt-8 lg:mt-0 space-y-8">
            <SajuResult result={result} elementBars={elementBars} interpretation={interpretation} isLoading={isLoading} />

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">다른 기능 살펴보기</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {FEATURE_LINKS.map((flow) => (
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

        </div>
      </div>
    </section>
    </>
  )
}
