export type StarSign =
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces'

export type StarElement = '불' | '흙' | '바람' | '물'

export interface StarSignInfo {
  name: string
  period: string
  element: StarElement
  keyword: string
  desc: string
  emoji: string
}

export const STAR_SIGNS: StarSign[] = [
  'aries','taurus','gemini','cancer','leo','virgo',
  'libra','scorpio','sagittarius','capricorn','aquarius','pisces'
]

export const STAR_SIGN_INFO: Record<StarSign, StarSignInfo> = {
  aries:       { name: '양자리',    period: '3.21~4.19',  element: '불',  emoji: '♈', keyword: '도전·추진', desc: '용기 있고 추진력이 강해요. 새로운 시작을 두려워하지 않는 개척자 에너지예요.' },
  taurus:      { name: '황소자리',  period: '4.20~5.20',  element: '흙',  emoji: '♉', keyword: '안정·신뢰', desc: '안정감을 중시하고 꾸준해요. 한번 마음먹은 건 끝까지 해내는 뚝심이 있어요.' },
  gemini:      { name: '쌍둥이자리', period: '5.21~6.21', element: '바람', emoji: '♊', keyword: '소통·호기심', desc: '말을 잘하고 호기심이 넘쳐요. 다양한 분야에 흥미를 갖는 만능 재주꾼이에요.' },
  cancer:      { name: '게자리',    period: '6.22~7.22',  element: '물',  emoji: '♋', keyword: '감성·보호', desc: '감수성이 풍부하고 사랑하는 사람을 지극히 아껴요. 가정적이고 따뜻해요.' },
  leo:         { name: '사자자리',  period: '7.23~8.22',  element: '불',  emoji: '♌', keyword: '자신감·리더', desc: '카리스마 있고 당당해요. 무대의 중심이 되는 걸 즐기며 주변에 활기를 불어넣어요.' },
  virgo:       { name: '처녀자리',  period: '8.23~9.22',  element: '흙',  emoji: '♍', keyword: '분석·완벽', desc: '꼼꼼하고 분석적이에요. 세부사항을 놓치지 않으며 완성도 높은 결과를 만들어요.' },
  libra:       { name: '천칭자리',  period: '9.23~10.23', element: '바람', emoji: '♎', keyword: '균형·조화', desc: '균형 감각이 뛰어나고 공정함을 추구해요. 사람들 사이에서 조화를 만드는 외교관이에요.' },
  scorpio:     { name: '전갈자리',  period: '10.24~11.22',element: '물',  emoji: '♏', keyword: '열정·통찰', desc: '집중력과 통찰력이 강해요. 표면보다 본질을 꿰뚫어 보는 깊은 내면을 가졌어요.' },
  sagittarius: { name: '사수자리',  period: '11.23~12.21',element: '불',  emoji: '♐', keyword: '자유·모험', desc: '자유를 사랑하고 철학적이에요. 새로운 경험과 지식을 향해 끊임없이 탐구해요.' },
  capricorn:   { name: '염소자리',  period: '12.22~1.19', element: '흙',  emoji: '♑', keyword: '책임·목표', desc: '목표를 세우면 끝까지 해내는 강인함이 있어요. 책임감과 자제력이 강한 현실주의자예요.' },
  aquarius:    { name: '물병자리',  period: '1.20~2.18',  element: '바람', emoji: '♒', keyword: '독창·혁신', desc: '독창적이고 혁신적이에요. 시대를 앞서가는 아이디어로 변화를 이끄는 개혁가예요.' },
  pisces:      { name: '물고기자리', period: '2.19~3.20', element: '물',  emoji: '♓', keyword: '공감·상상', desc: '공감 능력이 뛰어나고 상상력이 풍부해요. 예술적 감수성과 직관으로 세상을 느껴요.' },
}

