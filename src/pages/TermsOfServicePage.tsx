import { JSX } from 'react'

export default function TermsOfServicePage(): JSX.Element {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="space-y-8 rounded-3xl bg-white/90 p-8 shadow-sm ring-1 ring-slate-200/70 backdrop-blur">
        <header className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-500/80">Terms</span>
          <h1 className="text-3xl font-bold text-slate-900">이용약관</h1>
          <p className="text-base leading-relaxed text-slate-600">
            DotImage 서비스를 이용해 주셔서 감사합니다. 아래 약관은 서비스 이용 시 적용되며, 보다 안정적이고 투명한 서비스 제공을 위한 기본 규칙을 담고 있습니다.
          </p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">1. 서비스 제공</h2>
            <p>
              DotImage는 사주 계산, MBTI 테스트, 운세 추천 등 심리·명리 도구를 제공합니다. 서비스는 참고용 정보 제공을 목적으로 하며, 의사결정의 책임은 전적으로 사용자에게 있습니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">2. 사용자 의무</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>서비스를 법령 및 공공질서에 반하지 않게 이용해야 합니다.</li>
              <li>타인의 정보를 도용하거나 허위 정보를 입력해서는 안 됩니다.</li>
              <li>서비스의 소스 코드 및 데이터에 대한 무단 복제·배포를 제한합니다.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">3. 서비스 변경 및 중단</h2>
            <p>
              기능 개선이나 보안 업데이트를 위해 서비스가 사전 예고 없이 변경·중단될 수 있습니다. 중요한 변경 사항은 별도 공지로 안내드릴 예정입니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">4. 책임의 한계</h2>
            <p>
              DotImage는 무료로 제공되는 서비스이며, 사용 과정에서 발생할 수 있는 데이터 손실이나 해석 오류에 대해 법적 책임을 지지 않습니다. 다만 문제 발생 시 최대한 빠르게 복구하도록 노력하겠습니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">5. 약관 변경</h2>
            <p>
              약관이 변경될 경우 최소 7일 전에 공지하며, 이용자가 계속 서비스를 사용할 경우 변경된 약관에 동의한 것으로 간주됩니다.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
