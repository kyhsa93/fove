import { JSX, useEffect } from 'react'
import { ROUTE_PATHS } from '../routes'
import { AdUnit } from '../components/AdUnit'
import { ILJIN_GUIDE_SECTIONS, ILJIN_GUIDE_META } from '../data/blogIljinGuide.js'

const SECTIONS = ILJIN_GUIDE_SECTIONS

export default function BlogIljinGuidePage(): JSX.Element {
  useEffect(() => {
    document.title = '오늘의 일진 보는 법 완벽 정리 | Fove'
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    const desc = '천간·지지·오행으로 하루의 에너지를 읽는 방법. 일진의 개념부터 좋은 날과 조심할 날 구별법까지 쉽게 설명합니다.'
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', '오늘의 일진 보는 법 완벽 정리 — Fove')
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[name="twitter:title"]', '오늘의 일진 보는 법 완벽 정리 — Fove')
    setMeta('meta[name="twitter:description"]', desc)
    setMeta('meta[property="og:image"]', 'https://kyhsa93.github.io/fove/social-card.png')
    setMeta('meta[name="twitter:image"]', 'https://kyhsa93.github.io/fove/social-card.png')
  }, [])

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-2xl px-4 space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">{ILJIN_GUIDE_META.category}</p>
          <h1 className="text-3xl font-bold text-gray-900">{ILJIN_GUIDE_META.h1}</h1>
          <p className="text-sm text-gray-500">{ILJIN_GUIDE_META.subtitle}</p>
        </header>

        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <article key={section.title} className="space-y-3">
              <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              <div className="space-y-2">
                {section.content.map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-gray-700">{para}</p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <AdUnit slot="BLOG_ILJIN_GUIDE_BANNER" format="horizontal" />

        <aside className="rounded-2xl border border-amber-100 bg-amber-50/60 px-5 py-5 space-y-3">
          <h2 className="text-base font-semibold text-amber-900">오늘의 일진 직접 확인하기</h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            내 사주와 오늘의 일진을 결합해 집중할 것, 조심할 것, 행운 요소를 한눈에 확인할 수 있습니다.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href={ROUTE_PATHS.fortune}
              className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition shadow-sm"
            >
              오늘의 운세 보기
            </a>
            <a
              href={ROUTE_PATHS.taekil}
              className="rounded-full border border-amber-200 bg-white px-5 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 transition"
            >
              택일 — 길한 날 찾기
            </a>
          </div>
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
              href={ROUTE_PATHS.blogZodiacStandard}
              className="block text-sm text-slate-700 hover:text-amber-700 transition"
            >
              → 띠 기준은 입춘인가 음력 설인가?
            </a>
          </div>
        </nav>
      </div>
    </section>
  )
}
