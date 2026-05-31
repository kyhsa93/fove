import { JSX, useEffect, useMemo, useState } from 'react'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'
import { MBTI_DATA, MBTI_TYPES, getMbtiCompat } from '../lib/mbti/compatibility'
import type { MbtiRating } from '../lib/mbti/compatibility'
import { CompatShareCardButton } from '../components/ShareCard'
import { ShareLinkButton } from '../components/ShareLinkButton'

const RATING_LABEL: Record<MbtiRating, string> = {
  excellent: '최고 궁합',
  good: '좋은 궁합',
  moderate: '보통 궁합'
}

const RATING_COLOR: Record<MbtiRating, string> = {
  excellent: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  good: 'bg-sky-100 text-sky-700 border-sky-200',
  moderate: 'bg-slate-100 text-slate-600 border-slate-200'
}

const GROUP_COLORS: Record<string, string> = {
  '분석가': 'border-violet-200 bg-violet-50',
  '외교관': 'border-emerald-200 bg-emerald-50',
  '관리자': 'border-sky-200 bg-sky-50',
  '탐험가': 'border-amber-200 bg-amber-50'
}

const GROUP_BADGE: Record<string, string> = {
  '분석가': 'bg-violet-100 text-violet-700',
  '외교관': 'bg-emerald-100 text-emerald-700',
  '관리자': 'bg-sky-100 text-sky-700',
  '탐험가': 'bg-amber-100 text-amber-700'
}

const BAR_COLOR: Record<MbtiRating, string> = {
  excellent: 'bg-emerald-400',
  good: 'bg-sky-400',
  moderate: 'bg-amber-400'
}

const RATING_TEXT_COLOR: Record<MbtiRating, string> = {
  excellent: 'text-emerald-700 bg-emerald-100 border-emerald-200',
  good: 'text-sky-700 bg-sky-100 border-sky-200',
  moderate: 'text-slate-600 bg-slate-100 border-slate-200'
}

function MbtiCalculator() {
  const [typeA, setTypeA] = useState('')
  const [typeB, setTypeB] = useState('')

  const compat = useMemo(() => getMbtiCompat(typeA, typeB), [typeA, typeB])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const a = params.get('a')
    const b = params.get('b')
    if (a && MBTI_TYPES.includes(a)) setTypeA(a)
    if (b && MBTI_TYPES.includes(b)) setTypeB(b)
  }, [])

  const mbtiShareOptions = useMemo(() => ({
    title: typeA && typeB ? `${typeA} × ${typeB} MBTI 궁합 — Fove` : 'Fove MBTI 궁합',
    description: 'MBTI 16타입 궁합을 확인해보세요. 나와 잘 맞는 유형은?',
    url: `${typeof window !== 'undefined' ? window.location.origin : ''}${typeof window !== 'undefined' ? window.location.pathname : '/mbti/compatibility'}?a=${typeA}&b=${typeB}`,
  }), [typeA, typeB])

  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-6 space-y-5 shadow-sm">
      <div>
        <p className="text-base font-bold text-indigo-900 mb-1">MBTI 궁합 계산기</p>
        <p className="text-xs text-slate-500">두 사람의 MBTI를 선택하면 궁합을 바로 확인합니다.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {([
          { label: '나의 MBTI', value: typeA, setter: setTypeA },
          { label: '상대방 MBTI', value: typeB, setter: setTypeB }
        ] as Array<{ label: string; value: string; setter: (v: string) => void }>).map(({ label, value, setter }) => (
          <div key={label} className="space-y-1">
            <p className="text-xs font-medium text-slate-600">{label}</p>
            <select
              value={value}
              onChange={(e) => setter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">선택</option>
              {MBTI_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        ))}
      </div>

      {compat && typeA && typeB && (
        <div className="rounded-xl border border-white/80 bg-white/80 px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-bold text-slate-800">{typeA} × {typeB}</p>
            <span className={`text-xs font-semibold rounded-full border px-3 py-0.5 ${RATING_TEXT_COLOR[compat.rating]}`}>
              {RATING_LABEL[compat.rating]}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>궁합 점수</span>
              <span className="font-bold text-indigo-700 tabular-nums">{compat.score}점</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${BAR_COLOR[compat.rating]}`}
                style={{ width: `${compat.score}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{compat.reason}</p>
          {compat.reverse && (
            <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">{compat.reverse}</p>
          )}
          <div className="flex gap-2">
            <CompatShareCardButton data={{
              kind: 'mbti',
              typeLabel: 'MBTI 궁합',
              labelA: typeA,
              labelB: typeB,
              totalScore: compat.score,
              summary: compat.reason,
              ratingLabel: RATING_LABEL[compat.rating],
            }} />
            <ShareLinkButton options={mbtiShareOptions} label="공유하기 🔗" className="flex-1 py-2 text-xs" />
          </div>
        </div>
      )}

      {typeA === typeB && typeA !== '' && (
        <p className="text-sm text-slate-500 text-center">같은 MBTI끼리는 다른 타입을 선택해보세요.</p>
      )}
    </div>
  )
}

