import { JSX, useMemo } from 'react'
import { buildMonthlyFortune } from '../lib/saju'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'
import type { Element } from '../lib/saju/constants'

const ELEMENT_COLOR: Record<Element, string> = {
  목: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  화: 'border-rose-200 bg-rose-50 text-rose-900',
  토: 'border-amber-200 bg-amber-50 text-amber-900',
  금: 'border-slate-200 bg-slate-100 text-slate-800',
  수: 'border-blue-200 bg-blue-50 text-blue-900'
}

const ELEMENT_TIP: Record<Element, string> = {
  목: '성장과 소통의 기운. 새로운 만남과 시작에 유리합니다.',
  화: '열정과 추진의 기운. 발표·도전·적극적인 행동에 활기가 붙습니다.',
  토: '안정과 신뢰의 기운. 루틴 정비와 꼼꼼한 마무리에 좋습니다.',
  금: '결단과 집중의 기운. 분석·계획·검수 업무에서 빛납니다.',
  수: '지혜와 유연의 기운. 정보 수집과 전략 기획에 강합니다.'
}

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

export default function FortuneMonthPage(): JSX.Element {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const monthlyFortune = useMemo(() => buildMonthlyFortune(), [])
  const today = monthlyFortune.find((d) => d.isToday)

  const firstWeekday = useMemo(() => {
    // 0=일, 1=월 ... 6=토
    return new Date(year, month - 1, 1).getDay()
  }, [year, month])

  const elementCounts = useMemo(() => {
    const counts: Record<Element, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 }
    monthlyFortune.forEach((d) => { counts[d.element] += 1 })
    return counts
  }, [monthlyFortune])

  const dominantElement = useMemo(() => {
    return (Object.entries(elementCounts) as [Element, number][]).sort((a, b) => b[1] - a[1])[0]
  }, [elementCounts])

  const monthLabel = new Intl.DateTimeFormat('ko', { year: 'numeric', month: 'long' }).format(new Date(year, month - 1, 1))

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-2xl space-y-8 px-4">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">{monthLabel} 일진 달력</h1>
          <p className="text-sm text-gray-600">
            이번 달 매일의 일진 기운을 한눈에 확인하세요.
          </p>
        </header>

        {dominantElement ? (
          <div className={`rounded-2xl border px-4 py-4 space-y-1.5 ${ELEMENT_COLOR[dominantElement[0]]}`}>
            <p className="text-sm font-semibold">
              {monthLabel}의 주도 오행 — {dominantElement[0]} ({dominantElement[1]}일)
            </p>
            <p className="text-sm leading-relaxed">{ELEMENT_TIP[dominantElement[0]]}</p>
          </div>
        ) : null}

        {today ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 space-y-1">
            <p className="text-sm font-semibold text-amber-800">오늘 — {today.date} ({today.weekday}) · {today.pillarName}</p>
            <p className="text-sm text-amber-700">{today.elementLabel} · {today.yinYang}</p>
            <p className="text-sm text-amber-700 leading-relaxed">{ELEMENT_TIP[today.element]}</p>
          </div>
        ) : null}

        {/* 달력 그리드 */}
        <div className="rounded-2xl border border-slate-100 bg-white/90 px-3 py-4 sm:px-5">
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAY_LABELS.map((label) => (
              <div key={label} className="text-center text-xs font-medium text-slate-400 py-1">
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstWeekday }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {monthlyFortune.map((d) => (
              <div
                key={d.day}
                className={`rounded-lg border py-2 text-center space-y-0.5 transition ${
                  d.isToday
                    ? 'border-amber-300 bg-amber-50 shadow-sm ring-1 ring-amber-300'
                    : d.isPast
                      ? 'border-slate-100 bg-slate-50/60 opacity-60'
                      : `${ELEMENT_COLOR[d.element]} opacity-90`
                }`}
              >
                <p className={`text-xs font-medium ${d.isToday ? 'text-amber-700' : 'text-inherit opacity-70'}`}>
                  {d.day}
                </p>
                <p className={`text-xs font-bold leading-none ${d.isToday ? 'text-amber-900' : ''}`}>
                  {d.pillarName}
                </p>
                <p className={`text-[10px] leading-tight ${d.isToday ? 'text-amber-700' : 'opacity-70'}`}>
                  {d.elementLabel.replace(/\(.*?\)/, '')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 오행 분포 */}
        <div className="space-y-2">
          <h2 className="text-base font-semibold text-gray-800">이번 달 오행 분포</h2>
          <div className="grid grid-cols-5 gap-2">
            {(Object.entries(elementCounts) as [Element, number][]).sort((a, b) => b[1] - a[1]).map(([el, count]) => (
              <div key={el} className={`rounded-xl border px-2 py-3 text-center space-y-1 ${ELEMENT_COLOR[el]}`}>
                <p className="text-sm font-bold">{el}</p>
                <p className="text-xs">{count}일</p>
              </div>
            ))}
          </div>
        </div>

        {/* 일별 상세 흐름 */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">일별 상세 흐름</h2>
          <div className="space-y-1.5">
            {monthlyFortune.map((d) => (
              <div
                key={d.day}
                className={`flex items-center gap-4 rounded-xl border px-4 py-2.5 text-sm transition ${
                  d.isToday
                    ? 'border-amber-200 bg-amber-50'
                    : d.isPast
                      ? 'border-slate-100 bg-white/40 opacity-60'
                      : 'border-slate-100 bg-white/70'
                }`}
              >
                <div className="w-20 shrink-0">
                  <p className={`text-xs ${d.isToday ? 'text-amber-600' : 'text-slate-400'}`}>
                    {d.date} ({d.weekday})
                  </p>
                  <p className={`text-base font-bold ${d.isToday ? 'text-amber-900' : 'text-slate-700'}`}>
                    {d.pillarName}
                  </p>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <p className={`text-xs font-medium ${d.isToday ? 'text-amber-700' : 'text-slate-500'}`}>
                    {d.elementLabel} · {d.yinYang}
                  </p>
                  <p className={`text-xs leading-relaxed truncate ${d.isToday ? 'text-amber-900' : 'text-slate-600'}`}>
                    {ELEMENT_TIP[d.element]}
                  </p>
                </div>
              </div>
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
            onClick={() => navigateTo(ROUTE_PATHS.fortuneYear)}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-slate-400"
          >
            올해 연간 운세 보기
          </button>
        </div>
      </div>
    </section>
  )
}
