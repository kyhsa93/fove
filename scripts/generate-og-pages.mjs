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

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// ─── 블로그 본문 데이터 (컴포넌트와 동기화 유지) ──────────────────────────
const BLOG_NOSCRIPT = {
  '/blog/saju-basics': {
    h1: '사주란 무엇인가?',
    subtitle: '사주팔자(四柱八字) 기초 개념 정리',
    sections: [
      {
        h2: '사주(四柱)란 무엇인가?',
        paras: [
          '사주(四柱)는 사람이 태어난 연(年)·월(月)·일(日)·시(時) 네 가지 기둥을 뜻합니다. 이 네 기둥 각각에 천간(天干)과 지지(地支)가 하나씩 붙어 총 8글자가 완성되므로, 흔히 "사주팔자(四柱八字)"라고 부릅니다.',
          '사주는 동아시아 전통 명리학(命理學)에서 발전한 개념으로, 태어난 시공간의 기운이 사람의 기질·성향·삶의 흐름에 영향을 준다고 봅니다. 오늘날에는 자기 이해와 시기별 에너지 흐름을 파악하는 참고 도구로 활용됩니다.',
        ],
      },
      {
        h2: '천간(天干)과 지지(地支)',
        paras: [
          '천간은 갑(甲)·을(乙)·병(丙)·정(丁)·무(戊)·기(己)·경(庚)·신(辛)·임(壬)·계(癸) 10개로 이루어집니다. 각각 오행(목·화·토·금·수)과 음양으로 분류되며 연·월·일·시의 위쪽 글자에 해당합니다.',
          '지지는 자(子)·축(丑)·인(寅)·묘(卯)·진(辰)·사(巳)·오(午)·미(未)·신(申)·유(酉)·술(戌)·해(亥) 12개로 이루어집니다. 12간지(띠)와 동일하며 천간 아래 글자에 해당합니다. 천간과 지지의 60가지 조합이 "60갑자"를 이룹니다.',
        ],
      },
      {
        h2: '오행(五行): 목·화·토·금·수',
        paras: [
          '오행은 자연의 다섯 가지 기운을 상징합니다. 목(木)은 성장·창의, 화(火)는 열정·표현, 토(土)는 안정·중재, 금(金)은 결단·원칙, 수(水)는 지혜·유연함을 나타냅니다.',
          '사주 원국에서 어떤 오행이 강하고 약한지에 따라 성향과 잠재력이 달라집니다. 오행 상생(목→화→토→금→수→목)과 상극 관계를 통해 사주 전체의 균형을 파악합니다.',
        ],
      },
      {
        h2: '사주의 네 기둥 계산 방법',
        paras: [
          '연주(年柱)는 입춘(양력 2월 4~5일) 기준으로 계산합니다. 음력 설날이 아니라 입춘을 기준으로 해가 바뀌므로, 1~2월생은 반드시 입춘 전후를 확인해야 합니다.',
          '월주(月柱)는 절기(節氣)를 기준으로 구분합니다. 일주(日柱)는 양력 날짜를 기반으로 60갑자를 순환 계산합니다. 시주(時柱)는 태어난 시각에 따라 12지시를 배정합니다.',
        ],
      },
      {
        h2: '현대적 활용: 자기 이해의 도구',
        paras: [
          '사주는 타고난 기질과 에너지 패턴을 이해하는 참고 자료입니다. 특정 시기의 운의 흐름을 미리 파악해 중요한 결정에 활용하는 분들도 많습니다.',
          '결과는 결정론적 운명이 아닌 가이드로 받아들이는 것이 중요합니다.',
        ],
      },
    ],
  },

  '/blog/zodiac-standard': {
    h1: '띠 기준은 입춘인가 음력 설인가?',
    subtitle: '1~2월생이라면 반드시 확인해야 할 연주(年柱) 계산 기준',
    summary: '명리학(사주) 기준 → 입춘(양력 2월 4~5일) / 민간 관습 기준 → 음력 설날. Fove는 전통 명리학 기준인 입춘을 사용합니다.',
    sections: [
      {
        h2: '왜 혼란이 생기는가?',
        paras: [
          '매년 1~2월생들은 "내 띠가 뭐냐"는 질문 앞에서 혼란을 겪습니다. 이 혼란은 한국에서 띠를 계산하는 기준이 서로 다른 두 관습이 공존하기 때문에 생깁니다.',
          '인터넷 검색을 해보면 음력 설을 기준으로 보는 답변과 입춘을 기준으로 보는 답변이 섞여 있어 혼란이 더욱 커집니다.',
        ],
      },
      {
        h2: '입춘(立春) 기준 — 명리학 전통',
        paras: [
          '명리학(사주 이론)에서는 연주(年柱)를 입춘으로 구분합니다. 입춘은 24절기 중 첫 번째로, 매년 양력 2월 4~5일 무렵입니다.',
          '사주팔자를 계산할 때는 반드시 입춘 기준을 사용해야 사주 원국의 천간·지지가 정확하게 배정됩니다. Fove의 사주 계산도 입춘 기준을 채택하고 있습니다.',
        ],
      },
      {
        h2: '음력 설(구정) 기준 — 민간 관습',
        paras: [
          '일상에서 "새해"는 음력 설날(구정)을 기준으로 바뀐다는 관념이 여전히 강합니다. 이 맥락에서 띠도 설을 기준으로 보는 경우가 많습니다.',
          '음력 설은 해마다 양력으로 1월 21일~2월 20일 사이에 위치합니다. 이 구간에 태어난 사람은 두 기준 중 어느 것을 따르느냐에 따라 띠가 달라집니다.',
        ],
      },
      {
        h2: '두 기준의 차이 — 실제 사례',
        paras: [
          '예시: 2025년 1월 29일 출생 시, 입춘 기준으로는 2024년 갑진년(용띠), 음력 설 기준으로는 2025년 을사년(뱀띠)에 해당합니다.',
          '해마다 입춘과 설날이 며칠 차이가 나는 구간에 태어난 분들은 어느 기준을 따르느냐에 따라 띠가 한 해씩 달라집니다.',
        ],
      },
      {
        h2: 'Fove의 기준 — 입춘',
        paras: [
          'Fove는 전통 명리학 기준인 입춘을 연주(年柱) 변환 기준으로 사용합니다.',
          '입춘 전후 1~2월생은 전년도 천간·지지로 배정될 수 있으니 참고하세요.',
        ],
      },
    ],
  },

  '/blog/mbti-love-style': {
    h1: 'MBTI별 연애 스타일 완벽 정리',
    subtitle: 'MBTI 16가지 유형이 사랑을 표현하는 방식, 연애의 강점과 주의점, 이상적인 데이트까지 유형별로 분석합니다.',
    types: [
      { type: 'INTJ', nickname: '전략가', summary: '깊은 지적 연결을 원합니다. 표현은 서툴지만 한번 마음을 주면 흔들리지 않습니다.', strengths: ['변함없는 헌신', '파트너 성장 지원', '진지한 관계 지향'], cautions: ['감정 표현 부족', '높은 기대치', '완벽주의적 경향'], idealDate: '깊은 대화, 독서 카페, 전시관 방문' },
      { type: 'INTP', nickname: '논리술사', summary: '감정보다 이성으로 관계를 접근합니다. 상대의 지적 자극이 없으면 금세 멀어집니다.', strengths: ['독립성 존중', '비판 없는 수용', '창의적 아이디어'], cautions: ['감정적 공감 어려움', '즉흥적 표현 부족', '일상적 배려 소홀'], idealDate: '퀴즈나 보드게임, 새로운 주제의 대화' },
      { type: 'ENTJ', nickname: '통솔자', summary: '목표 지향적 연애를 합니다. 파트너를 리드하고 더 나은 방향으로 이끌고 싶어 합니다.', strengths: ['강력한 추진력', '명확한 목표 제시', '파트너 성공 응원'], cautions: ['지나친 주도성', '감정보다 논리 우선', '바쁜 일정'], idealDate: '새로운 도전, 계획적인 여행, 목표 공유' },
      { type: 'ENTP', nickname: '변론가', summary: '지적 토론이 연애의 핵심입니다. 틀에 얽매이지 않는 자유로운 관계를 선호합니다.', strengths: ['흥미로운 대화', '개방적 마인드', '유머 감각'], cautions: ['논쟁적 태도', '집중력 분산', '감정 무시'], idealDate: '즉흥 여행, 토론 카페, 새로운 음식 탐방' },
      { type: 'INFJ', nickname: '옹호자', summary: '깊고 의미 있는 연결을 추구합니다. 상대를 남들보다 더 잘 이해하고 싶어 합니다.', strengths: ['깊은 공감 능력', '진정성 있는 지지', '장기적 헌신'], cautions: ['지나친 기대', '혼자만의 시간 필요', '표현이 직접적이지 않음'], idealDate: '조용한 카페, 의미 있는 장소 방문, 독서' },
      { type: 'INFP', nickname: '중재자', summary: '진정성과 가치 공유를 가장 중요하게 여깁니다. 깊은 감정적 연결을 꿈꿉니다.', strengths: ['진심 어린 감정 표현', '상대 내면 이해', '창의적 애정 표현'], cautions: ['이상화 경향', '갈등 회피', '감정 기복'], idealDate: '자연 속 산책, 글쓰기·그림 함께하기, 감성 영화' },
      { type: 'ENFJ', nickname: '주인공', summary: '파트너의 행복을 위해 온 힘을 다합니다. 관계에서 감정 표현이 풍부합니다.', strengths: ['헌신적인 배려', '감성적 연결', '파트너 성장 지원'], cautions: ['자기 감정 억압', '과도한 책임감', '인정 욕구'], idealDate: '함께하는 봉사활동, 기념일 이벤트, 대화 중심 데이트' },
      { type: 'ENFP', nickname: '활동가', summary: '열정적이고 낭만적입니다. 파트너에게 영감을 주고 함께 성장하는 관계를 원합니다.', strengths: ['풍부한 감정 표현', '창의적 데이트 계획', '긍정적 에너지'], cautions: ['쉽게 열정 식음', '계획 변경 잦음', '깊이 있는 관계 유지 어려움'], idealDate: '즉흥 여행, 축제, 새로운 취미 탐색' },
      { type: 'ISTJ', nickname: '물류관리자', summary: '안정과 신뢰를 기반으로 관계를 쌓습니다. 말보다 행동으로 사랑을 증명합니다.', strengths: ['일관된 신뢰', '실질적인 지원', '오래 지속되는 헌신'], cautions: ['감정 표현 서툼', '변화에 느린 적응', '융통성 부족'], idealDate: '단골 식당, 집에서 함께 요리, 규칙적인 데이트' },
      { type: 'ISFJ', nickname: '수호자', summary: '따뜻하고 세심한 배려로 관계를 지킵니다. 파트너의 필요를 먼저 챙깁니다.', strengths: ['세심한 배려', '안정적인 존재감', '기억력 좋은 애정 표현'], cautions: ['자기 표현 부족', '갈등 회피 경향', '지나친 희생'], idealDate: '소박한 집밥 데이트, 추억 만들기, 조용한 여행' },
      { type: 'ESTJ', nickname: '경영자', summary: '책임감 있고 체계적으로 관계를 관리합니다. 파트너에게 안정감을 제공합니다.', strengths: ['믿음직한 안정감', '계획적인 배려', '명확한 의사소통'], cautions: ['융통성 부족', '감정보다 원칙 우선', '간섭적 태도'], idealDate: '계획된 여행, 공식 기념일 챙기기, 목표 공유 대화' },
      { type: 'ESFJ', nickname: '집정관', summary: '표현이 풍부하고 관계의 조화를 최우선으로 합니다. 파트너의 감정에 민감합니다.', strengths: ['감성적 공감', '적극적인 애정 표현', '관계 분위기 관리'], cautions: ['외부 평가 의식', '갈등 회피', '감정적 의존'], idealDate: '가족·친구와의 만남, 특별한 이벤트 기획' },
      { type: 'ISTP', nickname: '장인', summary: '독립성을 유지하면서 실질적으로 파트너를 돕습니다. 행동으로 사랑을 표현합니다.', strengths: ['실용적인 지원', '스트레스 없는 관계', '위기 대처 능력'], cautions: ['감정 표현 최소화', '갑작스러운 철수', '장기 계획 부재'], idealDate: '함께 만들기(요리·공작), 스포츠, 새로운 기술 도전' },
      { type: 'ISFP', nickname: '모험가', summary: '현재 순간에 충실한 감각적 사랑을 합니다. 진정성 있는 감정 표현을 중시합니다.', strengths: ['풍부한 감성', '상대 존중', '자유로운 연애 스타일'], cautions: ['미래 계획 소홀', '감정 억압', '갈등 시 침묵'], idealDate: '예술 전시, 자연 속 피크닉, 감성적인 음악 공연' },
      { type: 'ESTP', nickname: '사업가', summary: '활동적이고 즉흥적입니다. 파트너와 새로운 경험을 함께 탐구하는 것을 즐깁니다.', strengths: ['활기찬 에너지', '현실 문제 해결', '즉흥적 낭만'], cautions: ['깊이 있는 감정 어려움', '장기 계획 부재', '자극 추구 경향'], idealDate: '스포츠, 즉흥 여행, 새로운 활동 도전' },
      { type: 'ESFP', nickname: '연예인', summary: '생기 있고 즐거운 연애를 만듭니다. 파트너를 웃게 하고 함께하는 순간을 소중히 합니다.', strengths: ['긍정적인 에너지', '다채로운 데이트', '즉각적인 감정 표현'], cautions: ['미래 계획 어려움', '주의 분산', '깊이 있는 관계 회피'], idealDate: '파티, 콘서트, 새로운 맛집 탐방' },
    ],
  },
}

