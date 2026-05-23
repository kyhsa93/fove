type EventName = 'fortune_generated' | 'fortune_completed' | 'shared' | 'clicked_next'

interface EventProps {
  [key: string]: string | number | boolean | undefined
}

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void
  }
}

export function trackEvent(name: EventName, props?: EventProps): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, props as Record<string, unknown>)
  }
}
