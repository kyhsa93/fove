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

// ════════════════════════════════════════════════════════
// 세로형 스토리 카드 (1080×1920, 9:16)
// ════════════════════════════════════════════════════════

function buildPortraitCanvas(fortune: DailyFortune): HTMLCanvasElement {
  const PW = 1080
  const PH = 1920
  const PP = 80
  const canvas = document.createElement('canvas')
  canvas.width = PW
  canvas.height = PH
  const ctx = canvas.getContext('2d')!

  // 배경
  const bg = ctx.createLinearGradient(0, 0, PW, PH)
  bg.addColorStop(0, '#1e1b4b')
  bg.addColorStop(0.5, '#312e81')
  bg.addColorStop(1, '#0f172a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, PW, PH)

  // 미세 격자
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'
  ctx.lineWidth = 1
  for (let x = 0; x < PW; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, PH); ctx.stroke() }
  for (let y = 0; y < PH; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(PW, y); ctx.stroke() }

  // ── 브랜드 (좌상단) ──
  ctx.font = `bold 40px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.5)'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('Fove', PP, PP)

  ctx.font = `30px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.textAlign = 'right'
  ctx.fillText(fortune.dateLabel, PW - PP, PP + 6)
  ctx.textAlign = 'left'

  // ── 일진 + 오행 ──
  ctx.font = `bold 120px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(fortune.pillarName, PW / 2, PP + 120)

  ctx.font = `38px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillText(`${fortune.elementLabel} · ${fortune.yinYang}`, PW / 2, PP + 265)

  // ── 점수 원 (가운데) ──
  const cx = PW / 2
  const cy = PP + 490
  const radius = 160

  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 22
  ctx.stroke()

  if (fortune.score > 0) {
    ctx.beginPath()
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (fortune.score / 100))
    ctx.strokeStyle = scoreColor(fortune.score)
    ctx.lineWidth = 22
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  ctx.font = `bold 100px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${fortune.score}`, cx, cy - 14)

  ctx.font = `30px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.fillText('총운 점수', cx, cy + 60)

  // ── 구분선 ──
  ctx.strokeStyle = 'rgba(255,255,255,0.12)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PP, cy + radius + 40)
  ctx.lineTo(PW - PP, cy + radius + 40)
  ctx.stroke()

  // ── 에너지 텍스트 ──
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.font = `36px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  const energyY = cy + radius + 70
  const energyLines = wrapText(ctx, fortune.energyText, PW - PP * 2)
  energyLines.slice(0, 4).forEach((line, i) => ctx.fillText(line, PW / 2, energyY + i * 56))

  // ── 분야별 점수 바 (4개 가로) ──
  const barTop = energyY + Math.min(energyLines.length, 4) * 56 + 60
  const barItems = [
    { label: '일·업무', score: fortune.categoryScores.work, color: '#38bdf8' },
    { label: '사랑·관계', score: fortune.categoryScores.love, color: '#f472b6' },
    { label: '재물', score: fortune.categoryScores.money, color: '#fbbf24' },
    { label: '건강', score: fortune.categoryScores.health, color: '#34d399' },
  ]
  const barW = (PW - PP * 2 - 60) / 4
  barItems.forEach(({ label, score, color }, i) => {
    const bx = PP + i * (barW + 20)
    drawRoundRect(ctx, bx, barTop, barW, 90, 16)
    ctx.fillStyle = 'rgba(255,255,255,0.06)'
    ctx.fill()
    const fillW = Math.max(28, (barW - 28) * (score / 100))
    drawRoundRect(ctx, bx + 14, barTop + 54, fillW, 14, 7)
    ctx.fillStyle = color
    ctx.fill()
    ctx.font = `bold 26px system-ui, -apple-system, sans-serif`
    ctx.fillStyle = color
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(label, bx + 14, barTop + 12)
    ctx.font = `bold 32px system-ui, -apple-system, sans-serif`
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'right'
    ctx.fillText(`${score}`, bx + barW - 14, barTop + 10)
  })

  // ── 행운 요소 ──
  const luckyTop = barTop + 130
  const luckyItems = [
    { label: '🎨 행운색', value: fortune.lucky.color },
    { label: '🔢 행운 숫자', value: String(fortune.lucky.number) },
    { label: '🧭 행운 방위', value: fortune.lucky.direction },
  ]
  ctx.textAlign = 'center'
  luckyItems.forEach(({ label, value }, i) => {
    const lx = PP + (i * (PW - PP * 2)) / 3 + (PW - PP * 2) / 6
    ctx.font = `28px system-ui, -apple-system, sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.35)'
    ctx.textBaseline = 'top'
    ctx.fillText(label, lx, luckyTop)
    ctx.font = `bold 36px system-ui, -apple-system, sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fillText(value, lx, luckyTop + 36)
  })

  // ── 하단 CTA ──
  const ctaY = PH - PP - 80
  ctx.font = `bold 36px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('나의 오늘 운세 확인하기', PW / 2, ctaY)
  ctx.font = `28px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  ctx.fillText(typeof window !== 'undefined' ? window.location.host : '', PW / 2, ctaY + 46)

  return canvas
}

