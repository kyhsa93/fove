import { useEffect, useMemo, useState } from 'react'
import {
  buildDailyFortune,
  buildElementBars,
  buildInterpretation,
  calculateSaju,
  getTodayKey,
  type DailyFortune,
  type ElementBar,
  type Gender,
  type InterpretationCategory,
  type SajuResult
} from '../lib/saju'

const ONE_MINUTE = 60 * 1000

const parseTodayKey = (todayKey: string): Date | null => {
  const [year, month, day] = todayKey.split('-').map((value) => Number(value))
  if (!year || !month || !day || Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    return null
  }
  return new Date(year, month - 1, day)
}

export interface UseSajuCalculatorState {
  birthDate: string
  birthTime: string
  gender: Gender
  result: SajuResult | null
  error: string
  elementBars: ElementBar[]
  interpretation: InterpretationCategory[]
  dailyFortune: DailyFortune | null
  todayKey: string
  setBirthDate: (value: string) => void
  setBirthTime: (value: string) => void
  setGender: (value: Gender) => void
}

export function useSajuCalculator(): UseSajuCalculatorState {
  const [birthDate, setBirthDate] = useState<string>('')
  const [birthTime, setBirthTime] = useState<string>('')
  const [gender, setGender] = useState<Gender>('male')
  const [result, setResult] = useState<SajuResult | null>(null)
  const [error, setError] = useState<string>('')
  const [todayKey, setTodayKey] = useState<string>(() => getTodayKey())

  useEffect(() => {
    if (!birthDate) {
      setResult(null)
      setError('')
      return
    }

    try {
      const data = calculateSaju(birthDate, birthTime, gender)
      setResult(data)
      setError('')
    } catch (err) {
      const message = err instanceof Error ? err.message : '사주를 계산하는 동안 문제가 발생했습니다.'
      setResult(null)
      setError(message)
    }
  }, [birthDate, birthTime, gender])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateKey = () => {
      setTodayKey((prev) => {
        const nextKey = getTodayKey()
        return prev === nextKey ? prev : nextKey
      })
    }

    const intervalId = window.setInterval(updateKey, ONE_MINUTE)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const elementBars = useMemo<ElementBar[]>(() => buildElementBars(result), [result])

  const interpretation = useMemo<InterpretationCategory[]>(() => {
    if (!result) return []
    return buildInterpretation(result)
  }, [result])

  const dailyFortune = useMemo<DailyFortune | null>(() => {
    if (!result) return null

    const referenceDate = parseTodayKey(todayKey) ?? new Date()
    return buildDailyFortune(result, referenceDate)
  }, [result, todayKey])

  return {
    birthDate,
    birthTime,
    gender,
    result,
    error,
    elementBars,
    interpretation,
    dailyFortune,
    todayKey,
    setBirthDate,
    setBirthTime,
    setGender
  }
}
