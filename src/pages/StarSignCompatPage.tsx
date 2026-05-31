import { JSX, useEffect, useMemo, useState } from 'react'
import { STAR_SIGNS, STAR_SIGN_INFO, getStarCompat } from '../data/starSignCompat'
import type { StarSign } from '../data/starSignCompat'
import { ShareLinkButton } from '../components/ShareLinkButton'

const GRADE_STYLE = {
  '환상': 'text-amber-700 bg-amber-50 border-amber-200',
  '좋음': 'text-emerald-700 bg-emerald-50 border-emerald-200',
  '보통': 'text-slate-600 bg-slate-50 border-slate-200',
  '도전': 'text-rose-600 bg-rose-50 border-rose-200',
}

const ELEMENT_COLOR: Record<string, string> = {
  '불': 'text-rose-600 bg-rose-50 border-rose-200',
  '흙': 'text-amber-700 bg-amber-50 border-amber-200',
  '바람': 'text-sky-600 bg-sky-50 border-sky-200',
  '물': 'text-indigo-600 bg-indigo-50 border-indigo-200',
}

function getInitial(): { a: StarSign | ''; b: StarSign | '' } {
  if (typeof window === 'undefined') return { a: '', b: '' }
  const p = new URLSearchParams(window.location.search)
  const a = p.get('a') as StarSign | null
  const b = p.get('b') as StarSign | null
  return {
    a: STAR_SIGNS.includes(a as StarSign) ? (a as StarSign) : '',
    b: STAR_SIGNS.includes(b as StarSign) ? (b as StarSign) : '',
  }
}

export default function StarSignCompatPage(): JSX.Element {
  const init = useMemo(() => getInitial(), [])
  const [signA, setSignA] = useState<StarSign | ''>(init.a)
  const [signB, setSignB] = useState<StarSign | ''>(init.b)

  const result = useMemo(
    () => (signA && signB ? getStarCompat(signA as StarSign, signB as StarSign) : null),
    [signA, signB]
  )

  useEffect(() => {
    const nameA = signA ? STAR_SIGN_INFO[signA as StarSign].name : ''
    const nameB = signB ? STAR_SIGN_INFO[signB as StarSign].name : ''
    document.title = nameA && nameB
      ? `${nameA} × ${nameB} 별자리 궁합 — Fove`
      : '별자리 궁합 — Fove'
  }, [signA, signB])

  const shareOptions = useMemo(() => {
    const nameA = signA ? STAR_SIGN_INFO[signA as StarSign].name : ''
    const nameB = signB ? STAR_SIGN_INFO[signB as StarSign].name : ''
    return {
      title: nameA && nameB ? `${nameA} × ${nameB} 별자리 궁합 ${result?.score ?? ''}점 — Fove` : 'Fove 별자리 궁합',
      description: result ? `${result.grade} 궁합! ${result.elementRelation}` : '내 별자리 궁합을 확인해보세요.',
      url: `${typeof window !== 'undefined' ? window.location.origin : ''}${typeof window !== 'undefined' ? window.location.pathname : '/starsign-compatibility'}${signA && signB ? `?a=${signA}&b=${signB}` : ''}`,
    }
  }, [signA, signB, result])

  function SignGrid({ value, onChange, label }: { value: StarSign | ''; onChange: (v: StarSign) => void; label: string }) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
          {STAR_SIGNS.map((s) => {
            const info = STAR_SIGN_INFO[s]
            const elColor = ELEMENT_COLOR[info.element]
            return (
              <button
                key={s}
                type="button"
                onClick={() => onChange(s)}
                className={`rounded-xl border py-2 text-center transition ${
                  value === s ? elColor + ' ring-2 ring-offset-1 ring-current shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <p className="text-base">{info.emoji}</p>
                <p className="text-[10px] font-medium text-inherit leading-tight mt-0.5 truncate px-0.5">{info.name.replace('자리', '')}</p>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-2xl px-4 space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">별자리 궁합</h1>
          <p className="text-sm text-gray-600">12별자리의 원소 에너지로 두 사람의 궁합을 알아봐요.</p>
        </header>

        {/* 별자리 선택 */}
        <div className="rounded-2xl border border-slate-100 bg-white/90 px-5 py-6 shadow-sm space-y-5">
          <SignGrid value={signA} onChange={setSignA} label="나의 별자리" />
          <SignGrid value={signB} onChange={setSignB} label="상대방 별자리" />
        </div>

        {/* 결과 */}
        {result && signA && signB && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-violet-100 bg-violet-50/40 px-5 py-6 space-y-3 shadow-sm text-center">
              <div className="flex items-center justify-center gap-3 text-2xl">
                <span>{STAR_SIGN_INFO[signA as StarSign].emoji}</span>
                <span className="text-slate-300 text-xl">×</span>
                <span>{STAR_SIGN_INFO[signB as StarSign].emoji}</span>
              </div>
              <p className="text-sm text-slate-500">{result.elementRelation}</p>
              <p className={`text-7xl font-bold tabular-nums ${result.score >= 83 ? 'text-amber-500' : result.score >= 72 ? 'text-emerald-500' : result.score >= 62 ? 'text-slate-500' : 'text-rose-500'}`}>
                {result.score}
              </p>
              <p className="text-sm text-slate-500">점</p>
              <span className={`inline-block rounded-full border px-3 py-1 text-xs font-bold ${GRADE_STYLE[result.grade]}`}>
                {result.grade} 궁합
              </span>
              <div className="h-2.5 w-full max-w-xs mx-auto rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${result.score >= 83 ? 'bg-amber-400' : result.score >= 72 ? 'bg-emerald-400' : result.score >= 62 ? 'bg-slate-400' : 'bg-rose-400'}`}
                  style={{ width: `${result.score}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white/90 px-5 py-5 shadow-sm space-y-4">
              <p className="text-sm leading-relaxed text-slate-700">{result.detail}</p>
              <div className="rounded-xl bg-violet-50 border border-violet-100 px-4 py-3 space-y-1">
                <p className="text-xs font-semibold text-violet-700">💡 관계 팁</p>
                <p className="text-sm leading-relaxed text-violet-900">{result.tip}</p>
              </div>
            </div>

            {/* 두 별자리 정보 */}
            <div className="grid sm:grid-cols-2 gap-3">
              {([signA, signB] as StarSign[]).map((s) => {
                const info = STAR_SIGN_INFO[s]
                return (
                  <div key={s} className={`rounded-xl border px-4 py-3 space-y-1.5 ${ELEMENT_COLOR[info.element]}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{info.emoji}</span>
                      <div>
                        <p className="text-sm font-bold">{info.name}</p>
                        <p className="text-[10px] opacity-70">{info.period} · {info.element} 원소</p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold opacity-80">{info.keyword}</p>
                    <p className="text-xs leading-relaxed opacity-70">{info.desc}</p>
                  </div>
                )
              })}
            </div>

            <ShareLinkButton options={shareOptions} label="이 결과 공유하기 🔗" className="w-full py-3" />
          </div>
        )}

        {!result && (
          <div className="rounded-2xl border border-slate-100 bg-white/60 px-5 py-6 text-center text-sm text-slate-500">
            두 사람의 별자리를 선택하면 궁합 결과가 나타나요.
          </div>
        )}

        <p className="text-center text-xs text-slate-400">
          별자리 궁합은 서양 점성술 기반 재미 정보예요. 실제 인연은 서로의 노력이 더 중요해요.
        </p>
      </div>
    </section>
  )
}
