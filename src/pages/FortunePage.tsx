import { JSX, useEffect, useMemo } from 'react'
import { SajuForm } from '../components/SajuForm'
import { CombinedFortuneCard } from '../components/FortuneCard'
import { useSajuCalculator } from '../hooks/useSajuCalculator'
import { useToast } from '../components/ToastProvider'
import { navigateTo } from '../lib/router'
import type { RoutePath } from '../routes'
import { ROUTE_PATHS } from '../routes'
import { computeMbtiResultFromAnswers, loadPersistedAnswers, MBTI_COMPLETED_KEY } from '../components/MbtiTest'
import { getTodaySolarTerm } from '../lib/solarTermUtils'
import { buildWeeklyFortune } from '../lib/saju'

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
    description: '기본 정보를 계산하고 오행 밸런스를 확인하세요. 값이 비어 있으면 오늘 날짜와 현재 시간이 자동으로 입력됩니다.',
    accent: 'border-amber-100 hover:border-amber-200 focus-within:border-amber-300 bg-amber-50/60',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-400',
    path: ROUTE_PATHS.saju
  },
  {
    id: 'mbti',
    title: 'MBTI 성향',
    description: 'MBTI 결과와 함께 보면 오늘의 운세 카드에 성향 기반 해석이 추가됩니다. 무작위 초깃값으로 시작해 빠르게 수정할 수 있어요.',
    accent: 'border-indigo-100 hover:border-indigo-200 focus-within:border-indigo-300 bg-indigo-50/60',
    buttonClass: 'bg-indigo-500 hover:bg-indigo-600 focus-visible:ring-indigo-400',
    path: ROUTE_PATHS.mbti
  }
]

const FAQ_ITEMS: Array<{ question: string; answer: string[] }> = [
  {
    question: '오늘의 운세는 어떤 기준으로 생성되나요?',
    answer: [
      'Fove의 운세는 사주 계산 결과와 계절, 음양 흐름을 조합해 하루의 에너지 방향을 해석합니다.',
      '전통적인 일진 해석을 기반으로 하되 현대 생활 패턴에 맞게 행동 팁을 재구성했습니다.',
      '날마다 새롭게 계산되므로 중요한 일정이 있을 때는 아침에 확인해 두는 것이 좋아요.'
    ]
  },
  {
    question: '사주 정보를 다시 입력해야 하나요?',
    answer: [
      '입력값은 브라우저 로컬 저장소에 저장되므로 같은 기기에서는 자동으로 불러옵니다.',
      '정보가 바뀌었거나 초기화하고 싶다면 사주 페이지에서 값을 지운 뒤 새롭게 입력하면 됩니다.',
      '공용 기기를 사용할 때는 개인정보 보호를 위해 사용 후 브라우저 저장소를 정리하세요.'
    ]
  },
  {
    question: 'MBTI 결과는 어떻게 활용되나요?',
    answer: [
      'MBTI 페이지에서 20문항 검사를 완료하면 오늘의 운세 카드에 성향 기반 행동 팁이 자동으로 반영됩니다.',
      '성향 가이드는 참고용이므로 자신에게 맞는 속도로 조절하며 활용해 주세요.'
    ]
  }
]

