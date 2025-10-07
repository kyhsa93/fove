import { createContext, useCallback, useContext, useMemo, useState, type JSX, type ReactNode } from 'react'

export type ResultKind = 'saju' | 'mbti' | 'fortune' | 'lotto' | 'cross'

export interface StoredResultEntry {
  id: string
  kind: ResultKind
  title: string
  subtitle?: string
  summary: string
  timestamp: number
  badge?: string
}

interface ResultHistoryContextValue {
  history: StoredResultEntry[]
  favorites: StoredResultEntry[]
  addEntry: (entry: StoredResultEntry) => void
  toggleFavorite: (entry: StoredResultEntry) => void
  isFavorite: (id: string) => boolean
}

const HISTORY_STORAGE_KEY = 'fove:result-history'
const FAVORITES_STORAGE_KEY = 'fove:result-favorites'
const MAX_HISTORY = 30

const ResultHistoryContext = createContext<ResultHistoryContextValue | undefined>(undefined)

const safeParse = (value: string | null): StoredResultEntry[] => {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((item): item is StoredResultEntry =>
        typeof item === 'object' && item !== null && typeof item.id === 'string' && typeof item.title === 'string' && typeof item.kind === 'string'
      )
      .map((item) => ({ ...item, timestamp: typeof item.timestamp === 'number' ? item.timestamp : Date.now() }))
  } catch (error) {
    console.warn('Failed to parse stored results:', error)
    return []
  }
}

const save = (key: string, entries: StoredResultEntry[]) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(entries))
  } catch (error) {
    console.warn(`Failed to persist ${key}:`, error)
  }
}

export function ResultHistoryProvider({ children }: { children: ReactNode }): JSX.Element {
  const [history, setHistory] = useState<StoredResultEntry[]>(() => {
    if (typeof window === 'undefined') return []
    return safeParse(window.localStorage.getItem(HISTORY_STORAGE_KEY))
  })
  const [favorites, setFavorites] = useState<StoredResultEntry[]>(() => {
    if (typeof window === 'undefined') return []
    return safeParse(window.localStorage.getItem(FAVORITES_STORAGE_KEY))
  })

  const addEntry = useCallback((entry: StoredResultEntry) => {
    if (!entry?.id) return
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.id !== entry.id)
      const next = [{ ...entry }, ...filtered].slice(0, MAX_HISTORY)
      if (typeof window !== 'undefined') {
        save(HISTORY_STORAGE_KEY, next)
      }
      return next
    })
  }, [])

  const toggleFavorite = useCallback((entry: StoredResultEntry) => {
    if (!entry?.id) return
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === entry.id)
      const next = exists ? prev.filter((item) => item.id !== entry.id) : [{ ...entry }, ...prev]
      if (typeof window !== 'undefined') {
        save(FAVORITES_STORAGE_KEY, next)
      }
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (id: string) => {
      return favorites.some((item) => item.id === id)
    },
    [favorites]
  )

  const value = useMemo<ResultHistoryContextValue>(() => ({ history, favorites, addEntry, toggleFavorite, isFavorite }), [history, favorites, addEntry, toggleFavorite, isFavorite])

  return <ResultHistoryContext.Provider value={value}>{children}</ResultHistoryContext.Provider>
}

export function useResultHistory(): ResultHistoryContextValue {
  const ctx = useContext(ResultHistoryContext)
  if (!ctx) {
    throw new Error('useResultHistory must be used within a ResultHistoryProvider')
  }
  return ctx
}
