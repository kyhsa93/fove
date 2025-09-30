import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type JSX, type ReactNode } from 'react'

interface ToastItem {
  id: string
  message: string
  tone: 'info' | 'success' | 'error'
  duration: number
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastItem['tone'], duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const DEFAULT_DURATION = 4000

const getId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export function ToastProvider({ children }: { children: ReactNode }): JSX.Element {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timeouts = useRef<Record<string, number>>({})

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const timeoutId = timeouts.current[id]
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      delete timeouts.current[id]
    }
  }, [])

  const showToast = useCallback<ToastContextValue['showToast']>((message, tone = 'info', duration = DEFAULT_DURATION) => {
    if (!message) return
    const id = getId()
    setToasts((prev) => [...prev, { id, message, tone, duration }])
    const timeoutId = window.setTimeout(() => dismiss(id), duration)
    timeouts.current[id] = timeoutId
  }, [dismiss])

  useEffect(() => {
    return () => {
      Object.values(timeouts.current).forEach((timeoutId) => window.clearTimeout(timeoutId))
      timeouts.current = {}
    }
  }, [])

  const value = useMemo<ToastContextValue>(() => ({ showToast }), [showToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
        <div className="w-full max-w-md space-y-2" aria-live="assertive" aria-atomic="true">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg transition ${
                toast.tone === 'error'
                  ? 'border-rose-200 bg-rose-50 text-rose-900'
                  : toast.tone === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-slate-200 bg-white/95 text-slate-900'
              }`}
            >
              <span className="mt-0.5 text-base">
                {toast.tone === 'error' ? '⚠️' : toast.tone === 'success' ? '✅' : 'ℹ️'}
              </span>
              <p className="flex-1 leading-relaxed">{toast.message}</p>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                className="inline-flex h-6 w-6 items-center justify-center rounded-md text-xs text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return ctx
}
