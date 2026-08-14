import { JSX, useCallback, useEffect, useMemo, useState } from 'react'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'
import { ShareLinkButton } from '../components/ShareLinkButton'
import { ScoreBar } from '../components/ScoreBar'
import { getCompatParams } from '../lib/compatParams'
import type { Branch } from '../lib/saju/constants'
import { BRANCHES, BRANCH_ANIMALS, BRANCH_HARMONIES, BRANCH_CONFLICTS } from '../lib/saju/constants'

type CompatType = 'love' | 'friend' | 'work'

const COMPAT_LABELS: Record<CompatType, string> = {
  love: '연인 궁합',
  friend: '친구 궁합',
  work: '직장 궁합'
}

const TRIAD_GROUPS: Branch[][] = [
  ['자', '진', '신'],
  ['축', '사', '유'],
  ['인', '오', '술'],
  ['묘', '미', '해'],
]

function isTriad(a: Branch, b: Branch): boolean {
  return TRIAD_GROUPS.some((g) => g.includes(a) && g.includes(b))
}

function isSixHarmony(a: Branch, b: Branch): boolean {
  return BRANCH_HARMONIES[a] === b
}

function isClash(a: Branch, b: Branch): boolean {
  return BRANCH_CONFLICTS[a] === b
}

type ZodiacRelation = 'triad' | 'harmony' | 'same' | 'clash' | 'neutral'

function getZodiacRelation(a: Branch, b: Branch): ZodiacRelation {
  if (a === b) return 'same'
  if (isTriad(a, b)) return 'triad'
  if (isSixHarmony(a, b)) return 'harmony'
  if (isClash(a, b)) return 'clash'
  return 'neutral'
}

const BASE_SCORE: Record<ZodiacRelation, number> = {
  triad: 92,
  harmony: 83,
  same: 68,
  neutral: 65,
  clash: 50
}

const TYPE_MOD: Record<ZodiacRelation, Record<CompatType, number>> = {
  triad: { love: 3, friend: 2, work: 1 },
  harmony: { love: 5, friend: 3, work: 2 },
  same: { love: 2, friend: 3, work: 2 },
  neutral: { love: 0, friend: 2, work: 3 },
  clash: { love: -3, friend: -2, work: -2 }
}

function clamp(v: number) {
  return Math.min(99, Math.max(40, Math.round(v)))
}

function calcZodiacScore(a: Branch, b: Branch, type: CompatType): number {
  const rel = getZodiacRelation(a, b)
  return clamp(BASE_SCORE[rel] + TYPE_MOD[rel][type])
}

const RELATION_LABEL: Record<ZodiacRelation, string> = {
  triad: '삼합 — 최고 궁합',
  harmony: '육합 — 좋은 궁합',
  same: '동일 띠',
  neutral: '보통 궁합',
  clash: '충(冲) — 주의 필요'
}

const RELATION_COLOR: Record<ZodiacRelation, string> = {
  triad: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  harmony: 'bg-sky-100 text-sky-700 border-sky-200',
  same: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  neutral: 'bg-slate-100 text-slate-600 border-slate-200',
  clash: 'bg-rose-100 text-rose-700 border-rose-200'
}

const RELATION_BAR: Record<ZodiacRelation, string> = {
  triad: 'bg-emerald-400',
  harmony: 'bg-sky-400',
  same: 'bg-indigo-400',
  neutral: 'bg-amber-400',
  clash: 'bg-rose-400'
}

