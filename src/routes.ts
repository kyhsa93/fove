export const ROUTE_PATHS = {
  home: '/',
  saju: '/saju',
  mbti: '/mbti',
  fortune: '/fortune',
  fortuneWeek: '/fortune/week',
  fortuneMonth: '/fortune/month',
  fortuneYear: '/fortune/year',
  zodiac: '/zodiac',
  insight: '/insight',
  compatibility: '/compatibility',
  quiz: '/quiz',
  sajuYear: '/saju/year',
  mbtiCompatibility: '/mbti/compatibility',
  zodiacCompatibility: '/zodiac/compatibility',
  combinedCompatibility: '/compatibility/combined',
  tarot: '/tarot',
  taekil: '/taekil',
  bloodCompatibility: '/blood-compatibility',
  starSignCompatibility: '/starsign-compatibility',
  blogSajuBasics: '/blog/saju-basics',
  blogZodiacStandard: '/blog/zodiac-standard',
  blogMbtiLoveStyle: '/blog/mbti-love-style',
  blogIljinGuide: '/blog/iljin-guide',
  blogMbtiCareer: '/blog/mbti-career',
  privacyPolicy: '/privacy-policy',
  termsOfService: '/terms-of-service',
  contact: '/contact'
} as const

export type RoutePath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS]

export const footerLinks: Array<{ path: RoutePath; label: string }> = [
  { path: ROUTE_PATHS.privacyPolicy, label: 'Privacy Policy' },
  { path: ROUTE_PATHS.termsOfService, label: 'Terms of Service' },
  { path: ROUTE_PATHS.contact, label: 'Contact' }
]

export const navLinks: Array<{ path: RoutePath; label: string }> = [
  { path: ROUTE_PATHS.saju, label: '사주' },
  { path: ROUTE_PATHS.mbti, label: 'MBTI' },
  { path: ROUTE_PATHS.fortune, label: '오늘의 운세' },
  { path: ROUTE_PATHS.insight, label: '통합 인사이트' },
  { path: ROUTE_PATHS.taekil, label: '택일' },
  { path: ROUTE_PATHS.quiz, label: '퀴즈' }
]

export const blogLinks: Array<{ path: RoutePath; label: string }> = [
  { path: ROUTE_PATHS.blogSajuBasics, label: '사주란 무엇인가?' },
  { path: ROUTE_PATHS.blogZodiacStandard, label: '띠 기준 완벽 정리' },
  { path: ROUTE_PATHS.blogMbtiLoveStyle, label: 'MBTI별 연애 스타일' },
  { path: ROUTE_PATHS.blogIljinGuide, label: '일진 보는 법 완벽 정리' },
  { path: ROUTE_PATHS.blogMbtiCareer, label: 'MBTI 유형별 직업 궁합' }
]
