import { type JSX } from 'react'
import { useAdConsent } from '../lib/adConsent'

export function ConsentBanner(): JSX.Element | null {
  const { consent, grant, deny } = useAdConsent()

  if (consent !== null) return null

  return (
    <div
      role="dialog"
      aria-label="쿠키 및 광고 동의"
      className="fixed inset-x-0 bottom-16 z-40 px-3 pb-2 sm:bottom-0 sm:pb-4"
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white/95 px-4 py-4 shadow-xl backdrop-blur sm:flex sm:items-center sm:gap-6 sm:px-6">
        <p className="flex-1 text-sm leading-relaxed text-slate-600">
          Fove는 관련성 높은 광고 제공을 위해 쿠키를 사용합니다.
          자세한 내용은{' '}
          <a
            href="/privacy-policy"
            className="underline underline-offset-2 hover:text-slate-900"
          >
            개인정보 처리방침
          </a>
          을 확인하세요.
        </p>
        <div className="mt-3 flex gap-2 sm:mt-0 sm:shrink-0">
          <button
            type="button"
            onClick={deny}
            className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:flex-none"
          >
            거부
          </button>
          <button
            type="button"
            onClick={grant}
            className="flex-1 rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 sm:flex-none"
          >
            동의
          </button>
        </div>
      </div>
    </div>
  )
}
