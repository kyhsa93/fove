import { useEffect, useMemo, useState } from 'react'
import { SOLAR_TERMS, type SolarTermName } from './solarTerms'

const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const
const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const

type Stem = (typeof STEMS)[number]
type Branch = (typeof BRANCHES)[number]
type Element = '목' | '화' | '토' | '금' | '수'
type YinYang = '양' | '음'
type Gender = 'male' | 'female'

const STEM_ELEMENTS = {
  '갑': '목',
  '을': '목',
  '병': '화',
  '정': '화',
  '무': '토',
  '기': '토',
  '경': '금',
  '신': '금',
  '임': '수',
  '계': '수'
} as const satisfies Record<Stem, Element>

const STEM_YINYANG = {
  '갑': '양',
  '을': '음',
  '병': '양',
  '정': '음',
  '무': '양',
  '기': '음',
  '경': '양',
  '신': '음',
  '임': '양',
  '계': '음'
} as const satisfies Record<Stem, YinYang>

const BRANCH_ANIMALS = {
  '자': '쥐',
  '축': '소',
  '인': '호랑이',
  '묘': '토끼',
  '진': '용',
  '사': '뱀',
  '오': '말',
  '미': '양',
  '신': '원숭이',
  '유': '닭',
  '술': '개',
  '해': '돼지'
} as const satisfies Record<Branch, string>

const BRANCH_ELEMENTS = {
  '자': '수',
  '축': '토',
  '인': '목',
  '묘': '목',
  '진': '토',
  '사': '화',
  '오': '화',
  '미': '토',
  '신': '금',
  '유': '금',
  '술': '토',
  '해': '수'
} as const satisfies Record<Branch, Element>

const BRANCH_YINYANG = {
  '자': '양',
  '축': '음',
  '인': '양',
  '묘': '음',
  '진': '양',
  '사': '음',
  '오': '양',
  '미': '음',
  '신': '양',
  '유': '음',
  '술': '양',
  '해': '음'
} as const satisfies Record<Branch, YinYang>

const FIRST_MONTH_STEM_INDEX = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0] as const

const HOUR_RANGES = [
  '23:00 ~ 00:59',
  '01:00 ~ 02:59',
  '03:00 ~ 04:59',
  '05:00 ~ 06:59',
  '07:00 ~ 08:59',
  '09:00 ~ 10:59',
  '11:00 ~ 12:59',
  '13:00 ~ 14:59',
  '15:00 ~ 16:59',
  '17:00 ~ 18:59',
  '19:00 ~ 20:59',
  '21:00 ~ 22:59'
] as const

type WesternZodiac = { name: string; start: [number, number] }

const WESTERN_ZODIAC: WesternZodiac[] = [
  { name: '염소자리', start: [1, 1] },
  { name: '물병자리', start: [1, 20] },
  { name: '물고기자리', start: [2, 19] },
  { name: '양자리', start: [3, 21] },
  { name: '황소자리', start: [4, 20] },
  { name: '쌍둥이자리', start: [5, 21] },
  { name: '게자리', start: [6, 22] },
  { name: '사자자리', start: [7, 23] },
  { name: '처녀자리', start: [8, 23] },
  { name: '천칭자리', start: [9, 24] },
  { name: '전갈자리', start: [10, 24] },
  { name: '사수자리', start: [11, 23] },
  { name: '염소자리', start: [12, 22] }
]

const ELEMENT_LABELS = {
  '목': '목(木)',
  '화': '화(火)',
  '토': '토(土)',
  '금': '금(金)',
  '수': '수(水)'
} as const satisfies Record<Element, string>

type PillarKey = 'year' | 'month' | 'day' | 'hour'

const PILLAR_LABELS: Record<PillarKey, string> = {
  year: '연주',
  month: '월주',
  day: '일주',
  hour: '시주'
}

const PILLAR_FOCUS: Record<PillarKey, string> = {
  year: '초년·부모',
  month: '청년기·형제',
  day: '성향·배우자',
  hour: '말년·자녀'
}

const GENDER_LABELS: Record<Gender, string> = {
  male: '남성',
  female: '여성'
}

const GENDER_TONE: Record<Gender, string> = {
  male: '남성 사주에서는 양적인 추진력과 외향 에너지가 주도합니다.',
  female: '여성 사주에서는 섬세한 감각과 조화로운 기운이 중심이 됩니다.'
}

