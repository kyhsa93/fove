import { JSX, useEffect } from 'react'
import { ROUTE_PATHS } from '../routes'
import { AdUnit } from '../components/AdUnit'
import { LOVE_STYLES as LOVE_STYLES_DATA } from '../data/blogMbtiLoveStyle.js'

interface LoveStyleData {
  type: string
  nickname: string
  group: string
  summary: string
  strengths: string[]
  cautions: string[]
  idealDate: string
}

const LOVE_STYLES = LOVE_STYLES_DATA as LoveStyleData[]

const GROUP_COLORS: Record<string, { card: string; badge: string }> = {
  '분석가': { card: 'border-violet-100 bg-violet-50/50', badge: 'bg-violet-100 text-violet-700' },
  '외교관': { card: 'border-emerald-100 bg-emerald-50/50', badge: 'bg-emerald-100 text-emerald-700' },
  '관리자': { card: 'border-sky-100 bg-sky-50/50', badge: 'bg-sky-100 text-sky-700' },
  '탐험가': { card: 'border-amber-100 bg-amber-50/50', badge: 'bg-amber-100 text-amber-700' }
}

export default function BlogMbtiLoveStylePage(): JSX.Element {
  useEffect(() => {
    document.title = 'MBTI별 연애 스타일 완벽 정리 — 16타입 사랑 방식 | Fove'
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    const desc = 'MBTI 16타입별 연애 스타일을 완벽 정리합니다. INTJ, ENFP, INFJ, ENTP 등 각 유형이 사랑을 표현하는 방식, 강점과 주의점, 이상적인 데이트까지 분석합니다.'
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', 'MBTI별 연애 스타일 완벽 정리 — Fove')
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[name="twitter:title"]', 'MBTI별 연애 스타일 완벽 정리 — Fove')
    setMeta('meta[name="twitter:description"]', desc)
    setMeta('meta[property="og:image"]', 'https://kyhsa93.github.io/fove/social-card.png')
    setMeta('meta[name="twitter:image"]', 'https://kyhsa93.github.io/fove/social-card.png')
  }, [])

  const groups = ['분석가', '외교관', '관리자', '탐험가']

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-2xl px-4 space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">MBTI 연애 분석</p>
          <h1 className="text-3xl font-bold text-gray-900">MBTI별 연애 스타일 완벽 정리</h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            MBTI 16가지 유형이 사랑을 표현하는 방식, 연애의 강점과 주의점, 이상적인 데이트까지 유형별로 분석합니다. 내 유형과 상대 유형을 함께 확인해보세요.
          </p>
        </header>

        {groups.map((group) => {
          const types = LOVE_STYLES.filter((t) => t.group === group)
          const colors = GROUP_COLORS[group]
          return (
            <section key={group} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className={`text-sm font-semibold rounded-full px-3 py-0.5 ${colors.badge}`}>{group}</span>
                {group} 유형의 연애
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {types.map((data) => (
                  <article key={data.type} className={`rounded-2xl border px-5 py-5 space-y-4 ${colors.card}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">{data.type}</span>
                        <span className="text-sm text-gray-500">— {data.nickname}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-white/70 border border-white px-3 py-2.5 space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">강점</p>
                        <ul className="space-y-0.5">
                          {data.strengths.map((s) => (
                            <li key={s} className="text-xs text-gray-700">· {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl bg-white/70 border border-white px-3 py-2.5 space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-500">주의</p>
                        <ul className="space-y-0.5">
                          {data.cautions.map((c) => (
                            <li key={c} className="text-xs text-gray-700">· {c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/60 border border-white px-3 py-2 space-y-0.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">이상적 데이트</p>
                      <p className="text-xs text-gray-700">{data.idealDate}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}

        <AdUnit slot="BLOG_MBTI_LOVE_BANNER" format="horizontal" />

        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-6 space-y-3">
          <h2 className="text-base font-semibold text-indigo-900">MBTI 궁합도 확인해보세요</h2>
          <p className="text-sm text-indigo-700 leading-relaxed">
            내 유형과 상대 유형의 궁합 점수를 매트릭스로 확인하거나, 사주 오행 기반 궁합 점수를 계산해보세요.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href={ROUTE_PATHS.mbtiCompatibility}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition shadow-sm"
            >
              MBTI 궁합 매트릭스
            </a>
            <a
              href={ROUTE_PATHS.compatibility}
              className="rounded-full border border-indigo-200 bg-white px-5 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition"
            >
              사주 궁합 보기
            </a>
          </div>
        </section>

        <nav className="rounded-2xl border border-slate-100 bg-white/80 px-5 py-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-600">관련 글</h2>
          <div className="space-y-2">
            <a
              href={ROUTE_PATHS.blogSajuBasics}
              className="block text-sm text-slate-700 hover:text-rose-600 transition"
            >
              → 사주란 무엇인가? 사주팔자 기초 완벽 정리
            </a>
            <a
              href={ROUTE_PATHS.blogZodiacStandard}
              className="block text-sm text-slate-700 hover:text-rose-600 transition"
            >
              → 띠 기준은 입춘인가 음력 설인가?
            </a>
          </div>
        </nav>
      </div>
    </section>
  )
}
