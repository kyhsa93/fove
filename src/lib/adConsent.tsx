import { createContext, useContext, useEffect, useState, type JSX, type ReactNode } from 'react'
import { loadAdSense } from './adsense'

type ConsentState = 'granted' | 'denied' | null

const CONSENT_KEY = 'fove_ad_consent'

interface AdConsentCtx {
  consent: ConsentState
  grant: () => void
  deny: () => void
}

const AdConsentContext = createContext<AdConsentCtx>({
  consent: null,
  grant: () => {},
  deny: () => {}
})

export function useAdConsent(): AdConsentCtx {
  return useContext(AdConsentContext)
}

export function AdConsentProvider({ children }: { children: ReactNode }): JSX.Element {
  const [consent, setConsent] = useState<ConsentState>(() => {
    if (typeof window === 'undefined') return null
    return (localStorage.getItem(CONSENT_KEY) as ConsentState) ?? null
  })

  const grant = () => {
    localStorage.setItem(CONSENT_KEY, 'granted')
    setConsent('granted')
  }

  const deny = () => {
    localStorage.setItem(CONSENT_KEY, 'denied')
    setConsent('denied')
  }

  // 이미 동의한 상태로 들어온 방문(localStorage에 남아 있는 경우)과 방금 배너에서
  // 동의를 누른 경우를 한 곳에서 처리한다. loadAdSense가 중복 주입을 막으므로
  // consent가 바뀔 때마다 다시 호출돼도 스크립트는 한 번만 붙는다.
  useEffect(() => {
    if (consent === 'granted') loadAdSense()
  }, [consent])

  return (
    <AdConsentContext.Provider value={{ consent, grant, deny }}>
      {children}
    </AdConsentContext.Provider>
  )
}
