export const SITE_URL: string =
  typeof window !== 'undefined' ? window.location.origin : ''

export const OG_IMAGE_URL = `${SITE_URL}/social-card.png`
