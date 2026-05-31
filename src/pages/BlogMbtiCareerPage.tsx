import { JSX, useEffect } from 'react'
import { ROUTE_PATHS } from '../routes'
import { AdUnit } from '../components/AdUnit'
import { MBTI_CAREER_SECTIONS, MBTI_CAREER_META } from '../data/blogMbtiCareer.js'

const SECTIONS = MBTI_CAREER_SECTIONS

export default function BlogMbtiCareerPage(): JSX.Element {
  useEffect(() => {
    document.title = 'MBTI 유형별 직업 궁합 완벽 정리 | Fove'
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    const desc = '나의 MBTI 성향에 맞는 직업은? 16타입별 강점 직군과 업무 스타일을 분석합니다.'
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', 'MBTI 유형별 직업 궁합 완벽 정리 — Fove')
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[name="twitter:title"]', 'MBTI 유형별 직업 궁합 완벽 정리 — Fove')
    setMeta('meta[name="twitter:description"]', desc)
    setMeta('meta[property="og:image"]', `${typeof window !== 'undefined' ? window.location.origin : ''}/social-card.png`)
    setMeta('meta[name="twitter:image"]', `${typeof window !== 'undefined' ? window.location.origin : ''}/social-card.png`)
  }, [])

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-2xl px-4 space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{MBTI_CAREER_META.category}</p>
          <h1 className="text-3xl font-bold text-gray-900">{MBTI_CAREER_META.h1}</h1>
          <p className="text-sm text-gray-500">{MBTI_CAREER_META.subtitle}</p>
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

        <AdUnit slot="BLOG_MBTI_CAREER_BANNER" format="horizontal" />

        <aside className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-5 space-y-3">
          <h2 className="text-base font-semibold text-indigo-900">내 MBTI와 사주 통합 분석하기</h2>
          <p className="text-sm text-indigo-800 leading-relaxed">
            MBTI 성향과 사주 오행을 함께 분석해 협업 스타일, 강점 직군, 번아웃 예방 전략까지 확인할 수 있습니다.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href={ROUTE_PATHS.mbti}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition shadow-sm"
            >
              MBTI 검사하기
            </a>
            <a
              href={ROUTE_PATHS.insight}
              className="rounded-full border border-indigo-200 bg-white px-5 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition"
            >
              통합 인사이트 보기
            </a>
          </div>
        </aside>

        <nav className="rounded-2xl border border-slate-100 bg-white/80 px-5 py-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-600">관련 글</h2>
          <div className="space-y-2">
            <a
              href={ROUTE_PATHS.blogMbtiLoveStyle}
              className="block text-sm text-slate-700 hover:text-indigo-700 transition"
            >
              → MBTI별 연애 스타일 완벽 정리
            </a>
            <a
              href={ROUTE_PATHS.blogSajuBasics}
              className="block text-sm text-slate-700 hover:text-indigo-700 transition"
            >
              → 사주란 무엇인가? 사주팔자 기초 완벽 정리
            </a>
          </div>
        </nav>
      </div>
    </section>
  )
}