const TEMPERAMENT_BY_ELEMENT: Record<Element, string> = {
  '목': '목(木)의 기운이 강한 사람은 성장과 확장을 추구하며, 사람들 사이를 연결하고 새로운 시도를 즐깁니다.',
  '화': '화(火)의 기운이 강한 사람은 열정과 추진력이 뛰어나며, 감성이 풍부하고 리더십을 발휘하기 쉽습니다.',
  '토': '토(土)의 기운이 강한 사람은 안정과 신뢰를 중시하며, 균형 감각이 좋아 주변을 묵묵히 지탱합니다.',
  '금': '금(金)의 기운이 강한 사람은 치밀하고 원칙적이며, 명확한 목표 아래 집중력 있게 움직입니다.',
  '수': '수(水)의 기운이 강한 사람은 유연하고 지혜로우며, 정보와 흐름을 잘 읽는 감각을 가집니다.'
}

const RELATIONSHIP_BY_ANIMAL: Record<Branch, string> = {
  '자': '쥐띠의 지지는 언변과 순발력이 좋아 주변 사람들과 빠르게 친해지는 장점이 있습니다.',
  '축': '소띠의 지지는 신뢰와 성실함으로 인정받아, 차분한 관계를 오래 유지합니다.',
  '인': '호랑이띠의 지지는 주도적이고 도전적인 관계를 선호해, 적극적인 만남에 강합니다.',
  '묘': '토끼띠의 지지는 배려심과 섬세함이 뛰어나 조화로운 인간관계를 만들기 쉽습니다.',
  '진': '용띠의 지지는 카리스마와 호기심이 강해, 다채로운 인연을 끌어들이는 힘이 있습니다.',
  '사': '뱀띠의 지지는 통찰력이 깊어, 사람들의 속마음을 잘 파악하며 관계를 다지는 편입니다.',
  '오': '말띠의 지지는 밝고 활동적인 분위기로, 네트워크를 넓히고 활기찬 인맥을 유지합니다.',
  '미': '양띠의 지지는 온화하고 안정적인 기운으로, 서로를 돌보는 관계를 만들기 쉽습니다.',
  '신': '원숭이띠의 지지는 재치와 아이디어가 풍부해, 협력 속에서 시너지를 내는 관계가 많습니다.',
  '유': '닭띠의 지지는 성실함과 목표 지향성이 뚜렷해, 함께 성장하는 동료와 잘 맞습니다.',
  '술': '개띠의 지지는 의리와 책임감이 강하여, 든든한 동료·파트너로 인정받습니다.',
  '해': '돼지띠의 지지는 포용력과 따뜻함이 있어, 신뢰를 바탕으로한 관계가 오래갑니다.'
}

const CAREER_BY_ELEMENT: Record<Element, string> = {
  '목': '창의와 기획, 교육, 상담, 문화·콘텐츠 분야에서 잠재력이 돋보입니다.',
  '화': '리더십이 필요한 경영, 마케팅, 공연·예술, 교육·강연 분야와 인연이 깊습니다.',
  '토': '조직관리, 금융, 행정·법률, 부동산, 연구직 등 안정과 신뢰가 필요한 분야에 강점이 있습니다.',
  '금': '전문지식과 분석이 필요한 기술, IT, 금융, 의학, 법조계와 같은 영역에서 실력을 발휘하기 쉽습니다.',
  '수': '정보와 흐름을 다루는 IT, 연구, 해외업무, 교육, 상담, 기획 분야와 궁합이 좋습니다.'
}

const WEALTH_FOCUS_BY_ELEMENT: Record<Element, string> = {
  '목': '사람과 기회를 연결하는 능력이 재물운을 끌어들이므로, 네트워크 관리가 곧 재산이 됩니다.',
  '화': '명확한 목표 설정과 추진력이 수입을 늘립니다. 감정적 소비만 조심하면 재물운이 안정됩니다.',
  '토': '꾸준한 저축과 부동산·토지 관련 자산 운영에서 강점을 보여 장기적으로 재물이 모입니다.',
  '금': '분석력과 전문성을 키울수록 재물운이 상승합니다. 명확한 기준 아래 투자하면 유리합니다.',
  '수': '정보 수집과 트렌드 파악을 통해 유연하게 재테크하면 재물운이 좋아집니다.'
}

