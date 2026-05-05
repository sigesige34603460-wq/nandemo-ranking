/**
 * 何でもランキング ランキングページ自動生成スクリプト
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const RANKINGS_DIR = path.join(__dirname, '../rankings')

const TOPICS = [
  // 映画・動画
  { title: '2024年おすすめ映画TOP10', slug: 'movies-2024', category: '映画', emoji: '🎬', color: '#9b59b6' },
  { title: '泣ける映画ランキングTOP10', slug: 'cry-movies', category: '映画', emoji: '🎬', color: '#9b59b6' },
  { title: 'Netflixおすすめ作品TOP10', slug: 'netflix-top10', category: '映画', emoji: '🎬', color: '#9b59b6' },
  { title: 'アクション映画人気ランキングTOP10', slug: 'action-movies', category: '映画', emoji: '🎬', color: '#9b59b6' },
  // アニメ
  { title: '歴代アニメ人気ランキングTOP10', slug: 'anime-all-time', category: 'アニメ', emoji: '🎌', color: '#e74c3c' },
  { title: '2024年秋アニメおすすめTOP10', slug: 'anime-2024-fall', category: 'アニメ', emoji: '🎌', color: '#e74c3c' },
  { title: '異世界アニメおすすめランキングTOP10', slug: 'isekai-anime-top10', category: 'アニメ', emoji: '🎌', color: '#e74c3c' },
  { title: '泣けるアニメ映画TOP10', slug: 'cry-anime-movies', category: 'アニメ', emoji: '🎌', color: '#e74c3c' },
  // ゲーム
  { title: 'Switchおすすめソフトランキングをランキング', slug: 'switch-games-top10', category: 'ゲーム', emoji: '🎮', color: '#2980b9' },
  { title: 'スマホゲーム人気ランキングTOP10', slug: 'mobile-games-top10', category: 'ゲーム', emoji: '🎮', color: '#2980b9' },
  { title: 'RPGゲームおすすめランキングTOP10', slug: 'rpg-top10', category: 'ゲーム', emoji: '🎮', color: '#2980b9' },
  // 音楽
  { title: '2024年J-POP人気曲ランキングTOP10', slug: 'jpop-2024-top10', category: '音楽', emoji: '🎵', color: '#f39c12' },
  { title: 'カラオケ人気曲ランキングTOP10', slug: 'karaoke-top10', category: '音楽', emoji: '🎵', color: '#f39c12' },
  { title: '洋楽おすすめランキングTOP10', slug: 'western-music-top10', category: '音楽', emoji: '🎵', color: '#f39c12' },
  // 本・読書
  { title: '人生を変えたビジネス書ランキングTOP10', slug: 'life-changing-books', category: '本', emoji: '📚', color: '#c9a84c' },
  { title: '自己啓発本おすすめランキングTOP10', slug: 'self-help-books', category: '本', emoji: '📚', color: '#c9a84c' },
  { title: '小説おすすめランキングTOP10', slug: 'novel-top10', category: '本', emoji: '📚', color: '#c9a84c' },
  // ガジェット
  { title: '2024年買ってよかったガジェットTOP10', slug: 'gadgets-best-2024', category: 'ガジェット', emoji: '📱', color: '#3498db' },
  { title: 'ワイヤレスイヤホン人気ランキングTOP10', slug: 'wireless-earphones', category: 'ガジェット', emoji: '📱', color: '#3498db' },
  { title: 'スマートウォッチおすすめランキングTOP10', slug: 'smartwatch-top10', category: 'ガジェット', emoji: '📱', color: '#3498db' },
  // グルメ
  { title: '東京おすすめラーメン店ランキングTOP10', slug: 'tokyo-ramen-top10', category: 'グルメ', emoji: '🍜', color: '#e67e22' },
  { title: 'コンビニ人気スイーツランキングTOP10', slug: 'convenience-sweets-top10', category: 'グルメ', emoji: '🍜', color: '#e67e22' },
  { title: '日本全国ご当地グルメランキングTOP10', slug: 'local-food-top10', category: 'グルメ', emoji: '🍜', color: '#e67e22' },
  // スポーツ
  { title: '自宅筋トレメニューランキングTOP10', slug: 'home-workout-top10', category: 'スポーツ', emoji: '⚽', color: '#27ae60' },
  { title: 'ダイエット効果的な運動ランキングTOP10', slug: 'diet-sports-top10', category: 'スポーツ', emoji: '⚽', color: '#27ae60' },
  // 旅行
  { title: '国内旅行人気スポットランキングTOP10', slug: 'japan-travel-top10', category: '旅行', emoji: '✈️', color: '#1abc9c' },
  { title: '一人旅おすすめ場所ランキングTOP10', slug: 'solo-travel-top10', category: '旅行', emoji: '✈️', color: '#1abc9c' },
  { title: '海外旅行人気国ランキングTOP10', slug: 'overseas-travel-top10', category: '旅行', emoji: '✈️', color: '#1abc9c' },
  // コスメ
  { title: 'プチプラコスメ人気ランキングTOP10', slug: 'petit-cosme-top10', category: 'コスメ', emoji: '💄', color: '#e91e8c' },
  { title: '韓国コスメおすすめランキングTOP10', slug: 'korea-cosme-top10', category: 'コスメ', emoji: '💄', color: '#e91e8c' },
  // 健康
  { title: 'サプリメント人気ランキングTOP10', slug: 'supplement-top10', category: '健康', emoji: '💊', color: '#00897b' },
  { title: 'ダイエット食品おすすめランキングTOP10', slug: 'diet-food-top10', category: '健康', emoji: '💊', color: '#00897b' },
  // ペット
  { title: '人気犬種ランキングTOP10', slug: 'dog-breeds-top10', category: 'ペット', emoji: '🐾', color: '#8B6914' },
  { title: '人気猫種ランキングTOP10', slug: 'cat-breeds-top10', category: 'ペット', emoji: '🐾', color: '#8B6914' },
  // インテリア
  { title: 'ニトリ人気商品ランキングTOP10', slug: 'nitori-top10', category: 'インテリア', emoji: '🏠', color: '#795548' },
  { title: '一人暮らし必需品ランキングTOP10', slug: 'solo-living-top10', category: 'インテリア', emoji: '🏠', color: '#795548' },
  // ライフスタイル
  { title: '副業おすすめランキングTOP10', slug: 'side-job-top10', category: 'ライフスタイル', emoji: '💡', color: '#c0392b' },
  { title: '節約術おすすめランキングTOP10', slug: 'saving-top10', category: 'ライフスタイル', emoji: '💡', color: '#c0392b' },
  { title: '資格おすすめランキングTOP10', slug: 'certification-top10', category: 'ライフスタイル', emoji: '💡', color: '#c0392b' },
  // YouTube
  { title: 'YouTube人気チャンネルランキングTOP10', slug: 'youtube-channels-top10', category: 'YouTube', emoji: '▶️', color: '#FF0000' },
  { title: 'YouTuber人気ランキングTOP10', slug: 'youtubers-top10', category: 'YouTube', emoji: '▶️', color: '#FF0000' },
  // SNS
  { title: 'SNSアプリ人気ランキングTOP10', slug: 'sns-apps-top10', category: 'SNS', emoji: '📲', color: '#1565c0' },
  // 車
  { title: '軽自動車人気ランキングTOP10', slug: 'kei-car-top10', category: '車', emoji: '🚗', color: '#2c3e50' },
  { title: '電気自動車おすすめランキングTOP10', slug: 'ev-top10', category: '車', emoji: '🚗', color: '#2c3e50' },
]

function formatDate(date) {
  return date.toISOString().split('T')[0]
}

function generateRankingHtml(topic, date, items) {
  const itemsHtml = items.map((item, i) => {
    const rank = i + 1
    const crown = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}位`
    return `
    <div class="item">
      <div class="rank" style="background:${rank <= 3 ? topic.color : '#999'}">${crown}</div>
      <div class="item-body">
        <div class="item-title">${item.title}</div>
        <div class="item-reason">${item.reason}</div>
        ${item.tags ? `<div class="tags">${item.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` : ''}
      </div>
    </div>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${topic.title}｜何でもランキング</title>
<meta name="description" content="${topic.title}をAIが厳選してランキング形式でご紹介。最新の人気・おすすめ情報をお届けします。">
<link rel="canonical" href="https://nandemo-ranking.net/rankings/${topic.slug}/">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6023646963661694" crossorigin="anonymous"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:-apple-system,BlinkMacSystemFont,'Hiragino Sans',sans-serif;background:#f5f5f5;color:#222;}
.header{background:linear-gradient(135deg,#c0392b 0%,#e74c3c 60%,#e67e22 100%);padding:16px 20px;}
.header a{color:white;text-decoration:none;font-size:13px;opacity:0.85;}
.header h1{color:white;font-size:20px;font-weight:900;margin-top:8px;line-height:1.4;}
.header .meta{color:rgba(255,255,255,0.8);font-size:12px;margin-top:6px;}
.container{max-width:800px;margin:0 auto;padding:20px 16px;}
.intro{background:white;border-radius:12px;padding:16px 20px;margin-bottom:16px;font-size:14px;color:#555;line-height:1.7;box-shadow:0 1px 4px rgba(0,0,0,0.08);}
.item{display:flex;gap:12px;background:white;border-radius:12px;padding:16px;margin-bottom:10px;box-shadow:0 1px 4px rgba(0,0,0,0.08);}
.rank{width:44px;height:44px;border-radius:10px;color:white;font-size:13px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.item-body{flex:1;}
.item-title{font-size:15px;font-weight:800;color:#222;margin-bottom:4px;}
.item-reason{font-size:13px;color:#555;line-height:1.6;}
.tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;}
.tag{font-size:11px;background:#f0f0f0;color:#666;padding:2px 8px;border-radius:10px;}
.cta{background:linear-gradient(135deg,#c0392b,#e67e22);border-radius:12px;padding:20px;text-align:center;color:white;margin:20px 0;}
.cta h2{font-size:17px;font-weight:800;margin-bottom:8px;}
.cta a{display:inline-block;background:white;color:#c0392b;font-weight:700;font-size:14px;padding:10px 28px;border-radius:24px;text-decoration:none;margin-top:10px;}
.back{font-size:13px;color:#e74c3c;text-decoration:none;font-weight:600;display:block;margin-top:8px;}
footer{background:#222;color:#999;text-align:center;padding:20px;font-size:12px;margin-top:20px;}
footer a{color:#ccc;text-decoration:none;}
</style>
</head>
<body>
<div class="header">
  <a href="https://nandemo-ranking.net/">← 何でもランキングトップ</a>
  <h1>${topic.emoji} ${topic.title}</h1>
  <div class="meta">${topic.category} · AIが厳選 · ${date}更新</div>
</div>
<div class="container">
  <div class="intro">AIが最新情報をもとに厳選した<strong>${topic.title}</strong>をご紹介します。毎日更新中！</div>
  ${itemsHtml}
  <div class="cta">
    <h2>🏆 他のランキングも見る</h2>
    <p>38ジャンル以上のランキングを毎日更新中</p>
    <a href="https://nandemo-ranking.net/">ランキングを見る →</a>
  </div>
  <a href="/rankings/" class="back">← ランキング一覧に戻る</a>
</div>
<footer>
  <p>© 2024 何でもランキング | <a href="https://nandemo-ranking.net/">トップページ</a></p>
</footer>
</body>
</html>`
}

function buildIndex(rankings) {
  const sorted = rankings.sort((a, b) => b.date.localeCompare(a.date))
  const cards = sorted.map(r => `
    <a href="/rankings/${r.slug}/" class="card">
      <span class="emoji">${r.emoji}</span>
      <div>
        <span class="badge" style="background:${r.color}">${r.category}</span>
        <h2>${r.title}</h2>
        <p class="date">${r.date}</p>
      </div>
    </a>`).join('')

  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ランキング一覧｜何でもランキング</title>
<meta name="description" content="AIが厳選する各ジャンルのTOP10ランキング一覧。映画・アニメ・ゲーム・グルメ・旅行など毎日更新。">
<link rel="canonical" href="https://nandemo-ranking.net/rankings/">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6023646963661694" crossorigin="anonymous"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:-apple-system,BlinkMacSystemFont,'Hiragino Sans',sans-serif;background:#f5f5f5;color:#222;}
.header{background:linear-gradient(135deg,#c0392b 0%,#e74c3c 60%,#e67e22 100%);padding:20px;}
.header a{color:white;text-decoration:none;font-size:13px;opacity:0.85;}
.header h1{color:white;font-size:22px;font-weight:900;margin-top:8px;}
.header p{color:rgba(255,255,255,0.85);font-size:13px;margin-top:4px;}
.container{max-width:800px;margin:0 auto;padding:20px 16px;}
.card{display:flex;align-items:center;gap:14px;background:white;border-radius:12px;padding:14px 16px;margin-bottom:10px;text-decoration:none;color:#222;box-shadow:0 1px 4px rgba(0,0,0,0.08);}
.card:hover{box-shadow:0 4px 12px rgba(231,76,60,0.15);}
.emoji{font-size:30px;flex-shrink:0;}
.badge{display:inline-block;color:white;font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px;margin-bottom:4px;}
.card h2{font-size:14px;font-weight:700;line-height:1.4;margin-bottom:2px;}
.date{font-size:11px;color:#999;}
.back{display:block;text-align:center;margin-top:20px;color:#e74c3c;font-weight:700;font-size:14px;text-decoration:none;}
footer{background:#222;color:#999;text-align:center;padding:20px;font-size:12px;margin-top:20px;}
footer a{color:#ccc;text-decoration:none;}
</style>
</head>
<body>
<div class="header">
  <a href="https://nandemo-ranking.net/">← トップページ</a>
  <h1>🏆 ランキング一覧</h1>
  <p>全${sorted.length}件 · AIが厳選 · 毎日更新</p>
</div>
<div class="container">
  ${cards}
  <a href="https://nandemo-ranking.net/" class="back">トップページに戻る →</a>
</div>
<footer>
  <p>© 2024 何でもランキング | <a href="https://nandemo-ranking.net/">トップページ</a></p>
</footer>
</body>
</html>`
}

async function generateRanking(topic) {
  const rankingDir = path.join(RANKINGS_DIR, topic.slug)
  if (fs.existsSync(rankingDir)) {
    console.log(`スキップ: ${topic.slug}（既存）`)
    return false
  }

  console.log(`生成中: ${topic.title}`)

  const prompt = `「${topic.title}」のTOP10ランキングをJSON形式で出力してください。

以下のJSON配列のみ出力してください（説明文不要）：
[
  {"title":"アイテム名","reason":"選んだ理由（30文字以内）","tags":["タグ1","タグ2"]},
  ...10件
]

条件：
- 具体的な名称・タイトル・商品名を使う
- reasonは簡潔に
- tagsは2〜3個
- 日本語で出力`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) throw new Error(`API Error: ${await res.text()}`)

  const data = await res.json()
  const text = data.content[0].text

  // JSON抽出
  const match = text.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('JSON not found in response')
  const items = JSON.parse(match[0])

  const today = formatDate(new Date())
  fs.mkdirSync(rankingDir, { recursive: true })
  const html = generateRankingHtml(topic, today, items)
  fs.writeFileSync(path.join(rankingDir, 'index.html'), html, 'utf8')
  console.log(`✅ 生成完了: rankings/${topic.slug}/`)
  return { ...topic, date: today }
}

async function main() {
  if (!fs.existsSync(RANKINGS_DIR)) fs.mkdirSync(RANKINGS_DIR, { recursive: true })

  const existingSlugs = fs.readdirSync(RANKINGS_DIR)
    .filter(f => fs.statSync(path.join(RANKINGS_DIR, f)).isDirectory())

  const remaining = TOPICS.filter(t => !existingSlugs.includes(t.slug))

  if (remaining.length === 0) {
    console.log('全ランキング生成済み')
    return
  }

  const topic = remaining[Math.floor(Math.random() * remaining.length)]
  const newRanking = await generateRanking(topic)

  // インデックス再生成
  const allRankings = TOPICS
    .filter(t => fs.existsSync(path.join(RANKINGS_DIR, t.slug)))
    .map(t => {
      const stat = fs.statSync(path.join(RANKINGS_DIR, t.slug))
      return { ...t, date: newRanking?.slug === t.slug ? newRanking.date : formatDate(stat.mtime) }
    })

  fs.writeFileSync(path.join(RANKINGS_DIR, 'index.html'), buildIndex(allRankings), 'utf8')
  console.log(`✅ インデックス更新: rankings/index.html (${allRankings.length}件)`)
}

main().catch(console.error)