// ════════════════════════════════════════════════════════
// 궁합 공유 카드
// ════════════════════════════════════════════════════════

export interface CompatShareData {
  kind: 'saju' | 'mbti' | 'combined'
  typeLabel: string
  labelA: string
  labelB: string
  totalScore: number
  summary?: string
  dimensions?: Array<{ label: string; score: number; color: string }>
  ratingLabel?: string
}

const COMPAT_BG_START: Record<CompatShareData['kind'], string> = {
  saju: '#1a0533',
  mbti: '#0c1a3d',
  combined: '#0f1f3d',
}
const COMPAT_BG_END: Record<CompatShareData['kind'], string> = {
  saju: '#2e1065',
  mbti: '#1e3a8a',
  combined: '#172554',
}
const COMPAT_ACCENT: Record<CompatShareData['kind'], string> = {
  saju: '#a78bfa',
  mbti: '#60a5fa',
  combined: '#818cf8',
}

function buildCompatCanvas(data: CompatShareData): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // ── 배경 ────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, COMPAT_BG_START[data.kind])
  bg.addColorStop(1, COMPAT_BG_END[data.kind])
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  // 그리드 패턴
  ctx.strokeStyle = 'rgba(255,255,255,0.04)'
  ctx.lineWidth = 1
  for (let x = 0; x < W; x += 60) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
  }
  for (let y = 0; y < H; y += 60) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  }

  const accent = COMPAT_ACCENT[data.kind]

  // ── 브랜드 ──────────────────────────────────────────
  ctx.font = `bold 28px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText('Fove', PAD, PAD)

  // ── 종류 라벨 (우상단) ─────────────────────────────
  ctx.font = `22px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = accent
  ctx.textAlign = 'right'
  ctx.fillText(data.typeLabel, W - PAD, PAD + 4)
  ctx.textAlign = 'left'

  // ── 두 사람 이름 ────────────────────────────────────
  const nameY = PAD + 70
  const midX = W / 2

  ctx.font = `bold 56px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'right'
  ctx.fillText(data.labelA, midX - 50, nameY)

  ctx.font = `bold 40px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = accent
  ctx.textAlign = 'center'
  ctx.fillText('×', midX, nameY + 8)

  ctx.font = `bold 56px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'left'
  ctx.fillText(data.labelB, midX + 50, nameY)
  ctx.textAlign = 'left'

  // ── 점수 원 (우측) ───────────────────────────────────
  const cx = W - PAD - 110
  const cy = PAD + 130
  const radius = 95

  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 14
  ctx.stroke()

  if (data.totalScore > 0) {
    ctx.beginPath()
    ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (data.totalScore / 100))
    ctx.strokeStyle = scoreColor(data.totalScore)
    ctx.lineWidth = 14
    ctx.lineCap = 'round'
    ctx.stroke()
  }

  ctx.font = `bold 60px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(`${data.totalScore}`, cx, cy - 10)

  ctx.font = `20px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.45)'
  ctx.fillText('궁합 점수', cx, cy + 38)

  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'

  // ── 구분선 ──────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.1)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(PAD, PAD + 195)
  ctx.lineTo(W - PAD, PAD + 195)
  ctx.stroke()

  // ── 요약 텍스트 ──────────────────────────────────────
  if (data.summary) {
    ctx.font = `24px system-ui, -apple-system, sans-serif`
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    const maxW = W - PAD * 2 - 200
    const lines = wrapText(ctx, data.summary, maxW)
    lines.slice(0, 3).forEach((line, i) => {
      ctx.fillText(line, PAD, PAD + 220 + i * 40)
    })
  }

  // ── 등급 라벨 (MBTI 전용) ────────────────────────────
  if (data.ratingLabel) {
    ctx.font = `bold 26px system-ui, -apple-system, sans-serif`
    ctx.fillStyle = accent
    ctx.fillText(data.ratingLabel, PAD, PAD + 345)
  }

  // ── 분야별 점수 바 ────────────────────────────────────
  if (data.dimensions && data.dimensions.length > 0) {
    const dims = data.dimensions
    const barY = PAD + (data.summary ? 365 : 230)
    const barW = (W - PAD * 2 - (dims.length - 1) * 20) / dims.length
    dims.forEach(({ label, score, color }, i) => {
      const bx = PAD + i * (barW + 20)
      drawRoundRect(ctx, bx, barY, barW, 60, 12)
      ctx.fillStyle = 'rgba(255,255,255,0.06)'
      ctx.fill()
      const fillW = Math.max(24, (barW - 24) * (score / 100))
      drawRoundRect(ctx, bx + 12, barY + 36, fillW, 10, 5)
      ctx.fillStyle = color
      ctx.fill()
      ctx.font = `bold 20px system-ui, -apple-system, sans-serif`
      ctx.fillStyle = color
      ctx.textBaseline = 'top'
      ctx.fillText(label, bx + 12, barY + 10)
      ctx.font = `bold 24px system-ui, -apple-system, sans-serif`
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'right'
      ctx.fillText(`${score}`, bx + barW - 12, barY + 8)
      ctx.textAlign = 'left'
    })
  }

  // ── 하단 브랜드 ──────────────────────────────────────
  ctx.font = `18px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = 'rgba(255,255,255,0.2)'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'bottom'
  ctx.fillText('fove · 사주·MBTI·운세 인사이트', W - PAD, H - PAD + 12)

  return canvas
}

