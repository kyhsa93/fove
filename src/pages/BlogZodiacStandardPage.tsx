import { JSX, useEffect } from 'react'
import { ROUTE_PATHS } from '../routes'
import { AdUnit } from '../components/AdUnit'
import { ZODIAC_STANDARD_SECTIONS } from '../data/blogZodiacStandard.js'

const SECTIONS = ZODIAC_STANDARD_SECTIONS

export default function BlogZodiacStandardPage(): JSX.Element {
  useEffect(() => {
    document.title = '띠 기준은 입춘인가 음력 설인가? 완벽 정리 | Fove'
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    const desc = '1~2월생이 혼란스러워하는 띠(십이지) 기준을 완벽 정리합니다. 입춘 기준과 음력 설 기준의 차이, 사주명리학의 올바른 연주 계산법을 설명합니다.'
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', '띠 기준은 입춘인가 음력 설인가? — Fove')
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[name="twitter:title"]', '띠 기준은 입춘인가 음력 설인가? — Fove')
    setMeta('meta[name="twitter:description"]', desc)
    setMeta('meta[property="og:image"]', `${typeof window !== 'undefined' ? window.location.origin : ''}/social-card.png`)
    setMeta('meta[name="twitter:image"]', `${typeof window !== 'undefined' ? window.location.origin : ''}/social-card.png`)
  }, [])

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-2xl px-4 space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">사주 FAQ</p>
          <h1 className="text-3xl font-bold text-gray-900">띠 기준은 입춘인가 음력 설인가?</h1>
          <p className="text-sm text-gray-500">1~2월생이라면 반드시 확인해야 할 연주(年柱) 계산 기준</p>
        </header>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-4 space-y-1">
          <p className="text-sm font-semibold text-emerald-800">핵심 요약</p>
          <p className="text-sm text-emerald-700 leading-relaxed">
            명리학(사주) 기준 → <strong>입춘(양력 2월 4~5일)</strong> / 민간 관습 기준 → <strong>음력 설날</strong>. Fove는 전통 명리학 기준인 입춘을 사용합니다.
          </p>
        </div>

        <div className="space-y-8">
          {SECTIONS.map((section, idx) => (
            <article key={section.title} className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              <div className="space-y-2">
                {section.content.map((para, i) => {
                  const isExample = para.startsWith('→') || para.startsWith('예시:')
                  return (
                    <p
                      key={i}
                      className={`text-sm leading-relaxed ${isExample ? 'text-slate-600 pl-4 border-l-2 border-slate-200' : 'text-gray-700'}`}
                    >
                      {para}
                    </p>
                  )
                })}
              </div>
              {idx === 2 && (
                <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    <strong>참고:</strong> 음력 설날은 해마다 양력 날짜가 달라집니다. 입춘은 매년 양력 2월 4~5일로 거의 고정되어 있습니다.
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>

        <AdUnit slot="BLOG_ZODIAC_STANDARD_BANNER" format="horizontal" />

        <aside className="rounded-2xl border border-amber-100 bg-amber-50/60 px-5 py-5 space-y-3">
          <h2 className="text-base font-semibold text-amber-900">내 생년월일로 직접 확인하기</h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            입춘 기준으로 계산한 사주 네 기둥을 바로 확인할 수 있습니다. 1~2월생이라면 예상과 다른 연주가 나올 수 있습니다.
          </p>
          <a
            href={ROUTE_PATHS.saju}
            className="inline-block rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition shadow-sm"
          >
            사주 계산하기
          </a>
        </aside>

        <nav className="rounded-2xl border border-slate-100 bg-white/80 px-5 py-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-600">관련 글</h2>
          <div className="space-y-2">
            <a
              href={ROUTE_PATHS.blogSajuBasics}
              className="block text-sm text-slate-700 hover:text-amber-700 transition"
            >
              → 사주란 무엇인가? 사주팔자 기초 완벽 정리
            </a>
            <a
              href={ROUTE_PATHS.blogMbtiLoveStyle}
              className="block text-sm text-slate-700 hover:text-amber-700 transition"
            >
              → MBTI별 연애 스타일 완벽 정리
            </a>
          </div>
        </nav>
      </div>
    </section>
  )
}
