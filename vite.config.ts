import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { ZODIAC_SLUGS } from './scripts/zodiac.mjs'

const base = process.env.NODE_ENV === 'production' ? '/fove/' : '/'

export default defineConfig({
  base,
  ssgOptions: {
    script: 'async',
    formatting: 'none',
    includedRoutes: () => {
      const currentYear = new Date().getFullYear()
      const sajuYears = Array.from({ length: 80 }, (_, i) => currentYear - 70 + i)
      return [
        '/', '/saju', '/mbti', '/fortune', '/fortune/week', '/fortune/month', '/fortune/year',
        '/zodiac', '/zodiac/compatibility',
        ...ZODIAC_SLUGS.map((slug) => `/zodiac/${slug}`),
        '/insight', '/compatibility', '/mbti/compatibility', '/compatibility/combined',
        '/quiz',
        '/tarot', '/taekil', '/blood-compatibility', '/starsign-compatibility',
        '/blog/saju-basics', '/blog/zodiac-standard', '/blog/mbti-love-style',
        '/privacy-policy', '/terms-of-service', '/contact',
        ...sajuYears.map((y) => `/saju/${y}`),
      ]
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['robots.txt', 'social-card.png'],
      manifest: {
        name: 'Fove · 사주 & 운세',
        short_name: 'Fove',
        description: '사주 풀이, MBTI, 오늘의 운세를 한 번에',
        theme_color: '#4f46e5',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: `${base}fortune`,
        lang: 'ko',
        icons: [
          { src: `${base}icons/icon-192.svg`, sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: `${base}icons/icon-512.svg`, sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallbackDenylist: [/\/ads\.txt$/, /\/robots\.txt$/, /\/sitemap.*\.xml$/, /\/manifest.*\.webmanifest$/],
        importScripts: ['sw-push.js'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 5173
  }
})
