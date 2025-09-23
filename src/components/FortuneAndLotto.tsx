import {
  recommendLottoNumbers,
  type DailyFortune,
  type SajuResult
} from '../lib/saju'
import type { MbtiResult } from './MbtiTest'

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

const MBTI_LETTER_WEIGHTS: Record<string, number> = {
  E: 2,
  I: 3,
  S: 5,
  N: 7,
  T: 11,
  F: 13,
  J: 17,
  P: 19
}

const MBTI_LETTER_DESCRIPTIONS: Record<string, string> = {
  E: 'E · 외향 에너지',
  I: 'I · 내향 에너지',
  S: 'S · 현실 감각',
  N: 'N · 직관 감각',
  T: 'T · 논리 사고',
  F: 'F · 감성 공감',
  J: 'J · 계획 성향',
  P: 'P · 유연 성향'
}

interface CombinedFortuneText {
  energy: string
  action: string
  caution: string
  accent?: string
}

interface CombinedLottoRecommendation {
  numbers: number[]
  bonus: number
  influenceSummary?: string
  methodSummary?: string
}

export function buildCombinedFortuneText(
  dailyFortune: DailyFortune,
  mbtiResult?: MbtiResult | null
): CombinedFortuneText {
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

export function mergeLottoWithMbti(
  baseNumbers: { numbers: number[]; bonus: number },
  mbtiResult?: MbtiResult | null
): CombinedLottoRecommendation {
  if (!mbtiResult) {
    return { numbers: baseNumbers.numbers, bonus: baseNumbers.bonus }
  }

  const letters = mbtiResult.type.split('')
  const weights = letters.map((letter) => MBTI_LETTER_WEIGHTS[letter] ?? 1)
  const used = new Set<number>()
  const adjustedNumbers = baseNumbers.numbers.map((num, index) => {
    const weight = weights[index % weights.length]
    let adjusted = ((num + weight - 1) % 45) + 1
    while (used.has(adjusted)) {
      adjusted = (adjusted % 45) + 1
    }
    used.add(adjusted)
    return adjusted
  })
  adjustedNumbers.sort((a, b) => a - b)

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
  let bonus = ((baseNumbers.bonus + totalWeight - 1) % 45) + 1
  while (used.has(bonus)) {
    bonus = (bonus % 45) + 1
  }

  const influenceSummary = `MBTI 가중치(${mbtiResult.type}): ${letters
    .map((letter) => MBTI_LETTER_DESCRIPTIONS[letter] ?? letter)
    .join(', ')}`
  const methodSummary = '사주 기반 추천 번호에 MBTI 성향 가중치를 더해 재조정했습니다.'

  return { numbers: adjustedNumbers, bonus, influenceSummary, methodSummary }
}

interface CombinedFortuneCardProps {
  dailyFortune: DailyFortune
  mbtiResult?: MbtiResult | null
}

export function CombinedFortuneCard({ dailyFortune, mbtiResult }: CombinedFortuneCardProps): JSX.Element {
  const combinedTexts = buildCombinedFortuneText(dailyFortune, mbtiResult)

  return (
    <div className="bg-gradient-to-br from-amber-100 via-white to-rose-100 border border-amber-200 rounded-2xl shadow-sm p-6 space-y-4">
      <header className="flex flex-col gap-1 text-gray-900">
        <h2 className="text-lg font-semibold">오늘의 운세</h2>
        <p className="text-sm text-gray-600">{dailyFortune.dateLabel}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3 text-sm text-gray-700">
        <div className="md:col-span-1 space-y-1">
          <p className="text-xs text-gray-500">오늘의 일진</p>
          <p className="text-xl font-semibold text-gray-900">{dailyFortune.pillarName}</p>
          <p className="text-sm text-gray-600">
            ({dailyFortune.yinYang}·{dailyFortune.elementLabel})
          </p>
        </div>
        <div className="md:col-span-2 space-y-3">
          <div>
            <p className="text-xs font-semibold text-amber-600 tracking-wide">ENERGY</p>
            <p>{combinedTexts.energy}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-600 tracking-wide">ACTION</p>
            <p>{combinedTexts.action}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600 tracking-wide">CARE</p>
            <p>{combinedTexts.caution}</p>
          </div>
        </div>
      </div>
      {mbtiResult && combinedTexts.accent ? (
        <div className="rounded-xl border border-indigo-100 bg-white/70 p-4 text-sm text-indigo-900/80">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">MBTI Insight</p>
          <p className="mt-1">{combinedTexts.accent}</p>
          <p className="mt-1 text-xs text-indigo-600">핵심 메시지: {mbtiResult.summary.description}</p>
        </div>
      ) : null}
    </div>
  )
}

interface CombinedLottoCardProps {
  dailyFortune: DailyFortune
  result: SajuResult
  mbtiResult?: MbtiResult | null
}

export function CombinedLottoCard({ dailyFortune, result, mbtiResult }: CombinedLottoCardProps): JSX.Element {
  const baseLotto = recommendLottoNumbers(result, dailyFortune)
  const lucky = mergeLottoWithMbti(baseLotto, mbtiResult)
  const strongestElement = result.summary.strongest.element

  return (
    <div className="bg-white/90 border border-amber-200 rounded-2xl shadow-sm p-6 space-y-4">
      <header className="flex flex-col gap-1 text-gray-900">
        <h2 className="text-lg font-semibold">로또 번호 추천</h2>
        <p className="text-sm text-gray-600">
          {mbtiResult ? '사주 기운과 MBTI 성향을 함께 반영했습니다.' : '오늘의 사주 기운을 기반으로 추천했습니다.'}
        </p>
      </header>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {lucky.numbers.map((num) => (
          <span
            key={num}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-rose-200 text-gray-900 text-lg font-semibold shadow-sm"
          >
            {num}
          </span>
        ))}
      </div>
      <p className="text-sm text-center text-gray-600">
        보너스 번호 <span className="font-semibold text-rose-500">{lucky.bonus}</span>
      </p>
      {lucky.influenceSummary ? (
        <p className="text-xs text-center text-indigo-600">{lucky.influenceSummary}</p>
      ) : null}
      <div className="text-xs text-gray-600 space-y-1.5">
        <p className="font-semibold text-gray-700">추천 이유</p>
        <p>
          {dailyFortune.pillarName} ({dailyFortune.yinYang}·{dailyFortune.elementLabel}) 일진과 당신 사주의 가장 강한
          {` ${strongestElement} `}기운을 기반으로 흐름이 상승하는 조합을 골랐어요.
        </p>
        {lucky.methodSummary ? <p>{lucky.methodSummary}</p> : null}
        <p className="text-[11px] leading-relaxed text-gray-500">
          에너지 포인트: {dailyFortune.energyText}
        </p>
        <p className="text-[11px] leading-relaxed text-gray-500">
          실천 가이드: {dailyFortune.actionText}
        </p>
        <p className="text-[11px] leading-relaxed text-gray-500">
          균형 메모: {dailyFortune.cautionText}
        </p>
      </div>
    </div>
  )
}
