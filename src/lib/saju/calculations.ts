import { SOLAR_TERMS, type SolarTermName } from '../../solarTerms'
import {
  BRANCHES,
  BRANCH_ANIMALS,
  BRANCH_CONFLICTS,
  BRANCH_ELEMENTS,
  BRANCH_HARMONIES,
  BRANCH_YINYANG,
  CAREER_BY_ELEMENT,
  DAILY_ACTIVITY_BY_ELEMENT,
  DAILY_BRANCH_MESSAGES,
  DAILY_CARE_BY_ELEMENT,
  DAILY_ELEMENT_ALIGNMENT,
  DAILY_RELATION_MESSAGES,
  ELEMENT_CONTROLLED_BY,
  ELEMENT_CONTROLS,
  ELEMENT_LABELS,
  ELEMENT_PRODUCED_BY,
  ELEMENT_PRODUCES,
  FIRST_MONTH_STEM_INDEX,
  FLOW_MESSAGES,
  GENDER_LABELS,
  GENDER_TONE,
  HEALTH_TIPS_BY_ELEMENT,
  HONOR_FOCUS_BY_ELEMENT,
  HOUR_RANGES,
  PILLAR_FOCUS,
  RELATIONSHIP_BY_ANIMAL,
  SOLAR_TERM_INFO,
  SOLAR_TERM_YEAR_MAX,
  SOLAR_TERM_YEAR_MIN,
  STEMS,
  STEM_ELEMENTS,
  STEM_YINYANG,
  SUPPORTED_YEAR_MAX,
  SUPPORTED_YEAR_MIN,
  TEMPERAMENT_BY_ELEMENT,
  WEALTH_FOCUS_BY_ELEMENT,
  WESTERN_ZODIAC
} from './constants'
import type {
  BranchRelationKey,
  Element,
  ElementRelationKey,
  Gender,
  Stem,
  Branch,
  YinYang
} from './constants'
import type {
  DailyFortune,
  DateParts,
  ElementBar,
  MonthBoundaryInfo,
  Pillar,
  PillarExtras,
  SajuResult,
  Summary,
  InterpretationCategory,
  YearPillarInfo,
  HourInfo
} from './types'

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

