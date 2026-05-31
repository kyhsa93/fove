import { JSX, useMemo } from 'react'
import { useSajuCalculator } from '../hooks/useSajuCalculator'
import { computeMbtiResultFromAnswers, loadPersistedAnswers, MBTI_COMPLETED_KEY } from '../components/MbtiTest'
import {
  TEMPERAMENT_BY_ELEMENT,
  CAREER_BY_ELEMENT,
  WEALTH_FOCUS_BY_ELEMENT,
  HONOR_FOCUS_BY_ELEMENT,
  HEALTH_TIPS_BY_ELEMENT,
  ELEMENT_KEYWORDS,
  ELEMENT_LABELS
} from '../lib/saju'
import { buildDailyFortune } from '../lib/saju'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'

const MBTI_SAJU_BRIDGE: Record<string, Record<string, string>> = {
  목: {
    E: '사주의 목 기운이 외향성과 만나 사람 연결에 탁월한 힘을 발휘합니다.',
    I: '목의 성장 에너지가 내면 깊이와 결합해 깊은 통찰력을 만들어냅니다.',
    S: '목의 실용성과 현실 감각이 더해져 꾸준한 실행력이 강합니다.',
    N: '목의 확장 기운과 직관이 합쳐져 창의적 비전이 풍부합니다.',
    T: '목의 논리 구조와 분석력이 결합해 합리적 성장 전략을 세웁니다.',
    F: '목의 따뜻함과 공감 능력이 조화를 이뤄 관계 중심 리더십이 돋보입니다.',
    J: '목의 방향성과 계획력이 합쳐져 체계적인 목표 달성에 유리합니다.',
    P: '목의 유연함과 적응력이 결합해 변화 속에서도 성장을 지속합니다.'
  },
  화: {
    E: '화의 열정과 표현력이 외향성과 시너지를 내며 강한 임팩트를 만듭니다.',
    I: '불꽃 같은 에너지를 내면에 집중해 깊은 전문성과 창의성을 발휘합니다.',
    S: '화의 추진력이 실용적 현실 감각과 만나 빠른 실행으로 이어집니다.',
    N: '화의 열정과 가능성 탐색이 결합해 혁신적 아이디어를 끊임없이 생산합니다.',
    T: '화의 결단력이 논리와 만나 명확한 의사결정을 내립니다.',
    F: '열정적인 화 기운이 감성과 결합해 타인을 움직이는 메시지를 만듭니다.',
    J: '화의 추진력과 계획 실행력이 결합해 목표를 빠르게 완성합니다.',
    P: '화의 즉흥성과 유연함이 합쳐져 기회를 순발력 있게 잡아냅니다.'
  },
  토: {
    E: '토의 안정감이 외향성과 어우러져 사람들이 신뢰하는 중심 역할을 합니다.',
    I: '토의 깊은 내면 신뢰가 조용한 힘으로 발휘돼 묵직한 존재감을 남깁니다.',
    S: '토의 실용성과 현실 검증력이 더해져 안정적 결과물을 꾸준히 만듭니다.',
    N: '토의 안정적 기반 위에 직관이 더해져 현실화 가능한 비전을 세웁니다.',
    T: '토의 중심 잡는 힘과 논리가 합쳐져 흔들리지 않는 판단력을 유지합니다.',
    F: '토의 포용력과 공감이 결합해 누구에게나 편안한 지지자가 됩니다.',
    J: '토의 꼼꼼함과 계획성이 결합해 완성도 높은 결과물을 만들어냅니다.',
    P: '토의 유연한 적응력이 더해져 변화 속에서도 균형을 유지합니다.'
  },
  금: {
    E: '금의 예리함이 외향성과 결합해 설득력 있는 커뮤니케이션 능력을 발휘합니다.',
    I: '금의 날카로운 통찰력이 내면 집중력과 결합해 깊은 분석 능력을 갖춥니다.',
    S: '금의 정확성과 현실 기반 판단이 합쳐져 실수 없는 실행을 구현합니다.',
    N: '금의 예리함과 직관이 결합해 본질을 꿰뚫어보는 통찰력이 뛰어납니다.',
    T: '금의 논리적 결단력이 분석 능력과 만나 날카로운 문제 해결사가 됩니다.',
    F: '금의 원칙과 감성이 균형을 이뤄 공정하면서도 따뜻한 판단을 내립니다.',
    J: '금의 완벽주의와 계획력이 결합해 높은 기준의 성과를 지속합니다.',
    P: '금의 유연함이 더해져 원칙을 지키면서도 상황에 맞게 적응합니다.'
  },
  수: {
    E: '수의 지혜와 유연성이 외향성과 결합해 다양한 사람과 깊은 교류를 이끌어냅니다.',
    I: '수의 깊은 지성이 내면 탐구와 결합해 탁월한 분석력과 창의성을 발휘합니다.',
    S: '수의 유연성과 현실 감각이 합쳐져 변화하는 상황을 정확하게 읽습니다.',
    N: '수의 흐름과 직관이 결합해 패턴을 읽고 미래를 내다보는 능력이 강합니다.',
    T: '수의 지적 능력과 논리 분석력이 결합해 복잡한 문제를 체계적으로 해결합니다.',
    F: '수의 공감과 감수성이 결합해 타인의 마음을 깊이 이해하고 위로합니다.',
    J: '수의 전략적 사고와 계획력이 결합해 장기적 관점의 목표를 설계합니다.',
    P: '수의 유연성과 적응력이 결합해 어떤 환경에서도 자신의 길을 찾아냅니다.'
  }
}

