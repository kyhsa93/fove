import { JSX, useCallback, useEffect, useState } from 'react'
import { useAdConsent } from '../lib/adConsent'
import {
  shouldShowBanner,
  isIosSafari,
  markDismissed,
  markInstalled,
} from '../lib/installPrompt'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type BannerState = 'hidden' | 'android' | 'ios'

export function InstallBanner(): JSX.Element | null {
  const { consent } = useAdConsent()
  const [state, setState] = useState<BannerState>('hidden')
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // 동의 배너가 아직 표시 중이면 설치 배너도 표시하지 않음
    if (consent === null) return
    if (!shouldShowBanner()) return

    // Android/Chrome: beforeinstallprompt 이벤트 대기
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setState('android')
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // iOS Safari: 이미 이벤트가 없으므로 즉시 판단
    if (isIosSafari()) {
      setState('ios')
    }

    // appinstalled 이벤트: 설치 완료 감지
    const handleInstalled = () => {
      markInstalled()
      setState('hidden')
    }
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [consent])

  const handleAndroidInstall = useCallback(async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      markInstalled()
    } else {
      markDismissed()
    }
    setDeferredPrompt(null)
    setState('hidden')
  }, [deferredPrompt])

  const handleDismiss = useCallback(() => {
    markDismissed()
    setState('hidden')
  }, [])

  const handleIosInstalled = useCallback(() => {
    markInstalled()
    setState('hidden')
  }, [])

  if (state === 'hidden') return null

  // ── Android/Chrome 배너 ──────────────────────────────────────────────────
  if (state === 'android') {
    return (
      <div
        role="dialog"
        aria-label="앱 설치 안내"
        className="fixed inset-x-0 bottom-16 z-40 px-3 pb-2 sm:bottom-4"
      >
        <div className="mx-auto max-w-2xl rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-4 shadow-xl sm:flex sm:items-center sm:gap-4 sm:px-6">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl shrink-0">📲</span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-indigo-900">홈 화면에 추가하면 더 편해요</p>
              <p className="text-xs text-indigo-700 mt-0.5">앱처럼 바로 열리고, 알림도 더 잘 받을 수 있어요.</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2 sm:mt-0 sm:shrink-0">
            <button
              type="button"
              onClick={handleDismiss}
              className="flex-1 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50 sm:flex-none"
            >
              나중에
            </button>
            <button
              type="button"
              onClick={handleAndroidInstall}
              className="flex-1 rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 sm:flex-none"
            >
              홈 화면에 추가
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── iOS Safari 가이드 모달 ───────────────────────────────────────────────
  return (
    <div
      role="dialog"
      aria-label="iOS 앱 설치 안내"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-4 sm:items-center sm:pb-0"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleDismiss} aria-hidden="true" />
      <div className="relative w-full max-w-sm rounded-3xl bg-white px-6 py-6 shadow-2xl space-y-5">
        <div className="text-center space-y-1">
          <p className="text-2xl">📲</p>
          <h2 className="text-base font-bold text-slate-900">홈 화면에 추가하기</h2>
          <p className="text-xs text-slate-500">앱처럼 바로 열 수 있어요. 딱 3단계예요!</p>
        </div>

        <ol className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">1</span>
            <div>
              <p className="text-sm font-medium text-slate-800">하단 공유 버튼 탭</p>
              <p className="text-xs text-slate-500 mt-0.5">Safari 하단 가운데의 <span className="font-semibold">⬆ 공유</span> 아이콘을 탭하세요.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">2</span>
            <div>
              <p className="text-sm font-medium text-slate-800">'홈 화면에 추가' 선택</p>
              <p className="text-xs text-slate-500 mt-0.5">공유 메뉴에서 <span className="font-semibold">홈 화면에 추가</span>를 찾아 탭하세요.</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-xs font-bold text-white">3</span>
            <div>
              <p className="text-sm font-medium text-slate-800">추가 버튼 탭</p>
              <p className="text-xs text-slate-500 mt-0.5">우측 상단 <span className="font-semibold">추가</span>를 탭하면 완료!</p>
            </div>
          </li>
        </ol>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            나중에
          </button>
          <button
            type="button"
            onClick={handleIosInstalled}
            className="flex-1 rounded-full bg-indigo-500 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600"
          >
            설치했어요 ✓
          </button>
        </div>
      </div>
    </div>
  )
}
