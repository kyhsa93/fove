export type RoutePath = '/' | '/about' | '/privacy-policy' | '/terms-of-service' | '/contact'

export const footerLinks: Array<{ path: RoutePath; label: string }> = [
  { path: '/about', label: 'About' },
  { path: '/privacy-policy', label: 'Privacy Policy' },
  { path: '/terms-of-service', label: 'Terms of Service' },
  { path: '/contact', label: 'Contact' }
]
