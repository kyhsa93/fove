import fs from 'node:fs'
import path from 'node:path'
import { SAJU_BASICS_META, SAJU_BASICS_SECTIONS } from '../src/data/blogSajuBasics.js'
import { ZODIAC_STANDARD_META, ZODIAC_STANDARD_SUMMARY, ZODIAC_STANDARD_SECTIONS } from '../src/data/blogZodiacStandard.js'
import { MBTI_LOVE_STYLE_META, LOVE_STYLES } from '../src/data/blogMbtiLoveStyle.js'
import { ZODIAC_SIGNS } from './zodiac.mjs'

const STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸']
const BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥']
const BRANCH_ANIMALS = { 子:'쥐',丑:'소',寅:'호랑이',卯:'토끼',辰:'용',巳:'뱀',午:'말',未:'양',申:'원숭이',酉:'닭',戌:'개',亥:'돼지' }
const STEM_ELEMENTS = { 甲:'목',乙:'목',丙:'화',丁:'화',戊:'토',己:'토',庚:'금',辛:'금',壬:'수',癸:'수' }

function mod(n, m) { return ((n % m) + m) % m }
function getYearPillar(year) {
  const stem = STEMS[mod(year - 4, 10)]
  const branch = BRANCHES[mod(year - 4, 12)]
  return { stem, branch, animal: BRANCH_ANIMALS[branch], element: STEM_ELEMENTS[stem] }
}

const currentYear = new Date().getFullYear()
const sajuYears = Array.from({ length: 80 }, (_, i) => currentYear - 70 + i)

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
  ...ZODIAC_SIGNS.map(({ slug, animal, branch, element }) => ({
    path: `/zodiac/${slug}`,
    title: `${animal}띠 운세 — 성격·궁합·직업 특성 | Fove`,
    ogTitle: `${animal}띠 운세 — Fove`,
    description: `${animal}띠(${branch}, ${element} 기운)의 타고난 기질과 관계·직업·재물·건강 특성을 확인하세요. 삼합·육합 기반 띠 궁합도 함께 분석합니다.`,
  })),
  {
    path: '/privacy-policy',
    title: 'Fove · 개인정보처리방침',
    ogTitle: '개인정보처리방침 — Fove',
    description: 'Fove가 수집하는 정보와 이용 목적, 보관 기간, 이용자의 권리를 안내합니다.',
  },
  {
    path: '/terms-of-service',
    title: 'Fove · 이용약관',
    ogTitle: '이용약관 — Fove',
    description: 'Fove 서비스 이용 조건과 이용자·운영자의 권리와 의무를 안내합니다.',
  },
  {
    path: '/contact',
    title: 'Fove · 문의하기',
    ogTitle: '문의하기 — Fove',
    description: 'Fove 서비스에 대한 문의와 피드백을 보내주세요.',
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
    path: '/taekil',
    title: '택일 — 결혼·이사·계약·개업 좋은 날 찾기 | Fove',
    ogTitle: '택일 — 좋은 날 찾기 | Fove',
    description: '결혼·이사·계약·개업·여행·시험에 좋은 날을 사주 오행 기반으로 추천해드려요. 이번 달 최적의 날짜를 확인하세요.',
  },
  {
    path: '/tarot',
    title: '오늘의 타로 카드 — 하루를 위한 세 장의 카드 | Fove',
    ogTitle: '오늘의 타로 — Fove',
    description: '매일 새롭게 뽑히는 세 장의 타로 카드로 오늘의 에너지·행동·주의 포인트를 확인하세요. 78장 완전판.',
  },
  {
    path: '/blood-compatibility',
    title: '혈액형 궁합 — A·B·O·AB 16가지 조합 완벽 분석 | Fove',
    ogTitle: '혈액형 궁합 — Fove',
    description: 'A형·B형·O형·AB형 혈액형 16가지 조합의 궁합을 성향 분석으로 알아보세요. 나와 잘 맞는 혈액형은?',
  },
  {
    path: '/starsign-compatibility',
    title: '별자리 궁합 — 12별자리 144가지 조합 분석 | Fove',
    ogTitle: '별자리 궁합 — Fove',
    description: '양자리·황소자리·쌍둥이자리 등 12별자리 궁합을 원소 에너지 기반으로 분석해요. 내 별자리와 가장 잘 맞는 별자리는?',
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

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function buildNoscript(routePath) {
  const e = escapeHtml

  if (routePath === '/blog/saju-basics') {
    let body = `<h1>${e(SAJU_BASICS_META.h1)}</h1><p>${e(SAJU_BASICS_META.subtitle)}</p>`
    for (const s of SAJU_BASICS_SECTIONS) {
      body += `<h2>${e(s.title)}</h2>`
      for (const p of s.content) body += `<p>${e(p)}</p>`
    }
    return `<noscript><article lang="ko">${body}</article></noscript>`
  }

  if (routePath === '/blog/zodiac-standard') {
    let body = `<h1>${e(ZODIAC_STANDARD_META.h1)}</h1><p>${e(ZODIAC_STANDARD_META.subtitle)}</p>`
    body += `<p><strong>${e(ZODIAC_STANDARD_SUMMARY)}</strong></p>`
    for (const s of ZODIAC_STANDARD_SECTIONS) {
      body += `<h2>${e(s.title)}</h2>`
      for (const p of s.content) body += `<p>${e(p)}</p>`
    }
    return `<noscript><article lang="ko">${body}</article></noscript>`
  }

  if (routePath === '/blog/mbti-love-style') {
    let body = `<h1>${e(MBTI_LOVE_STYLE_META.h1)}</h1><p>${e(MBTI_LOVE_STYLE_META.subtitle)}</p>`
    for (const t of LOVE_STYLES) {
      body += `<h2>${e(t.type)} — ${e(t.nickname)}</h2>`
      body += `<p>${e(t.summary)}</p>`
      body += `<p>강점: ${t.strengths.map(e).join(', ')}</p>`
      body += `<p>주의: ${t.cautions.map(e).join(', ')}</p>`
      body += `<p>이상적 데이트: ${e(t.idealDate)}</p>`
    }
    return `<noscript><article lang="ko">${body}</article></noscript>`
  }

  return ''
}

const BLOG_DATE_PUBLISHED = '2026-05-25'
const BLOG_DATE_MODIFIED = '2026-05-30'

function canonicalFor(routePath) {
  return routePath === '/' ? `${siteBase}/` : `${siteBase}${routePath}`
}

function buildBlogPostingSchema(routePath, meta) {
  if (!meta || !routePath.startsWith('/blog/')) return ''
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: meta.ogTitle.replace(/ — Fove$/, '').trim(),
    description: meta.description,
    url: canonicalFor(routePath),
    datePublished: BLOG_DATE_PUBLISHED,
    dateModified: BLOG_DATE_MODIFIED,
    author: { '@type': 'Organization', name: 'Fove', url: siteBase },
    publisher: { '@type': 'Organization', name: 'Fove', url: siteBase },
    inLanguage: 'ko-KR',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalFor(routePath) },
  }
  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
}

