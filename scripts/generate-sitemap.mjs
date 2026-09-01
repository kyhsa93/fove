import fs from 'node:fs'
import path from 'node:path'
import { ZODIAC_SLUGS } from './zodiac.mjs'

const distDir = path.resolve('dist')
const sitemapPath = path.join(distDir, 'sitemap.xml')

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true })
}

const baseUrlRaw = process.env.SITE_BASE_URL ?? 'https://kyhsa93.github.io'
const baseUrl = baseUrlRaw.endsWith('/') ? baseUrlRaw.slice(0, -1) : baseUrlRaw
const now = new Date().toISOString()

const routePrefix = '/fove'

// /saju/{연도} 80장은 여기 없다. 본문이 오행 하나로만 갈려 80장이 실제로는 5종이라
// noindex 처리했고(generate-og-pages.mjs의 NOINDEX_ROUTES), 색인에서 뺀 페이지를
// 사이트맵에 남겨두면 크롤러에 상반된 신호를 준다.
const routes = [
  { path: `${routePrefix}/`, changefreq: 'daily', priority: '1.0' },
  { path: `${routePrefix}/saju`, changefreq: 'daily', priority: '0.9' },
  { path: `${routePrefix}/mbti`, changefreq: 'daily', priority: '0.9' },
  { path: `${routePrefix}/fortune`, changefreq: 'daily', priority: '0.9' },
  { path: `${routePrefix}/fortune/week`, changefreq: 'daily', priority: '0.7' },
  { path: `${routePrefix}/fortune/month`, changefreq: 'daily', priority: '0.7' },
  { path: `${routePrefix}/fortune/year`, changefreq: 'monthly', priority: '0.7' },
  { path: `${routePrefix}/zodiac`, changefreq: 'monthly', priority: '0.8' },
  { path: `${routePrefix}/zodiac/compatibility`, changefreq: 'monthly', priority: '0.8' },
  ...ZODIAC_SLUGS.map((slug) => ({
    path: `${routePrefix}/zodiac/${slug}`,
    changefreq: 'monthly',
    priority: '0.7'
  })),
  { path: `${routePrefix}/insight`, changefreq: 'monthly', priority: '0.8' },
  { path: `${routePrefix}/compatibility`, changefreq: 'monthly', priority: '0.8' },
  { path: `${routePrefix}/compatibility/combined`, changefreq: 'monthly', priority: '0.8' },
  { path: `${routePrefix}/quiz`, changefreq: 'monthly', priority: '0.7' },
  { path: `${routePrefix}/mbti/compatibility`, changefreq: 'monthly', priority: '0.8' },
  { path: `${routePrefix}/tarot`, changefreq: 'daily', priority: '0.9' },
  { path: `${routePrefix}/taekil`, changefreq: 'monthly', priority: '0.8' },
  { path: `${routePrefix}/blood-compatibility`, changefreq: 'monthly', priority: '0.8' },
  { path: `${routePrefix}/starsign-compatibility`, changefreq: 'monthly', priority: '0.8' },
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
