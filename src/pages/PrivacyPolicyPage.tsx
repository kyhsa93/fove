import { JSX } from 'react'

export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="space-y-8 rounded-3xl bg-white/90 p-8 shadow-sm ring-1 ring-slate-200/70 backdrop-blur">
        <header className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-500/80">Privacy</span>
          <h1 className="text-3xl font-bold text-slate-900">개인정보 처리방침</h1>
          <p className="text-base leading-relaxed text-slate-600">
            DotImage는 서비스 운영에 필요한 최소한의 정보만을 수집하고, 사용자 데이터는 기기에만 저장합니다. 본 방침은 개인정보를 어떤 방식으로 취급하고 보호하는지 설명합니다.
          </p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">1. 수집 항목 및 이용 목적</h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>사주 계산을 위한 생년월일, 출생시간, 성별: 운세 및 명리 해석 제공</li>
              <li>MBTI 테스트 응답: 성향 분석 및 맞춤 가이드 제공</li>
              <li>저장된 결과 및 즐겨찾기: 사용자가 다시 확인할 수 있도록 브라우저 로컬 스토리지에 보관</li>
            </ul>
            <p className="text-xs text-slate-500">※ 위 정보는 서버로 전송되지 않으며, 브라우저 로컬 환경에만 보관됩니다.</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">2. 보관 및 삭제</h2>
            <p>
              DotImage는 별도의 회원 가입 절차가 없으며, 모든 데이터는 사용자의 브라우저 로컬 스토리지에 암호화 없이 저장됩니다. 브라우저 캐시를 삭제하거나 설정에서 초기화하면 즉시 제거됩니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">3. 외부 서비스 연동</h2>
            <p>
              현재 외부 분석 도구, 광고 네트워크, 제3자 API와의 연동은 없습니다. 향후 변경 사항이 있을 경우 공지와 더불어 동의를 다시 요청드립니다.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-slate-900">4. 이용자 권리</h2>
            <p>
              사용자는 언제든지 브라우저에서 저장된 정보를 조회·삭제할 수 있으며, 관련 문의는 문의 페이지를 통해 접수하실 수 있습니다. 개인정보 관련 요청은 최대 7일 이내 답변합니다.
            </p>
          </section>
        </div>
      </div>
    </section>
  )
}
