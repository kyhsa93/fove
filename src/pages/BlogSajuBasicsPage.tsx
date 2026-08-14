import { JSX, useEffect } from 'react'
import { ROUTE_PATHS } from '../routes'
import { SAJU_BASICS_SECTIONS } from '../data/blogSajuBasics.js'

const SECTIONS = SAJU_BASICS_SECTIONS

export default function BlogSajuBasicsPage(): JSX.Element {
  useEffect(() => {
    document.title = '사주란 무엇인가? 사주팔자 기초 완벽 정리 | Fove'
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    const desc = '사주(四柱)의 개념부터 천간·지지·오행·60갑자까지. 사주팔자 계산 방법과 연주·월주·일주·시주의 기준을 쉽게 설명합니다.'
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', '사주란 무엇인가? — Fove')
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[name="twitter:title"]', '사주란 무엇인가? — Fove')
    setMeta('meta[name="twitter:description"]', desc)
    setMeta('meta[property="og:image"]', `${typeof window !== 'undefined' ? window.location.origin : ''}/social-card.png`)
    setMeta('meta[name="twitter:image"]', `${typeof window !== 'undefined' ? window.location.origin : ''}/social-card.png`)
  }, [])

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-2xl px-4 space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">사주 입문</p>
          <h1 className="text-3xl font-bold text-gray-900">사주란 무엇인가?</h1>
          <p className="text-sm text-gray-500">사주팔자(四柱八字) 기초 개념 정리</p>
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

        <aside className="rounded-2xl border border-amber-100 bg-amber-50/60 px-5 py-5 space-y-3">
          <h2 className="text-base font-semibold text-amber-900">내 사주 직접 계산해보기</h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            생년월일과 태어난 시간을 입력하면 사주 네 기둥과 오행 밸런스를 자동으로 계산합니다. 모든 계산은 브라우저에서 처리되어 개인정보가 저장되지 않습니다.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href={ROUTE_PATHS.saju}
              className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition shadow-sm"
            >
              사주 계산하기
            </a>
            <a
              href={ROUTE_PATHS.fortune}
              className="rounded-full border border-amber-200 bg-white px-5 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 transition"
            >
              오늘의 운세 보기
            </a>
          </div>
        </aside>

        <nav className="rounded-2xl border border-slate-100 bg-white/80 px-5 py-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-600">관련 글</h2>
          <div className="space-y-2">
            <a
              href={ROUTE_PATHS.blogZodiacStandard}
              className="block text-sm text-slate-700 hover:text-amber-700 transition"
            >
              → 띠 기준은 입춘인가 음력 설인가?
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
