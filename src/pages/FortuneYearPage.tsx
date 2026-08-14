import { JSX, useMemo } from 'react'
import { buildYearlyFortune } from '../lib/saju'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'
import type { Element } from '../lib/saju/constants'

const ELEMENT_COLOR: Record<Element, string> = {
  목: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  화: 'border-rose-200 bg-rose-50 text-rose-900',
  토: 'border-amber-200 bg-amber-50 text-amber-900',
  금: 'border-slate-200 bg-slate-50 text-slate-800',
  수: 'border-blue-200 bg-blue-50 text-blue-900'
}

const ELEMENT_SEASON_TIP: Record<Element, string> = {
  목: '성장과 확장의 시기. 새로운 프로젝트 착수와 인맥 확장에 유리합니다.',
  화: '열정과 추진의 시기. 발표·홍보·도전적인 계획을 실행하기 좋습니다.',
  토: '안정과 정비의 시기. 체계를 다지고 루틴을 정립하는 데 집중하세요.',
  금: '결단과 수확의 시기. 분석·정리·마무리 작업에서 빛을 발합니다.',
  수: '지혜와 준비의 시기. 정보를 모으고 내실을 다지는 재충전의 달입니다.'
}

export default function FortuneYearPage(): JSX.Element {
  const yearlyFortune = useMemo(() => buildYearlyFortune(), [])
  const currentYear = new Date().getFullYear()
  const currentMonth = yearlyFortune.find((m) => m.isCurrentMonth)

  const elementCounts = useMemo(() => {
    const counts: Record<Element, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 }
    yearlyFortune.forEach((m) => { counts[m.element] += 1 })
    return counts
  }, [yearlyFortune])

  const dominantElement = (Object.entries(elementCounts) as [Element, number][])
    .sort((a, b) => b[1] - a[1])[0]

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-2xl space-y-8 px-4">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{currentYear}년 연간 운세</h1>
          <p className="text-sm text-gray-600">
            올해 12개월의 월주 오행 흐름을 확인하고 시기별 에너지를 파악하세요.
          </p>
        </header>

        {dominantElement ? (
          <div className={`rounded-2xl border px-4 py-4 space-y-1.5 ${ELEMENT_COLOR[dominantElement[0]]}`}>
            <p className="text-sm font-semibold">
              {currentYear}년의 주도 오행 — {dominantElement[0]} ({dominantElement[1]}개월)
            </p>
            <p className="text-sm leading-relaxed">{ELEMENT_SEASON_TIP[dominantElement[0]]}</p>
          </div>
        ) : null}

        {currentMonth ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 space-y-1">
            <p className="text-sm font-semibold text-amber-800">이번 달 월주 — {currentMonth.pillarName}</p>
            <p className="text-sm text-amber-700">{currentMonth.elementLabel} · {currentMonth.yinYang}</p>
            <p className="text-sm text-amber-700 leading-relaxed">{ELEMENT_SEASON_TIP[currentMonth.element]}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {yearlyFortune.map((m) => (
            <div
              key={m.month}
              className={`rounded-xl border px-3 py-3 space-y-1 text-center transition ${
                m.isCurrentMonth
                  ? 'border-amber-300 bg-amber-50 shadow-sm ring-1 ring-amber-300'
                  : `${ELEMENT_COLOR[m.element]} opacity-80`
              }`}
            >
              <p className={`text-xs font-medium ${m.isCurrentMonth ? 'text-amber-700' : 'text-inherit opacity-70'}`}>
                {m.monthLabel}
              </p>
              {m.pillarName ? (
                <>
                  <p className={`text-base font-bold ${m.isCurrentMonth ? 'text-amber-900' : ''}`}>{m.pillarName}</p>
                  <p className={`text-xs leading-tight ${m.isCurrentMonth ? 'text-amber-800' : 'opacity-80'}`}>{m.elementLabel}</p>
                </>
              ) : (
                <p className="text-xs text-slate-400">—</p>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">월별 상세 흐름</h2>
          <div className="space-y-2">
            {yearlyFortune.map((m) => (
              m.pillarName ? (
                <div
                  key={m.month}
                  className={`flex items-start gap-4 rounded-xl border px-4 py-3 text-sm ${
                    m.isCurrentMonth ? 'border-amber-200 bg-amber-50' : 'border-slate-100 bg-white/70'
                  }`}
                >
                  <div className="w-16 shrink-0">
                    <p className={`text-xs ${m.isCurrentMonth ? 'text-amber-600' : 'text-slate-400'}`}>{m.monthLabel}</p>
                    <p className={`text-base font-bold ${m.isCurrentMonth ? 'text-amber-900' : 'text-slate-700'}`}>{m.pillarName}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className={`text-xs font-medium ${m.isCurrentMonth ? 'text-amber-700' : 'text-slate-500'}`}>
                      {m.elementLabel} · {m.yinYang}
                    </p>
                    <p className={`leading-relaxed ${m.isCurrentMonth ? 'text-amber-900' : 'text-slate-600'}`}>
                      {ELEMENT_SEASON_TIP[m.element]}
                    </p>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.fortune)}
            className="flex-1 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-amber-600 focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            오늘의 운세 보기
          </button>
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.fortuneWeek)}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-slate-400"
          >
            이번 주 일진 보기
          </button>
        </div>
      </div>
    </section>
  )
}
