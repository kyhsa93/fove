import { JSX, useCallback, useEffect, useMemo, useState } from 'react'
import { ELEMENT_LABELS, ELEMENT_KEYWORDS, TEMPERAMENT_BY_ELEMENT } from '../lib/saju'
import { parseSajuResult, calcCompatScores, getCompatDetail } from '../lib/saju/compatibility'
import type { CompatibilityType } from '../lib/saju/compatibility'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'
import { useToast } from '../components/ToastProvider'
import { CompatShareCardButton } from '../components/ShareCard'

const COMPAT_LABELS: Record<CompatibilityType, string> = {
  love: '연인 궁합',
  friend: '친구 궁합',
  work: '직장 궁합'
}

const CATEGORY_META: Array<{
  key: keyof ReturnType<typeof calcCompatScores>
  label: string
  subLabel: string
  icon: string
}> = [
  { key: 'overall', label: '총운', subLabel: '일주 오행 흐름', icon: '✦' },
  { key: 'love', label: '감정교류', subLabel: '일지 감정 결', icon: '♡' },
  { key: 'communication', label: '소통', subLabel: '월주 대화 방식', icon: '◎' },
  { key: 'future', label: '미래안정', subLabel: '연주 장기 흐름', icon: '◇' },
]

const HOUR_OPTIONS = [
  { label: '시간 모름', value: -1 },
  { label: '자시 (23:00~00:59)', value: 23 },
  { label: '축시 (01:00~02:59)', value: 1 },
  { label: '인시 (03:00~04:59)', value: 3 },
  { label: '묘시 (05:00~06:59)', value: 5 },
  { label: '진시 (07:00~08:59)', value: 7 },
  { label: '사시 (09:00~10:59)', value: 9 },
  { label: '오시 (11:00~12:59)', value: 11 },
  { label: '미시 (13:00~14:59)', value: 13 },
  { label: '신시 (15:00~16:59)', value: 15 },
  { label: '유시 (17:00~18:59)', value: 17 },
  { label: '술시 (19:00~20:59)', value: 19 },
  { label: '해시 (21:00~22:59)', value: 21 },
]

interface PersonInput {
  birthDate: string
  hour: number
  label: string
}

function getInitialState() {
  if (typeof window === 'undefined') return { a: '', b: '', type: 'love' as CompatibilityType }
  const params = new URLSearchParams(window.location.search)
  return {
    a: params.get('a') ?? '',
    b: params.get('b') ?? '',
    type: (params.get('type') as CompatibilityType) ?? 'love'
  }
}

function ScoreBar({ score, colorClass }: { score: number; colorClass: string }) {
  return (
    <div className="h-2 w-full rounded-full bg-indigo-100 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${score}%` }}
      />
    </div>
  )
}

function scoreColor(score: number) {
  if (score >= 80) return 'bg-emerald-400'
  if (score >= 65) return 'bg-amber-400'
  return 'bg-rose-400'
}

