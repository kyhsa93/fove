import { JSX, useCallback, useEffect, useMemo, useState } from 'react'
import { ELEMENT_LABELS, ELEMENT_KEYWORDS } from '../lib/saju'
import { parseSajuResult, calcCompatScores } from '../lib/saju/compatibility'
import type { CompatibilityType } from '../lib/saju/compatibility'
import { MBTI_TYPES, getMbtiCompat } from '../lib/mbti/compatibility'
import type { MbtiRating } from '../lib/mbti/compatibility'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'
import { CompatShareCardButton } from '../components/ShareCard'
import { ShareLinkButton } from '../components/ShareLinkButton'
import { getCompatParams } from '../lib/compatParams'

const COMPAT_LABELS: Record<CompatibilityType, string> = {
  love: '연인 궁합',
  friend: '친구 궁합',
  work: '직장 궁합'
}

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
  mbti: string
  label: string
}

type Level = 'high' | 'mid' | 'low'

function toLevel(score: number): Level {
  if (score >= 78) return 'high'
  if (score >= 63) return 'mid'
  return 'low'
}

const CROSS_ANALYSIS: Record<Level, Record<Level, string>> = {
  high: {
    high: '사주 오행과 MBTI 인지 기능 모두 높은 조화를 보입니다. 에너지 흐름과 소통 방식이 자연스럽게 맞아 함께할수록 빛나는 인연입니다.',
    mid: '오행 기운 흐름은 탄탄하지만 MBTI 소통 방식에 약간의 차이가 있습니다. 상대의 사고 패턴을 이해하면 관계가 더 풍성해집니다.',
    low: '기운의 흐름은 잘 맞지만 소통 방식 차이가 있습니다. 서로의 인지 방식을 의식적으로 이해하는 노력이 관계를 더 단단하게 만듭니다.'
  },
  mid: {
    high: '대화와 소통은 잘 통하지만 기운의 방향에 약간의 차이가 있습니다. MBTI 강점을 살리면서 에너지 흐름을 의식하면 관계가 균형 잡힙니다.',
    mid: '두 지표가 모두 보통 수준입니다. 서로의 공통점을 찾아가며 차이를 인정하는 과정이 관계를 만들어갑니다.',
    low: '소통은 나름 통하지만 기운과 성향 모두 차이가 있습니다. 상대를 이해하는 적극적인 노력이 관계의 질을 높입니다.'
  },
  low: {
    high: 'MBTI 소통 방식이 잘 맞지만 기운의 방향이 많이 다릅니다. 대화의 강점을 살리면 오행 에너지 차이를 충분히 극복할 수 있습니다.',
    mid: '기운의 방향이 다르고 소통에도 노력이 필요합니다. 서로의 강점을 발견하며 관계를 쌓아가세요.',
    low: '두 지표 모두 차이가 크게 나타납니다. 다름을 인정하고 이해하는 진심 어린 노력이 관계를 만들어갑니다.'
  }
}

const MBTI_RATING_LABEL: Record<MbtiRating, string> = {
  excellent: '최고 궁합',
  good: '좋은 궁합',
  moderate: '보통 궁합'
}

const MBTI_RATING_COLOR: Record<MbtiRating, string> = {
  excellent: 'text-emerald-700 bg-emerald-100 border-emerald-200',
  good: 'text-sky-700 bg-sky-100 border-sky-200',
  moderate: 'text-slate-600 bg-slate-100 border-slate-200'
}

function clamp(v: number) {
  return Math.min(99, Math.max(40, Math.round(v)))
}

function scoreBarColor(score: number) {
  if (score >= 80) return 'bg-emerald-400'
  if (score >= 65) return 'bg-amber-400'
  return 'bg-rose-400'
}