const HONOR_FOCUS_BY_ELEMENT: Record<Element, string> = {
  '목': '협력과 확장 속에서 명성을 얻으니, 공동 프로젝트와 사회 활동을 늘려 보세요.',
  '화': '빛나는 존재감을 기반으로 대중 앞에서 인정받기 쉬워 발표·홍보 영역에서 명예를 누립니다.',
  '토': '신뢰와 책임감이 명예를 키우므로, 꾸준한 성과 관리와 약속을 지키는 태도가 관건입니다.',
  '금': '전문 분야의 권위가 명예를 부르니, 자격과 스펙을 갖추고 묵묵히 실력을 쌓으세요.',
  '수': '지혜와 조정 능력이 명성을 가져옵니다. 다양한 사람들의 의견을 조율하는 자리에서 빛납니다.'
}

const HEALTH_TIPS_BY_ELEMENT: Record<Element, string> = {
  '목': '목 기운이 약하면 간·근육 계통을 돌보세요. 규칙적인 스트레칭과 휴식이 필요합니다.',
  '화': '화 기운이 약하면 심혈관/혈압 관리가 중요합니다. 지나친 야근과 스트레스 조절에 신경 쓰세요.',
  '토': '토 기운이 약하면 위장과 비장 관리가 필요합니다. 식습관과 규칙적인 생활 리듬을 지키세요.',
  '금': '금 기운이 약하면 호흡기·피부 관리가 중요합니다. 규칙적인 운동과 청결 유지가 도움이 됩니다.',
  '수': '수 기운이 약하면 신장·비뇨기와 하체 순환에 주의하세요. 충분한 수분과 휴식이 필요합니다.'
}

const FLOW_MESSAGES = {
  balanced: '오행이 비교적 고르게 분포해 스스로 균형을 유지하기 좋은 흐름입니다.',
  focused: (element: Element) => `${element} 기운이 두드러져 이와 관련된 기회가 자주 찾아옵니다. 반대로 부족한 오행을 보충하면 더 큰 성장을 기대할 수 있습니다.`,
  yinDominant: (diff: number) => `음 기운이 ${diff}개 더 많아 섬세함과 내면 탐구에 집중하기 좋은 시기입니다. 다만 과도한 생각은 피하세요.`,
  yangDominant: (diff: number) => `양 기운이 ${diff}개 더 많아 행동력과 추진력을 활용하기 좋습니다. 속도를 조절해 균형을 맞추면 더 안정적입니다.`
} as const

const DAILY_ACTIVITY_BY_ELEMENT: Record<Element, string> = {
  '목': '사람들과 소통하고 아이디어를 제안하는 자리에서 성과를 거둘 확률이 높습니다.',
  '화': '발표·영업처럼 존재감을 드러내는 활동에 적극 나서면 호응을 얻습니다.',
  '토': '체크리스트를 정리하고 누락된 일정을 정비하면 안정감을 되찾습니다.',
  '금': '자료 분석과 계획 수립에 집중하면 기대 이상의 깔끔한 마무리를 할 수 있습니다.',
  '수': '정보를 수집하고 흐름을 읽어 대응하면 유연하게 기회를 챙길 수 있습니다.'
}

const DAILY_CARE_BY_ELEMENT: Record<Element, string> = {
  '목': '분주함 속에서도 휴식 시간을 확보해 과로를 예방하세요.',
  '화': '감정이 과열되기 쉬우니 대화에서 한 템포 쉬어가는 여유가 필요합니다.',
  '토': '고집이 강해질 수 있어 타인의 조언을 한 번 더 듣는 것이 도움이 됩니다.',
  '금': '세부에 몰입하다 보면 경직될 수 있으니 시야를 넓히는 시간을 마련하세요.',
  '수': '우유부단해질 수 있으니 결정해야 할 일은 오늘 안에 마무리하세요.'
}

const DAILY_ELEMENT_ALIGNMENT: Record<'strong' | 'weak' | 'supportive' | 'neutral', string> = {
  strong: '오늘의 일진과 가장 강한 오행이 맞물려 추진력이 붙습니다. 자신 있게 주도권을 잡아도 좋겠습니다.',
  weak: '오늘의 일진이 부족한 오행을 자극하므로 페이스를 조절하고 기본기를 다지는 데 집중하세요.',
  supportive: '오늘의 일진이 당신의 기운을 든든하게 보완해 주니 과감하게 실행해도 무리가 없습니다.',
  neutral: '오늘의 일진은 비교적 중립적인 흐름이니 평소 루틴을 유지하며 컨디션을 살피면 좋습니다.'
}