function buildCombinedMessage(element: string, mbtiType: string, todayActionText: string): string {
  const traits: string[] = []

  for (const letter of mbtiType) {
    const msg = MBTI_SAJU_BRIDGE[element]?.[letter]
    if (msg) { traits.push(msg); break }
  }

  const second = MBTI_SAJU_BRIDGE[element]?.[mbtiType[2]]
  if (second) traits.push(second)

  return traits.length > 0
    ? `${traits.join(' ')} 오늘은 ${todayActionText}`
    : `오늘은 ${todayActionText}`
}

export default function InsightPage(): JSX.Element {
  const { result } = useSajuCalculator()

  const mbtiResult = useMemo(() => {
    if (typeof window === 'undefined') return null
    if (!window.localStorage.getItem(MBTI_COMPLETED_KEY)) return null
    return computeMbtiResultFromAnswers(loadPersistedAnswers())
  }, [])

  const dailyFortune = useMemo(() => {
    if (!result) return null
    try { return buildDailyFortune(result) } catch { return null }
  }, [result])

  const element = result?.summary.strongest.element
  const elementLabel = element ? ELEMENT_LABELS[element] : null
  const keywords = element ? ELEMENT_KEYWORDS[element] : []

  const combinedMessage = useMemo(() => {
    if (!element || !mbtiResult || !dailyFortune) return null
    return buildCombinedMessage(element, mbtiResult.type, dailyFortune.actionText)
  }, [element, mbtiResult, dailyFortune])

  if (!result) {
    return (
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-3xl px-4 space-y-6">
          <header className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-gray-900">사주 · MBTI 통합 인사이트</h1>
            <p className="text-sm text-gray-600">사주와 MBTI를 함께 분석해 나만의 성향 리포트를 제공합니다.</p>
          </header>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-6 text-center space-y-4">
            <p className="text-sm text-amber-800">사주 정보를 먼저 입력하면 통합 인사이트를 확인할 수 있습니다.</p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => navigateTo(ROUTE_PATHS.saju)}
                className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition"
              >
                사주 입력하기
              </button>
              {!mbtiResult ? (
                <button
                  type="button"
                  onClick={() => navigateTo(ROUTE_PATHS.mbti)}
                  className="rounded-full border border-indigo-200 bg-white px-5 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition"
                >
                  MBTI 검사하기
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-3xl px-4 space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">사주 · MBTI 통합 인사이트</h1>
          <p className="text-sm text-gray-600">타고난 사주 성향과 현재 MBTI 성향을 결합한 나만의 리포트</p>
        </header>

        {combinedMessage ? (
          <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 px-5 py-6 space-y-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500">오늘의 통합 인사이트</p>
            <p className="text-base leading-relaxed text-indigo-900">{combinedMessage}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {elementLabel ? (
                <span className="rounded-full bg-indigo-100 border border-indigo-200 px-3 py-0.5 text-xs font-medium text-indigo-700">
                  사주 {elementLabel} 기운
                </span>
              ) : null}
              {mbtiResult ? (
                <span className="rounded-full bg-violet-100 border border-violet-200 px-3 py-0.5 text-xs font-medium text-violet-700">
                  MBTI {mbtiResult.type}
                </span>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          {element ? (
            <div className="rounded-2xl border border-amber-100 bg-white/90 px-5 py-5 space-y-4 shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">사주 기반 성향</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{elementLabel} 기운</h2>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{TEMPERAMENT_BY_ELEMENT[element]}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {keywords.map((kw) => (
                  <span key={kw} className="text-xs rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-amber-800">{kw}</span>
                ))}
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-amber-600">직업·적성</p>
                  <p className="text-slate-700 leading-relaxed">{CAREER_BY_ELEMENT[element]}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-amber-600">재물 성향</p>
                  <p className="text-slate-700 leading-relaxed">{WEALTH_FOCUS_BY_ELEMENT[element]}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-amber-600">명예·사회성</p>
                  <p className="text-slate-700 leading-relaxed">{HONOR_FOCUS_BY_ELEMENT[element]}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-amber-600">건강 포인트</p>
                  <p className="text-slate-700 leading-relaxed">{HEALTH_TIPS_BY_ELEMENT[element]}</p>
                </div>
              </div>
            </div>
          ) : null}

          {mbtiResult ? (
            <div className="rounded-2xl border border-indigo-100 bg-white/90 px-5 py-5 space-y-4 shadow-sm">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">MBTI 기반 성향</p>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{mbtiResult.type}</h2>
                  <span className="text-sm text-slate-500">{mbtiResult.summary.title}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{mbtiResult.summary.description}</p>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-indigo-600">강점</p>
                  <ul className="space-y-0.5">
                    {mbtiResult.summary.strengths.slice(0, 3).map((s) => (
                      <li key={s} className="text-slate-700 leading-relaxed">✓ {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-indigo-600">주의 포인트</p>
                  <ul className="space-y-0.5">
                    {mbtiResult.summary.cautions.slice(0, 3).map((c) => (
                      <li key={c} className="text-slate-700 leading-relaxed">△ {c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 px-5 py-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">MBTI 기반 성향</p>
                <p className="text-sm text-indigo-700 leading-relaxed">
                  MBTI 검사를 완료하면 사주 성향과 교차 분석한 통합 인사이트가 제공됩니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigateTo(ROUTE_PATHS.mbti)}
                className="rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition self-start"
              >
                MBTI 검사하기
              </button>
            </div>
          )}
        </div>

        {dailyFortune ? (
          <div className="rounded-2xl border border-slate-100 bg-white/90 px-5 py-5 space-y-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">오늘의 행동 가이드</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-3 space-y-1">
                <p className="text-xs font-semibold text-emerald-700">오늘 해볼 것</p>
                <p className="text-sm leading-relaxed text-emerald-900">{dailyFortune.actionText}</p>
              </div>
              <div className="rounded-xl border border-rose-100 bg-rose-50/60 px-3 py-3 space-y-1">
                <p className="text-xs font-semibold text-rose-700">주의 포인트</p>
                <p className="text-sm leading-relaxed text-rose-900">{dailyFortune.cautionText}</p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.fortune)}
            className="flex-1 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-amber-600 transition"
          >
            오늘의 운세 보기
          </button>
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.quiz)}
            className="flex-1 rounded-full bg-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-violet-600 transition"
          >
            퀴즈 풀기
          </button>
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.saju)}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            사주 풀이 보기
          </button>
        </div>
      </div>
    </section>
  )
}
