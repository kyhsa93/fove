import { useEffect, useRef, type JSX } from 'react'
import { useAdConsent } from '../lib/adConsent'

type AdFormat = 'auto' | 'horizontal' | 'rectangle'

interface AdUnitProps {
  slot: string
  format?: AdFormat
  className?: string
}

const RESERVED_HEIGHT: Record<AdFormat, number> = {
  auto: 100,
  horizontal: 90,
  rectangle: 250,
}

const CLIENT_ID = 'ca-pub-1195159445218373'

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

function isStandaloneMode(): boolean {
  return typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches
}

export function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps): JSX.Element | null {
  const { consent } = useAdConsent()
  const pushed = useRef(false)

  useEffect(() => {
    if (consent !== 'granted' || isStandaloneMode() || pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {
      // adsbygoogle 스크립트 미로드 시 무시
    }
  }, [consent])

  if (consent !== 'granted' || isStandaloneMode()) return null

  if (import.meta.env.DEV) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400 ${className}`}
        style={{ minHeight: RESERVED_HEIGHT[format] }}
        aria-hidden="true"
      >
        광고 영역 ({format}, slot: {slot})
      </div>
    )
  }

  return (
    <div className={className} style={{ minHeight: RESERVED_HEIGHT[format] }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format === 'auto' ? 'auto' : undefined}
        data-full-width-responsive={format === 'auto' ? 'true' : undefined}
      />
    </div>
  )
}
