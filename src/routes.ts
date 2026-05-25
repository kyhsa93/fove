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
  blogSajuBasics: '/blog/saju-basics',
  blogZodiacStandard: '/blog/zodiac-standard',
  blogMbtiLoveStyle: '/blog/mbti-love-style',
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
  { path: ROUTE_PATHS.home, label: '홈' },
  { path: ROUTE_PATHS.saju, label: '사주' },
  { path: ROUTE_PATHS.mbti, label: 'MBTI' },
  { path: ROUTE_PATHS.fortune, label: '오늘의 운세' },
  { path: ROUTE_PATHS.insight, label: '통합 인사이트' }
]
