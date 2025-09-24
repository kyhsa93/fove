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

const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' }
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