const ELEMENT_COMPAT: Record<StarElement, Record<StarElement, { score: number; desc: string }>> = {
  '불': {
    '불':  { score: 86, desc: '열정과 에너지가 폭발하는 조합이에요. 서로를 자극하고 함께 불꽃을 키워가요. 경쟁심을 협력으로 바꾸면 최강의 파트너예요.' },
    '흙':  { score: 68, desc: '불의 열정을 흙이 현실로 만들어줘요. 속도 차이로 갈등이 생길 수 있지만 서로의 강점으로 균형을 잡을 수 있어요.' },
    '바람': { score: 85, desc: '바람이 불을 더 크게 키워요. 서로의 에너지를 증폭시키며 활기차고 지적인 관계를 만들어요.' },
    '물':  { score: 60, desc: '물과 불은 서로를 끄고 키워요. 감성(물)과 열정(불)이 충돌하지만 깊은 이해가 생기면 특별한 케미가 만들어져요.' },
  },
  '흙': {
    '불':  { score: 68, desc: '불의 열정을 흙이 현실로 만들어줘요. 서로의 페이스를 존중하는 게 핵심이에요.' },
    '흙':  { score: 83, desc: '안정적이고 신뢰 깊은 관계예요. 현실적인 가치관이 같아 함께 오래가는 든든한 파트너십을 만들어요.' },
    '바람': { score: 62, desc: '안정(흙)과 변화(바람)가 부딪혀요. 흙은 바람을 붙잡으려 하고 바람은 흙을 떠나려 할 수 있어요. 차이를 인정하는 게 중요해요.' },
    '물':  { score: 82, desc: '물이 흙을 기름지게 해줘요. 감성과 안정이 만나 서로를 풍요롭게 하는 이상적인 조합이에요.' },
  },
  '바람': {
    '불':  { score: 85, desc: '바람이 불을 키우는 환상의 조합. 서로의 열정과 지성이 시너지를 내며 빠르게 성장해요.' },
    '흙':  { score: 62, desc: '바람의 자유로움과 흙의 안정감이 충돌해요. 서로의 속도 차이를 인정하면 보완이 가능해요.' },
    '바람': { score: 84, desc: '소통과 아이디어가 넘치는 활기찬 관계예요. 둘 다 호기심이 많아 언제나 새로운 대화가 생겨요.' },
    '물':  { score: 66, desc: '바람의 이성과 물의 감성이 엇갈릴 수 있어요. 서로의 언어를 배우는 노력이 필요해요.' },
  },
  '물': {
    '불':  { score: 60, desc: '열정과 감성의 만남. 뜨거운 불과 깊은 물이 충돌하지만 서로에게 없는 에너지를 배울 수 있어요.' },
    '흙':  { score: 82, desc: '물이 흙을 적셔 생명력을 줘요. 감성적 지지(물)와 현실적 안정(흙)이 어우러지는 따뜻한 관계예요.' },
    '바람': { score: 66, desc: '감성(물)과 이성(바람)의 차이가 있어요. 서로의 표현 방식을 이해하려는 노력이 이 관계를 특별하게 해요.' },
    '물':  { score: 87, desc: '깊은 감성이 공명하는 특별한 관계예요. 서로의 마음을 말하지 않아도 이해하는 텔레파시 같은 유대감이 있어요.' },
  },
}

export interface StarCompatResult {
  score: number
  grade: '환상' | '좋음' | '보통' | '도전'
  elementRelation: string
  summary: string
  detail: string
  tip: string
}

function gradeFromScore(s: number): '환상' | '좋음' | '보통' | '도전' {
  if (s >= 83) return '환상'
  if (s >= 72) return '좋음'
  if (s >= 62) return '보통'
  return '도전'
}

const ELEMENT_RELATION: Record<string, string> = {
  '불-불': '같은 불 원소 — 열정이 폭발하는 조합',
  '흙-흙': '같은 흙 원소 — 안정과 신뢰의 조합',
  '바람-바람': '같은 바람 원소 — 소통과 지성의 조합',
  '물-물': '같은 물 원소 — 감성이 공명하는 조합',
  '불-바람': '불 + 바람 — 바람이 불꽃을 키워요',
  '흙-물': '흙 + 물 — 물이 흙을 풍요롭게 해요',
  '불-흙': '불 + 흙 — 열정이 현실을 만나요',
  '바람-물': '바람 + 물 — 이성과 감성의 만남',
  '불-물': '불 + 물 — 상반된 에너지의 만남',
  '흙-바람': '흙 + 바람 — 안정과 변화의 충돌',
}

function elementRelationKey(a: StarElement, b: StarElement): string {
  const pairs = ['불-바람', '흙-물', '불-흙', '바람-물', '불-물', '흙-바람']
  const direct = `${a}-${b}`
  const reverse = `${b}-${a}`
  if (pairs.includes(direct)) return direct
  if (pairs.includes(reverse)) return reverse
  return `${a}-${b}` // same element
}

const SIGN_TIPS: Partial<Record<string, string>> = {
  'aries-libra': '양자리의 직선적 열정과 천칭자리의 균형 감각이 서로를 완성해요.',
  'taurus-scorpio': '황소자리의 안정감과 전갈자리의 깊은 열정이 강한 유대를 만들어요.',
  'gemini-sagittarius': '쌍둥이의 호기심과 사수의 모험심이 끊임없이 새로운 세계를 탐험해요.',
  'cancer-capricorn': '게자리의 감성과 염소자리의 현실감이 서로의 부족함을 채워줘요.',
  'leo-aquarius': '사자의 개성과 물병의 혁신이 만나 독창적인 케미를 만들어요.',
  'virgo-pisces': '처녀자리의 분석력과 물고기자리의 직관이 아름다운 균형을 이뤄요.',
}

function signKey(a: StarSign, b: StarSign): string {
  return [a, b].sort().join('-')
}

export function getStarCompat(a: StarSign, b: StarSign): StarCompatResult {
  const infoA = STAR_SIGN_INFO[a]
  const infoB = STAR_SIGN_INFO[b]
  const compat = ELEMENT_COMPAT[infoA.element][infoB.element]
  const elKey = elementRelationKey(infoA.element, infoB.element)
  const customTip = SIGN_TIPS[signKey(a, b)]

  return {
    score: compat.score,
    grade: gradeFromScore(compat.score),
    elementRelation: ELEMENT_RELATION[elKey] ?? `${infoA.element} + ${infoB.element}`,
    summary: `${infoA.name} × ${infoB.name}`,
    detail: compat.desc,
    tip: customTip ?? `${infoA.keyword}인 ${infoA.name}와 ${infoB.keyword}인 ${infoB.name}의 차이를 강점으로 활용해보세요.`,
  }
}
