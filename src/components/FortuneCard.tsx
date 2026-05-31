import { JSX, useCallback, useMemo, useState } from 'react'
import { ActionCardDeck, type ActionCardData } from './ActionCards'
import { TooltipLabel } from './TooltipLabel'
import { ResultCard } from './ResultCard'
import { ShareCardButton, PortraitShareCardButton } from './ShareCard'
import { ShareLinkButton } from './ShareLinkButton'
import type { MbtiResult } from './MbtiTest'
import type { DailyFortune, SajuResult } from '../lib/saju'
import { trackEvent } from '../lib/analytics'

const SCORE_GRADES: Array<{ min: number; label: string; emoji: string; colorClass: string }> = [
  { min: 90, label: '대길', emoji: '⭐', colorClass: 'border-amber-200 bg-amber-50 text-amber-700' },
  { min: 80, label: '길', emoji: '🌟', colorClass: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  { min: 70, label: '보통', emoji: '☁️', colorClass: 'border-slate-200 bg-slate-50 text-slate-600' },
  { min: 60, label: '소길', emoji: '🌧', colorClass: 'border-blue-200 bg-blue-50 text-blue-600' },
  { min: 0, label: '주의', emoji: '⚡', colorClass: 'border-rose-200 bg-rose-50 text-rose-600' },
]

function getScoreGrade(score: number) {
  return SCORE_GRADES.find((g) => score >= g.min) ?? SCORE_GRADES[SCORE_GRADES.length - 1]
}

const MBTI_DIMENSION_TIPS: Record<string, { positive: string; negative: string }> = {
  EI: {
    positive: '사람들과 어울리며 활력을 얻기 좋은',
    negative: '조용한 환경에서 몰입하기 좋은'
  },
  SN: {
    positive: '현실적인 디테일을 정리하기 좋은',
    negative: '새로운 가능성을 상상하고 설계하기 좋은'
  },
  TF: {
    positive: '논리와 분석이 돋보이는',
    negative: '감성과 관계 감각이 빛나는'
  },
  JP: {
    positive: '계획을 정교하게 다듬기 좋은',
    negative: '변화에 유연하게 대응하기 좋은'
  }
}

const YINYANG_RELATION_TIPS: Record<'양' | '음', string> = {
  양: '먼저 안부를 건네고 주도적으로 흐름을 이끌면 좋은 반응을 얻습니다.',
  음: '경청과 질문으로 상대 페이스에 맞추면 자연스럽게 신뢰가 쌓입니다.'
}

interface CombinedFortuneText {
  energy: string
  action: string
  caution: string
  accent?: string
}

export function buildCombinedFortuneText(dailyFortune: DailyFortune, mbtiResult?: MbtiResult | null): CombinedFortuneText {
  if (!mbtiResult) {
    return {
      energy: dailyFortune.energyText,
      action: dailyFortune.actionText,
      caution: dailyFortune.cautionText
    }
  }

  const summary = mbtiResult.summary
  const [primaryStrength] = summary.strengths
  const [primaryCaution] = summary.cautions

  const dominantEntry = (Object.entries(mbtiResult.totals) as Array<[keyof typeof MBTI_DIMENSION_TIPS, number]>)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0]
  const dominantDimension = dominantEntry?.[0]
  const dominantValue = dominantEntry?.[1] ?? 0
  const orientation = dominantValue >= 0 ? 'positive' : 'negative'
  const orientationText = dominantDimension
    ? MBTI_DIMENSION_TIPS[dominantDimension][orientation]
    : '당신다운 흐름을 살리기 좋은'

  const energy = `${dailyFortune.energyText} ${summary.title} 유형(${mbtiResult.type})에게는 ${orientationText} 하루예요.`
  const action = `${dailyFortune.actionText}${primaryStrength ? ` 특히 ${primaryStrength} 강점을 활용해보세요.` : ''}`
  const caution = `${dailyFortune.cautionText}${primaryCaution ? ` ${primaryCaution} 부분을 의식하면 균형이 잡혀요.` : ''}`
  const accent = `${summary.title} · 강점: ${primaryStrength ?? '자신만의 강점'} · 주의: ${primaryCaution ?? '자기 돌봄'}`

  return { energy, action, caution, accent }
}