export default function CompatibilityPage(): JSX.Element {
  const { showToast } = useToast()
  const initial = useMemo(() => getInitialState(), [])

  const [personA, setPersonA] = useState<PersonInput>({ birthDate: initial.a, hour: -1, label: '나' })
  const [personB, setPersonB] = useState<PersonInput>({ birthDate: initial.b, hour: -1, label: '상대방' })
  const [activeType, setActiveType] = useState<CompatibilityType>(initial.type)
  const [checked, setChecked] = useState(() => initial.a.length >= 10 && initial.b.length >= 10)

  const resultA = useMemo(
    () => (checked ? parseSajuResult(personA.birthDate, personA.hour === -1 ? undefined : personA.hour) : null),
    [checked, personA.birthDate, personA.hour]
  )
  const resultB = useMemo(
    () => (checked ? parseSajuResult(personB.birthDate, personB.hour === -1 ? undefined : personB.hour) : null),
    [checked, personB.birthDate, personB.hour]
  )

  const scores = useMemo(
    () => (resultA && resultB ? calcCompatScores(resultA, resultB, activeType) : null),
    [resultA, resultB, activeType]
  )
  const detail = useMemo(
    () => (scores && resultA && resultB ? getCompatDetail(scores, resultA, resultB, activeType) : null),
    [scores, resultA, resultB, activeType]
  )

  useEffect(() => {
    if (!checked || !personA.birthDate || !personB.birthDate || !scores) return
    const title = `${personA.label} × ${personB.label} ${COMPAT_LABELS[activeType]} ${scores.total}점 — Fove`
    const desc = `사주 오행 기반 ${COMPAT_LABELS[activeType]} 결과: 총운 ${scores.overall}점, 감정교류 ${scores.love}점, 소통 ${scores.communication}점. Fove에서 두 사람의 궁합을 확인해보세요.`
    document.title = title
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', desc)
  }, [checked, personA, personB, activeType, scores])

  const handleCheck = () => {
    if (personA.birthDate.length >= 10 && personB.birthDate.length >= 10) {
      setChecked(true)
    }
  }

  const handleShare = useCallback(() => {
    const base = `${window.location.origin}${window.location.pathname}`
    const url = `${base}?a=${personA.birthDate}&b=${personB.birthDate}&type=${activeType}`
    navigator.clipboard.writeText(url).then(() => {
      showToast('링크가 복사됐습니다. 친구에게 공유해보세요!', 'success')
    }).catch(() => {
      showToast('링크 복사에 실패했습니다.', 'error')
    })
  }, [personA.birthDate, personB.birthDate, activeType, showToast])

  const resetChecked = () => setChecked(false)

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-3xl px-4 space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">궁합 보기</h1>
          <p className="text-sm text-gray-600">두 사람의 생년월일로 사주 오행 궁합을 4개 차원으로 분석합니다.</p>
        </header>

        {/* 입력 폼 */}
        <div className="rounded-2xl border border-slate-100 bg-white/90 px-5 py-6 space-y-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
          {([
            { state: personA, setter: setPersonA, defaultLabel: '나' },
            { state: personB, setter: setPersonB, defaultLabel: '상대방' }
          ] as Array<{ state: PersonInput; setter: (v: PersonInput) => void; defaultLabel: string }>)
            .map(({ state, setter, defaultLabel }, idx) => (
              <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-4 space-y-3">
                <p className="text-sm font-semibold text-slate-700">{state.label}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">생년월일</label>
                    <input
                      type="date"
                      value={state.birthDate}
                      onChange={(e) => { setter({ ...state, birthDate: e.target.value }); resetChecked() }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">태어난 시 <span className="text-slate-400">(선택)</span></label>
                    <select
                      value={state.hour}
                      onChange={(e) => { setter({ ...state, hour: Number(e.target.value) }); resetChecked() }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      {HOUR_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500">이름/호칭 <span className="text-slate-400">(선택)</span></label>
                  <input
                    type="text"
                    placeholder={defaultLabel}
                    value={state.label !== defaultLabel ? state.label : ''}
                    onChange={(e) => setter({ ...state, label: e.target.value || defaultLabel })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {(Object.keys(COMPAT_LABELS) as CompatibilityType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setActiveType(t); resetChecked() }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  activeType === t
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
                }`}
              >
                {COMPAT_LABELS[t]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCheck}
            disabled={personA.birthDate.length < 10 || personB.birthDate.length < 10}
            className="w-full rounded-2xl bg-indigo-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            궁합 확인하기
          </button>
        </div>

        {/* 결과 */}
        {checked && scores && detail && resultA && resultB ? (
          <div className="space-y-4">
            {/* 총점 카드 */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-6 space-y-3 shadow-sm text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{COMPAT_LABELS[activeType]} 결과</p>
              <p className="text-6xl font-bold text-indigo-900 tabular-nums">
                {scores.total}<span className="text-2xl font-normal ml-1">점</span>
              </p>
              <div className="h-3 w-full max-w-xs mx-auto rounded-full bg-indigo-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreColor(scores.total)}`}
                  style={{ width: `${scores.total}%` }}
                />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed pt-1">{detail.summary}</p>
            </div>

            {/* 4차원 점수 */}
            <div className="rounded-2xl border border-slate-100 bg-white/90 px-5 py-5 space-y-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">4차원 분석</p>
              {CATEGORY_META.map(({ key, label, subLabel, icon }) => {
                const score = scores[key] as number
                const text = detail[key as keyof typeof detail] as string
                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-indigo-400 text-sm">{icon}</span>
                        <span className="text-sm font-semibold text-slate-700">{label}</span>
                        <span className="text-xs text-slate-400">{subLabel}</span>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-indigo-700">{score}점</span>
                    </div>
                    <ScoreBar score={score} colorClass={scoreColor(score)} />
                    <p className="text-xs text-slate-600 leading-relaxed">{text}</p>
                  </div>
                )
              })}
            </div>

            {/* 두 사람 오행 카드 */}
            <div className="grid grid-cols-2 gap-3">
              {([
                { label: personA.label, result: resultA },
                { label: personB.label, result: resultB }
              ]).map(({ label, result }) => {
                const elem = result.summary.strongest.element
                return (
                  <div key={label} className="rounded-xl border border-indigo-100 bg-white/80 px-3 py-3 space-y-1.5">
                    <p className="text-xs font-semibold text-indigo-600">{label}</p>
                    <p className="text-base font-bold text-slate-800">{ELEMENT_LABELS[elem]} 기운</p>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{TEMPERAMENT_BY_ELEMENT[elem]}</p>
                    <div className="flex flex-wrap gap-1">
                      {ELEMENT_KEYWORDS[elem].slice(0, 2).map((kw) => (
                        <span key={kw} className="text-[10px] rounded-full bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-indigo-700">{kw}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3">
              <CompatShareCardButton data={{
                kind: 'saju',
                typeLabel: COMPAT_LABELS[activeType],
                labelA: personA.label,
                labelB: personB.label,
                totalScore: scores.total,
                summary: detail.summary,
                dimensions: [
                  { label: '총운', score: scores.overall, color: '#818cf8' },
                  { label: '감정교류', score: scores.love, color: '#f472b6' },
                  { label: '소통', score: scores.communication, color: '#fbbf24' },
                  { label: '미래안정', score: scores.future, color: '#34d399' },
                ],
              }} />
              <button
                type="button"
                onClick={handleShare}
                className="flex-1 rounded-full border border-indigo-200 bg-white/70 py-2.5 text-sm font-medium text-indigo-700 hover:bg-white transition"
              >
                링크 공유 🔗
              </button>
            </div>
          </div>
        ) : null}

        {/* 통합 궁합 CTA */}
        <div className="rounded-2xl border border-violet-100 bg-violet-50/60 px-5 py-4 space-y-2">
          <p className="text-sm font-semibold text-violet-800">사주 + MBTI 통합 궁합</p>
          <p className="text-xs text-violet-600 leading-relaxed">사주 오행(40%)과 MBTI 인지기능(60%)을 함께 분석해 더 입체적인 궁합을 확인할 수 있습니다.</p>
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.combinedCompatibility)}
            className="rounded-full bg-violet-500 px-5 py-2 text-sm font-medium text-white hover:bg-violet-600 transition shadow-sm"
          >
            통합 궁합 보러가기
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.insight)}
            className="flex-1 rounded-full bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 transition"
          >
            통합 인사이트 보기
          </button>
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.fortune)}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            오늘의 운세 보기
          </button>
        </div>
      </div>
    </section>
  )
}
