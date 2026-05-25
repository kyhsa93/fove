import { JSX, useEffect } from 'react'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'

const SECTIONS = [
  {
    title: '사주(四柱)란 무엇인가?',
    content: [
      '사주(四柱)는 사람이 태어난 연(年)·월(月)·일(日)·시(時) 네 가지 기둥을 뜻합니다. 이 네 기둥 각각에 천간(天干)과 지지(地支)가 하나씩 붙어 총 8글자가 완성되므로, 흔히 "사주팔자(四柱八字)"라고 부릅니다.',
      '사주는 동아시아 전통 명리학(命理學)에서 발전한 개념으로, 태어난 시공간의 기운이 사람의 기질·성향·삶의 흐름에 영향을 준다고 봅니다. 오늘날에는 자기 이해와 시기별 에너지 흐름을 파악하는 참고 도구로 활용됩니다.'
    ]
  },
  {
    title: '천간(天干)과 지지(地支)',
    content: [
      '천간은 갑(甲)·을(乙)·병(丙)·정(丁)·무(戊)·기(己)·경(庚)·신(辛)·임(壬)·계(癸) 10개로 이루어집니다. 각각 오행(목·화·토·금·수)과 음양으로 분류되며 연·월·일·시의 위쪽 글자에 해당합니다.',
      '지지는 자(子)·축(丑)·인(寅)·묘(卯)·진(辰)·사(巳)·오(午)·미(未)·신(申)·유(酉)·술(戌)·해(亥) 12개로 이루어집니다. 12간지(띠)와 동일하며 천간 아래 글자에 해당합니다. 천간과 지지의 60가지 조합이 "60갑자"를 이룹니다.'
    ]
  },
  {
    title: '오행(五行): 목·화·토·금·수',
    content: [
      '오행은 자연의 다섯 가지 기운을 상징합니다. 목(木)은 성장·창의, 화(火)는 열정·표현, 토(土)는 안정·중재, 금(金)은 결단·원칙, 수(水)는 지혜·유연함을 나타냅니다.',
      '사주 원국에서 어떤 오행이 강하고 약한지에 따라 성향과 잠재력이 달라집니다. 오행 상생(목→화→토→금→수→목)과 상극(목↔토, 토↔수, 수↔화, 화↔금, 금↔목) 관계를 통해 사주 전체의 균형을 파악합니다.'
    ]
  },
  {
    title: '사주의 네 기둥 계산 방법',
    content: [
      '연주(年柱)는 입춘(양력 2월 4~5일) 기준으로 계산합니다. 음력 설날이 아니라 입춘을 기준으로 해가 바뀌므로, 1~2월생은 반드시 입춘 전후를 확인해야 합니다.',
      '월주(月柱)는 절기(節氣)를 기준으로 구분합니다. 매월 4~8일 무렵의 절기 시작일이 월의 경계이며, 음력 초하루와는 다릅니다.',
      '일주(日柱)는 양력 날짜를 기반으로 60갑자를 순환 계산합니다. 자시(밤 11시~새벽 1시)가 하루의 시작이므로, 밤 11시 이후 출생은 다음 날 일주에 해당할 수 있습니다.',
      '시주(時柱)는 태어난 시각에 따라 12지시(각 2시간)를 배정합니다. 시주는 후천운과 자식, 말년 운에 영향을 준다고 봅니다.'
    ]
  },
  {
    title: '현대적 활용: 자기 이해의 도구',
    content: [
      '사주는 타고난 기질과 에너지 패턴을 이해하는 참고 자료입니다. 특정 시기의 운의 흐름을 미리 파악해 중요한 결정(이직, 이사, 투자 등)에 활용하는 분들도 많습니다.',
      '결과는 결정론적 운명이 아닌 가이드로 받아들이는 것이 중요합니다. 동일한 사주를 가진 사람도 환경·노력·선택에 따라 다른 삶을 살아갑니다.'
    ]
  }
]

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
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.saju)}
              className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-white hover:bg-amber-600 transition shadow-sm"
            >
              사주 계산하기
            </button>
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.fortune)}
              className="rounded-full border border-amber-200 bg-white px-5 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 transition"
            >
              오늘의 운세 보기
            </button>
          </div>
        </aside>

        <nav className="rounded-2xl border border-slate-100 bg-white/80 px-5 py-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-600">관련 글</h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.blogZodiacStandard)}
              className="block w-full text-left text-sm text-slate-700 hover:text-amber-700 transition"
            >
              → 띠 기준은 입춘인가 음력 설인가?
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
