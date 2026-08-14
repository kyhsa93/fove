export const ADSENSE_CLIENT_ID = 'ca-pub-1195159445218373'

const SCRIPT_ID = 'adsbygoogle-js'

export function isStandaloneMode(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches
  )
}

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
