/**
 * sitemap.xml 自動生成スクリプト
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DOMAIN = 'https://nandemo-ranking.net'
const TODAY = new Date().toISOString().split('T')[0]

const GENRES = [
  'book','gadget','anime','cosme','gourmet','travel','movie','sports','music',
  'game','dog','cat','guinness','usedcar','interior','health','license','baby',
  'fashion','wine','coffee','plant','art','diy','fish','history','space',
  'recipe','programming','sns','world','youtube','keyword','ishi','shokugyo',
  'geino','seijika_jp','seijika_world'
]

function getSubDirs(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter(f =>
    fs.statSync(path.join(dir, f)).isDirectory()
  )
}

function url(loc, lastmod, priority, changefreq = 'weekly') {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
}

// トップページ
const urls = [
  url(`${DOMAIN}/`, TODAY, '1.0', 'daily'),
  url(`${DOMAIN}/blog/`, TODAY, '0.9', 'daily'),
  url(`${DOMAIN}/rankings/`, TODAY, '0.9', 'daily'),
]

// ジャンルページ
GENRES.forEach(g => {
  urls.push(url(`${DOMAIN}/genre_pages_v2/${g}/`, TODAY, '0.8', 'daily'))
})

// ブログ記事
const blogDir = path.join(ROOT, 'blog')
getSubDirs(blogDir).forEach(slug => {
  const stat = fs.statSync(path.join(blogDir, slug))
  const lastmod = stat.mtime.toISOString().split('T')[0]
  urls.push(url(`${DOMAIN}/blog/${slug}/`, lastmod, '0.7'))
})

// ランキングページ
const rankingsDir = path.join(ROOT, 'rankings')
getSubDirs(rankingsDir).forEach(slug => {
  const stat = fs.statSync(path.join(rankingsDir, slug))
  const lastmod = stat.mtime.toISOString().split('T')[0]
  urls.push(url(`${DOMAIN}/rankings/${slug}/`, lastmod, '0.7'))
})

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8')
console.log(`✅ sitemap.xml 更新完了（${urls.length}件）`)
