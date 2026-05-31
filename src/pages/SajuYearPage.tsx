import { JSX, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  STEMS,
  BRANCHES,
  STEM_ELEMENTS,
  BRANCH_ANIMALS,
  ELEMENT_LABELS,
  TEMPERAMENT_BY_ELEMENT,
  CAREER_BY_ELEMENT,
  WEALTH_FOCUS_BY_ELEMENT,
  HEALTH_TIPS_BY_ELEMENT,
  ELEMENT_KEYWORDS
} from '../lib/saju/constants'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'

const BRANCH_TO_SLUG: Record<string, string> = {
  자: 'rat', 축: 'ox', 인: 'tiger', 묘: 'rabbit',
  진: 'dragon', 사: 'snake', 오: 'horse', 미: 'goat',
  신: 'monkey', 유: 'rooster', 술: 'dog', 해: 'pig'
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

function getYearPillar(year: number) {
  const stemIndex = mod(year - 4, STEMS.length)
  const branchIndex = mod(year - 4, BRANCHES.length)
  const stem = STEMS[stemIndex]
  const branch = BRANCHES[branchIndex]
  const element = STEM_ELEMENTS[stem]
  const animal = BRANCH_ANIMALS[branch]
  return { stem, branch, element, animal }
}

export default function SajuYearPage(): JSX.Element {
  const { year: yearParam } = useParams<{ year: string }>()
  const year = useMemo(() => {
    if (!yearParam) return null
    const n = parseInt(yearParam, 10)
    if (isNaN(n) || n < 1900 || n > 2100) return null
    return n
  }, [yearParam])
  const pillar = useMemo(() => (year ? getYearPillar(year) : null), [year])

  useEffect(() => {
    if (!year || !pillar) return
    const animalName = pillar.animal
    const elementLabel = ELEMENT_LABELS[pillar.element]
    document.title = `${year}년생 사주 특성 · ${animalName}띠 ${elementLabel} 기운 — Fove`
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    const desc = `${year}년생(${animalName}띠)의 사주 특성을 확인하세요. ${pillar.stem}${pillar.branch}년, ${elementLabel} 기운의 성향, 직업, 재물, 건강 분석을 제공합니다.`
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', `${year}년생 사주 특성 — Fove`)
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[property="og:image"]', 'https://kyhsa93.github.io/fove/social-card.png')
    setMeta('meta[name="twitter:image"]', 'https://kyhsa93.github.io/fove/social-card.png')
  }, [year, pillar])

  if (!year || !pillar) {
    return (
      <section className="py-6 sm:py-8">
        <div className="mx-auto max-w-2xl px-4 space-y-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">생년을 찾을 수 없습니다</h1>
          <p className="text-sm text-gray-600">URL 형식: /saju/1993 (1900~2100 사이)</p>
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.saju)}
            className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition"
          >
            사주 풀이 바로가기
          </button>
        </div>
      </section>
    )
  }

  const { stem, branch, element, animal } = pillar
  const elementLabel = ELEMENT_LABELS[element]
  const keywords = ELEMENT_KEYWORDS[element]

  const nearbyYears = [-2, -1, 0, 1, 2]
    .map((offset) => year + offset * 12)
    .filter((y) => y >= 1900 && y <= 2100)

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-2xl px-4 space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">생년별 사주 특성</p>
          <h1 className="text-3xl font-bold text-gray-900">{year}년생 · {animal}띠</h1>
          <p className="text-base text-gray-600">{stem}{branch}년 · {elementLabel} 기운</p>
        </header>

        <div className="rounded-2xl border border-amber-100 bg-amber-50/60 px-5 py-5 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">기본 사주 정보</p>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
            <div className="space-y-0.5">
              <dt className="text-xs text-amber-600">연주(年柱)</dt>
              <dd className="font-bold text-amber-900 text-base">{stem}{branch}</dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-xs text-amber-600">오행</dt>
              <dd className="font-bold text-amber-900 text-base">{elementLabel}</dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-xs text-amber-600">띠</dt>
              <dd className="font-bold text-amber-900 text-base">{animal}</dd>
            </div>
            <div className="space-y-0.5">
              <dt className="text-xs text-amber-600">천간</dt>
              <dd className="font-bold text-amber-900 text-base">{stem}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {keywords.map((kw) => (
              <span key={kw} className="text-xs rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 text-amber-800">{kw}</span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{year}년생 성향 분석</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: '기본 성향', value: TEMPERAMENT_BY_ELEMENT[element], color: 'border-amber-100 bg-amber-50/40 text-amber-600' },
              { label: '직업·적성', value: CAREER_BY_ELEMENT[element], color: 'border-blue-100 bg-blue-50/40 text-blue-600' },
              { label: '재물 성향', value: WEALTH_FOCUS_BY_ELEMENT[element], color: 'border-emerald-100 bg-emerald-50/40 text-emerald-600' },
              { label: '건강 포인트', value: HEALTH_TIPS_BY_ELEMENT[element], color: 'border-rose-100 bg-rose-50/40 text-rose-600' }
            ].map(({ label, value, color }) => (
              <div key={label} className={`rounded-xl border px-4 py-4 space-y-1.5`} style={{}}>
                <p className={`text-xs font-semibold ${color.split(' ')[2]}`}>{label}</p>
                <p className="text-sm leading-relaxed text-slate-700">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">같은 띠 다른 해</h2>
          <div className="flex flex-wrap gap-2">
            {nearbyYears.map((y) => {
              const p = getYearPillar(y)
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => {
                    window.history.pushState({}, '', `/saju/${y}`)
                    window.dispatchEvent(new PopStateEvent('popstate'))
                    window.scrollTo({ top: 0 })
                  }}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    y === year
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:text-amber-700'
                  }`}
                >
                  {y}년 ({p.animal}띠)
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.saju)}
            className="flex-1 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-amber-600 transition"
          >
            내 사주 풀이 보기
          </button>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.history.pushState({}, '', `/zodiac/${BRANCH_TO_SLUG[branch]}`)
                window.dispatchEvent(new PopStateEvent('popstate'))
              }
            }}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            {animal}띠 운세 보기
          </button>
        </div>
      </div>
    </section>
  )
}
