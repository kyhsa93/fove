import { calculateSaju, ELEMENT_PRODUCES, ELEMENT_CONTROLS, BRANCH_HARMONIES, BRANCH_CONFLICTS } from './index'
import type { Element, Branch } from './constants'
import type { SajuResult } from './types'

export type CompatibilityType = 'love' | 'friend' | 'work'

export interface CompatScores {
  overall: number
  love: number
  communication: number
  future: number
  total: number
}

export interface CompatDetail {
  overall: string
  love: string
  communication: string
  future: string
  summary: string
}

type ElementRel = 'generates' | 'generated' | 'same' | 'controls' | 'controlled'
type BranchRel = 'harmony' | 'same' | 'clash' | 'neutral'

function getElemRel(a: Element, b: Element): ElementRel {
  if (a === b) return 'same'
  if (ELEMENT_PRODUCES[a] === b) return 'generates'
  if (ELEMENT_PRODUCES[b] === a) return 'generated'
  if (ELEMENT_CONTROLS[a] === b) return 'controls'
  return 'controlled'
}

function getBranchRel(a: Branch, b: Branch): BranchRel {
  if (a === b) return 'same'
  if (BRANCH_HARMONIES[a] === b) return 'harmony'
  if (BRANCH_CONFLICTS[a] === b) return 'clash'
  return 'neutral'
}

const ELEM_BASE: Record<ElementRel, number> = {
  generates: 85,
  generated: 80,
  same: 73,
  controls: 60,
  controlled: 63
}

const BRANCH_BASE: Record<BranchRel, number> = {
  harmony: 87,
  same: 72,
  clash: 52,
  neutral: 67
}

const clamp = (v: number) => Math.min(99, Math.max(40, Math.round(v)))

export function parseSajuResult(birthDate: string, hour?: number): SajuResult | null {
  if (!birthDate || birthDate.length < 10) return null
  try {
    const timeStr = hour !== undefined ? `${String(hour).padStart(2, '0')}:00` : ''
    return calculateSaju(birthDate, timeStr, 'male')
  } catch {
    return null
  }
}

export function calcCompatScores(
  resultA: SajuResult,
  resultB: SajuResult,
  type: CompatibilityType
): CompatScores {
  const dayElemA = resultA.pillars.day.stemElement
  const dayElemB = resultB.pillars.day.stemElement
  const monthElemA = resultA.pillars.month.stemElement
  const monthElemB = resultB.pillars.month.stemElement
  const yearElemA = resultA.pillars.year.stemElement
  const yearElemB = resultB.pillars.year.stemElement
  const dayBranchA = resultA.pillars.day.branch
  const dayBranchB = resultB.pillars.day.branch
  const dayYinYangA = resultA.pillars.day.stemYinYang
  const dayYinYangB = resultB.pillars.day.stemYinYang
  const yinYangComplement = dayYinYangA !== dayYinYangB ? 5 : 0

  const overallRel = getElemRel(dayElemA, dayElemB)
  const overallMod: Record<CompatibilityType, number> = { love: 5, friend: 0, work: -3 }
  const overall = clamp(ELEM_BASE[overallRel] + overallMod[type])

  const branchRel = getBranchRel(dayBranchA, dayBranchB)
  const loveMod: Record<CompatibilityType, number> = { love: 8, friend: 0, work: -5 }
  const love = clamp(BRANCH_BASE[branchRel] + yinYangComplement + loveMod[type])

  const commRel = getElemRel(monthElemA, monthElemB)
  const sameYearElem = yearElemA === yearElemB ? 5 : 0
  const commMod: Record<CompatibilityType, number> = { love: 3, friend: 3, work: 2 }
  const communication = clamp(ELEM_BASE[commRel] + sameYearElem + commMod[type])

  const futureRel = getElemRel(yearElemA, yearElemB)
  const combinedElems = new Set([
    ...Object.entries(resultA.summary.elementCounts)
      .filter(([, c]) => c > 0)
      .map(([e]) => e),
    ...Object.entries(resultB.summary.elementCounts)
      .filter(([, c]) => c > 0)
      .map(([e]) => e),
  ])
  const diversityBonus = combinedElems.size >= 4 ? 5 : 0
  const futureMod: Record<CompatibilityType, number> = { love: 3, friend: 2, work: 3 }
  const future = clamp(ELEM_BASE[futureRel] + diversityBonus + futureMod[type])

  const total = clamp(overall * 0.30 + love * 0.30 + communication * 0.25 + future * 0.15)

  return { overall, love, communication, future, total }
}

function pick(score: number, high: string, mid: string, low: string): string {
  if (score >= 78) return high
  if (score >= 63) return mid
  return low
}

