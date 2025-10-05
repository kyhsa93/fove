import { JSX } from 'react'

export default function AboutPage(): JSX.Element {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="space-y-8 rounded-3xl bg-white/90 p-8 shadow-sm ring-1 ring-slate-200/70 backdrop-blur">
        <header className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500/80">About</span>
          <h1 className="text-3xl font-bold text-slate-900">DotImage 소개</h1>
          <p className="text-base leading-relaxed text-slate-600">
            DotImage는 사주, MBTI, 일일 운세를 한 화면에서 교차 분석해 주는 퍼스널 인사이트 도구입니다. 복잡한 데이터를 간결한 카드와 차트로 정리해,
            누구나 손쉽게 현재의 흐름과 다음 행동을 확인할 수 있도록 만들었습니다.
          </p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">핵심 기능</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>생년월일·출생시간으로 오행 밸런스를 계산하고 해석 가이드를 제공합니다.</li>
              <li>20문항 MBTI 테스트로 현재 성향과 강점을 빠르게 파악합니다.</li>
              <li>사주·MBTI 교차 인사이트로 오늘의 에너지 흐름과 추천 행동을 제안합니다.</li>
              <li>사주 기반 로또 추천, 결과 저장 및 즐겨찾기 같은 도구형 기능도 포함되어 있습니다.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">디자인 철학</h2>
            <p>
              데이터를 빠르게 이해하고 즉시 활용할 수 있게 만드는 것이 가장 중요하다고 생각했습니다. 따라서 핵심 통계와 해석을 카드 단위로 나누고,
              Tailwind CSS를 활용한 가벼운 모션과 색상 대비로 필요한 정보만 부각했습니다.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">향후 로드맵</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>개인 맞춤 추천을 강화하기 위한 저장된 결과 기반 분석</li>
              <li>명리 전문가와 협업한 해석 콘텐츠 확장</li>
              <li>모바일 홈 화면에 최적화된 컴팩트 카드 모드</li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  )
}