function buildNoscript(routePath) {
  const data = BLOG_NOSCRIPT[routePath]
  if (!data) return ''

  const e = escapeHtml

  let body = `<h1>${e(data.h1)}</h1><p>${e(data.subtitle)}</p>`

  if (data.summary) {
    body += `<p><strong>${e(data.summary)}</strong></p>`
  }

  if (data.sections) {
    for (const s of data.sections) {
      body += `<h2>${e(s.h2)}</h2>`
      for (const p of s.paras) body += `<p>${e(p)}</p>`
    }
  }

  if (data.types) {
    for (const t of data.types) {
      body += `<h2>${e(t.type)} — ${e(t.nickname)}</h2>`
      body += `<p>${e(t.summary)}</p>`
      body += `<p>강점: ${t.strengths.map(e).join(', ')}</p>`
      body += `<p>주의: ${t.cautions.map(e).join(', ')}</p>`
      body += `<p>이상적 데이트: ${e(t.idealDate)}</p>`
    }
  }

  return `<noscript><article lang="ko">${body}</article></noscript>`
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
  let html = injectOg(template, route)
  const noscript = buildNoscript(route.path)
  if (noscript) {
    html = html.replace('</body>', `${noscript}</body>`)
  }
  const outDir = path.join(distDir, route.path)
  fs.mkdirSync(outDir, { recursive: true })
  const outFile = path.join(outDir, 'index.html')
  fs.writeFileSync(outFile, html, 'utf8')
  generated++
}

console.log(`Generated ${generated} OG pages in dist/`)
