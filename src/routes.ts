export const BASE_PATH = '/fove' as const

export const ROUTE_PATHS = {
  home: `${BASE_PATH}` as const,
  saju: `${BASE_PATH}/saju` as const,
  mbti: `${BASE_PATH}/mbti` as const,
  fortune: `${BASE_PATH}/fortune` as const,
  privacyPolicy: `${BASE_PATH}/privacy-policy` as const,
  termsOfService: `${BASE_PATH}/terms-of-service` as const,
  contact: `${BASE_PATH}/contact` as const
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
  { path: ROUTE_PATHS.fortune, label: '오늘의 운세' }
]
