import { JSX, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'
import {
  BRANCH_ANIMALS,
  BRANCH_ELEMENTS,
  BRANCH_YINYANG,
  ELEMENT_LABELS,
  RELATIONSHIP_BY_ANIMAL,
  TEMPERAMENT_BY_ELEMENT,
  CAREER_BY_ELEMENT,
  HEALTH_TIPS_BY_ELEMENT,
  WEALTH_FOCUS_BY_ELEMENT,
  BRANCHES
} from '../lib/saju/constants'
import type { Branch, Element } from '../lib/saju/constants'

const SLUG_TO_BRANCH: Record<string, Branch> = {
  rat: '자', ox: '축', tiger: '인', rabbit: '묘',
  dragon: '진', snake: '사', horse: '오', goat: '미',
  monkey: '신', rooster: '유', dog: '술', pig: '해'
}

const BRANCH_TO_SLUG: Record<Branch, string> = Object.fromEntries(
  Object.entries(SLUG_TO_BRANCH).map(([slug, branch]) => [branch, slug])
) as Record<Branch, string>

// 띠별 년도 나머지 (2020은 쥐띠, 2020 % 12 = 4)
const BRANCH_YEAR_MOD: Record<Branch, number> = {
  자: 4, 축: 5, 인: 6, 묘: 7, 진: 8, 사: 9,
  오: 10, 미: 11, 신: 0, 유: 1, 술: 2, 해: 3
}

const ELEMENT_COLOR: Record<Element, string> = {
  목: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  화: 'border-rose-200 bg-rose-50 text-rose-900',
  토: 'border-amber-200 bg-amber-50 text-amber-900',
  금: 'border-slate-200 bg-slate-100 text-slate-800',
  수: 'border-blue-200 bg-blue-50 text-blue-900'
}

const ELEMENT_BADGE: Record<Element, string> = {
  목: 'bg-emerald-100 text-emerald-800',
  화: 'bg-rose-100 text-rose-800',
  토: 'bg-amber-100 text-amber-800',
  금: 'bg-slate-100 text-slate-700',
  수: 'bg-blue-100 text-blue-800'
}

function getBirthYears(branch: Branch): number[] {
  const mod = BRANCH_YEAR_MOD[branch]
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let y = currentYear + 12; y >= 1924; y -= 12) {
    if (y % 12 === mod) {
      years.push(y)
    }
  }
  return years.filter((y) => y <= currentYear + 12).slice(0, 8)
}

