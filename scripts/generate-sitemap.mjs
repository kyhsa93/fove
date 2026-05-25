import fs from 'node:fs'
import path from 'node:path'

const distDir = path.resolve('dist')
const sitemapPath = path.join(distDir, 'sitemap.xml')

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}

const baseUrlRaw = process.env.SITE_BASE_URL ?? 'https://kyhsa93.github.io'
const baseUrl = baseUrlRaw.endsWith('/') ? baseUrlRaw.slice(0, -1) : baseUrlRaw
const now = new Date().toISOString()

const routePrefix = '/fove'

const zodiacSlugs = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig']

const currentYear = new Date().getFullYear()
const sajuYears = Array.from({ length: 80 }, (_, i) => currentYear - 70 + i)

const routes = [
  { path: `${routePrefix}`, changefreq: 'daily', priority: '1.0' },
  { path: `${routePrefix}/saju`, changefreq: 'daily', priority: '0.9' },
  { path: `${routePrefix}/mbti`, changefreq: 'daily', priority: '0.9' },
  { path: `${routePrefix}/fortune`, changefreq: 'daily', priority: '0.9' },
  { path: `${routePrefix}/fortune/week`, changefreq: 'daily', priority: '0.7' },
  { path: `${routePrefix}/fortune/month`, changefreq: 'daily', priority: '0.7' },
  { path: `${routePrefix}/fortune/year`, changefreq: 'monthly', priority: '0.7' },
  { path: `${routePrefix}/zodiac`, changefreq: 'monthly', priority: '0.8' },
  ...zodiacSlugs.map((slug) => ({
    path: `${routePrefix}/zodiac/${slug}`,
    changefreq: 'monthly',
    priority: '0.7'
  })),
  { path: `${routePrefix}/insight`, changefreq: 'monthly', priority: '0.8' },
  { path: `${routePrefix}/compatibility`, changefreq: 'monthly', priority: '0.8' },
  { path: `${routePrefix}/quiz`, changefreq: 'monthly', priority: '0.7' },
  ...sajuYears.map((year) => ({
    path: `${routePrefix}/saju/${year}`,
    changefreq: 'yearly',
    priority: '0.6'
  })),
  { path: `${routePrefix}/mbti/compatibility`, changefreq: 'monthly', priority: '0.8' },
  { path: `${routePrefix}/blog/saju-basics`, changefreq: 'monthly', priority: '0.7' },
  { path: `${routePrefix}/blog/zodiac-standard`, changefreq: 'monthly', priority: '0.7' },
  { path: `${routePrefix}/blog/mbti-love-style`, changefreq: 'monthly', priority: '0.7' },
  { path: `${routePrefix}/privacy-policy`, changefreq: 'yearly', priority: '0.3' },
  { path: `${routePrefix}/terms-of-service`, changefreq: 'yearly', priority: '0.3' },
  { path: `${routePrefix}/contact`, changefreq: 'monthly', priority: '0.4' }
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes
    .map(({ path, changefreq, priority }) => {
      const loc = `${baseUrl}${path}`
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${now}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>'
      ].join('\n')
    })
    .join('\n') +
  '\n</urlset>\n'

fs.writeFileSync(sitemapPath, xml, 'utf8')

console.log(`Generated sitemap at ${sitemapPath}`)
