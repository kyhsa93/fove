import fs from 'fs'
import path from 'path'

const TERM_DEFS = [
  { term: '小寒', angle: 285, approxMonth: 0, approxDay: 5 },
  { term: '立春', angle: 315, approxMonth: 1, approxDay: 4 },
  { term: '驚蟄', angle: 345, approxMonth: 2, approxDay: 5 },
  { term: '清明', angle: 15, approxMonth: 3, approxDay: 5 },
  { term: '立夏', angle: 45, approxMonth: 4, approxDay: 5 },
  { term: '芒種', angle: 75, approxMonth: 5, approxDay: 6 },
  { term: '小暑', angle: 105, approxMonth: 6, approxDay: 7 },
  { term: '立秋', angle: 135, approxMonth: 7, approxDay: 7 },
  { term: '白露', angle: 165, approxMonth: 8, approxDay: 7 },
  { term: '寒露', angle: 195, approxMonth: 9, approxDay: 8 },
  { term: '立冬', angle: 225, approxMonth: 10, approxDay: 7 },
  { term: '大雪', angle: 255, approxMonth: 11, approxDay: 7 }
]

const OUTPUT_PATH = path.resolve('src/solarTerms.ts')
const YEAR_START = 1899
const YEAR_END = 2100

function deg2rad(deg) {
  return (deg * Math.PI) / 180
}

function rad2deg(rad) {
  return (rad * 180) / Math.PI
}

function normalizeAngle(angle) {
  let a = angle % 360
  if (a < 0) a += 360
  return a
}

function angleDifference(target, current) {
  let diff = target - current
  diff = ((diff + 180) % 360) - 180
  return diff
}

function julianDayFromDate(date) {
  return date.getTime() / 86400000 + 2440587.5
}

function julianDayToDate(jd) {
  const z = Math.floor(jd + 0.5)
  const f = jd + 0.5 - z
  let a = z
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25)
    a = z + 1 + alpha - Math.floor(alpha / 4)
  }
  const b = a + 1524
  const c = Math.floor((b - 122.1) / 365.25)
  const d = Math.floor(365.25 * c)
  const e = Math.floor((b - d) / 30.6001)
  const day = b - d - Math.floor(30.6001 * e) + f
  const month = e < 14 ? e - 1 : e - 13
  const year = month > 2 ? c - 4716 : c - 4715

  const dayInt = Math.floor(day)
  const dayFrac = day - dayInt
  const hours = dayFrac * 24
  const hour = Math.floor(hours)
  const minutes = (hours - hour) * 60
  const minute = Math.floor(minutes)
  const seconds = (minutes - minute) * 60
  const second = Math.floor(seconds)
  const millisecond = Math.round((seconds - second) * 1000)

  return new Date(Date.UTC(year, month - 1, dayInt, hour, minute, second, millisecond))
}

function calendarFromJulianDay(jd) {
  const date = julianDayToDate(jd)
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    date
  }
}

function deltaTSecondsFromJd(jd) {
  const { year, month } = calendarFromJulianDay(jd)
  return deltaTSeconds(year + (month - 0.5) / 12)
}

function deltaTSeconds(yearDecimal) {
  const y = yearDecimal
  let t

  if (y < 1900) {
    const u = y - 1860
    return (
      7.62 +
      0.5737 * u -
      0.251754 * u * u +
      0.01680668 * u ** 3 -
      0.0004473624 * u ** 4 +
      u ** 5 / 233174
    )
  }

  if (y < 1920) {
    t = y - 1900
    return -2.79 + 1.494119 * t - 0.0598939 * t ** 2 + 0.0061966 * t ** 3 - 0.000197 * t ** 4
  }

  if (y < 1941) {
    t = y - 1920
    return 21.20 + 0.84493 * t - 0.076100 * t ** 2 + 0.0020936 * t ** 3
  }

  if (y < 1961) {
    t = y - 1950
    return 29.07 + 0.407 * t - t ** 2 / 233 + t ** 3 / 2547
  }

  if (y < 1986) {
    t = y - 1975
    return 45.45 + 1.067 * t - t ** 2 / 260 - t ** 3 / 718
  }

  if (y < 2005) {
    t = y - 2000
    return (
      63.86 +
      0.3345 * t -
      0.060374 * t ** 2 +
      0.0017275 * t ** 3 +
      0.000651814 * t ** 4 +
      0.00002373599 * t ** 5
    )
  }

  if (y < 2050) {
    t = y - 2000
    return 62.92 + 0.32217 * t + 0.005589 * t ** 2
  }

  if (y < 2150) {
    t = (y - 1820) / 100
    return -20 + 32 * t ** 2 - 0.5628 * (2150 - y)
  }

  // Beyond 2150 fallback
  const u = (y - 1820) / 100
  return -20 + 32 * u ** 2
}