const ELEMENT_PRODUCES: Record<Element, Element> = {
  '목': '화',
  '화': '토',
  '토': '금',
  '금': '수',
  '수': '목'
}

const ELEMENT_PRODUCED_BY: Record<Element, Element> = {
  '목': '수',
  '화': '목',
  '토': '화',
  '금': '토',
  '수': '금'
}

const ELEMENT_CONTROLS: Record<Element, Element> = {
  '목': '토',
  '화': '금',
  '토': '수',
  '금': '목',
  '수': '화'
}

const ELEMENT_CONTROLLED_BY: Record<Element, Element> = {
  '목': '금',
  '화': '수',
  '토': '목',
  '금': '화',
  '수': '토'
}

type ElementRelationKey = 'aligned' | 'output' | 'resource' | 'authority' | 'pressure' | 'neutral'

const DAILY_RELATION_MESSAGES: Record<ElementRelationKey, string> = {
  aligned: '오늘의 기운이 당신의 일주 오행과 같아 컨디션이 자연스럽게 맞춰집니다.',
  output: '당신의 기운이 오늘 흐름을 이끌어 창의성과 표현력이 돋보입니다.',
  resource: '오늘의 기운이 당신을 북돋우니 재충전과 학습, 준비에 집중해 보세요.',
  authority: '당신의 기운이 상황을 다루기 쉬워 리더십을 발휘하기 좋습니다.',
  pressure: '오늘의 기운이 당신을 시험하니 무리한 약속보다는 우선순위를 정리하세요.',
  neutral: '오늘의 기운이 비교적 중립적이라 평소 페이스를 유지하기 좋습니다.'
}

const BRANCH_HARMONIES: Record<Branch, Branch> = {
  '자': '축',
  '축': '자',
  '인': '해',
  '묘': '술',
  '진': '유',
  '사': '신',
  '오': '미',
  '미': '오',
  '신': '사',
  '유': '진',
  '술': '묘',
  '해': '인'
}

const BRANCH_CONFLICTS: Record<Branch, Branch> = {
  '자': '오',
  '축': '미',
  '인': '신',
  '묘': '유',
  '진': '술',
  '사': '해',
  '오': '자',
  '미': '축',
  '신': '인',
  '유': '묘',
  '술': '진',
  '해': '사'
}

type BranchRelationKey = 'same' | 'harmony' | 'clash' | 'neutral'

const DAILY_BRANCH_MESSAGES: Record<BranchRelationKey, string> = {
  same: '일주 지지와 같은 기운이 들어와 익숙한 인연 속에서 힘을 얻습니다.',
  harmony: '일주 지지와 육합을 이루어 협력과 조율이 유리하게 작용합니다.',
  clash: '일주 지지와 충이 생겨 변수가 많을 수 있으니 유연하게 대응하세요.',
  neutral: ''
}

const SOLAR_TERM_INFO: Record<SolarTermName, { branch: Branch; monthIndex: number }> = {
  '立春': { branch: '인', monthIndex: 0 },
  '驚蟄': { branch: '묘', monthIndex: 1 },
  '清明': { branch: '진', monthIndex: 2 },
  '立夏': { branch: '사', monthIndex: 3 },
  '芒種': { branch: '오', monthIndex: 4 },
  '小暑': { branch: '미', monthIndex: 5 },
  '立秋': { branch: '신', monthIndex: 6 },
  '白露': { branch: '유', monthIndex: 7 },
  '寒露': { branch: '술', monthIndex: 8 },
  '立冬': { branch: '해', monthIndex: 9 },
  '大雪': { branch: '자', monthIndex: 10 },
  '小寒': { branch: '축', monthIndex: 11 }
} as const satisfies Record<SolarTermName, { branch: Branch; monthIndex: number }>

const SOLAR_TERM_YEARS = Object.keys(SOLAR_TERMS).map((year) => parseInt(year, 10))
const SOLAR_TERM_YEAR_MIN = Math.min(...SOLAR_TERM_YEARS)
const SOLAR_TERM_YEAR_MAX = Math.max(...SOLAR_TERM_YEARS)

const SUPPORTED_YEAR_MIN = 1900
const SUPPORTED_YEAR_MAX = 2100

