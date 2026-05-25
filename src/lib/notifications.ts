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

export async function sendTestNotification(title: string, body: string): Promise<void> {
  if (getNotificationPermission() !== 'granted') return
  const options: NotificationOptions = {
    body,
    icon: '/icons/icon-192.svg',
    badge: '/icons/icon-192.svg',
    tag: 'fove-daily'
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
}
