import { JSX, useMemo } from 'react'
import { buildWeeklyFortune } from '../lib/saju'
import { ELEMENT_LABELS } from '../lib/saju/constants'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'

const ELEMENT_DESCRIPTION: Record<string, string> = {
  '목(木)': '성장·확장의 에너지. 새로운 시작과 소통에 유리합니다.',
  '화(火)': '열정·추진의 에너지. 발표·홍보·만남에 활기가 붙습니다.',
  '토(土)': '안정·신뢰의 에너지. 루틴 정비와 꼼꼼한 마무리에 좋습니다.',
  '금(金)': '결단·집중의 에너지. 분석·계획·검수 업무에 탁월합니다.',
  '수(水)': '지혜·유연의 에너지. 정보 수집과 전략 기획에 빛납니다.'
}

export default function FortuneWeekPage(): JSX.Element {
  const weeklyFortune = useMemo(() => buildWeeklyFortune(), [])
  const today = weeklyFortune.find((d) => d.isToday)

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-2xl space-y-8 px-4">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">이번 주 일진 흐름</h1>
          <p className="text-sm text-gray-600">
            이번 주 7일의 일진 천간·지지와 오행 기운을 한눈에 확인하세요.
          </p>
        </header>

        {today ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 space-y-1">
            <p className="text-sm font-semibold text-amber-800">오늘의 일진 — {today.pillarName}</p>
            <p className="text-sm text-amber-700">{ELEMENT_DESCRIPTION[today.elementLabel] ?? today.elementLabel}</p>
          </div>
        ) : null}

        <div className="grid grid-cols-7 gap-1.5">
          {weeklyFortune.map((day) => (
            <div
              key={day.shortDate}
              className={`rounded-xl border px-1 py-3 text-center space-y-1.5 transition ${
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

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">일별 에너지 상세</h2>
          <div className="space-y-2">
            {weeklyFortune.map((day) => (
              <div
                key={day.shortDate}
                className={`flex items-start gap-4 rounded-xl border px-4 py-3 text-sm ${
                  day.isToday
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-slate-100 bg-white/70'
                }`}
              >
                <div className="w-14 shrink-0 text-center">
                  <p className={`text-xs ${day.isToday ? 'text-amber-600' : 'text-slate-400'}`}>{day.weekday} {day.shortDate}</p>
                  <p className={`text-base font-bold ${day.isToday ? 'text-amber-900' : 'text-slate-700'}`}>{day.pillarName}</p>
                </div>
                <div className="space-y-0.5">
                  <p className={`text-xs font-medium ${day.isToday ? 'text-amber-700' : 'text-slate-500'}`}>{day.elementLabel} · {day.yinYang}</p>
                  <p className={`leading-relaxed ${day.isToday ? 'text-amber-900' : 'text-slate-600'}`}>
                    {ELEMENT_DESCRIPTION[day.elementLabel] ?? ''}
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
            onClick={() => navigateTo(ROUTE_PATHS.saju)}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-slate-400"
          >
            사주 풀이 보기
          </button>
        </div>
      </div>
    </section>
  )
}
