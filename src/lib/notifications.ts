const NOTIF_OPT_IN_KEY = 'fove_notif_optin'
const LAST_NOTIFIED_KEY = 'fove_last_notified_date'
const DAILY_NOTIFICATION_TITLE = 'Fove · 오늘의 운세'
const DAILY_NOTIFICATION_BODY = '오늘의 운세가 준비됐어요. 하루의 흐름을 확인해보세요!'

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) return 'unsupported'
  return Notification.permission
}

export function isOptedIn(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(NOTIF_OPT_IN_KEY) === '1'
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied'
  const result = await Notification.requestPermission()
  if (result === 'granted') {
    window.localStorage.setItem(NOTIF_OPT_IN_KEY, '1')
    await registerPeriodicSync()
  } else {
    window.localStorage.removeItem(NOTIF_OPT_IN_KEY)
  }
  return result
}

export async function sendTestNotification(title: string, body: string): Promise<void> {
  if (getNotificationPermission() !== 'granted') return
  const options: NotificationOptions = {
    body,
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    tag: 'fove-daily',
    data: { url: '/fortune' },
  }
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(title, options)
      return
    } catch {
      // fall through to main-thread notification
    }
  }
  new Notification(title, options)
}

export function optOut(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(NOTIF_OPT_IN_KEY)
  window.localStorage.removeItem(LAST_NOTIFIED_KEY)
}

// ── Periodic Background Sync 등록 (Chrome Android/데스크탑) ──────────────
export async function registerPeriodicSync(): Promise<void> {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator) || !('permissions' in navigator)) return

  try {
    const registration = await navigator.serviceWorker.ready
    if (!('periodicSync' in registration)) return

    const status = await navigator.permissions.query({
      name: 'periodic-background-sync' as PermissionName,
    })
    if (status.state !== 'granted') return

    await (registration as unknown as { periodicSync: { register: (tag: string, opts: object) => Promise<void> } })
      .periodicSync.register('fove-daily-fortune', {
        minInterval: 24 * 60 * 60 * 1000,
      })
  } catch {
    // Periodic sync 미지원 환경 — 무시
  }
}

// ── 페이지 로드 시 당일 알림 체크 (모든 브라우저 폴백) ──────────────────
export function checkAndNotifyOnLoad(): void {
  if (typeof window === 'undefined') return
  if (!isOptedIn() || getNotificationPermission() !== 'granted') return

  const now = new Date()
  const hour = now.getHours()
  // 오전 5시 ~ 오후 10시 사이에만 알림
  if (hour < 5 || hour >= 22) return

  const today = now.toDateString()
  const lastNotified = window.localStorage.getItem(LAST_NOTIFIED_KEY)
  if (lastNotified === today) return

  window.localStorage.setItem(LAST_NOTIFIED_KEY, today)
  sendTestNotification(DAILY_NOTIFICATION_TITLE, DAILY_NOTIFICATION_BODY)
}