function injectOg(html, routePath, meta) {
  const canonicalUrl = canonicalFor(routePath)

  let result = html
    .replace(/(<meta property="og:url" content=")[^"]*(")/,  `$1${canonicalUrl}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/,  `$1${canonicalUrl}$2`)

  if (meta) {
    const title = escapeAttr(meta.title)
    const ogTitle = escapeAttr(meta.ogTitle)
    const description = escapeAttr(meta.description)

    result = result
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta name="description" content=")[^"]*(")/,  `$1${description}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/,  `$1${ogTitle}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/,  `$1${description}$2`)
      .replace(/(<meta property="og:image" content=")[^"]*(")/,  `$1${socialCard}$2`)
      .replace(/(<meta name="twitter:title" content=")[^"]*(")/,  `$1${ogTitle}$2`)
      .replace(/(<meta name="twitter:description" content=")[^"]*(")/,  `$1${description}$2`)
      .replace(/(<meta name="twitter:image" content=")[^"]*(")/,  `$1${socialCard}$2`)
  }

  const blogSchema = buildBlogPostingSchema(routePath, meta)
  if (blogSchema && !result.includes('"BlogPosting"')) {
    result = result.replace('</head>', `${blogSchema}</head>`)
  }

  return result
}

function routePathForFile(relPath) {
  if (relPath === 'index.html') return '/'
  if (relPath.endsWith('/index.html')) return `/${relPath.slice(0, -'/index.html'.length)}`
  return `/${relPath.slice(0, -'.html'.length)}`
}

function listHtmlFiles(dir) {
  const found = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) found.push(...listHtmlFiles(full))
    else if (entry.name.endsWith('.html')) found.push(full)
  }
  return found
}

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('dist/index.html not found — run `npm run build` first')
  process.exit(1)
}

const metaByPath = new Map(routes.map((route) => [route.path, route]))

for (const year of sajuYears) {
  const { stem, branch, animal, element } = getYearPillar(year)
  metaByPath.set(`/saju/${year}`, {
    path: `/saju/${year}`,
    title: `${year}년생 사주 특성 · ${animal}띠 ${element} 기운 — Fove`,
    ogTitle: `${year}년생(${animal}띠) 사주 특성 — Fove`,
    description: `${year}년생(${animal}띠)의 사주 특성을 확인하세요. ${stem}${branch}년, ${element} 기운의 성향·직업·재물·건강 분석을 제공합니다.`,
  })
}

const pageByRoute = new Map()

for (const file of listHtmlFiles(distDir)) {
  const relPath = path.relative(distDir, file).split(path.sep).join('/')
  const routePath = routePathForFile(relPath)
  const isDirectoryCopy = relPath !== 'index.html' && relPath.endsWith('/index.html')
  const existing = pageByRoute.get(routePath)

  if (!existing) {
    pageByRoute.set(routePath, { file, isDirectoryCopy })
  } else if (existing.isDirectoryCopy && !isDirectoryCopy) {
    fs.rmSync(existing.file)
    pageByRoute.set(routePath, { file, isDirectoryCopy })
  } else if (!existing.isDirectoryCopy && isDirectoryCopy) {
    fs.rmSync(file)
  }
}

let generated = 0

for (const [routePath, { file }] of pageByRoute) {
  let html = injectOg(fs.readFileSync(file, 'utf8'), routePath, metaByPath.get(routePath))
  const noscript = buildNoscript(routePath)
  if (noscript && !html.includes('<noscript>')) {
    html = html.replace('</body>', `${noscript}</body>`)
  }
  fs.writeFileSync(file, html, 'utf8')
  generated++
}

const sitemapPath = path.join(distDir, 'sitemap.xml')

if (fs.existsSync(sitemapPath)) {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8')
  const locs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => match[1])
  const missing = locs.filter((loc) => {
    if (!loc.startsWith(siteBase)) return true
    const routePath = loc.slice(siteBase.length)
    if (routePath === '' || routePath === '/') return !pageByRoute.has('/')
    return !pageByRoute.has(routePath)
  })

  if (missing.length > 0) {
    console.error(`sitemap lists ${missing.length} URL(s) with no page in dist:`)
    for (const loc of missing) console.error(`  ${loc}`)
    process.exit(1)
  }
}

console.log(`Generated ${generated} OG pages in dist/`)
