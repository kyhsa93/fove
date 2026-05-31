import { JSX, useEffect, useMemo, useState } from 'react'
import { BLOOD_TYPES, BLOOD_TRAITS, getBloodCompat } from '../data/bloodCompat'
import type { BloodType } from '../data/bloodCompat'
import { ShareLinkButton } from '../components/ShareLinkButton'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'

const GRADE_STYLE = {
  '환상': 'text-amber-700 bg-amber-50 border-amber-200',
  '좋음': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  '보통': 'text-slate-600 bg-slate-50 border-slate-200',
  '도전': 'text-rose-600 bg-rose-50 border-rose-200',
}

function getInitial(): { a: BloodType | ''; b: BloodType | '' } {
  if (typeof window === 'undefined') return { a: '', b: '' }
  const p = new URLSearchParams(window.location.search)
  const a = p.get('a') as BloodType | null
  const b = p.get('b') as BloodType | null
  return {
    a: BLOOD_TYPES.includes(a as BloodType) ? (a as BloodType) : '',
    b: BLOOD_TYPES.includes(b as BloodType) ? (b as BloodType) : '',
  }
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 83 ? 'text-amber-500' : score >= 72 ? 'text-emerald-500' : score >= 62 ? 'text-slate-500' : 'text-rose-500'
  return (
    <div className="text-center">
      <p className={`text-7xl font-bold tabular-nums ${color}`}>{score}</p>
      <p className="text-sm text-slate-500 mt-1">점</p>
    </div>
  )
}

