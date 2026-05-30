import { useEffect, useMemo, useState, type JSX, type ReactNode } from 'react'
import { useToast } from './ToastProvider'

interface ResultMetric {
  label: string
  value: string
}

interface ResultTab {
  id: string
  label: string
  content: ReactNode
}

interface ResultCardProps {
  badge: string
  title: string
  subtitle?: string
  metrics?: ResultMetric[]
  summary?: string
  tabs?: ResultTab[]
  footer?: ReactNode
  actions?: ReactNode
  onShare?: () => void
  onTabChange?: (tabId: string) => void
}

export function ResultCard({ badge, title, subtitle, metrics = [], summary, tabs = [], footer, actions, onShare, onTabChange }: ResultCardProps): JSX.Element {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id ?? '')

  useEffect(() => {
    if (tabs.length && !tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0].id)
    }
  }, [tabs, activeTab])

  const displayedTab = useMemo(() => {
    if (!tabs.length) return undefined
    const fallbackId = activeTab || tabs[0].id
    return tabs.find((tab) => tab.id === fallbackId) ?? tabs[0]
  }, [tabs, activeTab])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopyLink = async () => {
    if (!shareUrl) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = shareUrl
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      showToast('링크를 복사했습니다.', 'success')
    } catch (copyError) {
      console.warn('Failed to copy link', copyError)
      showToast('링크 복사에 실패했어요. 다시 시도해 주세요.', 'error')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: summary ?? '', url: shareUrl })
        onShare?.()
      } catch (shareError) {
        if (shareError instanceof Error && shareError.name === 'AbortError') return
        handleCopyLink()
        onShare?.()
      }
    } else {
      handleCopyLink()
      onShare?.()
    }
  }

  return (
    <section className="rounded-3xl border border-slate-100 bg-white/95 px-2 py-4 shadow-sm backdrop-blur-sm sm:px-6 sm:py-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{badge}</p>
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium transition hover:bg-slate-100 hover:text-slate-700"
          >
            <span aria-hidden="true">📤</span>
            공유
          </button>
          <span className="h-4 w-px bg-slate-200" aria-hidden="true" />
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium transition hover:bg-slate-100 hover:text-slate-700"
          >
            <span aria-hidden="true">🔗</span>
            링크 복사
          </button>
        </div>
      </header>

      <div className="mt-6 lg:grid lg:grid-cols-[260px_1fr] lg:gap-8 lg:items-start">
        {(metrics.length > 0 || summary) ? (
          <div className="space-y-4">
            {metrics.length ? (
              <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3 sm:px-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{metric.label}</dt>
                    <dd className="mt-1 text-lg font-semibold text-slate-900">{metric.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {summary ? <p className="text-sm leading-relaxed text-slate-700">{summary}</p> : null}
          </div>
        ) : <div />}

        {tabs.length ? (
          <div className="mt-6 lg:mt-0 lg:border-l lg:border-slate-100 lg:pl-8 space-y-4">
            <nav className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveTab(tab.id); onTabChange?.(tab.id) }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    (displayedTab?.id ?? tabs[0].id) === tab.id
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'border border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="rounded-2xl border border-slate-100 bg-white/90 px-3 py-4 text-sm leading-relaxed text-slate-700 sm:px-5 sm:py-5">
              {displayedTab?.content ?? null}
            </div>
          </div>
        ) : null}
      </div>

      {actions ? <div className="mt-6">{actions}</div> : null}
      {footer ? <div className="mt-6 text-xs text-slate-500">{footer}</div> : null}
    </section>
  )
}
