import type { DailyFortune, SajuResult } from './types'

const LCG_MODULUS = 0x100000000
const LCG_MULTIPLIER = 1664525
const LCG_INCREMENT = 1013904223

const createSeed = (value: string): number => {
  let hash = 0
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) % LCG_MODULUS
  }
  return hash || 1
}

const createRandomGenerator = (seedValue: number) => {
  let state = seedValue >>> 0
  return () => {
    state = (state * LCG_MULTIPLIER + LCG_INCREMENT) % LCG_MODULUS
    return state / LCG_MODULUS
  }
}

const buildSeedString = (result: SajuResult, fortune: DailyFortune): string => {
  const parts = [
    result.meta.solarDate,
    result.meta.gender,
    result.pillars.day.name,
    result.summary.strongest.element,
    fortune.dateLabel,
    fortune.pillarName,
    fortune.energyText,
    fortune.actionText,
    fortune.cautionText
  ]
  return parts.join('|')
}

export interface LuckyNumbers {
  numbers: number[]
  bonus: number
}

export function recommendLottoNumbers(result: SajuResult, fortune: DailyFortune): LuckyNumbers {
  const seedString = buildSeedString(result, fortune)
  const seed = createSeed(seedString)
  const random = createRandomGenerator(seed)

  const selected = new Set<number>()
  while (selected.size < 6) {
    const next = Math.floor(random() * 45) + 1
    selected.add(next)
  }

  const numbers = Array.from(selected)
  numbers.sort((a, b) => a - b)

  let bonus = Math.floor(random() * 45) + 1
  while (selected.has(bonus)) {
    bonus = Math.floor(random() * 45) + 1
  }

  return { numbers, bonus }
}
