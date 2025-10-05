import { JSX } from 'react'

export default function ContactPage(): JSX.Element {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="space-y-8 rounded-3xl bg-white/90 p-8 shadow-sm ring-1 ring-slate-200/70 backdrop-blur">
        <header className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500/80">Contact</span>
          <h1 className="text-3xl font-bold text-slate-900">문의하기</h1>
          <p className="text-base leading-relaxed text-slate-600">
            DotImage에 대한 제안, 버그 신고, 협업 문의는 아래 채널을 통해 언제든지 보내주세요. 빠르고 성실한 답변을 위해 노력하겠습니다.
          </p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">연락처</h2>
            <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-6 text-slate-700">
              <p className="text-sm">이메일</p>
              <a
                href="mailto:hello@dotimage.app"
                className="text-lg font-semibold text-rose-600 hover:underline"
              >
                hello@dotimage.app
              </a>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">문의 안내</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>서비스 개선 제안이나 기능 요청은 가능한 구체적으로 적어주시면 도움이 됩니다.</li>
              <li>버그 신고 시 재현 가능한 단계와 사용 중인 브라우저·버전을 알려주세요.</li>
              <li>파트너십 및 협업 제안은 회사/팀 소개와 함께 전달해 주시면 빠르게 검토하겠습니다.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">응답 시간</h2>
            <p>
              평일 기준 48시간 이내 답변을 목표로 하고 있습니다. 답변이 지연될 경우 접수하신 이메일로 진행 상황을 안내드리겠습니다.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
