const NOTIF_OPT_IN_KEY = 'fove_notif_optin'

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
  } else {
    window.localStorage.removeItem(NOTIF_OPT_IN_KEY)
  }
  return result
}

export function sendTestNotification(title: string, body: string): void {
  if (getNotificationPermission() !== 'granted') return
  new Notification(title, {
    body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'fove-daily'
  })
}

export function optOut(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(NOTIF_OPT_IN_KEY)
}