export function getTodayKey(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = (now.getMonth() + 1).toString().padStart(2, '0')
  const day = now.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getSolarTermEntries(year: number): Array<{ term: SolarTermName; date: Date }> {
  const entries = SOLAR_TERMS[year]
  if (!entries) return []
  return entries.map((entry) => ({
    term: entry.term,
    date: new Date(entry.iso)
  }))
}

function resolveYearPillar(date: Date): YearPillarInfo {
  const year = date.getFullYear()
  if (year < SUPPORTED_YEAR_MIN || year > SUPPORTED_YEAR_MAX) {
    throw new Error(`지원하는 생년월일은 ${SUPPORTED_YEAR_MIN}년부터 ${SUPPORTED_YEAR_MAX}년까지입니다.`)
  }

  const lichunEntry = SOLAR_TERMS[year]?.find((entry) => entry.term === '立春')
  if (!lichunEntry) {
    throw new Error('입춘 정보를 찾을 수 없습니다.')
  }

  const lichunDate = new Date(lichunEntry.iso)
  const pillarYear = date.getTime() < lichunDate.getTime() ? year - 1 : year
  const stemIndex = mod(pillarYear - 4, STEMS.length)
  const branchIndex = mod(pillarYear - 4, BRANCHES.length)

  return {
    year: pillarYear,
    stem: STEMS[stemIndex],
    branch: BRANCHES[branchIndex],
    stemIndex,
    branchIndex
  }
}

function resolveMonthBoundary(date: Date): MonthBoundaryInfo {
  const year = date.getFullYear()
  if (year < SOLAR_TERM_YEAR_MIN - 1 || year > SOLAR_TERM_YEAR_MAX + 1) {
    throw new Error('절기 데이터를 찾을 수 없는 날짜입니다.')
  }

  const entries = [
    ...getSolarTermEntries(year - 1),
    ...getSolarTermEntries(year),
    ...getSolarTermEntries(year + 1)
  ]

  if (!entries.length) {
    throw new Error('절기 데이터를 불러올 수 없습니다.')
  }

  entries.sort((a, b) => a.date.getTime() - b.date.getTime())

  const targetTime = date.getTime()
  let selected: { term: SolarTermName; date: Date } | null = null
  for (const entry of entries) {
    if (targetTime >= entry.date.getTime()) {
      selected = entry
    } else if (selected) {
      break
    } else {
      break
    }
  }

  if (!selected) {
    throw new Error('해당 날짜보다 이전의 절기 경계를 찾을 수 없습니다.')
  }

  const detail = SOLAR_TERM_INFO[selected.term]
  if (!detail) {
    throw new Error('절기 매핑 정보가 없습니다.')
  }

  return {
    term: selected.term,
    branch: detail.branch,
    monthIndex: detail.monthIndex
  }
}

function toDateParts(date: Date): DateParts {
  const numeric = new Intl.DateTimeFormat('ko-u-ca-chinese', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  }).formatToParts(date)

  const detailed = new Intl.DateTimeFormat('ko-u-ca-chinese', {
    dateStyle: 'long'
  }).formatToParts(date)

  let lunarMonth: number | null = null
  let lunarDay: number | null = null
  let relatedYear: number | null = null
  let monthLabel: string | null = null
  let dayLabel: string | null = null
  let yearName: string | null = null

  for (const part of numeric) {
    if (part.type === 'month') {
      const cleanValue = part.value.replace(/[^0-9]/g, '')
      lunarMonth = cleanValue ? parseInt(cleanValue, 10) : null
    }
    if (part.type === 'day') lunarDay = parseInt(part.value, 10)
    if ((part.type as string) === 'relatedYear') relatedYear = parseInt(part.value, 10)
  }

  for (const part of detailed) {
    if (part.type === 'month') monthLabel = part.value
    if (part.type === 'day') dayLabel = part.value
    if ((part.type as string) === 'yearName') yearName = part.value
  }

  if (!yearName || lunarMonth == null || lunarDay == null) {
    throw new Error('음력 정보를 계산할 수 없습니다.')
  }

  return {
    lunarMonth,
    lunarDay,
    relatedYear,
    monthLabel,
    dayLabel,
    yearName,
    isLeapMonth: monthLabel ? monthLabel.includes('윤') : false
  }
}

function getDayStemBranch(year: number, month: number, day: number): [number, number] {
  let Y = year
  let M = month
  const D = day

  if (M === 1 || M === 2) {
    Y -= 1
    M += 12
  }

  const C = Math.floor(Y / 100)
  const Y2 = Y % 100
  const term = Math.floor((3 * (M + 1)) / 5)

  const stemIndex = mod(
    4 * C + Math.floor(C / 4) + 5 * Y2 + Math.floor(Y2 / 4) + term + D - 3,
    10
  )
  const branchIndex = mod(
    8 * C + Math.floor(C / 4) + 5 * Y2 + Math.floor(Y2 / 4) + term + D + 7,
    12
  )

  return [stemIndex, branchIndex]
}

function getHourInfo(dayStemIndex: number, hourDecimal: number | null): HourInfo | null {
  if (hourDecimal == null) return null
  const hourIndex = mod(Math.floor((hourDecimal + 1) / 2), 12)
  const branch = BRANCHES[hourIndex]
  const stemIndex = mod(dayStemIndex * 2 + hourIndex, 10)
  const stem = STEMS[stemIndex]
  return {
    stem,
    branch,
    range: HOUR_RANGES[hourIndex]
  }
}

function getWesternZodiac(month: number, day: number): string {
  const target = month * 100 + day
  let selected = WESTERN_ZODIAC[0]
  for (const zodiac of WESTERN_ZODIAC) {
    const [m, d] = zodiac.start
    const threshold = m * 100 + d
    if (target >= threshold) {
      selected = zodiac
    }
  }
  if (target >= 1222) {
    selected = WESTERN_ZODIAC[WESTERN_ZODIAC.length - 1]
  }
  return selected.name
}

function buildPillar(stem: Stem, branch: Branch, extras: PillarExtras = {}): Pillar {
  return {
    stem,
    branch,
    name: `${stem}${branch}`,
    stemElement: STEM_ELEMENTS[stem],
    branchElement: BRANCH_ELEMENTS[branch],
    stemYinYang: STEM_YINYANG[stem],
    branchYinYang: BRANCH_YINYANG[branch],
    animal: BRANCH_ANIMALS[branch],
    ...extras
  }
}

