import { useCallback, useState, type JSX } from 'react'
import type { DailyFortune } from '../lib/saju'
import { trackEvent } from '../lib/analytics'

// ── 캔버스 상수 ──────────────────────────────────────────
const W = 1200
const H = 630
const PAD = 64

function scoreColor(score: number): string {
  if (score >= 80) return '#34d399'
  if (score >= 65) return '#fbbf24'
  return '#f87171'
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

function buildCanvas(fortune: DailyFortune): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // ── 배경 그라디언트 ──────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#1e1b4b')
  bg.addColorStop(0.6, '#312e81')
  bg.addColorStop(1, '#0f172a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // 미세 그리드 패턴
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'
  ctx.lineWidth = 1
  for (let x = 0; x < W; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y < H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  // ── 브랜드 (좌상단) ────────────────────────────────────
  ctx.font = `bold 30px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('Fove', PAD, PAD)

  // ── 날짜 (우상단) ─────────────────────────────────────
  ctx.font = `22px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.4)'
  ctx.textAlign = 'right'
  ctx.fillText(fortune.dateLabel, W - PAD, PAD + 4)
  ctx.textAlign = 'left'

  // ── 일진 + 오행 ──────────────────────────────────────
  ctx.font = `bold 64px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = '#ffffff'
  ctx.fillText(fortune.pillarName, PAD, PAD + 70)

  ctx.font = `26px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillText(`${fortune.elementLabel} · ${fortune.yinYang}`, PAD, PAD + 150)

  // ── 점수 원 (우측) ────────────────────────────────────
  const cx = W - PAD - 110
  const cy = PAD + 110
  const radius = 90

  // 배경 원
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 12
  ctx.stroke()

  // 점수 호
  if (fortune.score > 0) {
    ctx.beginPath()
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (fortune.score / 100))
    ctx.strokeStyle = scoreColor(fortune.score)
    ctx.lineWidth = 12
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  // 점수 숫자
  ctx.font = `bold 58px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${fortune.score}`, cx, cy - 8)

  ctx.font = `20px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.fillText('총운 점수', cx, cy + 36)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  // ── 구분선 ────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, PAD + 210)
  ctx.lineTo(W - PAD, PAD + 210)
  ctx.stroke()

  // ── 에너지 텍스트 ─────────────────────────────────────
  ctx.font = `26px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  const textMaxW = W - PAD * 2 - 180
  const energyLines = wrapText(ctx, fortune.energyText, textMaxW)
  energyLines.slice(0, 3).forEach((line, i) => {
    ctx.fillText(line, PAD, PAD + 235 + i * 42)
  })

  // ── 분야별 점수 바 ────────────────────────────────────
  const barItems = [
    { label: '일', score: fortune.categoryScores.work, color: '#38bdf8' },
    { label: '관계', score: fortune.categoryScores.love, color: '#f472b6' },
    { label: '재물', score: fortune.categoryScores.money, color: '#fbbf24' },
    { label: '건강', score: fortune.categoryScores.health, color: '#34d399' },
  ]
  const barY = PAD + 400
  const barW = (W - PAD * 2 - 60) / 4
  barItems.forEach(({ label, score, color }, i) => {
    const bx = PAD + i * (barW + 20)
    // 배경 박스
    drawRoundRect(ctx, bx, barY, barW, 60, 12)
    ctx.fillStyle = 'rgba(255,255,255,0.06)'
    ctx.fill()
    // 채움 바
    const fillW = Math.max(24, (barW - 24) * (score / 100))
    drawRoundRect(ctx, bx + 12, barY + 36, fillW, 10, 5)
    ctx.fillStyle = color
    ctx.fill()
    // 라벨
    ctx.font = `bold 20px system-ui, -apple-system, sans-serif`
    ctx.fillStyle = color
    ctx.textBaseline = 'top'
    ctx.fillText(label, bx + 12, barY + 10)
    // 점수
    ctx.font = `bold 24px system-ui, -apple-system, sans-serif`
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'right'
    ctx.fillText(`${score}`, bx + barW - 12, barY + 8)
    ctx.textAlign = 'left'
  })

  // ── 행운 요소 ─────────────────────────────────────────
  const luckyY = H - PAD - 48
  const luckyItems = [
    { label: '행운색', value: fortune.lucky.color },
    { label: '행운 숫자', value: String(fortune.lucky.number) },
    { label: '행운 방위', value: fortune.lucky.direction },
  ]
  luckyItems.forEach(({ label, value }, i) => {
    const lx = PAD + i * 230
    ctx.font = `18px system-ui, -apple-system, sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.textBaseline = 'top'
    ctx.fillText(label, lx, luckyY)
    ctx.font = `bold 24px system-ui, -apple-system, sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fillText(value, lx, luckyY + 22)
  })

  // ── 하단 브랜드 ────────────────────────────────────────
  ctx.font = `18px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  ctx.fillText('fove · 사주·MBTI·운세 인사이트', W - PAD, H - PAD + 12)

  return canvas
}

// ── 훅 ──────────────────────────────────────────────────
export function useShareCard(fortune: DailyFortune) {
  const downloadImage = useCallback(() => {
    const canvas = buildCanvas(fortune)
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fove-운세-${fortune.dateLabel.replace(/\./g, '')}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 'image/png')
    trackEvent('shared', { pillar: fortune.pillarName, score: fortune.score })
  }, [fortune])

  return { downloadImage }
}

// ── 버튼 컴포넌트 ─────────────────────────────────────────
export function ShareCardButton({ fortune }: { fortune: DailyFortune }): JSX.Element {
  const { downloadImage } = useShareCard(fortune)
  const [saving, setSaving] = useState(false)

  const handleClick = () => {
    setSaving(true)
    setTimeout(() => {
      downloadImage()
      setSaving(false)
    }, 50)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/60 px-5 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:opacity-50"
    >
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {saving ? '생성 중…' : '이미지 저장'}
    </button>
  )
}
