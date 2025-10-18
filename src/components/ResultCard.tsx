import { useEffect, useMemo, useState, type JSX, type ReactNode } from 'react'
import { useResultHistory, type StoredResultEntry } from '../hooks/useResultHistory'
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
  entry: StoredResultEntry
  metrics?: ResultMetric[]
  summary?: string
  tabs?: ResultTab[]
  footer?: ReactNode
  actions?: ReactNode
}

export function ResultCard({ entry, metrics = [], summary, tabs = [], footer, actions }: ResultCardProps): JSX.Element {
  const { toggleFavorite, isFavorite } = useResultHistory()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id ?? '')
  const favorite = isFavorite(entry.id)

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

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    const url = new URL(window.location.href)
    url.searchParams.set('tool', entry.kind)
    return url.toString()
  }, [entry.kind])

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
    if (!shareUrl) {
      handleCopyLink()
      return
    }
    if (navigator.share) {
      try {
        await navigator.share({
          title: entry.title,
          text: summary ?? entry.summary ?? '',
          url: shareUrl
        })
      } catch (shareError) {
        if (shareError instanceof Error && shareError.name === 'AbortError') return
        console.warn('Failed to invoke share dialog', shareError)
        handleCopyLink()
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <section className="rounded-3xl border border-slate-100 bg-white/95 px-2 py-4 shadow-sm backdrop-blur-sm sm:px-6 sm:py-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {entry.badge ?? entry.kind.toUpperCase()}
          </p>
          <h2 className="text-2xl font-bold text-slate-900">{entry.title}</h2>
          {entry.subtitle ? <p className="text-sm text-slate-600">{entry.subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-2">
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
          <button
            type="button"
            onClick={() => toggleFavorite(entry)}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-base transition ${
              favorite
                ? 'border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100'
                : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-100 hover:text-rose-500'
            }`}
            aria-pressed={favorite}
            aria-label={favorite ? '즐겨찾기 해제' : '즐겨찾기에 추가'}
          >
            {favorite ? '♥' : '♡'}
          </button>
        </div>
      </header>

      {metrics.length ? (
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-3 sm:px-4">
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{metric.label}</dt>
              <dd className="mt-1 text-lg font-semibold text-slate-900">{metric.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {summary ? <p className="mt-6 text-sm leading-relaxed text-slate-700">{summary}</p> : null}

      {tabs.length ? (
        <div className="mt-6 space-y-4">
          <nav className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
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

      {actions ? <div className="mt-6">{actions}</div> : null}
      {footer ? <div className="mt-6 text-xs text-slate-500">{footer}</div> : null}
    </section>
  )
}
