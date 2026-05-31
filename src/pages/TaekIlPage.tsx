import { JSX, useMemo, useState } from 'react'
import { buildMonthlyFortune, buildDailyFortune } from '../lib/saju'
import { useSajuCalculator } from '../hooks/useSajuCalculator'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'
import type { Element } from '../lib/saju/constants'

type Purpose = 'wedding' | 'moving' | 'contract' | 'business' | 'travel' | 'exam'

const PURPOSES: Array<{ key: Purpose; label: string; emoji: string; desc: string }> = [
  { key: 'wedding',  label: '결혼·혼인',  emoji: '💍', desc: '결혼식·혼인 신고에 좋은 날' },
  { key: 'moving',   label: '이사',        emoji: '🏠', desc: '새 집으로 이동하기 좋은 날' },
  { key: 'contract', label: '계약·서명',   emoji: '📝', desc: '중요한 계약·합의에 좋은 날' },
  { key: 'business', label: '개업·시작',   emoji: '🚀', desc: '새 사업·프로젝트 시작에 좋은 날' },
  { key: 'travel',   label: '여행·출장',   emoji: '✈️', desc: '먼 길 떠나기에 좋은 날' },
  { key: 'exam',     label: '시험·면접',   emoji: '📚', desc: '시험·중요 발표·면접에 좋은 날' },
]

// 목적별 선호 오행 (상생 기운)
const PURPOSE_ELEMENTS: Record<Purpose, Element[]> = {
  wedding:  ['목', '화', '수'],
  moving:   ['토', '금', '목'],
  contract: ['금', '토', '수'],
  business: ['화', '목', '금'],
  travel:   ['수', '목', '화'],
  exam:     ['금', '수', '토'],
}

// 목적별 설명
const PURPOSE_REASON: Record<Purpose, string> = {
  wedding:  '목·화·수 기운이 강한 날은 새로운 인연과 교감, 감성이 풍부해 결혼에 좋아요.',
  moving:   '토·금·목 기운의 날은 안정적인 터전을 마련하고 새 출발하기 적합해요.',
  contract: '금·토·수 기운의 날은 판단력이 예리하고 신뢰가 바탕이 되어 계약에 유리해요.',
  business: '화·목·금 기운의 날은 추진력과 창의성, 결단력이 모여 시작에 최적이에요.',
  travel:   '수·목·화 기운의 날은 흐름을 잘 읽고 유연하게 이동하기에 좋아요.',
  exam:     '금·수·토 기운의 날은 집중력과 분석력, 침착함이 강해 시험에 유리해요.',
}

interface DayResult {
  day: number
  date: string
  weekday: string
  element: Element
  score: number
  pillarName: string
  reason: string
}