export default function MbtiCompatibilityPage(): JSX.Element {
  useEffect(() => {
    document.title = 'MBTI 16타입 궁합 매트릭스 — 나와 맞는 유형은? | Fove'
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    const desc = 'MBTI 16타입별 연애 궁합을 확인하세요. INTJ, ENFP, INFJ, ENTP 등 각 유형의 최고 궁합과 연애 스타일을 분석합니다.'
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', 'MBTI 16타입 궁합 매트릭스 — Fove')
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[name="twitter:title"]', 'MBTI 16타입 궁합 매트릭스 — Fove')
    setMeta('meta[name="twitter:description"]', desc)
    setMeta('meta[property="og:image"]', `${typeof window !== 'undefined' ? window.location.origin : ''}/social-card.png`)
    setMeta('meta[name="twitter:image"]', `${typeof window !== 'undefined' ? window.location.origin : ''}/social-card.png`)
  }, [])

  const groups = ['분석가', '외교관', '관리자', '탐험가']

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-4xl px-4 space-y-10">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-gray-900">MBTI 16타입 궁합 매트릭스</h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            MBTI 유형별 연애 궁합과 스타일을 분석합니다. 인지 기능의 상호보완성을 바탕으로 최고 궁합·좋은 궁합을 정리했습니다. 참고 자료로 활용하되, 실제 관계는 두 사람의 노력이 더 중요합니다.
          </p>
        </header>

        <MbtiCalculator />

        {groups.map((group) => {
          const types = MBTI_DATA.filter((t) => t.group === group)
          return (
            <section key={group} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className={`text-sm font-semibold rounded-full px-3 py-0.5 ${GROUP_BADGE[group]}`}>{group}</span>
                {group} 유형 궁합
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {types.map((data) => (
                  <article key={data.type} className={`rounded-2xl border px-5 py-5 space-y-4 ${GROUP_COLORS[data.group]}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">{data.type}</span>
                        <span className="text-sm text-gray-600">— {data.nickname}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{data.loveStyle}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">추천 궁합</p>
                      {data.matches.map((match) => (
                        <div key={match.type} className="rounded-xl bg-white/70 border border-white px-3 py-2.5 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900">{match.type}</span>
                            <span className={`text-[10px] font-semibold rounded-full border px-2 py-0.5 ${RATING_COLOR[match.rating as MbtiRating]}`}>
                              {RATING_LABEL[match.rating as MbtiRating]}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{match.reason}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}

        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-6 space-y-3">
          <h2 className="text-base font-semibold text-indigo-900">직접 궁합 점수 확인하기</h2>
          <p className="text-sm text-indigo-700 leading-relaxed">
            사주 오행과 MBTI를 함께 분석하면 더 입체적인 관계 분석이 가능합니다.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.combinedCompatibility)}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition shadow-sm"
            >
              사주+MBTI 통합 궁합
            </button>
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.compatibility)}
              className="rounded-full border border-indigo-200 bg-white px-5 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition"
            >
              사주 궁합 보기
            </button>
          </div>
        </section>
      </div>
    </section>
  )
}
