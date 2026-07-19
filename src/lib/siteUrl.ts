const SITE_ORIGIN = 'https://kyhsa93.github.io'
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '')

export const SITE_URL: string =
  typeof window !== 'undefined'
    ? `${window.location.origin}${basePath}`
    : `${SITE_ORIGIN}${basePath}`

export const OG_IMAGE_URL = `${SITE_URL}/social-card.png`