interface DateParts {
  lunarMonth: number
  lunarDay: number
  relatedYear: number | null
  monthLabel: string | null
  dayLabel: string | null
  yearName: string
  isLeapMonth: boolean
}

interface HourInfo {
  stem: Stem
  branch: Branch
  range: string
}

type PillarExtras = Partial<{
  focus: string
  lunarMonth: number
  isLeapMonth: boolean
  monthLabel: string | null
  range: string
}>

interface Pillar extends PillarExtras {
  stem: Stem
  branch: Branch
  name: string
  stemElement: Element
  branchElement: Element
  stemYinYang: YinYang
  branchYinYang: YinYang
  animal: (typeof BRANCH_ANIMALS)[Branch]
}

interface SummaryElement {
  element: Element
  count: number
}

interface Summary {
  elementCounts: Record<Element, number>
  yinYangCounts: Record<YinYang, number>
  strongest: SummaryElement
  weakest: SummaryElement
  yinYangMessage: string
  elementsArray: SummaryElement[]
  totalElements: number
}

interface SajuMeta {
  solarDate: string
  lunarDate: string
  lunarRelatedYear: number | null
  westernZodiac: string
  hasTime: boolean
  timeText: string
  gender: Gender
  genderLabel: string
}

interface Pillars {
  year: Pillar
  month: Pillar
  day: Pillar
  hour: Pillar | null
}

interface SajuResult {
  pillars: Pillars
  summary: Summary
  meta: SajuMeta
}

interface ElementBar {
  element: Element
  label: string
  count: number
  ratio: number
}

interface InterpretationCategory {
  key: string
  title: string
  description: string
}

interface DailyFortune {
  dateLabel: string
  pillarName: string
  elementLabel: string
  yinYang: YinYang
  energyText: string
  actionText: string
  cautionText: string
}

interface YearPillarInfo {
  year: number
  stem: Stem
  branch: Branch
  stemIndex: number
  branchIndex: number
}