const OVERALL_TEXT: Record<ElementRel, Record<CompatibilityType, [string, string, string]>> = {
  generates: {
    love: [
      '두 사람의 기운이 자연스럽게 흘러 서로를 성장시킵니다. 함께할수록 더 빛나는 관계입니다.',
      '에너지 흐름이 좋지만 한쪽이 지나치게 소모되지 않도록 균형을 맞춰가세요.',
      '좋은 흐름이지만 헌신이 당연해지지 않도록 서로의 노력을 인식하세요.'
    ],
    friend: [
      '서로가 서로의 성장을 자연스럽게 이끄는 사이입니다. 함께하면 더 좋아집니다.',
      '긍정적 흐름이지만 서로의 경계를 존중하는 것도 중요합니다.',
      '좋은 에너지 흐름이 있으나 의존도를 적절히 조절해보세요.'
    ],
    work: [
      '역할 분담이 자연스러워 팀으로 시너지를 내기 좋은 조합입니다.',
      '협업 흐름이 원활하지만 공과 과를 명확히 구분하세요.',
      '기본 협력은 됩니다. 역할을 구체화하면 더 효율적입니다.'
    ]
  },
  generated: {
    love: [
      '상대가 나를 성장시켜 주는 관계로, 안정감과 따뜻함을 느낍니다.',
      '지지받는 기운이 있으나 스스로의 주도성도 함께 키워나가세요.',
      '의지하는 경향이 있을 수 있으니 상호 독립성을 유지하세요.'
    ],
    friend: [
      '서로를 북돋우고 든든하게 지지하는 우정입니다.',
      '지지 관계가 좋지만 서로의 개인 공간도 챙기세요.',
      '지지가 있으나 각자의 성장도 중요합니다.'
    ],
    work: [
      '든든한 지원이 오가며 효율적인 협업이 이루어집니다.',
      '지원 관계는 좋으나 책임 구분을 명확히 하세요.',
      '협력은 되지만 각자의 역할을 분명히 하면 더 좋습니다.'
    ]
  },
  same: {
    love: [
      '같은 에너지가 공명하여 서로를 깊이 이해합니다. 친근함이 강점입니다.',
      '이해는 빠르지만 비슷한 패턴이 반복될 수 있어 새로운 자극이 필요합니다.',
      '비슷함이 편안함도 주지만 변화의 바람이 필요할 수 있습니다.'
    ],
    friend: [
      '공통점이 많아 금방 친해지고 오래가는 우정입니다.',
      '비슷한 만큼 맞지만 다름을 받아들이는 연습도 필요합니다.',
      '비슷함이 공감을 주지만 서로 다른 관점도 존중하세요.'
    ],
    work: [
      '같은 방향으로 힘을 합쳐 강력한 시너지를 냅니다.',
      '협업은 원활하나 다양한 시각이 필요할 수 있습니다.',
      '협업 자체는 편하지만 편향을 주의하세요.'
    ]
  },
  controls: {
    love: [
      '긴장감이 매력이 되는 관계입니다. 노력이 필요하지만 그만큼 깊어질 수 있습니다.',
      '서로 다른 에너지가 마찰을 일으킬 수 있어 소통이 특히 중요합니다.',
      '기운의 방향이 달라 갈등이 생길 수 있습니다. 진심 어린 대화가 관계를 유지합니다.'
    ],
    friend: [
      '서로 자극이 되는 사이입니다. 성장을 원한다면 좋은 관계입니다.',
      '차이가 있지만 의외의 배움을 얻을 수 있습니다.',
      '노력이 필요한 관계지만 서로 인정하면 단단해집니다.'
    ],
    work: [
      '팽팽한 긴장이 높은 품질을 만드는 조합입니다.',
      '의견 충돌이 있을 수 있으나 명확한 역할 분담으로 해소하세요.',
      '업무 스타일 차이가 있어 규칙을 명확히 정해야 합니다.'
    ]
  },
  controlled: {
    love: [
      '에너지 차이가 있지만 그 안에서 독특한 균형을 만들 수 있습니다.',
      '한쪽이 주도하는 경향이 있으니 균형을 의식적으로 맞추세요.',
      '기운 차이가 있어 서로 맞춰가는 노력이 필요합니다.'
    ],
    friend: [
      '다름이 오히려 보완이 되는 관계입니다.',
      '차이를 받아들이면 서로에게 귀한 존재가 됩니다.',
      '다름이 있지만 존중하면 의외의 조화를 찾을 수 있습니다.'
    ],
    work: [
      '다양한 관점이 균형 잡힌 결과물을 만듭니다.',
      '차이를 인정하고 접점을 찾으면 협업이 원활해집니다.',
      '역할을 명확히 나누면 갈등을 줄일 수 있습니다.'
    ]
  }
}