export default function FortunePage(): JSX.Element {
  const { showToast } = useToast()
  const { birthDate, birthTime, gender, result, error, dailyFortune, isLoading, setBirthDate, setBirthTime, setGender } = useSajuCalculator()

  const mbtiResult = useMemo(() => {
    if (typeof window === 'undefined') return null
    if (!window.localStorage.getItem(MBTI_COMPLETED_KEY)) return null
    return computeMbtiResultFromAnswers(loadPersistedAnswers())
  }, [])

  const todaySolarTerm = useMemo(() => getTodaySolarTerm(), [])
  const weeklyFortune = useMemo(() => buildWeeklyFortune(), [])

  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error, showToast])

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
        <CombinedFortuneCard dailyFortune={dailyFortune} sajuResult={result} mbtiResult={mbtiResult} />
        {!mbtiResult ? (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 px-2 py-4 text-sm text-indigo-900/80 sm:px-4">
            MBTI 페이지에서 검사를 완료하면 성향에 맞춘 교차 인사이트가 함께 제공됩니다.
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-4xl space-y-8 px-4">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">오늘의 운세</h1>
          <p className="text-sm text-gray-600">
            사주 기반으로 오늘의 흐름과 실천 포인트를 확인하세요. 사주 입력값이 비어 있으면 오늘 날짜와 현재 시간이 자동으로 채워지고 성별은 남성으로 시작하므로 바로 확인할 수 있어요.
          </p>
        </header>

        {todaySolarTerm ? (
          <div className={`rounded-2xl border px-4 py-4 text-sm leading-relaxed space-y-1.5 ${todaySolarTerm.isExactDay ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
            <p className="font-semibold text-base">
              {todaySolarTerm.isExactDay ? '오늘은 ' : '어제부터 '}
              <span className="text-amber-700">{todaySolarTerm.nameKr}({todaySolarTerm.meaning})</span>
              {todaySolarTerm.isExactDay ? '입니다' : '절기가 시작됐습니다'}
              {' — '}{todaySolarTerm.element} 기운의 전환점
            </p>
            <p className="text-sm">{todaySolarTerm.message}</p>
          </div>
        ) : null}

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

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">오늘의 운세 카드</h2>
          {isLoading ? (
            <div className="rounded-2xl border border-amber-100 bg-white/60 px-3 py-5 text-sm leading-relaxed text-gray-700 sm:px-6 sm:py-6">
              운세 데이터를 정리하고 있습니다. 1~2초 정도 소요됩니다.
            </div>
          ) : (
            renderFortuneSection()
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">이번 주 일진 흐름</h2>
          <div className="grid grid-cols-7 gap-1.5">
            {weeklyFortune.map((day) => (
              <div
                key={day.shortDate}
                className={`rounded-xl border px-1.5 py-3 text-center space-y-1.5 transition ${
                  day.isToday
                    ? 'border-amber-300 bg-amber-50 shadow-sm'
                    : 'border-slate-100 bg-white/80'
                }`}
              >
                <p className={`text-xs font-medium ${day.isToday ? 'text-amber-700' : 'text-slate-400'}`}>{day.weekday}</p>
                <p className={`text-xs ${day.isToday ? 'text-amber-600' : 'text-slate-400'}`}>{day.shortDate}</p>
                <p className={`text-sm font-bold ${day.isToday ? 'text-amber-900' : 'text-slate-700'}`}>{day.pillarName}</p>
                <p className={`text-xs leading-tight ${day.isToday ? 'text-amber-800' : 'text-slate-500'}`}>{day.elementLabel}</p>
              </div>
            ))}
          </div>
        </section>

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
          <h2 className="text-lg font-semibold text-gray-900">더 알아보기</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => {
                const tomorrow = new Date()
                tomorrow.setDate(tomorrow.getDate() + 1)
                const y = tomorrow.getFullYear()
                const m = String(tomorrow.getMonth() + 1).padStart(2, '0')
                const d = String(tomorrow.getDate()).padStart(2, '0')
                setBirthDate(`${y}-${m}-${d}`)
              }}
              className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-5 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-amber-400"
            >
              <p className="text-base font-semibold text-amber-900">내일 운세 미리 보기</p>
              <p className="mt-1 text-sm text-amber-700">내일 날짜로 전환해 내일의 흐름을 확인합니다.</p>
            </button>
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.saju)}
              className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-5 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-slate-400"
            >
              <p className="text-base font-semibold text-slate-800">사주 풀이 보기</p>
              <p className="mt-1 text-sm text-slate-600">생년월일로 사주 기둥과 오행 밸런스를 확인합니다.</p>
            </button>
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.mbti)}
              className="rounded-2xl border border-indigo-200 bg-indigo-50/60 px-4 py-5 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-indigo-400"
            >
              <p className="text-base font-semibold text-indigo-900">MBTI 성향 연결</p>
              <p className="mt-1 text-sm text-indigo-700">MBTI를 추가하면 운세에 성향 기반 인사이트가 추가됩니다.</p>
            </button>
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
