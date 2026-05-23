import { SOLAR_TERMS } from '../../solarTerms'
import type { SolarTermName } from '../../solarTerms'

export const STEMS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'] as const
export const BRANCHES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'] as const

export type Stem = (typeof STEMS)[number]
export type Branch = (typeof BRANCHES)[number]
export type Element = '목' | '화' | '토' | '금' | '수'
export type YinYang = '양' | '음'
export type Gender = 'male' | 'female'

export const STEM_ELEMENTS = {
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

export const STEM_YINYANG = {
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

export const BRANCH_ANIMALS = {
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

export const BRANCH_ELEMENTS = {
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

export const BRANCH_YINYANG = {
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

export const FIRST_MONTH_STEM_INDEX = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0] as const

export const HOUR_RANGES = [
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

export type WesternZodiac = { name: string; start: [number, number] }

export const WESTERN_ZODIAC: WesternZodiac[] = [
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

export const ELEMENT_LABELS = {
  '목': '목(木)',
  '화': '화(火)',
  '토': '토(土)',
  '금': '금(金)',
  '수': '수(水)'
} as const satisfies Record<Element, string>

export type PillarKey = 'year' | 'month' | 'day' | 'hour'

export const PILLAR_LABELS: Record<PillarKey, string> = {
  year: '연주',
  month: '월주',
  day: '일주',
  hour: '시주'
}

export const PILLAR_FOCUS: Record<PillarKey, string> = {
  year: '초년·부모',
  month: '청년기·형제',
  day: '성향·배우자',
  hour: '말년·자녀'
}

export const GENDER_LABELS: Record<Gender, string> = {
  male: '남성',
  female: '여성'
}

export const GENDER_TONE: Record<Gender, string> = {
  male: '남성 사주에서는 양적인 추진력과 외향 에너지가 주도합니다.',
  female: '여성 사주에서는 섬세한 감각과 조화로운 기운이 중심이 됩니다.'
}

export const TEMPERAMENT_BY_ELEMENT: Record<Element, string> = {
  '목': '목(木)의 기운이 강한 사람은 성장과 확장을 추구하며, 사람들 사이를 연결하고 새로운 시도를 즐깁니다.',
  '화': '화(火)의 기운이 강한 사람은 열정과 추진력이 뛰어나며, 감성이 풍부하고 리더십을 발휘하기 쉽습니다.',
  '토': '토(土)의 기운이 강한 사람은 안정과 신뢰를 중시하며, 균형 감각이 좋아 주변을 묵묵히 지탱합니다.',
  '금': '금(金)의 기운이 강한 사람은 치밀하고 원칙적이며, 명확한 목표 아래 집중력 있게 움직입니다.',
  '수': '수(水)의 기운이 강한 사람은 유연하고 지혜로우며, 정보와 흐름을 잘 읽는 감각을 가집니다.'
}

export const RELATIONSHIP_BY_ANIMAL: Record<Branch, string> = {
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

export const CAREER_BY_ELEMENT: Record<Element, string> = {
  '목': '창의와 기획, 교육, 상담, 문화·콘텐츠 분야에서 잠재력이 돋보입니다.',
  '화': '리더십이 필요한 경영, 마케팅, 공연·예술, 교육·강연 분야와 인연이 깊습니다.',
  '토': '조직관리, 금융, 행정·법률, 부동산, 연구직 등 안정과 신뢰가 필요한 분야에 강점이 있습니다.',
  '금': '전문지식과 분석이 필요한 기술, IT, 금융, 의학, 법조계와 같은 영역에서 실력을 발휘하기 쉽습니다.',
  '수': '정보와 흐름을 다루는 IT, 연구, 해외업무, 교육, 상담, 기획 분야와 궁합이 좋습니다.'
}

export const WEALTH_FOCUS_BY_ELEMENT: Record<Element, string> = {
  '목': '사람과 기회를 연결하는 능력이 재물운을 끌어들이므로, 네트워크 관리가 곧 재산이 됩니다.',
  '화': '명확한 목표 설정과 추진력이 수입을 늘립니다. 감정적 소비만 조심하면 재물운이 안정됩니다.',
  '토': '꾸준한 저축과 부동산·토지 관련 자산 운영에서 강점을 보여 장기적으로 재물이 모입니다.',
  '금': '분석력과 전문성을 키울수록 재물운이 상승합니다. 명확한 기준 아래 투자하면 유리합니다.',
  '수': '정보 수집과 트렌드 파악을 통해 유연하게 재테크하면 재물운이 좋아집니다.'
}

export const HONOR_FOCUS_BY_ELEMENT: Record<Element, string> = {
  '목': '협력과 확장 속에서 명성을 얻으니, 공동 프로젝트와 사회 활동을 늘려 보세요.',
  '화': '빛나는 존재감을 기반으로 대중 앞에서 인정받기 쉬워 발표·홍보 영역에서 명예를 누립니다.',
  '토': '신뢰와 책임감이 명예를 키우므로, 꾸준한 성과 관리와 약속을 지키는 태도가 관건입니다.',
  '금': '전문 분야의 권위가 명예를 부르니, 자격과 스펙을 갖추고 묵묵히 실력을 쌓으세요.',
  '수': '지혜와 조정 능력이 명성을 가져옵니다. 다양한 사람들의 의견을 조율하는 자리에서 빛납니다.'
}

export const HEALTH_TIPS_BY_ELEMENT: Record<Element, string> = {
  '목': '목 기운이 약하면 간·근육 계통을 돌보세요. 규칙적인 스트레칭과 휴식이 필요합니다.',
  '화': '화 기운이 약하면 심혈관/혈압 관리가 중요합니다. 지나친 야근과 스트레스 조절에 신경 쓰세요.',
  '토': '토 기운이 약하면 위장과 비장 관리가 필요합니다. 식습관과 규칙적인 생활 리듬을 지키세요.',
  '금': '금 기운이 약하면 호흡기·피부 관리가 중요합니다. 규칙적인 운동과 청결 유지가 도움이 됩니다.',
  '수': '수 기운이 약하면 신장·비뇨기와 하체 순환에 주의하세요. 충분한 수분과 휴식이 필요합니다.'
}

export const STEM_DAILY_CONTEXT: Record<Stem, string> = {
  '갑': '갑(甲)목 기운의 날로, 새로운 시작과 직진하는 추진력이 강하게 흐릅니다.',
  '을': '을(乙)목 기운의 날로, 유연한 적응력과 관계 조율 감각이 살아있는 날입니다.',
  '병': '병(丙)화 기운의 날로, 밝고 외향적인 존재감을 발산하기 좋은 날입니다.',
  '정': '정(丁)화 기운의 날로, 섬세한 집중력과 내적 열정이 빛을 발하는 날입니다.',
  '무': '무(戊)토 기운의 날로, 안정적인 포용력과 중심 잡기에 유리한 날입니다.',
  '기': '기(己)토 기운의 날로, 현실적인 판단력과 세밀한 조정 능력이 강점인 날입니다.',
  '경': '경(庚)금 기운의 날로, 결단력과 추진력이 선명하게 드러나는 날입니다.',
  '신': '신(辛)금 기운의 날로, 정밀함과 날카로운 분석력이 빛을 발하는 날입니다.',
  '임': '임(壬)수 기운의 날로, 유동적 지혜와 큰 그림을 보는 안목이 살아나는 날입니다.',
  '계': '계(癸)수 기운의 날로, 섬세한 인내력과 깊은 통찰이 발휘되는 날입니다.'
}

export const ELEMENT_KEYWORDS: Record<Element, string[]> = {
  목: ['성장 지향', '연결자', '창의적'],
  화: ['열정적', '리더십', '추진력'],
  토: ['안정 추구', '신뢰감', '균형적'],
  금: ['원칙주의', '집중력', '치밀함'],
  수: ['유연함', '통찰력', '지혜로움']
}

export const FLOW_MESSAGES = {
  balanced: '오행이 비교적 고르게 분포해 스스로 균형을 유지하기 좋은 흐름입니다.',
  focused: (element: Element) => `${element} 기운이 두드러져 이와 관련된 기회가 자주 찾아옵니다. 반대로 부족한 오행을 보충하면 더 큰 성장을 기대할 수 있습니다.`,
  yinDominant: (diff: number) => `음 기운이 ${diff}개 더 많아 섬세함과 내면 탐구에 집중하기 좋은 시기입니다. 다만 과도한 생각은 피하세요.`,
  yangDominant: (diff: number) => `양 기운이 ${diff}개 더 많아 행동력과 추진력을 활용하기 좋습니다. 속도를 조절해 균형을 맞추면 더 안정적입니다.`
} as const

export const ELEMENT_ACTION_DO: Record<Element, string> = {
  '목': '새로운 아이디어를 적어 보거나 가벼운 스트레칭으로 몸을 깨워 확장 에너지를 움직여 보세요.',
  '화': '짧은 발표·콘텐츠 작업처럼 열정을 쏟을 수 있는 일을 정해 추진력을 살려 보세요.',
  '토': '공간 정리와 기록 정비로 안정감을 만들면 토 기운이 든든해집니다.',
  '금': '중요한 자료를 분류하고 계획을 구조화하며 집중력을 발휘해 보세요.',
  '수': '정보를 모으거나 글로 생각을 정리하며 유연한 흐름을 만들어 보세요.'
}

export const ELEMENT_ACTION_AVOID: Record<Element, string> = {
  '목': '즉흥적으로 계획을 바꾸기보다 정한 우선순위를 지켜 균형을 잡아보세요.',
  '화': '감정이 과열될 때는 잠시 숨고르기 하며 급한 반응을 줄이세요.',
  '토': '모든 책임을 혼자 떠안지 말고 나눌 부분이 있는지 살펴보세요.',
  '금': '사소한 실수에 날카롭게 반응하기보다 한 번 더 여유를 두세요.',
  '수': '생각만 반복하다 시간을 보내지 말고, 정한 마감과 휴식을 지켜 보세요.'
}

export const DAILY_ACTIVITY_BY_ELEMENT: Record<Element, string> = {
  '목': '사람들과 소통하고 아이디어를 제안하는 자리에서 성과를 거둘 확률이 높습니다.',
  '화': '발표·영업처럼 존재감을 드러내는 활동에 적극 나서면 호응을 얻습니다.',
  '토': '체크리스트를 정리하고 누락된 일정을 정비하면 안정감을 되찾습니다.',
  '금': '자료 분석과 계획 수립에 집중하면 기대 이상의 깔끔한 마무리를 할 수 있습니다.',
  '수': '정보를 수집하고 흐름을 읽어 대응하면 유연하게 기회를 챙길 수 있습니다.'
}

export const DAILY_CARE_BY_ELEMENT: Record<Element, string> = {
  '목': '분주함 속에서도 휴식 시간을 확보해 과로를 예방하세요.',
  '화': '감정이 과열되기 쉬우니 대화에서 한 템포 쉬어가는 여유가 필요합니다.',
  '토': '고집이 강해질 수 있어 타인의 조언을 한 번 더 듣는 것이 도움이 됩니다.',
  '금': '세부에 몰입하다 보면 경직될 수 있으니 시야를 넓히는 시간을 마련하세요.',
  '수': '우유부단해질 수 있으니 결정해야 할 일은 오늘 안에 마무리하세요.'
}

export const DAILY_ELEMENT_ALIGNMENT: Record<'strong' | 'weak' | 'supportive' | 'neutral', string> = {
  strong: '오늘의 일진과 가장 강한 오행이 맞물려 추진력이 붙습니다. 자신 있게 주도권을 잡아도 좋겠습니다.',
  weak: '오늘의 일진이 부족한 오행을 자극하므로 페이스를 조절하고 기본기를 다지는 데 집중하세요.',
  supportive: '오늘의 일진이 당신의 기운을 든든하게 보완해 주니 과감하게 실행해도 무리가 없습니다.',
  neutral: '오늘의 일진은 비교적 중립적인 흐름이니 평소 루틴을 유지하며 컨디션을 살피면 좋습니다.'
}

export const ELEMENT_PRODUCES: Record<Element, Element> = {
  '목': '화',
  '화': '토',
  '토': '금',
  '금': '수',
  '수': '목'
}

export const ELEMENT_PRODUCED_BY: Record<Element, Element> = {
  '목': '수',
  '화': '목',
  '토': '화',
  '금': '토',
  '수': '금'
}

export const ELEMENT_CONTROLS: Record<Element, Element> = {
  '목': '토',
  '화': '금',
  '토': '수',
  '금': '목',
  '수': '화'
}

export const ELEMENT_CONTROLLED_BY: Record<Element, Element> = {
  '목': '금',
  '화': '수',
  '토': '목',
  '금': '화',
  '수': '토'
}

export type ElementRelationKey = 'aligned' | 'output' | 'resource' | 'authority' | 'pressure' | 'neutral'

export const DAILY_RELATION_MESSAGES: Record<ElementRelationKey, string> = {
  aligned: '오늘의 기운이 당신의 일주 오행과 같아 컨디션이 자연스럽게 맞춰집니다.',
  output: '당신의 기운이 오늘 흐름을 이끌어 창의성과 표현력이 돋보입니다.',
  resource: '오늘의 기운이 당신을 북돋우니 재충전과 학습, 준비에 집중해 보세요.',
  authority: '당신의 기운이 상황을 다루기 쉬워 리더십을 발휘하기 좋습니다.',
  pressure: '오늘의 기운이 당신을 시험하니 무리한 약속보다는 우선순위를 정리하세요.',
  neutral: '오늘의 기운이 비교적 중립적이라 평소 페이스를 유지하기 좋습니다.'
}

export const BRANCH_HARMONIES: Record<Branch, Branch> = {
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

export const BRANCH_CONFLICTS: Record<Branch, Branch> = {
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

export type BranchRelationKey = 'same' | 'harmony' | 'clash' | 'neutral'

export const DAILY_BRANCH_MESSAGES: Record<BranchRelationKey, string> = {
  same: '일주 지지와 같은 기운이 들어와 익숙한 인연 속에서 힘을 얻습니다.',
  harmony: '일주 지지와 육합을 이루어 협력과 조율이 유리하게 작용합니다.',
  clash: '일주 지지와 충이 생겨 변수가 많을 수 있으니 유연하게 대응하세요.',
  neutral: ''
}

export const SOLAR_TERM_INFO: Record<SolarTermName, { branch: Branch; monthIndex: number }> = {
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

export const SOLAR_TERM_YEARS = Object.keys(SOLAR_TERMS).map((year) => parseInt(year, 10))
export const SOLAR_TERM_YEAR_MIN = Math.min(...SOLAR_TERM_YEARS)
export const SOLAR_TERM_YEAR_MAX = Math.max(...SOLAR_TERM_YEARS)

export const SUPPORTED_YEAR_MIN = 1900
export const SUPPORTED_YEAR_MAX = 2100
