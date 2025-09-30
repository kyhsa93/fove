import { useEffect, useMemo, useState, type JSX, type ReactNode } from 'react'
import { useResultHistory, type StoredResultEntry } from '../hooks/useResultHistory'

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
  loading?: boolean
}

export function ResultCard({ entry, metrics = [], summary, tabs = [], footer, actions, loading = false }: ResultCardProps): JSX.Element {
  const { toggleFavorite, isFavorite } = useResultHistory()
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

  if (loading) {
    return <ResultCardSkeleton />
  }

  return (
    <section className="rounded-3xl border border-slate-100 bg-white/95 p-6 shadow-sm backdrop-blur-sm">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {entry.badge ?? entry.kind.toUpperCase()}
          </p>
          <h2 className="text-2xl font-bold text-slate-900">{entry.title}</h2>
          {entry.subtitle ? <p className="text-sm text-slate-600">{entry.subtitle}</p> : null}
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
      </header>

      {metrics.length ? (
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
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
          <div className="rounded-2xl border border-slate-100 bg-white/90 p-5 text-sm leading-relaxed text-slate-700">
            {displayedTab?.content ?? null}
          </div>
        </div>
      ) : null}

      {actions ? <div className="mt-6">{actions}</div> : null}
      {footer ? <div className="mt-6 text-xs text-slate-500">{footer}</div> : null}
    </section>
  )
}

export function ResultCardSkeleton(): JSX.Element {
  return (
    <section className="animate-pulse rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-24 rounded bg-slate-200" />
          <div className="h-6 w-40 rounded bg-slate-200" />
          <div className="h-4 w-32 rounded bg-slate-200" />
        </div>
        <div className="h-9 w-9 rounded-full border border-slate-200 bg-slate-100" />
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="h-20 rounded-2xl bg-slate-100" />
        <div className="h-20 rounded-2xl bg-slate-100" />
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-4 w-full rounded bg-slate-100" />
        <div className="h-4 w-5/6 rounded bg-slate-100" />
        <div className="h-4 w-3/4 rounded bg-slate-100" />
      </div>
      <div className="mt-6 h-40 rounded-2xl bg-slate-100" />
    </section>
  )
}
