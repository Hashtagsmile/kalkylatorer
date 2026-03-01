/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { ROUTES } from './src/config/links'
import { getCatalogCalculatorCount } from './src/config/catalog'

/** Sitemap routes – datadrivet från config/links */
const SITEMAP_ROUTES = Object.values(ROUTES)

function sitemapPlugin() {
  return {
    name: 'sitemap-robots',
    closeBundle() {
      const siteUrl = process.env.VITE_SITE_URL || 'https://example.com'
      const outDir = join(process.cwd(), 'dist')

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_ROUTES.map(
  (path) => `  <url>
    <loc>${siteUrl}${path}</loc>
    <changefreq>monthly</changefreq>
    <priority>${path === '/' ? '1.0' : '0.8'}</priority>
  </url>`
).join('\n')}
</urlset>`

      writeFileSync(join(outDir, 'sitemap.xml'), sitemap, 'utf-8')

      const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`
      writeFileSync(join(outDir, 'robots.txt'), robots, 'utf-8')
    },
  }
}

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
  plugins: [
    react(),
    {
      name: 'html-site-url',
      transformIndexHtml(html) {
        const siteUrl = process.env.VITE_SITE_URL || 'https://example.com'
        const calculatorCount = String(getCatalogCalculatorCount())
        return html
          .replace(/\{\{SITE_URL\}\}/g, siteUrl)
          .replace(/\{\{CALCULATOR_COUNT\}\}/g, calculatorCount)
      },
    },
    sitemapPlugin(),
  ],
})