export default function CombinedCompatPage(): JSX.Element {
  const initial = useMemo(() => getCompatParams(), [])

  const [personA, setPersonA] = useState<PersonInput>({ birthDate: '', hour: -1, mbti: '', label: '나' })
  const [personB, setPersonB] = useState<PersonInput>({ birthDate: '', hour: -1, mbti: '', label: '상대방' })
  const [activeType, setActiveType] = useState<CompatibilityType>(initial.type as CompatibilityType)
  const [checked, setChecked] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    document.title = '사주+MBTI 통합 궁합 | Fove'
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    setMeta('meta[name="description"]', '사주 오행(40%)과 MBTI 인지기능(60%)을 결합한 통합 궁합을 확인하세요. 두 사람의 에너지 흐름과 소통 방식을 교차 분석합니다.')
    setMeta('meta[property="og:title"]', '사주+MBTI 통합 궁합 | Fove')
    setMeta('meta[property="og:image"]', 'https://kyhsa93.github.io/fove/social-card.png')
    setMeta('meta[name="twitter:image"]', 'https://kyhsa93.github.io/fove/social-card.png')
  }, [])

  const canCheck = personA.birthDate.length >= 10 && personB.birthDate.length >= 10

  const resultA = useMemo(
    () => (checked ? parseSajuResult(personA.birthDate, personA.hour === -1 ? undefined : personA.hour) : null),
    [checked, personA.birthDate, personA.hour]
  )
  const resultB = useMemo(
    () => (checked ? parseSajuResult(personB.birthDate, personB.hour === -1 ? undefined : personB.hour) : null),
    [checked, personB.birthDate, personB.hour]
  )

  const sajuScores = useMemo(
    () => (resultA && resultB ? calcCompatScores(resultA, resultB, activeType) : null),
    [resultA, resultB, activeType]
  )

  const mbtiCompat = useMemo(
    () => (checked && personA.mbti && personB.mbti ? getMbtiCompat(personA.mbti, personB.mbti) : null),
    [checked, personA.mbti, personB.mbti]
  )

  const combinedScore = useMemo(() => {
    if (!sajuScores) return null
    const sajuTotal = sajuScores.total
    const mbtiScore = mbtiCompat?.score ?? 65
    return clamp(sajuTotal * 0.4 + mbtiScore * 0.6)
  }, [sajuScores, mbtiCompat])

  const crossAnalysis = useMemo(() => {
    if (!sajuScores || combinedScore === null) return null
    const sajuLevel = toLevel(sajuScores.total)
    const mbtiLevel = mbtiCompat ? toLevel(mbtiCompat.score) : 'mid'
    return CROSS_ANALYSIS[sajuLevel][mbtiLevel]
  }, [sajuScores, mbtiCompat, combinedScore])

  useEffect(() => {
    if (isCalculating && sajuScores) setIsCalculating(false)
  }, [isCalculating, sajuScores])

  const handleCheck = () => {
    if (canCheck) {
      setIsCalculating(true)
      setChecked(true)
    }
  }

  const combinedShareOptions = useMemo(() => ({
    title: combinedScore > 0 ? `사주+MBTI 통합 궁합 ${combinedScore}점 — Fove` : 'Fove 사주+MBTI 통합 궁합',
    description: '사주 오행과 MBTI를 결합한 통합 궁합을 확인해보세요!',
    url: `${typeof window !== 'undefined' ? window.location.origin : 'https://kyhsa93.github.io'}${typeof window !== 'undefined' ? window.location.pathname : '/fove/compatibility/combined'}?type=${activeType}`,
  }), [activeType, combinedScore])

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-xl px-4 space-y-8">
        <header className="space-y-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">사주 + MBTI</p>
          <h1 className="text-3xl font-bold text-gray-900">통합 궁합</h1>
          <p className="text-sm text-gray-600">사주 오행(40%)과 MBTI 인지기능(60%)을 결합해 두 사람의 궁합을 입체적으로 분석합니다.</p>
        </header>

        {/* 입력 폼 */}
        <div className="rounded-2xl border border-slate-100 bg-white/90 px-5 py-6 space-y-4 shadow-sm">
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
                      onChange={(e) => { setter({ ...state, birthDate: e.target.value }); setChecked(false) }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">태어난 시 <span className="text-slate-400">(선택)</span></label>
                    <select
                      value={state.hour}
                      onChange={(e) => { setter({ ...state, hour: Number(e.target.value) }); setChecked(false) }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      {HOUR_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">MBTI <span className="text-slate-400">(선택)</span></label>
                    <select
                      value={state.mbti}
                      onChange={(e) => { setter({ ...state, mbti: e.target.value }); setChecked(false) }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                      <option value="">선택</option>
                      {MBTI_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
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
              </div>
            ))}

          <div className="flex gap-2 flex-wrap">
            {(Object.keys(COMPAT_LABELS) as CompatibilityType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setActiveType(t); setChecked(false) }}
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
            disabled={!canCheck || isCalculating}
            className="w-full rounded-2xl bg-indigo-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isCalculating ? '계산 중...' : '통합 궁합 확인하기'}
          </button>

          {!personA.mbti || !personB.mbti ? (
            <p className="text-xs text-slate-400 text-center">MBTI를 입력하지 않으면 사주 오행만으로 분석합니다.</p>
          ) : null}
        </div>

        {/* 계산 중 */}
        {isCalculating && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 px-5 py-8 text-center text-sm text-indigo-500">
            궁합을 계산하고 있어요...
          </div>
        )}

        {/* 결과 */}
        {!isCalculating && checked && combinedScore !== null && sajuScores ? (
          <div className="space-y-4">
            {/* 통합 총점 */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-6 space-y-3 shadow-sm text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                {COMPAT_LABELS[activeType]} — 통합 점수
              </p>
              <p className="text-6xl font-bold text-indigo-900 tabular-nums">
                {combinedScore}<span className="text-2xl font-normal ml-1">점</span>
              </p>
              <div className="h-3 w-full max-w-xs mx-auto rounded-full bg-indigo-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(combinedScore)}`}
                  style={{ width: `${combinedScore}%` }}
                />
              </div>
              {crossAnalysis && (
                <p className="text-sm text-slate-700 leading-relaxed pt-1">{crossAnalysis}</p>
              )}
            </div>

            {/* 두 지표 점수 비교 */}
            <div className="rounded-2xl border border-slate-100 bg-white/90 px-5 py-5 space-y-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">지표별 점수</p>

              {/* 사주 오행 */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5">40%</span>
                    <span className="text-sm font-semibold text-slate-700">사주 오행</span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-indigo-700">{sajuScores.total}점</span>
                </div>
                <div className="h-2 w-full rounded-full bg-indigo-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${scoreBarColor(sajuScores.total)}`}
                    style={{ width: `${sajuScores.total}%` }}
                  />
                </div>
                {/* 사주 4개 카테고리 미니 표시 */}
                <div className="grid grid-cols-4 gap-1 pt-1">
                  {([
                    { label: '총운', score: sajuScores.overall },
                    { label: '감정', score: sajuScores.love },
                    { label: '소통', score: sajuScores.communication },
                    { label: '미래', score: sajuScores.future },
                  ]).map(({ label, score }) => (
                    <div key={label} className="text-center">
                      <p className="text-[10px] text-slate-400">{label}</p>
                      <p className="text-xs font-bold text-slate-600 tabular-nums">{score}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* MBTI */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-violet-400 bg-violet-50 border border-violet-100 rounded px-1.5 py-0.5">60%</span>
                    <span className="text-sm font-semibold text-slate-700">MBTI 인지기능</span>
                    {mbtiCompat && (
                      <span className={`text-[10px] font-semibold rounded-full border px-2 py-0.5 ${MBTI_RATING_COLOR[mbtiCompat.rating]}`}>
                        {MBTI_RATING_LABEL[mbtiCompat.rating]}
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold tabular-nums text-violet-700">
                    {mbtiCompat?.score ?? '—'}점
                  </span>
                </div>
                {mbtiCompat ? (
                  <>
                    <div className="h-2 w-full rounded-full bg-violet-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${scoreBarColor(mbtiCompat.score)}`}
                        style={{ width: `${mbtiCompat.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-0.5">{mbtiCompat.reason}</p>
                    {mbtiCompat.reverse && (
                      <p className="text-xs text-slate-500 leading-relaxed">{mbtiCompat.reverse}</p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-slate-400">MBTI를 입력하면 인지기능 궁합이 추가됩니다.</p>
                )}
              </div>
            </div>

            {/* 두 사람 오행 정보 */}
            {resultA && resultB && (
              <div className="grid grid-cols-2 gap-3">
                {([
                  { label: personA.label, result: resultA, mbti: personA.mbti },
                  { label: personB.label, result: resultB, mbti: personB.mbti }
                ]).map(({ label, result, mbti }) => {
                  const elem = result.summary.strongest.element
                  return (
                    <div key={label} className="rounded-xl border border-indigo-100 bg-white/80 px-3 py-3 space-y-1.5">
                      <p className="text-xs font-semibold text-indigo-600">{label}</p>
                      <p className="text-sm font-bold text-slate-800">{ELEMENT_LABELS[elem]} 기운</p>
                      {mbti && (
                        <p className="text-xs font-semibold text-violet-600">{mbti}</p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {ELEMENT_KEYWORDS[elem].slice(0, 2).map((kw) => (
                          <span key={kw} className="text-[10px] rounded-full bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-indigo-700">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="flex gap-3">
              <CompatShareCardButton data={{
                kind: 'combined',
                typeLabel: '통합 궁합',
                labelA: personA.label,
                labelB: personB.label,
                totalScore: Math.round(combinedScore ?? 0),
                dimensions: [
                  { label: '사주 궁합', score: sajuScores?.total ?? 0, color: '#818cf8' },
                  { label: 'MBTI 궁합', score: mbtiCompat?.score ?? 0, color: '#60a5fa' },
                ],
              }} />
              <ShareLinkButton options={combinedShareOptions} label="공유하기 🔗" className="flex-1" />
            </div>
          </div>
        ) : null}

        {/* 하단 네비게이션 */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.compatibility)}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            사주 궁합만 보기
          </button>
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.mbtiCompatibility)}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            MBTI 궁합만 보기
          </button>
        </div>
      </div>
    </section>
  )
}