function makeSummary(pillars: Pillar[], hasHour: boolean): Summary {
  const elementCounts: Record<Element, number> = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 }
  const yinYangCounts: Record<YinYang, number> = { 양: 0, 음: 0 }

  const activePillars = hasHour ? pillars : pillars.slice(0, 3)

  for (const pillar of activePillars) {
    elementCounts[pillar.stemElement] += 1
    elementCounts[pillar.branchElement] += 1
    yinYangCounts[pillar.stemYinYang] += 1
    yinYangCounts[pillar.branchYinYang] += 1
  }

  const elementsArray = (Object.entries(elementCounts) as Array<[Element, number]>).map(([element, count]) => ({
    element,
    count
  }))
  elementsArray.sort((a, b) => b.count - a.count)

  const maxCount = elementsArray[0].count
  const minCount = elementsArray[elementsArray.length - 1].count

  const strongest = elementsArray.find((item) => item.count === maxCount) ?? elementsArray[0]
  const weakest = elementsArray.find((item) => item.count === minCount) ?? elementsArray[elementsArray.length - 1]

  const yinYangMessage = yinYangCounts.양 === yinYangCounts.음
    ? '음양의 균형이 비교적 잘 맞습니다.'
    : yinYangCounts.양 > yinYangCounts.음
      ? `양(${yinYangCounts.양})의 기운이 더 강합니다.`
      : `음(${yinYangCounts.음})의 기운이 더 강합니다.`

  return {
    elementCounts,
    yinYangCounts,
    strongest,
    weakest,
    yinYangMessage,
    elementsArray,
    totalElements: activePillars.length * 2
  }
}

export function calculateSaju(birthDateStr: string, birthTimeStr: string, gender: Gender): SajuResult {
  const [yStr, mStr, dStr] = birthDateStr.split('-')
  if (!yStr || !mStr || !dStr) {
    throw new Error('생년월일을 정확히 입력해 주세요.')
  }
  const year = parseInt(yStr, 10)
  const month = parseInt(mStr, 10)
  const day = parseInt(dStr, 10)

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
    throw new Error('생년월일 형식을 확인해 주세요.')
  }

  let hasTime = Boolean(birthTimeStr)
  let hour = 12
  let minute = 0
  if (hasTime) {
    const [hStr, minStr] = birthTimeStr.split(':')
    if (!hStr) {
      hasTime = false
    } else {
      hour = parseInt(hStr, 10)
      minute = minStr ? parseInt(minStr, 10) : 0
      if (Number.isNaN(hour) || Number.isNaN(minute)) {
        throw new Error('시간 형식을 확인해 주세요.')
      }
    }
  }

  const date = new Date(year, month - 1, day, hour, minute)
  if (Number.isNaN(date.getTime())) {
    throw new Error('유효하지 않은 날짜입니다.')
  }

  const { lunarMonth, lunarDay, relatedYear, monthLabel, dayLabel, isLeapMonth } = toDateParts(date)

  const yearInfo = resolveYearPillar(date)
  const monthBoundary = resolveMonthBoundary(date)

  const yearStem = yearInfo.stem
  const yearBranch = yearInfo.branch
  const yearStemIndex = yearInfo.stemIndex

  const monthBranch = monthBoundary.branch
  const monthStemIndex = mod(FIRST_MONTH_STEM_INDEX[yearStemIndex] + monthBoundary.monthIndex, STEMS.length)
  const monthStem = STEMS[monthStemIndex]

  const [dayStemIndexRaw, dayBranchIndexRaw] = getDayStemBranch(year, month, day)
  const dayStem = STEMS[mod(dayStemIndexRaw, STEMS.length)]
  const dayBranch = BRANCHES[mod(dayBranchIndexRaw, BRANCHES.length)]

  const yearPillar = buildPillar(yearStem, yearBranch, { focus: PILLAR_FOCUS.year })
  const monthPillar = buildPillar(monthStem, monthBranch, {
    focus: PILLAR_FOCUS.month,
    lunarMonth,
    isLeapMonth,
    monthLabel
  })
  const dayPillar = buildPillar(dayStem, dayBranch, { focus: PILLAR_FOCUS.day })
  const hourBase = hasTime ? getHourInfo(dayStemIndexRaw, hour + minute / 60) : null
  const hourPillar = hourBase
    ? buildPillar(hourBase.stem, hourBase.branch, { focus: PILLAR_FOCUS.hour, range: hourBase.range })
    : null

  const solidPillars: Pillar[] = [yearPillar, monthPillar, dayPillar, hourPillar].filter((p): p is Pillar => Boolean(p))
  const summary = makeSummary(solidPillars, Boolean(hourPillar))

  const weekday = new Intl.DateTimeFormat('ko', { weekday: 'long' }).format(date)
  const westernZodiac = getWesternZodiac(month, day)

  const lunarText = `${monthLabel || `${lunarMonth}월`} ${dayLabel || `${lunarDay}일`}`.trim()

  return {
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar
    },
    summary,
    meta: {
      solarDate: `${year}년 ${month}월 ${day}일 (${weekday})`,
      lunarDate: lunarText,
      lunarRelatedYear: relatedYear,
      westernZodiac,
      hasTime: Boolean(hourPillar),
      timeText: hasTime ? `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}` : '미입력',
      gender,
      genderLabel: GENDER_LABELS[gender]
    }
  }
}