function ZodiacAnimalCard({ branch, onClick }: { branch: Branch; onClick: () => void }): JSX.Element {
  const animal = BRANCH_ANIMALS[branch]
  const element = BRANCH_ELEMENTS[branch]
  const elementLabel = ELEMENT_LABELS[element]
  const yinyang = BRANCH_YINYANG[branch]
  const recentYear = getBirthYears(branch)[0]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-4 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 space-y-2 ${ELEMENT_COLOR[element]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{animal}</span>
        <span className="text-xs font-medium text-slate-500">{branch}</span>
      </div>
      <div className="flex gap-1.5 flex-wrap">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ELEMENT_BADGE[element]}`}>{elementLabel}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{yinyang}</span>
      </div>
      <p className="text-xs text-slate-500">{recentYear}년생 포함</p>
    </button>
  )
}

function ZodiacOverview({ navigateToZodiac }: { navigateToZodiac: (slug?: string) => void }): JSX.Element {
  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-2xl space-y-8 px-4">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">띠별 운세</h1>
          <p className="text-sm text-gray-600">
            12간지 띠별 기질·관계·직업·건강 특성을 확인하세요.
          </p>
        </header>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {BRANCHES.map((branch) => (
            <ZodiacAnimalCard
              key={branch}
              branch={branch}
              onClick={() => navigateToZodiac(BRANCH_TO_SLUG[branch])}
            />
          ))}
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.fortune)}
            className="flex-1 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-amber-600"
          >
            오늘의 운세 보기
          </button>
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.zodiacCompatibility)}
            className="flex-1 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-600"
          >
            띠 궁합 보기
          </button>
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.saju)}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            사주 풀이 보기
          </button>
        </div>
      </div>
    </section>
  )
}

function ZodiacDetail({ branch, navigateToZodiac }: { branch: Branch; navigateToZodiac: (slug?: string) => void }): JSX.Element {
  const animal = BRANCH_ANIMALS[branch]
  const element = BRANCH_ELEMENTS[branch]
  const yinyang = BRANCH_YINYANG[branch]
  const elementLabel = ELEMENT_LABELS[element]
  const birthYears = useMemo(() => getBirthYears(branch), [branch])
  const currentYear = new Date().getFullYear()
  const isThisYear = birthYears.some((y) => y === currentYear)

  useEffect(() => {
    document.title = `Fove · ${animal}띠 운세`
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    const desc = `${animal}띠(${branch})의 기질·관계·직업·건강 특성과 사주 오행 분석을 확인하세요.`
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', `${animal}띠 운세 — Fove`)
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[name="twitter:title"]', `${animal}띠 운세 — Fove`)
    setMeta('meta[name="twitter:description"]', desc)
    setMeta('meta[property="og:image"]', 'https://kyhsa93.github.io/fove/social-card.png')
    setMeta('meta[name="twitter:image"]', 'https://kyhsa93.github.io/fove/social-card.png')
  }, [branch, animal])

  const otherBranches = BRANCHES.filter((b) => b !== branch)

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-2xl space-y-8 px-4">
        <header className="space-y-3 text-center">
          <button
            type="button"
            onClick={() => navigateToZodiac()}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            ← 띠별 운세 목록
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{animal}띠 운세</h1>
          <div className="flex justify-center gap-2">
            <span className={`rounded-full px-3 py-1 text-sm font-medium ${ELEMENT_BADGE[element]}`}>{elementLabel}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{yinyang}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">지지 {branch}</span>
          </div>
        </header>

        {isThisYear ? (
          <div className={`rounded-2xl border px-4 py-4 space-y-1 ${ELEMENT_COLOR[element]}`}>
            <p className="text-sm font-semibold">{currentYear}년은 {animal}띠의 해입니다</p>
            <p className="text-sm leading-relaxed">올해 태어나신 분들은 {animal}띠에 해당합니다.</p>
          </div>
        ) : null}

        <div className="rounded-2xl border border-slate-100 bg-white/90 px-5 py-5 space-y-3">
          <h2 className="text-base font-semibold text-gray-800">출생 연도</h2>
          <div className="flex flex-wrap gap-2">
            {birthYears.map((y) => (
              <span
                key={y}
                className={`rounded-full border px-3 py-1 text-sm font-medium transition ${
                  y === currentYear
                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                    : y > currentYear
                      ? 'border-slate-200 bg-slate-50 text-slate-500'
                      : 'border-slate-100 bg-white text-slate-700'
                }`}
              >
                {y}년
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500">12년 주기로 반복되며 입춘(2월 4일경) 이전 출생자는 전년도 띠에 해당할 수 있습니다.</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">기질 & 성격</h2>
          <div className={`rounded-2xl border px-5 py-4 space-y-2 ${ELEMENT_COLOR[element]}`}>
            <p className="text-sm leading-relaxed">{TEMPERAMENT_BY_ELEMENT[element]}</p>
            <p className="text-sm leading-relaxed">{RELATIONSHIP_BY_ANIMAL[branch]}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">직업·적성</p>
            <p className="text-sm leading-relaxed text-slate-700">{CAREER_BY_ELEMENT[element]}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">재물운 방향</p>
            <p className="text-sm leading-relaxed text-slate-700">{WEALTH_FOCUS_BY_ELEMENT[element]}</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-white/90 px-4 py-4 space-y-2 sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">건강 포인트</p>
            <p className="text-sm leading-relaxed text-slate-700">{HEALTH_TIPS_BY_ELEMENT[element]}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">다른 띠 보기</h2>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
            {otherBranches.map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => navigateToZodiac(BRANCH_TO_SLUG[b])}
                className={`rounded-xl border px-2 py-2 text-center text-xs font-medium transition hover:-translate-y-0.5 hover:shadow-sm ${ELEMENT_COLOR[BRANCH_ELEMENTS[b]]}`}
              >
                <p className="font-bold">{BRANCH_ANIMALS[b]}</p>
                <p className="opacity-70">{b}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.fortune)}
            className="flex-1 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-amber-600"
          >
            오늘의 운세 보기
          </button>
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.zodiacCompatibility)}
            className="flex-1 rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-600"
          >
            띠 궁합 보기
          </button>
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.saju)}
            className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            사주 풀이 보기
          </button>
        </div>
      </div>
    </section>
  )
}

export default function ZodiacPage(): JSX.Element {
  const { type: slug = '' } = useParams<{ type?: string }>()
  const navigate = useNavigate()

  const branch = SLUG_TO_BRANCH[slug]

  const navigateToZodiac = (newSlug?: string) => {
    if (newSlug) {
      navigate(`/zodiac/${newSlug}`)
    } else if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/zodiac')
    }
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (branch) {
    return <ZodiacDetail branch={branch} navigateToZodiac={navigateToZodiac} />
  }
  return <ZodiacOverview navigateToZodiac={navigateToZodiac} />
}