export default function BloodCompatPage(): JSX.Element {
  const init = useMemo(() => getInitial(), [])
  const [typeA, setTypeA] = useState<BloodType | ''>(init.a)
  const [typeB, setTypeB] = useState<BloodType | ''>(init.b)
  const [labelA, setLabelA] = useState('나')
  const [labelB, setLabelB] = useState('상대방')

  const result = useMemo(
    () => (typeA && typeB ? getBloodCompat(typeA as BloodType, typeB as BloodType) : null),
    [typeA, typeB]
  )

  useEffect(() => {
    document.title = typeA && typeB
      ? `${typeA}형 × ${typeB}형 혈액형 궁합 — Fove`
      : '혈액형 궁합 — Fove'
  }, [typeA, typeB])

  const shareOptions = useMemo(() => ({
    title: typeA && typeB ? `${labelA}(${typeA}형) × ${labelB}(${typeB}형) 혈액형 궁합 ${result?.score ?? ''}점 — Fove` : 'Fove 혈액형 궁합',
    description: result ? `${result.grade} 궁합! ${result.summary}` : '내 혈액형 궁합을 확인해보세요.',
    url: `${typeof window !== 'undefined' ? window.location.origin : 'https://kyhsa93.github.io'}${typeof window !== 'undefined' ? window.location.pathname : '/fove/blood-compatibility'}${typeA && typeB ? `?a=${typeA}&b=${typeB}` : ''}`,
  }), [typeA, typeB, labelA, labelB, result])

  function TypeSelector({ value, onChange, label }: { value: BloodType | ''; onChange: (v: BloodType) => void; label: string }) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700 text-center">{label}</p>
        <div className="grid grid-cols-2 gap-2">
          {BLOOD_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={`rounded-xl border py-3 text-lg font-bold transition ${
                value === t
                  ? 'border-rose-400 bg-rose-500 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:text-rose-600'
              }`}
            >
              {t}형
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-lg px-4 space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">혈액형 궁합</h1>
          <p className="text-sm text-gray-600">두 사람의 혈액형으로 성향 기반 궁합을 알아봐요.</p>
        </header>

        {/* 혈액형 선택 */}
        <div className="rounded-2xl border border-slate-100 bg-white/90 px-5 py-6 shadow-sm space-y-5">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <TypeSelector value={typeA} onChange={setTypeA} label="나의 혈액형" />
              <div className="space-y-1">
                <label className="text-xs text-slate-500">이름/호칭 <span className="text-slate-400">(선택)</span></label>
                <input
                  type="text"
                  placeholder="나"
                  value={labelA !== '나' ? labelA : ''}
                  onChange={(e) => setLabelA(e.target.value || '나')}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
            </div>
            <div className="space-y-3">
              <TypeSelector value={typeB} onChange={setTypeB} label="상대방 혈액형" />
              <div className="space-y-1">
                <label className="text-xs text-slate-500">이름/호칭 <span className="text-slate-400">(선택)</span></label>
                <input
                  type="text"
                  placeholder="상대방"
                  value={labelB !== '상대방' ? labelB : ''}
                  onChange={(e) => setLabelB(e.target.value || '상대방')}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                />
              </div>
            </div>
          </div>
          {typeA && typeB && (
            <div className="pt-1 text-center text-sm text-slate-500">
              {labelA}({typeA}형) × {labelB}({typeB}형)
            </div>
          )}
        </div>

        {/* 결과 */}
        {result && typeA && typeB && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-rose-100 bg-rose-50/40 px-5 py-6 space-y-4 shadow-sm text-center">
              <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${GRADE_STYLE[result.grade]}`}>
                {result.grade} 궁합
              </span>
              <ScoreRing score={result.score} />
              <p className="text-sm font-semibold text-slate-800">{result.summary}</p>
              <div className="h-2.5 w-full max-w-xs mx-auto rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${result.score >= 83 ? 'bg-amber-400' : result.score >= 72 ? 'bg-emerald-400' : result.score >= 62 ? 'bg-slate-400' : 'bg-rose-400'}`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/90 px-5 py-5 shadow-sm space-y-4">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">궁합 분석</p>
                <p className="text-sm leading-relaxed text-slate-700">{result.detail}</p>
              </div>
              <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 space-y-1">
                <p className="text-xs font-semibold text-amber-700">💡 관계 팁</p>
                <p className="text-sm leading-relaxed text-amber-900">{result.tip}</p>
              </div>
            </div>

            {/* 두 혈액형 특성 */}
            <div className="grid grid-cols-2 gap-3">
              {([{ type: typeA, label: labelA }, { type: typeB, label: labelB }] as Array<{ type: BloodType; label: string }>).map(({ type: t, label }) => (
                <div key={t} className="rounded-xl border border-slate-100 bg-white/80 px-3 py-3 space-y-1.5">
                  <p className="text-xs font-semibold text-rose-500">{label}</p>
                  <p className="text-base font-bold text-rose-600">{t}형</p>
                  <p className="text-xs font-semibold text-slate-600">{BLOOD_TRAITS[t].keyword}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{BLOOD_TRAITS[t].desc}</p>
                </div>
              ))}
            </div>

            <ShareLinkButton options={shareOptions} label="이 결과 공유하기 🔗" className="w-full py-3" />

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => navigateTo(ROUTE_PATHS.compatibility)}
                className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-indigo-900">사주 궁합</p>
                <p className="mt-0.5 text-xs text-indigo-700">오행 기반 4차원 분석</p>
              </button>
              <button
                type="button"
                onClick={() => navigateTo(ROUTE_PATHS.starSignCompatibility)}
                className="rounded-2xl border border-violet-100 bg-violet-50/60 px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-violet-900">별자리 궁합</p>
                <p className="mt-0.5 text-xs text-violet-700">12별자리 원소 기반 분석</p>
              </button>
            </div>
          </div>
        )}

        {/* 안내 */}
        {!result && (
          <div className="rounded-2xl border border-slate-100 bg-white/60 px-5 py-6 text-center text-sm text-slate-500">
            두 사람의 혈액형을 선택하면 궁합 결과가 나타나요.
          </div>
        )}

        <p className="text-center text-xs text-slate-400">
          혈액형 궁합은 재미로 보는 참고 정보예요. 실제 관계는 대화와 노력으로 만들어져요.
        </p>
      </div>
    </section>
  )
}