interface MonthBoundaryInfo {
  term: SolarTermName
  branch: Branch
  monthIndex: number
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

function getTodayKey(): string {
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

function calculateSaju(birthDateStr: string, birthTimeStr: string, gender: Gender): SajuResult {
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

function buildDailyFortune(result: SajuResult): DailyFortune {
  const now = new Date()
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

function buildInterpretation(result: SajuResult): InterpretationCategory[] {
  const categories: InterpretationCategory[] = []
  const { pillars, summary } = result
  const strongestElement = summary.strongest.element
  const weakestElement = summary.weakest.element
  const maxCount = summary.strongest.count
  const minCount = summary.weakest.count
  const gender = result.meta.gender
  const genderLabel = result.meta.genderLabel
  const genderTone = GENDER_TONE[gender]

  categories.push({
    key: 'temperament',
    title: '타고난 기질과 성격',
    description: `${genderLabel} 사주 관점에서 보면 ${TEMPERAMENT_BY_ELEMENT[pillars.day.stemElement]} 일주(${pillars.day.name})의 특성이 강하게 작용합니다.`
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
    description: `${genderTone} ${flowMessage}`
  })

  categories.push({
    key: 'relationship',
    title: '관계운',
    description: `${genderLabel} 사주 기준으로 ${RELATIONSHIP_BY_ANIMAL[pillars.day.branch]} 일주 특성과 ${RELATIONSHIP_BY_ANIMAL[pillars.year.branch]} 연주의 기운이 조화를 이루면 폭넓은 인맥을 구축할 수 있습니다.`
  })

  categories.push({
    key: 'career',
    title: '직업·적성',
    description: `${genderLabel} 사주에 잘 맞는 흐름은 ${CAREER_BY_ELEMENT[pillars.month.stemElement]} 월주(${pillars.month.name})의 환경을 활용하면 성장 속도가 빨라집니다.`
  })

  categories.push({
    key: 'wealth',
    title: '재물운',
    description: `${WEALTH_FOCUS_BY_ELEMENT[strongestElement]}${maxCount === minCount ? '' : ` 부족한 ${weakestElement} 기운을 보충하면 재물 순환이 더욱 안정됩니다.`}`
  })

  categories.push({
    key: 'honor',
    title: '명예·사회적 인정',
    description: `${HONOR_FOCUS_BY_ELEMENT[strongestElement]}${maxCount === minCount ? ' 오행의 균형이 좋아 다양한 분야에서 신뢰를 얻기 쉽습니다.' : ' 일주와 월주의 조화를 통해 신뢰와 명성을 쌓아보세요.'}`
  })

  categories.push({
    key: 'health',
    title: '건강 포인트',
    description: `${HEALTH_TIPS_BY_ELEMENT[weakestElement]}${maxCount === minCount ? ' 현재 균형이 잘 맞으니 규칙적인 생활을 이어가면 좋습니다.' : ' 규칙적인 생활습관으로 오행의 균형을 맞추면 컨디션이 안정됩니다.'}`
  })

  return categories
}

export default function App(): JSX.Element {
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

    const intervalId = window.setInterval(updateKey, 60 * 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  const elementBars = useMemo<ElementBar[]>(() => {
    if (!result) return []
    return (Object.entries(result.summary.elementCounts) as Array<[Element, number]>).map(([element, count]) => ({
      element,
      label: ELEMENT_LABELS[element],
      count,
      ratio: result.summary.totalElements ? Math.round((count / result.summary.totalElements) * 100) : 0
    }))
  }, [result])

  const interpretation = useMemo<InterpretationCategory[]>(() => {
    if (!result) return []
    return buildInterpretation(result)
  }, [result])

  const dailyFortune = useMemo<DailyFortune | null>(() => {
    if (!result) return null
    return buildDailyFortune(result)
  }, [result, todayKey])

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-rose-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">사주팔자 간편 조회</h1>
          <p className="text-sm text-gray-600">
            양력 생년월일과 태어난 시간을 입력하면 사주팔자(연·월·일·시주의 천간과 지지)를 자동으로 계산해 드립니다.
          </p>
        </header>

        <section className="bg-white/80 backdrop-blur-sm border border-amber-100 shadow-sm rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">기본 정보 입력</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm text-gray-700 font-medium">생년월일</span>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm text-gray-700 font-medium">태어난 시간 (선택)</span>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <span className="text-xs text-gray-500">* 시간 미입력 시 시주는 계산되지 않습니다.</span>
            </label>
            <fieldset className="flex flex-col gap-2">
              <span className="text-sm text-gray-700 font-medium">성별</span>
              <div className="flex items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="text-amber-500 focus:ring-amber-400"
                  />
                  남성
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="text-amber-500 focus:ring-amber-400"
                  />
                  여성
                </label>
              </div>
              <span className="text-xs text-gray-500">* 성별에 따라 해석 문구가 조금씩 달라집니다.</span>
            </fieldset>
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>
          )}
        </section>

        {result ? (
          <section className="space-y-6">
            <div className="bg-white/90 border border-amber-100 rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">기본 해석</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
                  <p className="text-sm text-gray-600">양력 기준</p>
                  <p className="text-base font-semibold text-gray-900">{result.meta.solarDate}</p>
                  <p className="text-sm text-gray-600">서양 별자리: {result.meta.westernZodiac}</p>
                  <p className="text-sm text-gray-600">입력한 시간: {result.meta.timeText}</p>
                  <p className="text-sm text-gray-600">성별: {result.meta.genderLabel}</p>
                </div>
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 space-y-2">
                  <p className="text-sm text-gray-600">음력 기준</p>
                  <p className="text-base font-semibold text-gray-900">{result.pillars.year.name}년 ({result.meta.lunarDate})</p>
                  {result.pillars.month?.isLeapMonth && (
                    <p className="text-xs text-rose-500">※ 윤달에 해당하는 날짜입니다.</p>
                  )}
                  {!result.meta.hasTime && (
                    <p className="text-xs text-rose-500">※ 태어난 시간을 입력하면 시주까지 확인할 수 있습니다.</p>
                  )}
                </div>
              </div>
            </div>

            {dailyFortune && (
              <div className="bg-gradient-to-br from-amber-100 via-white to-rose-100 border border-amber-200 rounded-2xl shadow-sm p-6 space-y-4">
                <header className="flex flex-col gap-1 text-gray-900">
                  <h2 className="text-lg font-semibold">오늘의 운세</h2>
                  <p className="text-sm text-gray-600">{dailyFortune.dateLabel}</p>
                </header>
                <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-700">
                  <div className="md:col-span-1 space-y-1">
                    <p className="text-xs text-gray-500">오늘의 일진</p>
                    <p className="text-xl font-semibold text-gray-900">{dailyFortune.pillarName}</p>
                    <p className="text-sm text-gray-600">
                      ({dailyFortune.yinYang}·{dailyFortune.elementLabel})
                    </p>
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-amber-600 tracking-wide">ENERGY</p>
                      <p>{dailyFortune.energyText}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-rose-600 tracking-wide">ACTION</p>
                      <p>{dailyFortune.actionText}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-600 tracking-wide">CARE</p>
                      <p>{dailyFortune.cautionText}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              {(Object.entries(result.pillars) as Array<[PillarKey, Pillar | null]>).map(([key, pillar]) => {
                if (!pillar) return null
                const focusText = pillar.focus ?? PILLAR_FOCUS[key]
                const monthText = pillar.monthLabel ?? (pillar.lunarMonth ? `${pillar.lunarMonth}월` : '-')
                return (
                  <article key={key} className="bg-white/90 border border-gray-100 rounded-2xl shadow-sm p-5 space-y-3">
                    <header className="flex items-baseline justify-between">
                      <h3 className="text-md font-semibold text-gray-900">{PILLAR_LABELS[key]}</h3>
                      <span className="text-xs text-gray-500">{focusText}</span>
                    </header>
                    <p className="text-2xl font-bold text-gray-900 tracking-wide">{pillar.name}</p>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                      <div>
                        <dt className="text-gray-500">천간</dt>
                        <dd className="font-medium">{pillar.stem} ({STEM_YINYANG[pillar.stem]}·{ELEMENT_LABELS[pillar.stemElement]})</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">지지</dt>
                        <dd className="font-medium">{pillar.branch} ({BRANCH_YINYANG[pillar.branch]}·{ELEMENT_LABELS[pillar.branchElement]})</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">띠</dt>
                        <dd className="font-medium">{pillar.animal}</dd>
                      </div>
                      {pillar.range ? (
                        <div>
                          <dt className="text-gray-500">시각대</dt>
                          <dd className="font-medium">{pillar.range}</dd>
                        </div>
                      ) : key === 'month' ? (
                        <div>
                          <dt className="text-gray-500">음력월</dt>
                          <dd className="font-medium">{monthText}</dd>
                        </div>
                      ) : (
                        <div>
                          <dt className="text-gray-500">중요성</dt>
                          <dd className="font-medium">{focusText}</dd>
                        </div>
                      )}
                    </dl>
                  </article>
                )
              })}
            </div>

            <div className="bg-white/90 border border-amber-100 rounded-2xl shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">오행 · 음양 분포</h2>
              <div className="grid gap-3 md:grid-cols-5">
                {elementBars.map((item) => (
                  <div key={item.element} className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 text-center">{item.label}</p>
                    <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-amber-400 to-rose-400" style={{ width: `${item.ratio}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 text-center">{item.count}개</p>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <p>강한 오행: {result.summary.strongest.element} ({result.summary.strongest.count}개)</p>
                <p>부족한 오행: {result.summary.weakest.element} ({result.summary.weakest.count}개)</p>
                <p>{result.summary.yinYangMessage}</p>
              </div>
            </div>

            {interpretation.length > 0 && (
              <div className="bg-white/90 border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">심층 해석</h2>
                <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  {interpretation.map((item) => (
                    <div key={item.key}>
                      <p className="font-semibold text-gray-900">{item.title}</p>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white/70 border border-gray-100 rounded-2xl p-5 text-sm text-gray-600 leading-relaxed">
              <p className="font-medium text-gray-800">활용 가이드</p>
              <p>
                사주팔자는 태어난 시점의 기운을 간단히 살펴보는 도구입니다. 실제 상담에서는 절기, 대운, 세운 등 다양한 요소를 함께 고려하므로 참고용으로 활용해 주세요.
              </p>
              <p className="mt-2 text-xs text-gray-500">※ 계산은 음력(중국력) 변환 결과를 기반으로 하며, 기기 환경에 따라 결과가 다소 달라질 수 있습니다.</p>
            </div>
          </section>
        ) : (
          <section className="bg-white/70 border border-dashed border-amber-200 rounded-2xl p-8 text-center text-sm text-gray-600">
            생년월일을 입력하면 사주팔자 결과가 이 영역에 실시간으로 표시됩니다.
          </section>
        )}
      </div>
    </div>
  )
}
