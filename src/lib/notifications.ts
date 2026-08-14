import { getName } from './profile'
import { getStreakCount } from './streak'
import { STEMS, STEM_DAILY_CONTEXT } from './saju/constants'
import { getTodaySpecialEvent, getTomorrowSpecialEvent } from './specialEvents'

const NOTIF_OPT_IN_KEY = 'fove_notif_optin'
const LAST_NOTIFIED_KEY = 'fove_last_notified_date'
const LAST_STREAK_TOAST_KEY = 'fove_last_streak_toast'

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

function getJulianDayNumber(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  )
}

function getTodayStemContext(): string {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000)
  const year = kst.getUTCFullYear()
  const month = kst.getUTCMonth() + 1
  const day = kst.getUTCDate()
  const jdn = getJulianDayNumber(year, month, day)
  const stem = STEMS[mod(jdn + 50, 60) % STEMS.length]
  return STEM_DAILY_CONTEXT[stem] ?? ''
}

interface NotificationContent {
  title: string
  body: string
  url: string
}

function buildSmartNotificationContent(): NotificationContent {
  const name = getName()
  const namePrefix = name ? `${name}님, ` : ''
  const streakCount = getStreakCount()
  const isMonday = new Date().getDay() === 1
  const stemContext = getTodayStemContext()

  const todayEvent = getTodaySpecialEvent()
  if (todayEvent) {
    return {
      title: `Fove · 오늘은 ${todayEvent.name}`,
      body: `${namePrefix}${todayEvent.message}`,
      url: todayEvent.ctaPath,
    }
  }

  const tomorrowEvent = getTomorrowSpecialEvent()
  if (tomorrowEvent) {
    return {
      title: `Fove · 내일은 ${tomorrowEvent.name}`,
      body: `${namePrefix}내일 특별한 날이에요. 오늘 운세를 확인하고 준비해보세요!`,
      url: '/fortune',
    }
  }

  if (isMonday) {
    return {
      title: 'Fove · 이번 주 흐름',
      body: `${namePrefix}새로운 한 주가 시작됐어요! 이번 주 일진 흐름을 미리 확인해보세요.`,
      url: '/fortune/week',
    }
  }

  if (streakCount >= 3) {
    return {
      title: 'Fove · 오늘의 운세',
      body: `🔥 ${streakCount}일 연속! ${namePrefix}${stemContext}`,
      url: '/fortune',
    }
  }

  return {
    title: 'Fove · 오늘의 운세',
    body: `${namePrefix}${stemContext} 오늘의 운세를 확인해보세요!`,
    url: '/fortune',
  }
}

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

export async function sendTestNotification(title: string, body: string, url = '/fortune'): Promise<void> {
  if (getNotificationPermission() !== 'granted') return
  const appUrl = `${import.meta.env.BASE_URL}${url.replace(/^\//, '')}`
  const options: NotificationOptions = {
    body,
    icon: `${import.meta.env.BASE_URL}icons/icon-192.svg`,
    badge: `${import.meta.env.BASE_URL}icons/icon-192.svg`,
    tag: 'fove-daily',
    data: { url: appUrl },
  }
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(title, options)
      return
    } catch {
    }
  }
  new Notification(title, options)
}

export function optOut(): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(NOTIF_OPT_IN_KEY)
  window.localStorage.removeItem(LAST_NOTIFIED_KEY)
}

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
  }
}

export function checkAndNotifyOnLoad(): void {
  if (typeof window === 'undefined') return
  if (!isOptedIn() || getNotificationPermission() !== 'granted') return

  const now = new Date()
  const hour = now.getHours()
  if (hour < 5 || hour >= 22) return

  const today = now.toDateString()
  const lastNotified = window.localStorage.getItem(LAST_NOTIFIED_KEY)
  if (lastNotified === today) return

  window.localStorage.setItem(LAST_NOTIFIED_KEY, today)
  const content = buildSmartNotificationContent()
  sendTestNotification(content.title, content.body, content.url)
}

export function shouldShowEveningStreakReminder(): boolean {
  if (typeof window === 'undefined') return false

  const streakCount = getStreakCount()
  if (streakCount < 2) return false

  const hour = new Date().getHours()
  if (hour < 20) return false

  const today = new Date().toDateString()
  const lastShown = window.localStorage.getItem(LAST_STREAK_TOAST_KEY)
  return lastShown !== today
}

export function markEveningStreakReminderShown(): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(LAST_STREAK_TOAST_KEY, new Date().toDateString())
}