export function buildDailyFortune(result: SajuResult, referenceDate: Date = new Date()): DailyFortune {
  const now = referenceDate
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()

  const [todayStemIndexRaw, todayBranchIndexRaw] = getDayStemBranch(year, month, day)
  const stem = STEMS[mod(todayStemIndexRaw, STEMS.length)]
  const branch = BRANCHES[mod(todayBranchIndexRaw, BRANCHES.length)]
  const element = STEM_ELEMENTS[stem]
  const yinYang = STEM_YINYANG[stem]

  const dateLabel = new Intl.DateTimeFormat('ko', { dateStyle: 'full' }).format(now)

  const elementCount = result.summary.elementCounts[element]
  const average = result.summary.totalElements / Object.keys(ELEMENT_LABELS).length

  const personalElement = result.pillars.day.stemElement
  const personalBranch = result.pillars.day.branch

  let alignment: keyof typeof DAILY_ELEMENT_ALIGNMENT
  if (element === result.summary.strongest.element) {
    alignment = 'strong'
  } else if (element === result.summary.weakest.element) {
    alignment = 'weak'
  } else if (elementCount >= average) {
    alignment = 'supportive'
  } else {
    alignment = 'neutral'
  }

  let relationKey: ElementRelationKey = 'neutral'
  if (element === personalElement) {
    relationKey = 'aligned'
  } else if (ELEMENT_PRODUCES[personalElement] === element) {
    relationKey = 'output'
  } else if (ELEMENT_PRODUCED_BY[personalElement] === element) {
    relationKey = 'resource'
  } else if (ELEMENT_CONTROLS[personalElement] === element) {
    relationKey = 'authority'
  } else if (ELEMENT_CONTROLLED_BY[personalElement] === element) {
    relationKey = 'pressure'
  }

  let branchRelation: BranchRelationKey = 'neutral'
  if (branch === personalBranch) {
    branchRelation = 'same'
  } else if (BRANCH_HARMONIES[personalBranch] === branch) {
    branchRelation = 'harmony'
  } else if (BRANCH_CONFLICTS[personalBranch] === branch) {
    branchRelation = 'clash'
  }

  const yinCount = result.summary.yinYangCounts.음
  const yangCount = result.summary.yinYangCounts.양

  let balanceText: string
  if (yangCount - yinCount >= 2) {
    balanceText =
      yinYang === '양'
        ? '양 기운이 겹쳐 속도가 붙지만, 휴식과 속도 조절을 통해 균형을 잡으세요.'
        : '오늘은 음 기운이 더해져 감정 조율이 쉬워집니다. 차분함을 유지하면 시너지가 납니다.'
  } else if (yinCount - yangCount >= 2) {
    balanceText =
      yinYang === '음'
        ? '음 기운이 겹쳐 내면에 집중하기 좋지만 생각이 깊어질 수 있으니 몸을 가볍게 움직여 보세요.'
        : '양 기운이 더해져 실행력이 보완되니 작은 실천으로 흐름을 바꿔보세요.'
  } else {
    balanceText = '음양 균형이 안정적이라 큰 무리 없이 계획을 이어갈 수 있습니다.'
  }

  const branchPositive = branchRelation === 'same' || branchRelation === 'harmony' ? DAILY_BRANCH_MESSAGES[branchRelation] : ''
  const branchCaution = branchRelation === 'clash' ? DAILY_BRANCH_MESSAGES[branchRelation] : ''

  const energyText = `${DAILY_RELATION_MESSAGES[relationKey]} ${DAILY_ELEMENT_ALIGNMENT[alignment]}`.trim()
  const actionParts = [DAILY_ACTIVITY_BY_ELEMENT[element], branchPositive].filter(Boolean)
  const cautionParts = [balanceText, DAILY_CARE_BY_ELEMENT[element], branchCaution].filter(Boolean)

  return {
    dateLabel,
    pillarName: `${stem}${branch}`,
    elementLabel: ELEMENT_LABELS[element],
    yinYang,
    energyText,
    actionText: actionParts.join(' '),
    cautionText: cautionParts.join(' ')
  }
}

