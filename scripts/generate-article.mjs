/**
 * 何でもランキング コラム自動生成スクリプト
 * 使い方: ANTHROPIC_API_KEY=xxx node scripts/generate-article.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, '../blog')
const INDEX_FILE = path.join(BLOG_DIR, 'index.html')

const TOPICS = [
  // 本・読書
  { title: '2024年おすすめビジネス書TOP10', slug: 'business-books', category: '本・読書', emoji: '📚' },
  { title: '読書習慣を身につける方法', slug: 'reading-habit', category: '本・読書', emoji: '📚' },
  { title: '年間100冊読む人の読書術', slug: 'speed-reading', category: '本・読書', emoji: '📚' },
  // ガジェット・テック
  { title: '2024年買ってよかったガジェットランキング', slug: 'gadgets-2024', category: 'ガジェット', emoji: '📱' },
  { title: 'スマートホームを安く始める方法', slug: 'smart-home', category: 'ガジェット', emoji: '📱' },
  { title: 'コスパ最強イヤホンランキング', slug: 'earphone-ranking', category: 'ガジェット', emoji: '📱' },
  // アニメ・漫画
  { title: '2024年秋アニメおすすめランキング', slug: 'anime-2024-fall', category: 'アニメ', emoji: '🎌' },
  { title: '泣けるアニメ映画TOP10', slug: 'cry-anime', category: 'アニメ', emoji: '🎌' },
  { title: '異世界転生アニメおすすめランキング', slug: 'isekai-anime', category: 'アニメ', emoji: '🎌' },
  // コスメ・美容
  { title: 'プチプラコスメおすすめランキング2024', slug: 'petit-cosme', category: 'コスメ', emoji: '💄' },
  { title: '韓国コスメ人気ランキング', slug: 'korea-cosme', category: 'コスメ', emoji: '💄' },
  { title: 'スキンケアの正しい順番と方法', slug: 'skincare-order', category: 'コスメ', emoji: '💄' },
  // グルメ・食べ物
  { title: '東京で行くべきラーメン店ランキング', slug: 'tokyo-ramen', category: 'グルメ', emoji: '🍜' },
  { title: 'コンビニスイーツ人気ランキング', slug: 'convenience-sweets', category: 'グルメ', emoji: '🍜' },
  { title: '自宅でできる簡単絶品レシピランキング', slug: 'home-recipe', category: 'グルメ', emoji: '🍜' },
  // 旅行
  { title: '国内旅行おすすめ人気スポットランキング', slug: 'domestic-travel', category: '旅行', emoji: '✈️' },
  { title: '一人旅におすすめの日本の場所TOP10', slug: 'solo-travel-japan', category: '旅行', emoji: '✈️' },
  { title: '格安で海外旅行を楽しむ方法', slug: 'budget-travel', category: '旅行', emoji: '✈️' },
  // 映画・動画
  { title: 'Netflixおすすめ映画ランキング2024', slug: 'netflix-movies', category: '映画', emoji: '🎬' },
  { title: '感動する邦画おすすめランキング', slug: 'japanese-movies', category: '映画', emoji: '🎬' },
  { title: 'アクション映画おすすめランキングTOP10', slug: 'action-movies', category: '映画', emoji: '🎬' },
  // スポーツ・健康
  { title: '自宅でできる筋トレメニューランキング', slug: 'home-workout', category: 'スポーツ', emoji: '⚽' },
  { title: 'ダイエットに効果的な運動ランキング', slug: 'diet-exercise', category: 'スポーツ', emoji: '⚽' },
  { title: 'スポーツジムの選び方と人気ランキング', slug: 'gym-ranking', category: 'スポーツ', emoji: '⚽' },
  // 音楽
  { title: '2024年上半期J-POP人気曲ランキング', slug: 'jpop-2024', category: '音楽', emoji: '🎵' },
  { title: 'カラオケで盛り上がる曲ランキング', slug: 'karaoke-songs', category: '音楽', emoji: '🎵' },
  { title: 'ドライブで聴きたい曲ランキング', slug: 'drive-music', category: '音楽', emoji: '🎵' },
  // ゲーム
  { title: 'Switch おすすめソフトランキング2024', slug: 'switch-games', category: 'ゲーム', emoji: '🎮' },
  { title: 'スマホゲームおすすめ人気ランキング', slug: 'smartphone-games', category: 'ゲーム', emoji: '🎮' },
  { title: 'RPGおすすめゲームランキングTOP10', slug: 'rpg-games', category: 'ゲーム', emoji: '🎮' },
  // ペット
  { title: '犬の人気犬種ランキングTOP10', slug: 'dog-breeds', category: 'ペット', emoji: '🐾' },
  { title: '猫の人気品種ランキングTOP10', slug: 'cat-breeds', category: 'ペット', emoji: '🐾' },
  { title: 'ペット用品おすすめランキング', slug: 'pet-goods', category: 'ペット', emoji: '🐾' },
  // ライフスタイル
  { title: '副業おすすめランキング2024', slug: 'side-job-2024', category: 'ライフスタイル', emoji: '💡' },
  { title: '節約術おすすめランキング', slug: 'saving-money', category: 'ライフスタイル', emoji: '💡' },
  { title: '趣味でお金を稼ぐ方法ランキング', slug: 'hobby-income', category: 'ライフスタイル', emoji: '💡' },
  // インテリア
  { title: 'おしゃれな部屋作りアイデアランキング', slug: 'interior-ideas', category: 'インテリア', emoji: '🏠' },
  { title: 'ニトリおすすめ商品ランキング', slug: 'nitori-ranking', category: 'インテリア', emoji: '🏠' },
  // 教育・学習
  { title: '大人が学ぶべき資格ランキング', slug: 'adult-certification', category: '教育', emoji: '📖' },
  { title: '英語学習アプリおすすめランキング', slug: 'english-app', category: '教育', emoji: '📖' },
  { title: 'オンライン学習サービスおすすめランキング', slug: 'online-learning', category: '教育', emoji: '📖' },
  // 車・乗り物
  { title: 'コスパ最強の軽自動車ランキング', slug: 'kei-car', category: '車・乗り物', emoji: '🚗' },
  { title: '電気自動車おすすめランキング2024', slug: 'ev-ranking', category: '車・乗り物', emoji: '🚗' },
]

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function generateArticleHtml(slug, title, category, emoji, date, content) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}｜何でもランキング</title>
<meta name="description" content="${title}をランキング形式で徹底解説。AIが厳選した最新情報をお届けします。">
<link rel="canonical" href="https://nandemo-ranking.net/blog/${slug}/">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6023646963661694" crossorigin="anonymous"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:-apple-system,BlinkMacSystemFont,'Hiragino Sans',sans-serif;background:#f5f5f5;color:#222;line-height:1.7;}
.header{background:linear-gradient(135deg,#c0392b 0%,#e74c3c 60%,#e67e22 100%);padding:16px 20px;}
.header a{color:white;text-decoration:none;font-size:13px;opacity:0.85;}
.header h1{color:white;font-size:20px;font-weight:900;margin-top:8px;line-height:1.4;}
.header .meta{color:rgba(255,255,255,0.8);font-size:12px;margin-top:6px;}
.container{max-width:800px;margin:0 auto;padding:20px 16px;}
.article-body{background:white;border-radius:12px;padding:24px;margin-bottom:20px;box-shadow:0 1px 4px rgba(0,0,0,0.08);}
.article-body h2{font-size:18px;font-weight:800;color:#c0392b;margin:24px 0 12px;padding-bottom:6px;border-bottom:2px solid #ffe0de;}
.article-body h3{font-size:15px;font-weight:700;color:#333;margin:18px 0 8px;}
.article-body p{margin-bottom:14px;font-size:14px;line-height:1.9;color:#444;}
.article-body ul,.article-body ol{padding-left:20px;margin-bottom:14px;}
.article-body li{margin-bottom:6px;font-size:14px;color:#444;}
.article-body table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px;}
.article-body th{background:#e74c3c;color:white;padding:8px 12px;text-align:left;}
.article-body td{padding:8px 12px;border-bottom:1px solid #eee;}
.article-body tr:nth-child(even) td{background:#fff5f5;}
.article-body strong{color:#c0392b;}
.cta{background:linear-gradient(135deg,#c0392b,#e67e22);border-radius:12px;padding:20px;text-align:center;color:white;margin-bottom:20px;}
.cta h2{font-size:17px;font-weight:800;margin-bottom:8px;}
.cta p{font-size:13px;opacity:0.9;margin-bottom:14px;}
.cta a{display:inline-block;background:white;color:#c0392b;font-weight:700;font-size:14px;padding:10px 28px;border-radius:24px;text-decoration:none;}
.back{font-size:13px;color:#e74c3c;text-decoration:none;font-weight:600;}
.category-badge{display:inline-block;background:#fff0ee;color:#c0392b;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;margin-bottom:10px;border:1px solid #ffcccc;}
footer{background:#222;color:#999;text-align:center;padding:20px;font-size:12px;margin-top:20px;}
footer a{color:#ccc;text-decoration:none;}
</style>
</head>
<body>
<div class="header">
  <a href="https://nandemo-ranking.net/">← 何でもランキングトップ</a>
  <h1>${emoji} ${title}</h1>
  <div class="meta">${category} · ${date}</div>
</div>
<div class="container">
  <div class="article-body">
    <span class="category-badge">${category}</span>
    ${content}
  </div>
  <div class="cta">
    <h2>🏆 ランキングをもっと見る</h2>
    <p>38ジャンル・毎日更新のランキングサイト</p>
    <a href="https://nandemo-ranking.net/">ランキングを見る →</a>
  </div>
  <a href="/blog/" class="back">← コラム一覧に戻る</a>
</div>
<footer>
  <p>© 2024 何でもランキング | <a href="https://nandemo-ranking.net/">トップページ</a></p>
</footer>
</body>
</html>`
}

async function generateArticle(topic) {
  const today = formatDate(new Date())
  const articleDir = path.join(BLOG_DIR, topic.slug)

  if (fs.existsSync(articleDir)) {
    console.log(`スキップ: ${topic.slug}（既存）`)
    return false
  }

  console.log(`生成中: ${topic.title}`)

  const prompt = `「${topic.title}」について、日本語のランキング記事を書いてください。

以下の構成でHTML本文（bodyタグ内のコンテンツのみ）を出力してください：
- 読者：${topic.category}に興味がある日本人
- 文字数：800〜1200文字
- h2見出しを3〜4個使う
- 具体的なランキングや数字を含める
- 最後に「何でもランキングでさらに詳しくチェック」という誘導文で締める
- <h2>, <h3>, <p>, <ul>, <li>, <strong> タグのみ使用
- HTMLのみ出力（説明文不要）`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(`API Error: ${JSON.stringify(err)}`)
  }

  const data = await res.json()
  const content = data.content[0].text

  fs.mkdirSync(articleDir, { recursive: true })
  const html = generateArticleHtml(topic.slug, topic.title, topic.category, topic.emoji, today, content)
  fs.writeFileSync(path.join(articleDir, 'index.html'), html, 'utf8')
  console.log(`✅ 生成完了: blog/${topic.slug}/`)
  return { ...topic, date: today }
}

function buildIndex(articles) {
  const sorted = articles.sort((a, b) => b.date.localeCompare(a.date))

  const cards = sorted.map(a => `
    <a href="/blog/${a.slug}/" class="card">
      <span class="emoji">${a.emoji}</span>
      <div class="card-body">
        <span class="badge">${a.category}</span>
        <h2>${a.title}</h2>
        <p class="date">${a.date}</p>
      </div>
    </a>`).join('')

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>コラム・記事一覧｜何でもランキング</title>
<meta name="description" content="本・ガジェット・アニメ・グルメ・旅行など38ジャンルのランキングコラムを毎日更新。">
<link rel="canonical" href="https://nandemo-ranking.net/blog/">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6023646963661694" crossorigin="anonymous"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:-apple-system,BlinkMacSystemFont,'Hiragino Sans',sans-serif;background:#f5f5f5;color:#222;}
.header{background:linear-gradient(135deg,#c0392b 0%,#e74c3c 60%,#e67e22 100%);padding:20px;}
.header a{color:white;text-decoration:none;font-size:13px;opacity:0.85;}
.header h1{color:white;font-size:22px;font-weight:900;margin-top:8px;}
.header p{color:rgba(255,255,255,0.85);font-size:13px;margin-top:4px;}
.container{max-width:800px;margin:0 auto;padding:20px 16px;}
.card{display:flex;align-items:center;gap:14px;background:white;border-radius:12px;padding:16px;margin-bottom:12px;text-decoration:none;color:#222;box-shadow:0 1px 4px rgba(0,0,0,0.08);}
.card:hover{box-shadow:0 4px 12px rgba(231,76,60,0.15);}
.emoji{font-size:32px;flex-shrink:0;}
.card-body{flex:1;}
.badge{display:inline-block;background:#fff0ee;color:#c0392b;font-size:11px;font-weight:700;padding:2px 8px;border-radius:20px;border:1px solid #ffcccc;margin-bottom:4px;}
.card h2{font-size:14px;font-weight:700;line-height:1.4;margin-bottom:4px;}
.date{font-size:11px;color:#999;}
.back{display:block;text-align:center;margin-top:20px;color:#e74c3c;font-weight:700;font-size:14px;text-decoration:none;}
footer{background:#222;color:#999;text-align:center;padding:20px;font-size:12px;margin-top:20px;}
footer a{color:#ccc;text-decoration:none;}
</style>
</head>
<body>
<div class="header">
  <a href="https://nandemo-ranking.net/">← トップページ</a>
  <h1>📝 ランキングコラム</h1>
  <p>全${sorted.length}記事 · 毎日更新</p>
</div>
<div class="container">
  ${cards}
  <a href="https://nandemo-ranking.net/" class="back">🏆 ランキングを見る →</a>
</div>
<footer>
  <p>© 2024 何でもランキング | <a href="https://nandemo-ranking.net/">トップページ</a></p>
</footer>
</body>
</html>`
}

async function main() {
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true })

  // 既存記事一覧を読み込む
  const existingSlugs = fs.readdirSync(BLOG_DIR)
    .filter(f => fs.statSync(path.join(BLOG_DIR, f)).isDirectory())

  // 未生成トピックを選ぶ
  const remaining = TOPICS.filter(t => !existingSlugs.includes(t.slug))

  let newArticle = null
  if (remaining.length === 0) {
    console.log('全トピック生成済み')
    return
  }

  const topic = remaining[Math.floor(Math.random() * remaining.length)]
  newArticle = await generateArticle(topic)

  // 全記事メタデータを収集してインデックス再生成
  const allArticles = TOPICS
    .filter(t => fs.existsSync(path.join(BLOG_DIR, t.slug)))
    .map(t => {
      // 日付をHTMLから取得（簡易的にディレクトリの更新日時で代替）
      const stat = fs.statSync(path.join(BLOG_DIR, t.slug))
      const date = newArticle?.slug === t.slug
        ? newArticle.date
        : formatDate(stat.mtime)
      return { ...t, date }
    })

  fs.writeFileSync(INDEX_FILE, buildIndex(allArticles), 'utf8')
  console.log(`✅ インデックス更新: blog/index.html (${allArticles.length}記事)`)
}

main().catch(console.error)