function scoreGrade(score: number): { label: string; color: string } {
  if (score >= 85) return { label: '대길 ⭐', color: 'text-amber-600 bg-amber-50 border-amber-200' }
  if (score >= 75) return { label: '길', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
  if (score >= 65) return { label: '보통', color: 'text-slate-500 bg-slate-50 border-slate-200' }
  return { label: '비추', color: 'text-rose-500 bg-rose-50 border-rose-200' }
}

export default function TaekIlPage(): JSX.Element {
  const [purpose, setPurpose] = useState<Purpose | null>(null)
  const { result } = useSajuCalculator()

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const monthLabel = new Intl.DateTimeFormat('ko', { year: 'numeric', month: 'long' }).format(now)

  const monthlyFortune = useMemo(() => buildMonthlyFortune(), [])

  const recommendations = useMemo<DayResult[]>(() => {
    if (!purpose) return []
    const preferred = PURPOSE_ELEMENTS[purpose]

    return monthlyFortune
      .filter((d) => !d.isPast)
      .map((d) => {
        const isPreferred = preferred.includes(d.element)
        let score = isPreferred ? 78 : 58

        // 사주 있으면 실제 점수 사용
        if (result) {
          try {
            const [y, mo, dy] = d.date.split('.').map(Number)
            const ref = new Date(y, mo - 1, dy, 12, 0, 0)
            const fortune = buildDailyFortune(result, ref)
            score = isPreferred ? Math.min(99, fortune.score + 8) : Math.max(30, fortune.score - 5)
          } catch {}
        }

        // 주말 소폭 보정 (결혼·이사는 주말 선호)
        const dayOfWeek = new Date(year, month - 1, d.day).getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        if (['wedding', 'moving'].includes(purpose) && isWeekend) score = Math.min(99, score + 5)

        return {
          day: d.day,
          date: d.date,
          weekday: d.weekday,
          element: d.element,
          score,
          pillarName: d.pillarName,
          reason: isPreferred
            ? `${d.element} 기운이 ${purpose === 'wedding' ? '인연·교감' : purpose === 'moving' ? '안정·이동' : purpose === 'contract' ? '신뢰·판단' : purpose === 'business' ? '추진·창의' : purpose === 'travel' ? '흐름·유연' : '집중·분석'}에 잘 맞는 날이에요.`
            : `${d.element} 기운의 날로 목적과의 궁합이 평범해요.`,
        }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
  }, [purpose, monthlyFortune, result, year, month])

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-lg px-4 space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">택일</h1>
          <p className="text-sm text-gray-600">{monthLabel} 중에서 목적에 맞는 좋은 날을 찾아드려요.</p>
        </header>

        {/* 목적 선택 */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-slate-700">어떤 일을 계획하고 계신가요?</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PURPOSES.map(({ key, label, emoji, desc }) => (
              <button
                key={key}
                type="button"
                onClick={() => setPurpose(key)}
                className={`rounded-xl border px-3 py-3 text-left space-y-1 transition ${
                  purpose === key
                    ? 'border-indigo-400 bg-indigo-50 ring-2 ring-indigo-300 ring-offset-1'
                    : 'border-slate-200 bg-white hover:border-indigo-200'
                }`}
              >
                <p className="text-xl">{emoji}</p>
                <p className="text-sm font-semibold text-slate-800">{label}</p>
                <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 결과 */}
        {purpose && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 space-y-1">
              <p className="text-sm font-semibold text-indigo-900">
                {PURPOSES.find((p) => p.key === purpose)?.emoji} {PURPOSES.find((p) => p.key === purpose)?.label}에 좋은 날
              </p>
              <p className="text-xs text-indigo-700">{PURPOSE_REASON[purpose]}</p>
              {!result && <p className="text-xs text-indigo-500">💡 사주 정보를 입력하면 더 정확한 맞춤 결과를 확인할 수 있어요.</p>}
            </div>

            <div className="space-y-2">
              {recommendations.map((day, idx) => {
                const grade = scoreGrade(day.score)
                return (
                  <div
                    key={day.day}
                    className={`rounded-xl border px-4 py-3 flex items-center gap-4 ${
                      idx === 0 ? 'border-amber-200 bg-amber-50/60' : 'border-slate-100 bg-white/80'
                    }`}
                  >
                    <div className="w-8 text-center shrink-0">
                      {idx === 0 && <p className="text-base">🏆</p>}
                      {idx > 0 && <p className="text-sm font-bold text-slate-400">{idx + 1}</p>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-slate-800">{month}월 {day.day}일 ({day.weekday})</p>
                        <span className={`text-[10px] font-semibold rounded-full border px-2 py-0.5 ${grade.color}`}>
                          {grade.label}
                        </span>
                        <span className="text-[10px] text-slate-400">{day.pillarName} · {day.element}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{day.reason}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-bold text-slate-700 tabular-nums">{day.score}</p>
                      <p className="text-[10px] text-slate-400">점</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {recommendations.length === 0 && (
              <p className="text-center text-sm text-slate-500">이번 달 남은 날이 없어요.</p>
            )}
          </div>
        )}

        {!purpose && (
          <div className="rounded-2xl border border-slate-100 bg-white/60 px-5 py-6 text-center text-sm text-slate-500">
            목적을 선택하면 이번 달 좋은 날을 순서대로 알려드려요.
          </div>
        )}

        <div className="rounded-2xl border border-slate-100 bg-white/60 px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">사주 정보가 있으면 더 정확한 결과를 드려요.</p>
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.saju)}
            className="shrink-0 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition"
          >
            사주 입력 →
          </button>
        </div>

        <p className="text-center text-xs text-slate-400">
          택일은 일진과 오행 기반의 참고 정보예요. 최종 결정은 개인 상황에 맞게 판단하세요.
        </p>
      </div>
    </section>
  )
}
