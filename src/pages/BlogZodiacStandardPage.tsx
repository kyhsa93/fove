import { JSX, useEffect } from 'react'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'
import { AdUnit } from '../components/AdUnit'

const SECTIONS = [
  {
    title: '왜 혼란이 생기는가?',
    content: [
      '매년 1~2월생들은 "내 띠가 뭐냐"는 질문 앞에서 혼란을 겪습니다. "음력 설날 전에 태어났으니 전 해 띠 아닌가요?" "입춘이 지났으면 새 해 띠인가요?" — 이 혼란은 한국에서 띠를 계산하는 기준이 서로 다른 두 관습이 공존하기 때문에 생깁니다.',
      '실제로 인터넷 검색을 해보면 음력 설을 기준으로 보는 답변과 입춘을 기준으로 보는 답변이 섞여 있어 혼란이 더욱 커집니다. 이 글에서 각 기준의 근거와 차이점을 명확히 정리합니다.'
    ]
  },
  {
    title: '입춘(立春) 기준 — 명리학 전통',
    content: [
      '명리학(사주 이론)에서는 연주(年柱)를 입춘으로 구분합니다. 입춘은 24절기 중 첫 번째로, 매년 양력 2월 4~5일 무렵입니다. 명리학적으로는 이날부터 "새 해"의 기운이 시작됩니다.',
      '예를 들어 2025년 입춘은 2월 3일이었습니다. 이 날 이전에 태어났다면(2025년 1월 1일~2월 2일) 명리학적으로는 2024년 갑진년(용띠)에 해당합니다. 2월 3일 이후 출생이면 2025년 을사년(뱀띠)입니다.',
      '사주팔자를 계산할 때는 반드시 입춘 기준을 사용해야 사주 원국의 천간·지지가 정확하게 배정됩니다. Fove의 사주 계산도 입춘 기준을 채택하고 있습니다.'
    ]
  },
  {
    title: '음력 설(구정) 기준 — 민간 관습',
    content: [
      '일상에서 "새해"는 음력 설날(구정, 정월 초하루)을 기준으로 바뀐다는 관념이 여전히 강합니다. 특히 어르신들은 "설이 지나야 한 살 더 먹는다"는 표현을 자주 쓰며, 이 맥락에서 띠도 설을 기준으로 보는 경우가 많습니다.',
      '음력 설은 해마다 양력으로 1월 21일~2월 20일 사이에 위치합니다. 입춘과 음력 설이 같은 날인 경우는 드물며, 보통 1~3주 정도 차이가 납니다. 이 구간에 태어난 사람은 두 기준 중 어느 것을 따르느냐에 따라 띠가 달라집니다.'
    ]
  },
  {
    title: '두 기준의 차이 — 실제 사례',
    content: [
      '예시: 2025년 1월 29일 출생 (2025년 음력 설은 1월 29일)',
      '→ 입춘 기준: 2025년 입춘(2월 3일) 이전 출생 → 2024년 갑진년 → 용띠',
      '→ 음력 설 기준: 2025년 1월 29일 설날 = 2025년 을사년 시작 → 뱀띠',
      '이처럼 해마다 입춘과 설날이 며칠 차이가 나는 구간에 태어난 분들은 어느 기준을 따르느냐에 따라 띠가 한 해씩 달라집니다.'
    ]
  },
  {
    title: 'Fove의 기준 — 입춘',
    content: [
      'Fove는 전통 명리학 기준인 입춘을 연주(年柱) 변환 기준으로 사용합니다. 사주 계산의 월주 역시 절기(節氣)를 기준으로 하며, 이는 전통적인 사주명리 계산 방식과 일치합니다.',
      '궁금한 분은 Fove 사주 페이지에서 생년월일을 입력해 직접 확인할 수 있습니다. 입춘 전후 1~2월생은 전년도 천간·지지로 배정될 수 있으니 참고하세요.'
    ]
  }
]

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
          <button
            type="button"
            onClick={() => navigateTo(ROUTE_PATHS.saju)}
            className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition shadow-sm"
          >
            사주 계산하기
          </button>
        </aside>

        <nav className="rounded-2xl border border-slate-100 bg-white/80 px-5 py-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-600">관련 글</h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.blogSajuBasics)}
              className="block w-full text-left text-sm text-slate-700 hover:text-amber-700 transition"
            >
              → 사주란 무엇인가? 사주팔자 기초 완벽 정리
            </button>
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.blogMbtiLoveStyle)}
              className="block w-full text-left text-sm text-slate-700 hover:text-amber-700 transition"
            >
              → MBTI별 연애 스타일 완벽 정리
            </button>
          </div>
        </nav>
      </div>
    </section>
  )
}
