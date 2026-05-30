const DISMISSED_KEY = 'fove_install_dismissed_at'
const INSTALLED_KEY = 'fove_install_done'
const DISMISS_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7일

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
  )
}

export function isInstalled(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(INSTALLED_KEY) === '1'
}

export function isDismissedRecently(): boolean {
  if (typeof window === 'undefined') return false
  const ts = window.localStorage.getItem(DISMISSED_KEY)
  if (!ts) return false
  return Date.now() - Number(ts) < DISMISS_TTL_MS
}

export function markDismissed(): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(DISMISSED_KEY, String(Date.now()))
}

export function markInstalled(): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(INSTALLED_KEY, '1')
}

export function isIosSafari(): boolean {
  if (typeof window === 'undefined') return false
  const ua = navigator.userAgent
  const isIos = /iphone|ipad|ipod/i.test(ua)
  // Chrome/Firefox on iOS는 A2HS 미지원 — Safari만 처리
  const isChrome = /CriOS/i.test(ua)
  const isFirefox = /FxiOS/i.test(ua)
  return isIos && !isChrome && !isFirefox
}

export function shouldShowBanner(): boolean {
  return !isStandalone() && !isInstalled() && !isDismissedRecently()
}
