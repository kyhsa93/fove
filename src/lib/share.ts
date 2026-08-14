export interface ShareOptions {
  title: string
  description: string
  url: string
  imageUrl?: string
}

declare global {
  interface Window {
    Kakao?: {
      init(key: string): void
      isInitialized(): boolean
      Share: {
        sendDefault(options: object): void
      }
    }
  }
}

const KAKAO_SDK_URL = 'https://t1.kakaocdn.net/kakaojs/2.7.2/kakao.min.js'

async function loadKakaoSdk(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  const appKey = (import.meta as { env: Record<string, string> }).env.VITE_KAKAO_APP_KEY
  if (!appKey) return false

  if (window.Kakao?.isInitialized?.()) return true

  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${KAKAO_SDK_URL}"]`)) {
      setTimeout(() => resolve(Boolean(window.Kakao?.isInitialized?.())), 1000)
      return
    }
    const script = document.createElement('script')
    script.src = KAKAO_SDK_URL
    script.onload = () => {
      try { window.Kakao?.init(appKey); resolve(true) } catch { resolve(false) }
    }
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })
}

async function kakaoShare(options: ShareOptions): Promise<boolean> {
  const loaded = await loadKakaoSdk()
  if (!loaded || !window.Kakao) return false
  try {
    const siteBase = typeof window !== 'undefined'
      ? `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}`
      : ''
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: options.title,
        description: options.description,
        imageUrl: options.imageUrl ?? `${siteBase}/social-card.png`,
        link: { mobileWebUrl: options.url, webUrl: options.url },
      },
      buttons: [{ title: '결과 보기', link: { mobileWebUrl: options.url, webUrl: options.url } }],
    })
    return true
  } catch {
    return false
  }
}

export type ShareResult = 'native' | 'kakao' | 'clipboard' | 'error'

export async function shareLink(options: ShareOptions): Promise<ShareResult> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: options.title, text: options.description, url: options.url })
      return 'native'
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'native'
    }
  }

  const kakaoOk = await kakaoShare(options)
  if (kakaoOk) return 'kakao'

  try {
    await navigator.clipboard.writeText(options.url)
    return 'clipboard'
  } catch {
    try {
      const el = document.createElement('textarea')
      el.value = options.url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      return 'clipboard'
    } catch {
      return 'error'
    }
  }
}