const ELEMENT_ROUTINE_TIPS: Record<Element, string> = {
  목: '새로운 배움과 사람을 꾸준히 만나는 루틴을 통해 기운이 확장됩니다.',
  화: '짧은 운동과 명확한 목표 정리가 화 기운을 긍정적으로 발산하도록 돕습니다.',
  토: '하루 일과와 공간을 정돈하며 규칙적인 식사 시간을 지키면 토 기운이 안정됩니다.',
  금: '자료 정리와 계획 점검 시간을 정기적으로 확보하면 금 기운이 바로 섭니다.',
  수: '충분한 수분과 휴식, 조용한 기록 시간을 마련하면 수 기운이 부드럽게 흘러갑니다.'
}

export function buildInterpretation(result: SajuResult): InterpretationCategory[] {
  const categories: InterpretationCategory[] = []
  const { pillars, summary } = result
  const strongestElement = summary.strongest.element
  const weakestElement = summary.weakest.element
  const maxCount = summary.strongest.count
  const minCount = summary.weakest.count
  const gender = result.meta.gender
  const genderTone = GENDER_TONE[gender]
  const strongRoutine = ELEMENT_ROUTINE_TIPS[strongestElement]
  const weakRoutine = ELEMENT_ROUTINE_TIPS[weakestElement]

  categories.push({
    key: 'temperament',
    title: '타고난 기질과 성격',
    description: [
      `사주의 중심이 되는 ${pillars.day.name} 일주에서 ${pillars.day.stem}(${ELEMENT_LABELS[pillars.day.stemElement]}) 기운과 ${pillars.day.branch} 지지가 겹쳐 ${TEMPERAMENT_BY_ELEMENT[pillars.day.stemElement]} 성향이 두드러집니다.`,
      `이 결과의 의미는? 강한 ${strongestElement} 기운이 ${summary.strongest.count}개 쌓여 자신의 주도권을 확보하기 쉬운 흐름을 만든다는 뜻입니다.`,
      `삶에 적용하는 팁: 강한 ${strongestElement} 기운은 자신감이 필요한 자리에서 쓰고, 부족한 ${weakestElement} 기운은 ${weakRoutine}`
    ].join(' ')
  })

  const elementGap = maxCount - minCount
  let flowMessage: string
  if (elementGap <= 1) {
    flowMessage = FLOW_MESSAGES.balanced
  } else {
    flowMessage = FLOW_MESSAGES.focused(summary.strongest.element)
  }

  const yinCount = summary.yinYangCounts.음
  const yangCount = summary.yinYangCounts.양
  const yinYangDiff = Math.abs(yinCount - yangCount)
  if (yinCount > yangCount && yinYangDiff >= 2) {
    flowMessage += ` ${FLOW_MESSAGES.yinDominant(yinYangDiff)}`
  } else if (yangCount > yinCount && yinYangDiff >= 2) {
    flowMessage += ` ${FLOW_MESSAGES.yangDominant(yinYangDiff)}`
  }

  categories.push({
    key: 'fortune',
    title: '운의 흐름',
    description: [
      `${strongestElement} 기운과 ${weakestElement} 기운의 차이가 ${elementGap}개라 흐름이 한쪽으로 기울어 있습니다.`,
      `이 결과의 의미는? ${genderTone} ${flowMessage}`,
      `삶에 적용하는 팁: ${strongRoutine} 부족한 ${weakestElement} 영역은 하루 10분이라도 ${weakRoutine}`
    ].join(' ')
  })

  categories.push({
    key: 'relationship',
    title: '관계운',
    description: [
      `일주(${pillars.day.branch})와 연주(${pillars.year.branch})의 관계가 ${RELATIONSHIP_BY_ANIMAL[pillars.year.branch]} 흐름과 연결되기 때문입니다.`,
      `이 결과의 의미는? ${RELATIONSHIP_BY_ANIMAL[pillars.day.branch]} 영향으로 자신이 주도하는 인간관계 스타일이 형성된다는 뜻입니다.`,
      `삶에 적용하는 팁: 강한 ${strongestElement} 기운을 만남과 협업에 활용하고, 부족한 ${weakestElement} 감각은 일정에 휴식과 경청 시간을 배치해 보완하세요.`
    ].join(' ')
  })

  categories.push({
    key: 'career',
    title: '직업·적성',
    description: [
      `월주(${pillars.month.name})에서 ${pillars.month.stem}(${ELEMENT_LABELS[pillars.month.stemElement]}) 기운이 직업 환경을 설계하는 축을 담당하기 때문입니다.`,
      `이 결과의 의미는? ${CAREER_BY_ELEMENT[pillars.month.stemElement]}`,
      `삶에 적용하는 팁: 강한 ${strongestElement} 기운을 프로젝트의 추진력으로 삼고, 부족한 ${weakestElement} 기운은 ${weakRoutine}`
    ].join(' ')
  })

  categories.push({
    key: 'wealth',
    title: '재물운',
    description: [
      `${strongestElement} 기운이 ${summary.elementCounts[strongestElement]}개로 가장 높아 재물 흐름을 끌어오는 열쇠가 됩니다.`,
      `이 결과의 의미는? ${WEALTH_FOCUS_BY_ELEMENT[strongestElement]}`,
      `삶에 적용하는 팁: ${
        maxCount === minCount
          ? '오행 균형이 좋아 계획적인 저축과 투자가 빛을 발합니다.'
          : `부족한 ${weakestElement} 기운은 ${ELEMENT_ROUTINE_TIPS[weakestElement]}`
      }`
    ].join(' ')
  })

  categories.push({
    key: 'honor',
    title: '명예·사회적 인정',
    description: [
      `${strongestElement} 기운이 주축이 되어 사회적 평가가 해당 기운과 연결되기 쉽습니다.`,
      `이 결과의 의미는? ${HONOR_FOCUS_BY_ELEMENT[strongestElement]}${maxCount === minCount ? ' 오행 균형이 좋아 다양한 영역에서 신뢰를 얻기 좋은 구조입니다.' : ''}`,
      `삶에 적용하는 팁: ${maxCount === minCount ? '꾸준한 약속 이행과 기록 관리로 명성을 쌓아보세요.' : `부족한 ${weakestElement} 기운을 보완하면 인정 폭이 더욱 넓어집니다.`}`
    ].join(' ')
  })

  categories.push({
    key: 'health',
    title: '건강 포인트',
    description: [
      `${weakestElement} 기운이 ${summary.elementCounts[weakestElement]}개로 가장 낮아 몸이 해당 부위를 먼저 신호로 보냅니다.`,
      `이 결과의 의미는? ${HEALTH_TIPS_BY_ELEMENT[weakestElement]}`,
      `삶에 적용하는 팁: ${maxCount === minCount ? '현재의 생활 리듬을 유지하면서 주기적인 컨디션 점검을 이어가세요.' : `${ELEMENT_ROUTINE_TIPS[weakestElement]} 강한 ${strongestElement} 기운은 무리하지 않도록 속도를 조절하세요.`}`
    ].join(' ')
  })

  return categories
}

export function buildElementBars(result: SajuResult | null): ElementBar[] {
  if (!result) return []
  return (Object.entries(result.summary.elementCounts) as Array<[Element, number]>).map(([element, count]) => ({
    element,
    label: ELEMENT_LABELS[element],
    count,
    ratio: result.summary.totalElements ? Math.round((count / result.summary.totalElements) * 100) : 0
  }))
}
