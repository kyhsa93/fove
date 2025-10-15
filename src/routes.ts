export type RoutePath =
  | '/'
  | '/saju'
  | '/mbti'
  | '/fortune'
  | '/privacy-policy'
  | '/terms-of-service'
  | '/contact'

export const footerLinks: Array<{ path: RoutePath; label: string }> = [
  { path: '/', label: '사주' },
  { path: '/mbti', label: 'MBTI' },
  { path: '/fortune', label: '오늘의 운세·로또' },
  { path: '/privacy-policy', label: 'Privacy Policy' },
  { path: '/terms-of-service', label: 'Terms of Service' },
  { path: '/contact', label: 'Contact' }
]

export const navLinks: Array<{ path: RoutePath; label: string }> = [
  { path: '/saju', label: '사주' },
  { path: '/mbti', label: 'MBTI' },
  { path: '/fortune', label: '오늘의 운세·로또' }
]