function solarLongitude(jd) {
  const T = (jd - 2451545.0) / 36525
  const L0 = normalizeAngle(
    280.46646 + 36000.76983 * T + 0.0003032 * T ** 2
  )
  const M = normalizeAngle(
    357.52911 + 35999.05029 * T - 0.0001537 * T ** 2 - 0.00000048 * T ** 3
  )
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T ** 2

  const Mrad = deg2rad(M)
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T ** 2) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad)

  const trueLong = L0 + C
  const omega = 125.04 - 1934.136 * T
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(deg2rad(omega))
  return normalizeAngle(lambda)
}

function findSolarTermUt(year, termDef) {
  // Initial guess in UTC, using approximate month/day
  let guessDate = new Date(Date.UTC(year, termDef.approxMonth, termDef.approxDay, 0, 0, 0))

  // Adjust for terms that may belong to next year (rare but keep safe)
  if (termDef.term === '小寒' && termDef.approxMonth === 0) {
    // Ensure we're always looking at January of the target year
    guessDate = new Date(Date.UTC(year, 0, termDef.approxDay, 0, 0, 0))
  }

  let jdUt = julianDayFromDate(guessDate)

  for (let i = 0; i < 8; i++) {
    const deltaSec = deltaTSecondsFromJd(jdUt)
    const jde = jdUt + deltaSec / 86400
    const lambda = solarLongitude(jde)
    const diff = angleDifference(termDef.angle, lambda)
    jdUt += diff / 0.98564736629
  }

  const finalDeltaSec = deltaTSecondsFromJd(jdUt)
  const finalJde = jdUt + finalDeltaSec / 86400
  const finalLambda = solarLongitude(finalJde)
  const finalDiff = Math.abs(angleDifference(termDef.angle, finalLambda))
  if (finalDiff > 0.01) {
    console.warn(`Warning: convergence issue for ${year} ${termDef.term}: diff=${finalDiff.toFixed(4)}°`)
  }

  return jdUt
}

function buildDataset() {
  const result = {}
  for (let year = YEAR_START; year <= YEAR_END; year++) {
    result[year] = TERM_DEFS.map((def) => {
      const jdUt = findSolarTermUt(year, def)
      const date = julianDayToDate(jdUt)
      return {
        term: def.term,
        iso: date.toISOString()
      }
    })
  }
  return result
}

function formatDataset(dataset) {
  const lines = []
  lines.push('// Auto-generated by scripts/generateSolarTerms.mjs')
  lines.push('// Contains solar term boundaries (UTC) used for month pillar calculations.')
  lines.push('export interface SolarTermEntry { term: SolarTermName; iso: string }')
  lines.push("export type SolarTermName = '小寒' | '立春' | '驚蟄' | '清明' | '立夏' | '芒種' | '小暑' | '立秋' | '白露' | '寒露' | '立冬' | '大雪'")
  lines.push('export const SOLAR_TERMS: Record<number, SolarTermEntry[]> = {')

  const years = Object.keys(dataset).map(Number).sort((a, b) => a - b)
  for (const year of years) {
    const entries = dataset[year]
    const entryLines = entries
      .map((entry) => `    { term: '${entry.term}', iso: '${entry.iso}' }`)
      .join(',\n')
    lines.push(`  ${year}: [\n${entryLines}\n  ],`)
  }
  lines.push('}')
  lines.push('')
  return lines.join('\n')
}

function main() {
  const dataset = buildDataset()
  const content = formatDataset(dataset)
  fs.writeFileSync(OUTPUT_PATH, content, 'utf8')
  console.log(`Wrote solar terms to ${OUTPUT_PATH}`)
}

main()
