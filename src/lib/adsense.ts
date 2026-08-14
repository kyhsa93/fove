export const ADSENSE_CLIENT_ID = 'ca-pub-1195159445218373'

const SCRIPT_ID = 'adsbygoogle-js'

// 설치된 PWA에서는 광고를 띄우지 않는다(홈 화면 앱처럼 쓰는 사용자 경험 유지).
export function isStandaloneMode(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches
  )
}

// AdSense는 자동광고로 운영한다. 자동광고는 이 스크립트만 붙으면 구글이 페이지를
// 분석해 광고 위치를 직접 정하므로, 페이지마다 <ins data-ad-slot>을 심을 필요가 없다.
// (수동 유닛을 쓰려면 AdSense 대시보드에서 발급한 숫자 슬롯 ID가 있어야 하는데,
//  자리표시자 문자열을 넣어두면 광고가 채워지지 않고 빈 공간만 남는다.)
//
// 그래서 스크립트를 index.html에 정적으로 두지 않고 여기서 주입한다 — 정적으로 두면
// 동의 배너에 답하기 전에도, 설치된 PWA 안에서도 자동광고가 그대로 붙어버려서
// ConsentBanner가 사실상 장식이 된다. 이 함수가 광고 노출 여부를 결정하는 유일한 지점이다.
export function loadAdSense(): void {
  if (typeof document === 'undefined') return
  if (isStandaloneMode()) return
  if (document.getElementById(SCRIPT_ID)) return

  const script = document.createElement('script')
  script.id = SCRIPT_ID
  script.async = true
  script.crossOrigin = 'anonymous'
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`
  document.head.appendChild(script)
}