// ── 궁합 공유 버튼 컴포넌트 ──────────────────────────────
function DownloadButton({ onSave, label }: { onSave: () => void; label: string }): JSX.Element {
  const [saving, setSaving] = useState(false)
  const handleClick = () => {
    setSaving(true)
    setTimeout(() => { onSave(); setSaving(false) }, 50)
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={saving}
      className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/60 px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
    >
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {saving ? '생성 중…' : label}
    </button>
  )
}

export function CompatShareCardButton({ data }: { data: CompatShareData }): JSX.Element {
  const handleSave = useCallback(() => {
    const canvas = buildCompatCanvas(data)
    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `fove-궁합-${data.labelA}-${data.labelB}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 'image/png')
    trackEvent('shared', { pillar: `${data.labelA}x${data.labelB}`, score: data.totalScore })
  }, [data])

  return <DownloadButton onSave={handleSave} label="궁합 카드 저장" />
}

// ── 세로형 스토리 카드 버튼 ──────────────────────────────
export function PortraitShareCardButton({ fortune }: { fortune: DailyFortune }): JSX.Element {
  const [saving, setSaving] = useState(false)

  const handleClick = () => {
    setSaving(true)
    setTimeout(() => {
      const canvas = buildPortraitCanvas(fortune)
      canvas.toBlob((blob) => {
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `fove-스토리-${fortune.dateLabel.replace(/\./g, '')}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 'image/png')
      trackEvent('shared', { pillar: fortune.pillarName, score: fortune.score })
      setSaving(false)
    }, 50)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={saving}
      className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50/60 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
    >
      {saving ? '생성 중…' : '스토리 📱'}
    </button>
  )
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