function buildFortuneActionCards(combinedTexts: CombinedFortuneText, dailyFortune: DailyFortune): ActionCardData[] {
  return [
    {
      title: '오늘 해볼 것',
      description: combinedTexts.action,
      tone: 'do'
    },
    {
      title: '피해야 할 것',
      description: combinedTexts.caution,
      tone: 'avoid'
    },
    {
      title: '관계 · 소통 팁',
      description: `${YINYANG_RELATION_TIPS[dailyFortune.yinYang]} ${combinedTexts.energy}`,
      tone: 'relation'
    }
  ]
}

const LUCKY_ITEMS = [
  { key: 'color' as const, label: '행운색', emoji: '🎨' },
  { key: 'number' as const, label: '행운 숫자', emoji: '🔢' },
  { key: 'direction' as const, label: '행운 방위', emoji: '🧭' },
  { key: 'food' as const, label: '행운 음식', emoji: '🍀' },
]

function LuckyCard({ lucky, dateLabel }: { lucky: DailyFortune['lucky']; dateLabel: string }): JSX.Element {
  const [copied, setCopied] = useState(false)

  const shareText = `✨ ${dateLabel} 오늘의 행운 요소\n🎨 행운색: ${lucky.color}\n🔢 행운 숫자: ${lucky.number}\n🧭 행운 방위: ${lucky.direction}\n🍀 행운 음식: ${lucky.food}\n⚡ 오늘 피할 것: ${lucky.avoid}\n\nFove에서 오늘 운세 확인 → https://kyhsa93.github.io/fove`

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText)
    } catch {
      const el = document.createElement('textarea')
      el.value = shareText
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [shareText])

  return (
    <div className="rounded-xl border border-amber-100 bg-white/80 px-3 py-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-amber-700">✨ 오늘의 행운 요소</p>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs text-amber-600 hover:text-amber-800 transition font-medium"
        >
          {copied ? '✓ 복사됨' : '텍스트 복사'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {LUCKY_ITEMS.map(({ key, label, emoji }) => (
          <div key={key} className="rounded-lg bg-amber-50/60 border border-amber-100 px-2 py-2.5 text-center space-y-1">
            <p className="text-[10px] text-slate-500">{emoji} {label}</p>
            <p className="text-sm font-semibold text-slate-800 leading-snug">{lucky[key]}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-rose-100 bg-rose-50/50 px-3 py-2.5 flex items-start gap-2">
        <span className="text-base shrink-0">⚡</span>
        <div>
          <p className="text-[10px] font-semibold text-rose-600 mb-0.5">오늘 피할 것</p>
          <p className="text-xs text-rose-900 leading-relaxed">{lucky.avoid}</p>
        </div>
      </div>
    </div>
  )
}

interface CombinedFortuneCardProps {
  dailyFortune: DailyFortune
  sajuResult?: SajuResult | null
  mbtiResult?: MbtiResult | null
}

const CATEGORY_META = [
  { key: 'work' as const, label: '일·업무', tooltip: '직장·공부·프로젝트에서 발휘되는 에너지 수준이에요.', icon: '💼', bar: 'bg-blue-400', border: 'border-blue-100 bg-blue-50/60 text-blue-900' },
  { key: 'love' as const, label: '사랑·관계', tooltip: '연인·가족·친구와의 관계 흐름을 나타내요.', icon: '🌸', bar: 'bg-rose-400', border: 'border-rose-100 bg-rose-50/60 text-rose-900' },
  { key: 'money' as const, label: '재물', tooltip: '금전·소비·투자 관련 에너지 흐름이에요.', icon: '💰', bar: 'bg-amber-400', border: 'border-amber-100 bg-amber-50/60 text-amber-900' },
  { key: 'health' as const, label: '건강', tooltip: '오늘 몸과 마음의 컨디션 지수예요.', icon: '🌿', bar: 'bg-emerald-400', border: 'border-emerald-100 bg-emerald-50/60 text-emerald-900' }
]

function ScoreBar({ score, label, color }: { score: number; label: string; color: string }): JSX.Element {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{label}</span>
        <span className="font-semibold text-slate-700">{score}점</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

function OverallScoreBar({ score }: { score: number }): JSX.Element {
  const color = score >= 80 ? 'bg-emerald-400' : score >= 65 ? 'bg-amber-400' : 'bg-rose-400'
  const grade = getScoreGrade(score)
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>오늘의 운세 지수</span>
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-0.5 rounded-full border px-2 py-0.5 text-xs font-semibold ${grade.colorClass}`}>
            {grade.emoji} {grade.label}
          </span>
          <span className="font-semibold text-slate-700">{score}점</span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export function CombinedFortuneCard({ dailyFortune, sajuResult, mbtiResult }: CombinedFortuneCardProps): JSX.Element {
  const { dateLabel, pillarName, elementLabel, yinYang, score, categories, categoryScores, lucky } = dailyFortune
  const combinedTexts = useMemo(() => buildCombinedFortuneText(dailyFortune, mbtiResult), [dailyFortune, mbtiResult])
  const actionCards = useMemo(() => buildFortuneActionCards(combinedTexts, dailyFortune), [combinedTexts, dailyFortune])

  const metrics = useMemo(
    () => [
      { label: '오늘의 일진', value: pillarName },
      { label: '오행', value: elementLabel },
      { label: '음양', value: yinYang }
    ],
    [pillarName, elementLabel, yinYang]
  )

  const analysisTab = useMemo(() => {
    const luckyRange = sajuResult?.pillars.hour?.range
    const strongestLabel = sajuResult ? `${sajuResult.summary.strongest.element} (${sajuResult.summary.strongest.count}개)` : null
    const reasonText = sajuResult
      ? `${pillarName} 일진이 ${elementLabel} 기운을 강조하고, 개인 사주의 강점인 ${strongestLabel ?? '개인 오행'} 흐름이 맞물렸습니다.`
      : `${pillarName} 일진이 ${elementLabel} 기운을 중심으로 하루의 방향을 잡고 있습니다.`
    const cautionText = `${combinedTexts.caution}${luckyRange ? ` 길한 시간대는 ${luckyRange}입니다.` : ' 태어난 시간을 입력하면 길한 시간대를 안내해 드립니다.'}`
    const relationHint = actionCards[2]?.description ?? ''

    return (
      <div className="space-y-5 text-sm leading-relaxed text-slate-700">
        <div className="space-y-3">
          <div className="rounded-xl border border-amber-50 bg-amber-50/40 px-3 py-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              <TooltipLabel text="ENERGY" description="오늘 하루 전반의 에너지 흐름 요약입니다." className="text-amber-600" />
            </p>
            <p>{combinedTexts.energy}</p>
          </div>
          <div className="rounded-xl border border-rose-50 bg-rose-50/40 px-3 py-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
              <TooltipLabel text="ACTION" description="실제로 실행하면 도움이 되는 행동 가이드입니다." className="text-rose-600" />
            </p>
            <p>{combinedTexts.action}</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/40 px-3 py-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              <TooltipLabel text="CARE" description="균형을 위해 조심하면 좋은 포인트입니다." className="text-slate-600" />
            </p>
            <p>{combinedTexts.caution}</p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-100 bg-white/80 px-2 py-4 sm:px-4">
          <h3 className="text-sm font-semibold text-amber-700">핵심 해설</h3>
          <dl className="mt-3 grid gap-3 sm:grid-cols-2 text-slate-700">
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-amber-500">왜 이런 결과가 나왔나요?</dt>
              <dd>{reasonText}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-amber-500">오늘 해볼 것</dt>
              <dd>{combinedTexts.action}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-amber-500">주의·길한 시간대</dt>
              <dd>{cautionText}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-amber-500">관계 힌트</dt>
              <dd>{relationHint}</dd>
            </div>
          </dl>
        </div>
      </div>
    )
  }, [combinedTexts, pillarName, elementLabel, actionCards, sajuResult, score])

  const categoriesTab = useMemo(() => (
    <div className="space-y-4 text-sm leading-relaxed">
      <div className="grid gap-3 sm:grid-cols-2">
        {CATEGORY_META.map(({ key, label, tooltip, icon, bar, border }) => (
          <div key={key} className={`rounded-xl border px-3 py-4 space-y-2.5 ${border}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">
                <TooltipLabel text={`${icon} ${label}`} description={tooltip} />
              </p>
              <span className="text-lg font-bold tabular-nums">{categoryScores[key]}점</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
              <div className={`h-full rounded-full ${bar}`} style={{ width: `${categoryScores[key]}%` }} />
            </div>
            <p className="text-xs leading-relaxed opacity-80">{categories[key]}</p>
          </div>
        ))}
      </div>

      <LuckyCard lucky={lucky} dateLabel={dateLabel} />
    </div>
  ), [categories, categoryScores, lucky, dateLabel])

  const adviceTab = useMemo(() => (
    <div className="space-y-5 text-sm leading-relaxed text-slate-700">
      <ActionCardDeck cards={actionCards} />
      {mbtiResult && combinedTexts.accent ? (
        <div className="rounded-xl border border-indigo-100 bg-white/80 px-2 py-4 text-indigo-900/80 sm:px-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">MBTI Insight</p>
          <p className="mt-1">{combinedTexts.accent}</p>
          <p className="mt-1 text-xs text-indigo-600">핵심 메시지: {mbtiResult.summary.description}</p>
        </div>
      ) : null}
    </div>
  ), [actionCards, combinedTexts, mbtiResult])

  const tabs = useMemo(() => [
    { id: 'analysis', label: '해석', content: analysisTab },
    { id: 'categories', label: '분야별', content: categoriesTab },
    { id: 'advice', label: '조언', content: adviceTab }
  ], [analysisTab, categoriesTab, adviceTab])

  const handleShare = useCallback(() => {
    trackEvent('shared', { pillar: pillarName, score })
  }, [pillarName, score])

  const fortuneShareOptions = useMemo(() => ({
    title: `오늘의 운세 ${score}점 — Fove`,
    description: `${dateLabel} 일진 ${pillarName}. 나의 운세도 확인해보세요!`,
    url: 'https://kyhsa93.github.io/fove/fortune',
  }), [score, dateLabel, pillarName])

  const handleTabChange = useCallback((tabId: string) => {
    if (tabId === 'advice') {
      trackEvent('fortune_completed', { pillar: pillarName, score })
    }
  }, [pillarName, score])

  return (
    <ResultCard
      badge="FORTUNE"
      title="오늘의 운세"
      subtitle={`${dateLabel} · ${pillarName}`}
      metrics={metrics}
      summary={combinedTexts.energy}
      tabs={tabs}
      belowGrid={<OverallScoreBar score={score} />}
      actions={
        <div className="flex gap-2 flex-wrap">
          <ShareCardButton fortune={dailyFortune} />
          <PortraitShareCardButton fortune={dailyFortune} />
          <ShareLinkButton
            options={fortuneShareOptions}
            label="공유 🔗"
            className="px-3 py-1.5 text-xs"
          />
        </div>
      }
      onShare={handleShare}
      onTabChange={handleTabChange}
    />
  )
}