const COMMENTS: Record<ZodiacRelation, Record<CompatType, { high: string; low: string }>> = {
  triad: {
    love: {
      high: '삼합의 기운으로 두 사람은 자연스럽게 하나가 됩니다. 서로를 향한 끌림이 강하고 함께할수록 빛납니다.',
      low: '삼합 에너지가 있어 기본 친화력은 높습니다. 서로의 다름을 인정하면 더 빛날 수 있습니다.'
    },
    friend: {
      high: '삼합으로 연결된 인연은 자연스럽게 깊어집니다. 오래 함께할수록 강해지는 우정입니다.',
      low: '삼합 에너지가 좋은 기반을 만들어줍니다. 적극적으로 시간을 보내면 깊은 우정으로 이어집니다.'
    },
    work: {
      high: '삼합 에너지로 팀 시너지가 뛰어납니다. 각자의 강점을 살리면 탁월한 결과를 냅니다.',
      low: '기본 협력 에너지가 좋습니다. 역할을 명확히 하면 더 좋은 성과를 낼 수 있습니다.'
    }
  },
  harmony: {
    love: {
      high: '육합의 기운이 흘러 감정적 교감이 자연스럽습니다. 함께 있으면 편안하고 따뜻합니다.',
      low: '육합 에너지가 있어 친밀감 형성이 쉽습니다. 서로를 이해하는 노력으로 더 깊어집니다.'
    },
    friend: {
      high: '육합으로 이어진 인연은 서로를 보완합니다. 다른 듯 잘 맞는 사이입니다.',
      low: '좋은 에너지가 흐릅니다. 공통 관심사를 찾으면 더 가깝게 지낼 수 있습니다.'
    },
    work: {
      high: '육합 에너지로 협력이 원활합니다. 서로의 강점이 잘 맞물립니다.',
      low: '협업 기반이 좋습니다. 소통을 자주 하면 더 효율적인 팀이 됩니다.'
    }
  },
  same: {
    love: {
      high: '같은 띠로 서로를 깊이 이해합니다. 공감대가 넓어 대화가 편합니다.',
      low: '비슷한 만큼 이해가 쉬운 관계입니다. 서로 다른 면을 발견하며 성장해보세요.'
    },
    friend: {
      high: '같은 에너지를 가진 사이로 공통점이 많습니다. 편안하고 오래가는 우정입니다.',
      low: '공통점이 많아 금방 친해집니다. 서로의 다름도 인정하면 더 풍성한 관계가 됩니다.'
    },
    work: {
      high: '같은 방향성으로 협력이 원활합니다. 명확한 역할 분담으로 시너지를 내세요.',
      low: '비슷한 스타일로 협업이 편합니다. 다양한 시각을 보완하면 더 좋습니다.'
    }
  },
  neutral: {
    love: {
      high: '특별한 에너지 충돌 없이 안정적입니다. 서로를 알아가는 과정이 관계를 만듭니다.',
      low: '보통의 인연이지만 노력으로 좋은 관계를 만들 수 있습니다.'
    },
    friend: {
      high: '무난하게 어울릴 수 있는 사이입니다. 공통 관심사를 찾으면 좋은 친구가 됩니다.',
      low: '처음엔 낯설 수 있지만 서로를 알아갈수록 의외의 공통점을 발견합니다.'
    },
    work: {
      high: '안정적인 협업이 가능합니다. 명확한 역할로 효율을 높이세요.',
      low: '기본 협력은 됩니다. 적극적인 소통으로 업무 효율을 높일 수 있습니다.'
    }
  },
  clash: {
    love: {
      high: '충(冲)의 에너지로 강렬한 감정이 오갑니다. 갈등도 있지만 그만큼 열정도 강합니다.',
      low: '기운이 충돌할 수 있어 감정 조절이 중요합니다. 차분한 대화로 관계를 쌓아가세요.'
    },
    friend: {
      high: '의견 충돌이 있을 수 있지만 성장 자극이 됩니다. 서로 다름을 인정하면 단단해집니다.',
      low: '기운 충돌로 마찰이 생길 수 있습니다. 서로의 장점을 보려는 노력이 필요합니다.'
    },
    work: {
      high: '긴장감이 높은 품질을 만들 수 있습니다. 명확한 역할 분담이 갈등을 줄입니다.',
      low: '업무 스타일 충돌이 있을 수 있습니다. 규칙을 먼저 정하고 협업하세요.'
    }
  }
}

function getComment(rel: ZodiacRelation, type: CompatType, score: number): string {
  return score >= 70 ? COMMENTS[rel][type].high : COMMENTS[rel][type].low
}

function yearToBranch(year: number): Branch {
  const idx = ((year - 2020) % 12 + 12 * 100) % 12
  return BRANCHES[idx]
}