const LOVE_TEXT: Record<BranchRel, [string, string, string]> = {
  harmony: [
    '일지가 육합을 이루어 감정적 교감이 자연스럽게 흐릅니다. 감정 표현이 편안합니다.',
    '감정의 흐름이 잘 맞지만 가끔 기대치가 어긋날 수 있습니다.',
    '감정적 연결은 있으나 표현 방식의 차이를 이해하는 노력이 필요합니다.'
  ],
  same: [
    '같은 지지 에너지로 감정의 결이 비슷합니다. 깊은 공감이 가능합니다.',
    '감정 패턴이 비슷해 이해는 쉽지만 새로운 자극도 중요합니다.',
    '비슷한 감정 패턴이지만 활력을 불어넣는 변화를 시도해보세요.'
  ],
  clash: [
    '감정의 방향이 달라 충돌이 있지만 그만큼 강렬한 감정을 나눕니다.',
    '감정적 마찰이 생길 수 있어 감정 표현의 타이밍이 중요합니다.',
    '일지 충으로 감정 기복이 있을 수 있습니다. 차분한 대화로 극복하세요.'
  ],
  neutral: [
    '안정적인 감정 흐름으로 서로 편안합니다.',
    '감정 교류가 무난하나 더 깊이 표현하려는 노력이 관계를 풍성하게 합니다.',
    '감정적 연결이 약할 수 있어 감정을 자주 나누는 습관이 필요합니다.'
  ]
}

const COMM_TEXT: Record<ElementRel, [string, string, string]> = {
  generates: [
    '월간 오행이 잘 흘러 대화가 자연스럽고 오해가 적습니다.',
    '대화가 원활하나 한쪽이 주도하는 경향이 있을 수 있습니다.',
    '소통 자체는 되나 의사소통 방식을 맞춰가는 노력이 필요합니다.'
  ],
  generated: [
    '서로의 말을 잘 받아주어 대화가 풍성합니다.',
    '잘 들어주지만 자신의 의견도 명확히 표현하세요.',
    '경청 능력은 좋으나 적극적인 표현을 키워가세요.'
  ],
  same: [
    '같은 소통 방식으로 빠르게 이해합니다. 대화가 편안합니다.',
    '이해는 빠르지만 다양한 관점 교환도 시도해보세요.',
    '소통은 편하지만 비슷한 맹점을 공유할 수 있어 외부 시각을 구하세요.'
  ],
  controls: [
    '소통 방식이 다르지만 그 차이가 새로운 시각을 줍니다.',
    '의견 충돌이 있을 수 있어 경청하는 자세가 필요합니다.',
    '소통 방식 차이로 오해가 생기기 쉽습니다. 천천히 풀어가세요.'
  ],
  controlled: [
    '다른 소통 방식이 서로에게 배움이 됩니다.',
    '차이를 좁혀가는 과정에서 관계가 깊어집니다.',
    '소통에 노력이 필요합니다. 짧고 명확하게 표현하는 것이 도움이 됩니다.'
  ]
}

const FUTURE_TEXT: [string, string, string] = [
  '두 사람의 장기적 방향이 잘 맞아 함께 성장하는 미래를 그릴 수 있습니다.',
  '미래를 함께 그릴 수 있지만 중간중간 방향을 맞춰가는 대화가 중요합니다.',
  '서로의 장기 목표를 공유하는 시간을 자주 갖는 것이 관계를 탄탄하게 합니다.'
]

export function getCompatDetail(
  scores: CompatScores,
  resultA: SajuResult,
  resultB: SajuResult,
  type: CompatibilityType
): CompatDetail {
  const overallRel = getElemRel(resultA.pillars.day.stemElement, resultB.pillars.day.stemElement)
  const branchRel = getBranchRel(resultA.pillars.day.branch, resultB.pillars.day.branch)
  const commRel = getElemRel(resultA.pillars.month.stemElement, resultB.pillars.month.stemElement)

  const [oh, om, ol] = OVERALL_TEXT[overallRel][type]
  const [lh, lm, ll] = LOVE_TEXT[branchRel]
  const [ch, cm, cl] = COMM_TEXT[commRel]
  const [fh, fm, fl] = FUTURE_TEXT

  const summary =
    scores.total >= 85
      ? '두 사람의 사주 오행이 깊이 조화를 이룹니다. 함께할수록 서로를 더욱 빛나게 하는 인연입니다.'
      : scores.total >= 75
        ? '좋은 에너지 흐름 속에 약간의 차이가 있습니다. 이해와 소통으로 더 단단한 관계를 만들 수 있습니다.'
        : scores.total >= 63
          ? '서로 다른 기운이 자극과 마찰을 동시에 줍니다. 차이를 인정하면 예상 밖의 조화를 발견할 수 있습니다.'
          : '기운의 방향이 많이 달라 노력이 필요한 관계입니다. 서로를 이해하는 진심 어린 대화가 간극을 좁혀갑니다.'

  return {
    overall: pick(scores.overall, oh, om, ol),
    love: pick(scores.love, lh, lm, ll),
    communication: pick(scores.communication, ch, cm, cl),
    future: pick(scores.future, fh, fm, fl),
    summary
  }
}
