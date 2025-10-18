import { JSX, useEffect, useMemo } from 'react'
import { ActionCardDeck, type ActionCardData } from './ActionCards'
import { TooltipLabel } from './TooltipLabel'
import { ResultCard } from './ResultCard'
import { useResultHistory } from '../hooks/useResultHistory'
import type { MbtiResult } from './MbtiTest'
import type { DailyFortune, SajuResult } from '../lib/saju'

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
      title: '대인관계/업무 팁',
      description: `${YINYANG_RELATION_TIPS[dailyFortune.yinYang]} ${combinedTexts.energy}`,
      tone: 'relation'
    }
  ]
}

interface CombinedFortuneCardProps {
  dailyFortune: DailyFortune
  sajuResult?: SajuResult | null
  mbtiResult?: MbtiResult | null
}

export function CombinedFortuneCard({ dailyFortune, sajuResult, mbtiResult }: CombinedFortuneCardProps): JSX.Element {
  const { addEntry } = useResultHistory()
  const { dateLabel, pillarName, elementLabel, yinYang } = dailyFortune
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

  const fortuneKey = useMemo(() => `${dateLabel}:${mbtiResult?.type ?? 'base'}`, [dateLabel, mbtiResult?.type])

  const historyEntry = useMemo(
    () => ({
      id: `fortune:${fortuneKey}`,
      kind: 'fortune' as const,
      title: '오늘의 운세',
      subtitle: `${dateLabel} · ${pillarName}`,
      summary: combinedTexts.energy,
      timestamp: Date.now(),
      badge: 'FORTUNE'
    }),
    [fortuneKey, dateLabel, pillarName, combinedTexts.energy]
  )

  useEffect(() => {
    addEntry(historyEntry)
  }, [historyEntry, addEntry])

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
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
              <TooltipLabel text="ENERGY" description="오늘 하루 전반의 에너지 흐름 요약입니다." className="text-amber-600" />
            </p>
            <p>{combinedTexts.energy}</p>
          </div>
          <div className="md:col-span-1 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
              <TooltipLabel text="ACTION" description="실제로 실행하면 도움이 되는 행동 가이드입니다." className="text-rose-600" />
            </p>
            <p>{combinedTexts.action}</p>
          </div>
          <div className="md:col-span-1 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              <TooltipLabel text="CARE" description="균형을 위해 조심하면 좋은 포인트입니다." className="text-slate-600" />
            </p>
            <p>{combinedTexts.caution}</p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-100 bg-white/80 px-2 py-4 sm:px-4">
          <h3 className="text-sm font-semibold text-amber-700">핵심 해설</h3>
          <dl className="mt-3 grid gap-3 md:grid-cols-2 text-slate-700">
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-amber-500">왜 이런 결과가 나왔나요?</dt>
              <dd>{reasonText}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-amber-500">이 결과의 의미는?</dt>
              <dd>{combinedTexts.energy}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-amber-500">오늘 해볼 것</dt>
              <dd>{combinedTexts.action}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-amber-500">주의·길한 시간대</dt>
              <dd>{cautionText}</dd>
            </div>
            <div className="space-y-1 md:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-amber-500">관계 힌트</dt>
              <dd>{relationHint}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-amber-200/70 bg-amber-50/70 px-2 py-4 text-amber-900/80 sm:px-4">
          <p className="text-sm font-semibold text-amber-900">이 결과는 이렇게 읽어보세요</p>
          <ul className="mt-2 space-y-1 leading-relaxed">
            <li>1) 오늘의 일진으로 기본 기운을 확인하고 ENERGY → ACTION 순으로 읽어보세요.</li>
            <li>2) CARE 문장을 체크해 무리할 부분을 조정하면 균형 잡힌 하루가 됩니다.</li>
            <li>3) 실천 카드를 일정에 바로 옮겨놓으면 실행률이 훨씬 높아집니다.</li>
          </ul>
        </div>
      </div>
    )
  }, [combinedTexts, pillarName, elementLabel, actionCards, sajuResult])

  const adviceTab = useMemo(() => {
    return (
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
    )
  }, [actionCards, combinedTexts, mbtiResult])

  const tabs = useMemo(() => {
    return [
      { id: 'analysis', label: '해석', content: analysisTab },
      { id: 'advice', label: '조언', content: adviceTab }
    ]
  }, [analysisTab, adviceTab])

  return <ResultCard entry={historyEntry} metrics={metrics} summary={combinedTexts.energy} tabs={tabs} />
}
