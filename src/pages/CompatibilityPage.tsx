import { JSX, useCallback, useEffect, useMemo, useState } from 'react'
import { calculateSaju, ELEMENT_LABELS, ELEMENT_KEYWORDS, TEMPERAMENT_BY_ELEMENT } from '../lib/saju'
import type { Element } from '../lib/saju/constants'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'
import { useToast } from '../components/ToastProvider'

type CompatibilityType = 'love' | 'friend' | 'work'

const COMPAT_LABELS: Record<CompatibilityType, string> = {
  love: '연인 궁합',
  friend: '친구 궁합',
  work: '직장 궁합'
}

const ELEMENT_RELATION: Record<Element, { produces: Element; controlledBy: Element; controls: Element }> = {
  목: { produces: '화', controlledBy: '금', controls: '토' },
  화: { produces: '토', controlledBy: '수', controls: '금' },
  토: { produces: '금', controlledBy: '목', controls: '수' },
  금: { produces: '수', controlledBy: '화', controls: '목' },
  수: { produces: '목', controlledBy: '토', controls: '화' }
}

function calcCompatScore(elemA: Element, elemB: Element, type: CompatibilityType): number {
  const rel = ELEMENT_RELATION[elemA]
  let base = 65
  if (elemA === elemB) base = 72
  else if (rel.produces === elemB) base = 82
  else if (rel.controlledBy === elemA) base = 58
  else if (rel.controls === elemB) base = 60

  const MOD: Record<CompatibilityType, number> = { love: 5, friend: 0, work: -3 }
  return Math.min(99, Math.max(40, base + MOD[type]))
}

function getCompatComment(score: number, type: CompatibilityType): string {
  if (score >= 80) {
    if (type === 'love') return '두 사람의 기운이 자연스럽게 흘러 서로를 성장시키는 관계입니다. 함께할수록 더 빛납니다.'
    if (type === 'friend') return '서로 다른 강점이 보완되며 오래 함께할수록 깊어지는 우정입니다.'
    return '서로의 역할이 잘 분담되어 팀 시너지가 높습니다. 신뢰 관계를 쌓기 유리합니다.'
  }
  if (score >= 68) {
    if (type === 'love') return '서로 다른 기운이 때로는 자극이 되고 때로는 마찰이 됩니다. 이해와 소통이 관계를 풍성하게 합니다.'
    if (type === 'friend') return '공통점과 차이점이 공존하는 관계입니다. 서로의 관점을 존중하면 좋은 자극이 됩니다.'
    return '협업 시 역할 분담을 명확히 하면 좋은 성과를 낼 수 있습니다.'
  }
  if (type === 'love') return '두 기운의 방향이 달라 노력이 필요한 관계입니다. 진심 어린 대화로 간극을 좁혀가세요.'
  if (type === 'friend') return '처음엔 낯설 수 있지만 서로를 알아갈수록 의외의 조화를 찾을 수 있습니다.'
  return '업무 스타일 차이가 있을 수 있습니다. 역할을 명확히 하고 중간 접점을 찾으면 협력이 원활해집니다.'
}

interface PersonInput {
  birthDate: string
  label: string
}

function parseElement(birthDate: string): Element | null {
  if (!birthDate || birthDate.length < 10) return null
  try {
    const [y, m, d] = birthDate.split('-').map(Number)
    const result = calculateSaju(new Date(y, m - 1, d, 12, 0))
    return result.summary.strongest.element
  } catch {
    return null
  }
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

export default function CompatibilityPage(): JSX.Element {
  const { showToast } = useToast()
  const initial = useMemo(() => getInitialState(), [])

  const [personA, setPersonA] = useState<PersonInput>({ birthDate: initial.a, label: '나' })
  const [personB, setPersonB] = useState<PersonInput>({ birthDate: initial.b, label: '상대방' })
  const [activeType, setActiveType] = useState<CompatibilityType>(initial.type)
  const [checked, setChecked] = useState(() => initial.a.length >= 10 && initial.b.length >= 10)

  useEffect(() => {
    if (!checked || !personA.birthDate || !personB.birthDate) return
    const score = calcCompatScore(
      parseElement(personA.birthDate) ?? '목',
      parseElement(personB.birthDate) ?? '목',
      activeType
    )
    const title = `${personA.label} × ${personB.label} ${COMPAT_LABELS[activeType]} ${score}점 — Fove`
    const desc = `사주 오행 기반 ${COMPAT_LABELS[activeType]} 결과: ${score}점. Fove에서 두 사람의 궁합을 확인해보세요.`
    document.title = title
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', desc)
  }, [checked, personA, personB, activeType])

  const elemA = useMemo(() => checked ? parseElement(personA.birthDate) : null, [checked, personA.birthDate])
  const elemB = useMemo(() => checked ? parseElement(personB.birthDate) : null, [checked, personB.birthDate])

  const score = useMemo(() => {
    if (!elemA || !elemB) return null
    return calcCompatScore(elemA, elemB, activeType)
  }, [elemA, elemB, activeType])

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

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-xl px-4 space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">궁합 보기</h1>
          <p className="text-sm text-gray-600">두 사람의 생년월일로 사주 오행 궁합을 분석합니다.</p>
        </header>

        <div className="rounded-2xl border border-slate-100 bg-white/90 px-5 py-6 space-y-5 shadow-sm">
          {([
            { state: personA, setter: setPersonA, placeholder: '나의 생년월일' },
            { state: personB, setter: setPersonB, placeholder: '상대방 생년월일' }
          ] as Array<{ state: PersonInput; setter: (v: PersonInput) => void; placeholder: string }>).map(({ state, setter, placeholder }, idx) => (
            <div key={idx} className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">{state.label}</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={placeholder + ' (예: 1993-01-15)'}
                  value={state.label !== (idx === 0 ? '나' : '상대방') ? state.label : ''}
                  onChange={(e) => setter({ ...state, label: e.target.value || (idx === 0 ? '나' : '상대방') })}
                  className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <input
                  type="date"
                  value={state.birthDate}
                  onChange={(e) => { setter({ ...state, birthDate: e.target.value }); setChecked(false) }}
                  className="flex-none w-36 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
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
            disabled={personA.birthDate.length < 10 || personB.birthDate.length < 10}
            className="w-full rounded-2xl bg-indigo-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            궁합 확인하기
          </button>
        </div>

        {checked && score !== null && elemA && elemB ? (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-6 space-y-5 shadow-sm">
            <div className="text-center space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{COMPAT_LABELS[activeType]} 결과</p>
              <p className="text-5xl font-bold text-indigo-900 tabular-nums">{score}<span className="text-xl font-normal ml-1">점</span></p>
              <div className="h-2.5 w-full rounded-full bg-indigo-100 overflow-hidden max-w-xs mx-auto">
                <div
                  className={`h-full rounded-full transition-all ${score >= 78 ? 'bg-emerald-400' : score >= 63 ? 'bg-amber-400' : 'bg-rose-400'}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {([
                { label: personA.label, elem: elemA },
                { label: personB.label, elem: elemB }
              ]).map(({ label, elem }) => (
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
              ))}
            </div>

            <div className="rounded-xl border border-white/80 bg-white/70 px-4 py-4 space-y-1">
              <p className="text-xs font-semibold text-slate-500">종합 해석</p>
              <p className="text-sm leading-relaxed text-slate-700">{getCompatComment(score, activeType)}</p>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="w-full rounded-2xl border border-indigo-200 bg-white/70 py-3 text-sm font-medium text-indigo-700 hover:bg-white transition"
            >
              이 결과 공유하기 🔗
            </button>
          </div>
        ) : null}

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