export default function ZodiacCompatPage(): JSX.Element {
  const initial = useMemo(() => getCompatParams(), [])

  const [yearA, setYearA] = useState(initial.a)
  const [yearB, setYearB] = useState(initial.b)
  const [nameA, setNameA] = useState('나')
  const [nameB, setNameB] = useState('상대방')
  const [activeType, setActiveType] = useState<CompatType>(initial.type as CompatType)
  const [checked, setChecked] = useState(() => initial.a.length === 4 && initial.b.length === 4)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    document.title = '띠 궁합 — 12간지 궁합 보기 | Fove'
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    setMeta('meta[name="description"]', '쥐띠·소띠·호랑이띠 등 12간지 띠별 궁합을 확인하세요. 삼합·육합·충 기반으로 연인·친구·직장 궁합을 분석합니다.')
    setMeta('meta[property="og:title"]', '띠 궁합 — 12간지 궁합 보기 | Fove')
    setMeta('meta[property="og:image"]', `${typeof window !== 'undefined' ? window.location.origin : ''}/social-card.png`)
    setMeta('meta[name="twitter:image"]', `${typeof window !== 'undefined' ? window.location.origin : ''}/social-card.png`)
  }, [])

  const branchA = useMemo(() => {
    const y = parseInt(yearA)
    return !isNaN(y) && y >= 1900 && y <= 2100 ? yearToBranch(y) : null
  }, [yearA])

  const branchB = useMemo(() => {
    const y = parseInt(yearB)
    return !isNaN(y) && y >= 1900 && y <= 2100 ? yearToBranch(y) : null
  }, [yearB])

  const relation = useMemo(
    () => (checked && branchA && branchB ? getZodiacRelation(branchA, branchB) : null),
    [checked, branchA, branchB]
  )

  const score = useMemo(
    () => (relation && branchA && branchB ? calcZodiacScore(branchA, branchB, activeType) : null),
    [relation, branchA, branchB, activeType]
  )

  useEffect(() => {
    if (isCalculating && score !== null) setIsCalculating(false)
  }, [isCalculating, score])

  const handleCheck = () => {
    if (branchA && branchB) {
      setIsCalculating(true)
      setChecked(true)
    }
  }

  const zodiacShareOptions = useMemo(() => {
    const base = `${typeof window !== 'undefined' ? window.location.origin : ''}${typeof window !== 'undefined' ? window.location.pathname : '/zodiac/compatibility'}`
    return {
      title: branchA && branchB ? `${BRANCH_ANIMALS[branchA]}띠 × ${BRANCH_ANIMALS[branchB]}띠 궁합 — Fove` : 'Fove 띠 궁합',
      description: '12간지 띠 궁합을 삼합·육합·충 기반으로 분석해보세요!',
      url: `${base}?a=${yearA}&b=${yearB}&type=${activeType}`,
    }
  }, [yearA, yearB, activeType, branchA, branchB])

  const animalLabel = (branch: Branch | null) =>
    branch ? `${BRANCH_ANIMALS[branch]}띠` : '—'

  const currentYear = new Date().getFullYear()

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-xl px-4 space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">띠 궁합</h1>
          <p className="text-sm text-gray-600">12간지 삼합·육합·충 원리로 두 사람의 띠 궁합을 분석합니다.</p>
        </header>

        <div className="rounded-2xl border border-slate-100 bg-white/90 px-5 py-6 space-y-4 shadow-sm">
          {([
            { year: yearA, setYear: setYearA, name: nameA, setName: setNameA, defaultName: '나' },
            { year: yearB, setYear: setYearB, name: nameB, setName: setNameB, defaultName: '상대방' }
          ] as Array<{
            year: string; setYear: (v: string) => void
            name: string; setName: (v: string) => void
            defaultName: string
          }>).map(({ year, setYear, name, setName, defaultName }, idx) => {
            const parsed = parseInt(year)
            const branch = !isNaN(parsed) && parsed >= 1900 && parsed <= 2100 ? yearToBranch(parsed) : null
            return (
              <div key={idx} className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">{name}</p>
                  {branch && (
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5">
                      {BRANCH_ANIMALS[branch]}띠
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">출생 연도</label>
                    <input
                      type="number"
                      min={1900}
                      max={currentYear}
                      placeholder="예) 1995"
                      value={year}
                      onChange={(e) => { setYear(e.target.value); setChecked(false) }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500">이름/호칭 <span className="text-slate-400">(선택)</span></label>
                    <input
                      type="text"
                      placeholder={defaultName}
                      value={name !== defaultName ? name : ''}
                      onChange={(e) => setName(e.target.value || defaultName)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                  </div>
                </div>
              </div>
            )
          })}

          <div className="flex gap-2 flex-wrap">
            {(Object.keys(COMPAT_LABELS) as CompatType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setActiveType(t); setChecked(false) }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
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
            disabled={!branchA || !branchB || isCalculating}
            className="w-full rounded-2xl bg-indigo-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isCalculating ? '계산 중...' : '띠 궁합 확인하기'}
          </button>

          <p className="text-xs text-slate-400 text-center">
            * 입춘(2월 4일 전후) 이전 출생은 전년도 띠에 해당할 수 있습니다.
          </p>
        </div>

        {isCalculating && (
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 px-5 py-8 text-center text-sm text-indigo-500">
            궁합을 계산하고 있어요...
          </div>
        )}

        {!isCalculating && checked && relation && score !== null && branchA && branchB ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-6 space-y-4 shadow-sm">
              <div className="text-center space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  {COMPAT_LABELS[activeType]} 결과
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-bold text-slate-800">{animalLabel(branchA)}</span>
                  <span className="text-slate-400">×</span>
                  <span className="text-2xl font-bold text-slate-800">{animalLabel(branchB)}</span>
                </div>
                <p className="text-5xl font-bold text-indigo-900 tabular-nums">
                  {score}<span className="text-xl font-normal ml-1">점</span>
                </p>
                <ScoreBar score={score} colorClass={RELATION_BAR[relation]} className="h-2.5 max-w-xs mx-auto" />
                <span className={`inline-block text-xs font-semibold rounded-full border px-3 py-0.5 ${RELATION_COLOR[relation]}`}>
                  {RELATION_LABEL[relation]}
                </span>
              </div>

              <div className="rounded-xl border border-white/80 bg-white/70 px-4 py-4 space-y-1">
                <p className="text-xs font-semibold text-slate-500">해석</p>
                <p className="text-sm leading-relaxed text-slate-700">
                  {getComment(relation, activeType, score)}
                </p>
              </div>

              {(relation === 'triad' || relation === 'harmony') && (
                <div className="rounded-xl border border-indigo-50 bg-white/50 px-4 py-3 space-y-1">
                  <p className="text-xs font-semibold text-indigo-400">
                    {relation === 'triad' ? '삼합(三合)이란?' : '육합(六合)이란?'}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {relation === 'triad'
                      ? '삼합은 세 가지 띠가 하나의 오행 기운으로 합쳐지는 관계입니다. 자·진·신은 수(水), 축·사·유는 금(金), 인·오·술은 화(火), 묘·미·해는 목(木)으로 합화(合化)합니다.'
                      : '육합은 두 지지가 음양 짝을 이루어 화합하는 관계입니다. 자·축, 인·해, 묘·술, 진·유, 사·신, 오·미가 각각 육합을 이룹니다.'}
                  </p>
                </div>
              )}
              {relation === 'clash' && (
                <div className="rounded-xl border border-rose-50 bg-white/50 px-4 py-3 space-y-1">
                  <p className="text-xs font-semibold text-rose-400">충(冲)이란?</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    충은 서로 정반대 방향의 기운이 부딪히는 관계입니다. 갈등과 변화를 일으킬 수 있지만, 서로 다름을 인정하면 강한 자극이 되기도 합니다.
                  </p>
                </div>
              )}

              <ShareLinkButton options={zodiacShareOptions} label="이 결과 공유하기 🔗" className="w-full py-3" />
            </div>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-100 bg-white/90 px-5 py-5 space-y-3 shadow-sm">
          <p className="text-sm font-semibold text-slate-700">삼합 그룹 — 최고 궁합 조합</p>
          <div className="grid grid-cols-2 gap-2">
            {TRIAD_GROUPS.map((group) => (
              <div key={group.join('')} className="rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2 text-center">
                <p className="text-sm font-semibold text-emerald-700">
                  {group.map((b) => BRANCH_ANIMALS[b] + '띠').join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.compatibility)}
            className="flex-1 rounded-full bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 transition"
          >
            사주 궁합 보기
          </button>
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.mbtiCompatibility)}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            MBTI 궁합 보기
          </button>
        </div>
      </div>
    </section>
  )
}
