import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve('dist')
const baseUrlRaw = process.env.SITE_BASE_URL ?? 'https://kyhsa93.github.io'
const baseUrl = baseUrlRaw.endsWith('/') ? baseUrlRaw.slice(0, -1) : baseUrlRaw
const routePrefix = '/fove'
const siteBase = `${baseUrl}${routePrefix}`
const socialCard = `${siteBase}/social-card.png`

const routes = [
  {
    path: '/saju',
    title: 'Fove · 사주 풀이',
    ogTitle: '사주 풀이 — Fove',
    description: '생년월일과 태어난 시간으로 사주팔자를 계산하고 오행 밸런스와 사주 해석을 확인하세요.',
  },
  {
    path: '/mbti',
    title: 'Fove · MBTI 성향 진단',
    ogTitle: 'MBTI 성향 진단 — Fove',
    description: '20문항으로 빠르게 MBTI 성향을 진단하고 사주 운세와 교차 인사이트를 받아보세요.',
  },
  {
    path: '/fortune',
    title: 'Fove · 오늘의 운세',
    ogTitle: '오늘의 운세 — Fove',
    description: '사주와 일진을 조합해 오늘의 에너지 흐름, 분야별 운세(일·사랑·재물·건강), 행운 요소를 확인하세요.',
  },
  {
    path: '/fortune/week',
    title: 'Fove · 이번 주 일진 흐름',
    ogTitle: '이번 주 일진 — Fove',
    description: '이번 주 7일의 일진 천간·지지와 오행 에너지 흐름을 한눈에 확인하세요.',
  },
  {
    path: '/fortune/month',
    title: 'Fove · 이번 달 일진 달력',
    ogTitle: '이번 달 일진 달력 — Fove',
    description: '이번 달 매일의 일진 천간·지지와 오행 기운을 달력 형태로 한눈에 확인하세요.',
  },
  {
    path: '/fortune/year',
    title: 'Fove · 연간 운세',
    ogTitle: '연간 운세 — Fove',
    description: '올해 12개월의 월주 오행 흐름을 확인하고 시기별 에너지와 행동 방향을 파악하세요.',
  },
  {
    path: '/zodiac',
    title: 'Fove · 띠별 운세',
    ogTitle: '띠별 운세 — Fove',
    description: '12간지 띠별 기질·관계·직업·건강 특성과 사주 오행 분석을 확인하세요.',
  },
  {
    path: '/insight',
    title: 'Fove · 사주·MBTI 통합 인사이트',
    ogTitle: '사주·MBTI 통합 인사이트 — Fove',
    description: '타고난 사주 성향과 현재 MBTI 성향을 결합해 나만의 맞춤 성향 리포트를 확인하세요.',
  },
  {
    path: '/compatibility',
    title: 'Fove · 궁합 보기',
    ogTitle: '궁합 보기 — Fove',
    description: '두 사람의 생년월일과 사주 오행을 분석해 연인·친구·직장 궁합 점수를 확인하세요.',
  },
  {
    path: '/mbti/compatibility',
    title: 'MBTI 16타입 궁합 매트릭스 — 나와 맞는 유형은? | Fove',
    ogTitle: 'MBTI 16타입 궁합 매트릭스 — Fove',
    description: 'MBTI 16타입별 연애 궁합을 확인하세요. INTJ, ENFP, INFJ, ENTP 등 각 유형의 최고 궁합과 연애 스타일을 분석합니다.',
  },
  {
    path: '/zodiac/compatibility',
    title: '띠 궁합 — 12간지 궁합 보기 | Fove',
    ogTitle: '띠 궁합 — 12간지 궁합 보기 | Fove',
    description: '쥐띠·소띠·호랑이띠 등 12간지 띠별 궁합을 확인하세요. 삼합·육합·충 기반으로 연인·친구·직장 궁합을 분석합니다.',
  },
  {
    path: '/compatibility/combined',
    title: '사주+MBTI 통합 궁합 | Fove',
    ogTitle: '사주+MBTI 통합 궁합 — Fove',
    description: '사주 오행(40%)과 MBTI 인지기능(60%)을 결합한 통합 궁합을 확인하세요. 두 사람의 에너지 흐름과 소통 방식을 교차 분석합니다.',
  },
  {
    path: '/quiz',
    title: 'Fove · 운세 심리테스트',
    ogTitle: '운세 심리테스트 — Fove',
    description: '가벼운 심리테스트로 나의 운 흐름과 성향을 확인하고 결과를 공유해 보세요.',
  },
  {
    path: '/blog/saju-basics',
    title: '사주란 무엇인가? 사주팔자 기초 완벽 정리 | Fove',
    ogTitle: '사주란 무엇인가? — Fove',
    description: '사주(四柱)의 개념부터 천간·지지·오행·60갑자까지. 사주팔자 계산 방법과 연주·월주·일주·시주의 기준을 쉽게 설명합니다.',
  },
  {
    path: '/blog/zodiac-standard',
    title: '띠 기준은 입춘인가 음력 설인가? 완벽 정리 | Fove',
    ogTitle: '띠 기준은 입춘인가 음력 설인가? — Fove',
    description: '1~2월생이 혼란스러워하는 띠 기준을 완벽 정리합니다. 입춘 기준과 음력 설 기준의 차이, 사주명리학의 올바른 연주 계산법을 설명합니다.',
  },
  {
    path: '/blog/mbti-love-style',
    title: 'MBTI별 연애 스타일 완벽 정리 — 16타입 사랑 방식 | Fove',
    ogTitle: 'MBTI별 연애 스타일 완벽 정리 — Fove',
    description: 'MBTI 16타입별 연애 스타일을 완벽 정리합니다. 각 유형이 사랑을 표현하는 방식, 강점과 주의점, 이상적인 데이트까지 분석합니다.',
  },
]

function escapeAttr(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function injectOg(template, route) {
  const canonicalUrl = `${siteBase}${route.path}`
  const title = escapeAttr(route.title)
  const ogTitle = escapeAttr(route.ogTitle)
  const description = escapeAttr(route.description)

  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/,  `$1${description}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/,  `$1${ogTitle}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/,  `$1${description}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/,  `$1${canonicalUrl}$2`)
    .replace(/(<meta property="og:image" content=")[^"]*(")/,  `$1${socialCard}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/,  `$1${ogTitle}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/,  `$1${description}$2`)
    .replace(/(<meta name="twitter:image" content=")[^"]*(")/,  `$1${socialCard}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/,  `$1${canonicalUrl}$2`)
}

const templatePath = path.join(distDir, 'index.html')
if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found — run `npm run build` first')
  process.exit(1)
}

const template = fs.readFileSync(templatePath, 'utf8')
let generated = 0

for (const route of routes) {
  const html = injectOg(template, route)
  const outDir = path.join(distDir, route.path)
  fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, 'index.html')
  fs.writeFileSync(outFile, html, 'utf8')
  generated++
}

console.log(`Generated ${generated} OG pages in dist/`)
