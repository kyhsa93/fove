import { JSX, useEffect, useMemo } from 'react';
import { ActionCardDeck, type ActionCardData } from './ActionCards';
import { TooltipLabel } from './TooltipLabel';
import { ResultCard } from './ResultCard';
import { useResultHistory } from '../hooks/useResultHistory';
import {
  recommendLottoNumbers,
  RELATIONSHIP_BY_ANIMAL,
  type DailyFortune,
  type Element,
  type SajuResult
} from '../lib/saju'
import type { MbtiResult, MbtiType } from './MbtiTest'

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

const YINYANG_RELATION_TIPS: Record<'양' | '음', string> = {
  양: '먼저 안부를 건네고 주도적으로 흐름을 이끌면 좋은 반응을 얻습니다.',
  음: '경청과 질문으로 상대 페이스에 맞추면 자연스럽게 신뢰가 쌓입니다.'
}

type CrossGroup = 'NT' | 'NF' | 'SJ' | 'SP'

const MBTI_GROUP_MAP: Record<MbtiType, CrossGroup> = {
  INTJ: 'NT',
  INTP: 'NT',
  ENTJ: 'NT',
  ENTP: 'NT',
  INFJ: 'NF',
  INFP: 'NF',
  ENFJ: 'NF',
  ENFP: 'NF',
  ISTJ: 'SJ',
  ISFJ: 'SJ',
  ESTJ: 'SJ',
  ESFJ: 'SJ',
  ISTP: 'SP',
  ISFP: 'SP',
  ESTP: 'SP',
  ESFP: 'SP'
}

const CROSS_INSIGHT_TABLE: Record<CrossGroup, Record<Element, { summary: string; advice: string; focus: string }>> = {
  NT: {
    목: {
      summary: '전략가형과 목(木)의 확장 에너지가 만나 아이디어와 계획을 크게 펼치기 좋은 흐름입니다.',
      advice: '새로운 구조나 시스템을 설계해 초안을 만들어 보세요. 팀과 공유하면 실행 동력을 얻습니다.',
      focus: '아이디어 설계'
    },
    화: {
      summary: '불(火)의 추진력이 분석력에 불을 붙여 결단력이 살아납니다.',
      advice: '빠르게 실행 가능한 실험을 정하고 주변을 설득해 보세요.',
      focus: '실험 실행'
    },
    토: {
      summary: '토(土)의 안정감이 장기 전략을 현실화하도록 돕습니다.',
      advice: '우선순위를 재정비하고 리스크를 점검해 전략을 다듬어 보세요.',
      focus: '전략 다듬기'
    },
    금: {
      summary: '금(金)의 분석 기운이 사고력을 날카롭게 만들어 데이터 기반 판단이 수월합니다.',
      advice: '인사이트를 숫자와 근거로 묶어 결정권자와 공유하세요.',
      focus: '분석·근거'
    },
    수: {
      summary: '수(水)의 유연성이 복잡한 문제를 다각도로 볼 수 있게 해 줍니다.',
      advice: '조용한 탐구 시간과 글쓰기로 아이디어를 확장하세요.',
      focus: '탐구·정리'
    }
  },
  NF: {
    목: {
      summary: '목(木)의 성장 에너지가 공감력과 만나 새로운 협업을 시작하기 좋은 날입니다.',
      advice: '사람들의 가능성을 기록하고 함께 성장할 프로젝트를 제안해 보세요.',
      focus: '협업 제안'
    },
    화: {
      summary: '불(火)의 열정이 이상과 비전을 대중에게 전할 힘을 줍니다.',
      advice: '강의나 발표로 메시지를 공유하면 영향력이 커집니다.',
      focus: '메시지 공유'
    },
    토: {
      summary: '토(土)의 안정감이 감수성을 지지해 현실적인 돌봄을 실행하기 좋습니다.',
      advice: '주변인의 필요를 세심하게 챙기고 실질적 지원을 계획하세요.',
      focus: '실질적 돌봄'
    },
    금: {
      summary: '금(金)의 명확함이 가치관을 정리해 건설적 대화를 이끕니다.',
      advice: '갈등 조정이나 가치 정렬 미팅을 주도해 보세요.',
      focus: '가치 정렬'
    },
    수: {
      summary: '수(水)의 흐름이 직관을 자극해 창의적인 스토리텔링이 살아납니다.',
      advice: '콘텐츠 제작이나 글쓰기로 마음을 표현해 보세요.',
      focus: '스토리텔링'
    }
  },
  SJ: {
    목: {
      summary: '목(木)의 확장 에너지가 안정적 실행력에 새로운 성장 기회를 더합니다.',
      advice: '업무 프로세스에 개선 아이디어를 한 가지 도입해 보세요.',
      focus: '프로세스 개선'
    },
    화: {
      summary: '불(火)의 추진력이 책임감과 만나 팀을 이끄는 리더십이 빛납니다.',
      advice: '중요한 의사결정을 명확히 정리해 구성원과 공유하세요.',
      focus: '리더십·정리'
    },
    토: {
      summary: '토(土)의 기운이 베이스를 더 단단하게 만들어 루틴 정비에 최적화된 날입니다.',
      advice: '자료·공간·재정을 정리하며 기반을 강화하세요.',
      focus: '기반 다지기'
    },
    금: {
      summary: '금(金)의 규칙성이 꼼꼼함과 만나 체크리스트의 힘이 커집니다.',
      advice: '감사·검토 업무를 집중적으로 처리하면 효율이 오릅니다.',
      focus: '검토·체크'
    },
    수: {
      summary: '수(水)의 유연함이 안정적인 성향에 부드러운 커뮤니케이션을 더합니다.',
      advice: '대인 커뮤니케이션에 시간을 투자해 신뢰를 강화하세요.',
      focus: '소통 강화'
    }
  },
  SP: {
    목: {
      summary: '목(木)의 확장이 즉흥적인 감각과 어우러져 새로운 체험이 영감을 줍니다.',
      advice: '새로운 활동이나 학습을 가볍게 시도해 기운을 살려보세요.',
      focus: '새로운 경험'
    },
    화: {
      summary: '불(火)의 활기가 행동력을 끌어올려 도전적인 미션도 즐겁게 해냅니다.',
      advice: '즉각 실행 가능한 목표를 정하고 몸을 움직여 보세요.',
      focus: '즉각 실행'
    },
    토: {
      summary: '토(土)의 안정감이 감각적인 기질을 정돈해 실용적인 결과를 만듭니다.',
      advice: '작업 공간이나 도구를 정리하며 효율을 높여 보세요.',
      focus: '환경 정비'
    },
    금: {
      summary: '금(金)의 집중력이 상황 판단력을 날카롭게 만들어 숙련도가 올라갑니다.',
      advice: '기술 연습이나 문제 해결 과제를 집중적으로 처리하세요.',
      focus: '기술 연습'
    },
    수: {
      summary: '수(水)의 흐름이 즉흥성을 부드럽게 완충해 협업 감이 좋아집니다.',
      advice: '팀과의 합을 맞출 수 있는 짧은 프로젝트에 참여해 보세요.',
      focus: '팀 협업'
    }
  }
}

const CROSS_DEFAULT = {
  summary: '사주 기운과 MBTI 성향이 부드럽게 조화를 이루는 날입니다.',
  advice: '몸과 마음이 원하는 속도를 존중하며 하루 계획을 조율해 보세요.',
  focus: '자기 점검'
}

function buildCrossInsight(dailyFortune: DailyFortune, mbtiResult: MbtiResult): { summary: string; advice: string; focus: string } {
  const group = MBTI_GROUP_MAP[mbtiResult.type] ?? 'NF'
  const elementKey = dailyFortune.elementLabel.charAt(0) as Element
  const insight = CROSS_INSIGHT_TABLE[group]?.[elementKey]
  return insight ?? CROSS_DEFAULT
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

function buildFortuneActionCards(
  combinedTexts: CombinedFortuneText,
  dailyFortune: DailyFortune
): ActionCardData[] {
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

const ELEMENT_FORTUNE_SUPPORT: Record<Element, string> = {
  목: '사람과 아이디어를 연결해 보는 시간이 행운 흐름을 끌어올립니다.',
  화: '열정이 필요한 일에 불씨를 붙이면 행운 에너지가 커집니다.',
  토: '정리와 기록으로 기반을 다지면 안정된 기운이 행운으로 이어집니다.',
  금: '데이터와 계획을 점검하면 기회를 선명하게 볼 수 있습니다.',
  수: '정보 수집과 조용한 사색이 행운을 부드럽게 끌어옵니다.'
}

function buildLottoActionCards(
  dailyFortune: DailyFortune,
  result: SajuResult,
  influenceSummary?: string
): ActionCardData[] {
  const strongestElement = result.summary.strongest.element
  const relationTip = RELATIONSHIP_BY_ANIMAL[result.pillars.day.branch]

  return [
    {
      title: '오늘 해볼 것',
      description: `${ELEMENT_FORTUNE_SUPPORT[strongestElement]} ${dailyFortune.energyText}`,
      tone: 'do'
    },
    {
      title: '피해야 할 것',
      description: `${dailyFortune.cautionText} 추천 번호에 집착하기보다 가볍게 즐겨보세요.`,
      tone: 'avoid'
    },
    {
      title: '대인관계/업무 팁',
      description: `${relationTip} ${influenceSummary ?? '공유하며 함께 기대를 나누면 즐거움이 배가됩니다.'}`,
      tone: 'relation'
    }
  ]
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

interface CombinedLottoCardProps {
  dailyFortune: DailyFortune
  result: SajuResult
  mbtiResult?: MbtiResult | null
}

export function CombinedLottoCard({ dailyFortune, result, mbtiResult }: CombinedLottoCardProps): JSX.Element {
  const { addEntry } = useResultHistory()
  const { dateLabel, pillarName, energyText, actionText, cautionText, elementLabel, yinYang } = dailyFortune
  const baseLotto = useMemo(() => recommendLottoNumbers(result, dailyFortune), [result, dailyFortune])
  const lucky = useMemo(() => mergeLottoWithMbti(baseLotto, mbtiResult), [baseLotto, mbtiResult])
  const strongestElement = result.summary.strongest.element
  const actionCards = useMemo(
    () => buildLottoActionCards(dailyFortune, result, lucky.influenceSummary),
    [dailyFortune, result, lucky.influenceSummary]
  )

  const metrics = useMemo(
    () => [
      { label: '추천 조합', value: lucky.numbers.join(', ') },
      { label: '보너스', value: `${lucky.bonus}` },
      { label: '강한 오행', value: strongestElement }
    ],
    [lucky, strongestElement]
  )

  const lottoKey = useMemo(
    () => `${dateLabel}:${result.meta.solarDate}:${result.meta.timeText}`,
    [dateLabel, result.meta.solarDate, result.meta.timeText]
  )

  const historyEntry = useMemo(
    () => ({
      id: `lotto:${lottoKey}`,
      kind: 'lotto' as const,
      title: '로또 번호 추천',
      subtitle: `${dateLabel} · ${pillarName}`,
      summary: `메인 번호 ${lucky.numbers.slice(0, 3).join(', ')}... · 보너스 ${lucky.bonus}`,
      timestamp: Date.now(),
      badge: 'LOTTO'
    }),
    [lottoKey, dateLabel, pillarName, lucky]
  )

  useEffect(() => {
    addEntry(historyEntry)
  }, [historyEntry, addEntry])

  const analysisTab = useMemo(() => {
    return (
      <div className="space-y-5 text-sm leading-relaxed text-slate-700">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {lucky.numbers.map((num) => (
            <span
              key={num}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-rose-200 text-lg font-semibold text-slate-900 shadow-sm"
            >
              {num}
            </span>
          ))}
        </div>
        <p className="text-sm text-center text-gray-600">
          <TooltipLabel text="보너스 번호" description="기본 조합 외에 흐름이 이어질 때 참고하면 좋은 숫자입니다." />{' '}
          <span className="font-semibold text-rose-500">{lucky.bonus}</span>
        </p>
        {lucky.influenceSummary ? (
          <p className="text-xs text-center text-indigo-600">{lucky.influenceSummary}</p>
        ) : null}
        <div className="rounded-xl border border-amber-200/70 bg-amber-50/70 px-2 py-4 text-amber-900/80 sm:px-4">
          <p className="text-sm font-semibold text-amber-900">이 결과는 이렇게 읽어보세요</p>
          <ul className="mt-2 space-y-1 leading-relaxed">
            <li>1) 추천 번호를 메모하고 마음에 드는 조합을 표시해 두세요.</li>
            <li>2) 추천 이유를 읽으며 오늘의 기운과 연결하면 의미가 더 선명해집니다.</li>
            <li>3) 과몰입하지 않도록 실천 카드를 참고해 일상 루틴과 균형을 맞추세요.</li>
          </ul>
        </div>
        <div className="space-y-1.5 text-xs text-gray-600">
          <p className="font-semibold text-gray-700">
            <TooltipLabel text="추천 이유" description="추천 번호 조합의 근거를 설명합니다." />
          </p>
          <p>
            {pillarName} ({yinYang}·{elementLabel}) 일진과 가장 강한 {strongestElement} 기운을 조합해 상승 흐름을 만들었어요.
          </p>
          {lucky.methodSummary ? <p>{lucky.methodSummary}</p> : null}
          <p className="text-[11px] leading-relaxed text-gray-500">에너지 포인트: {energyText}</p>
          <p className="text-[11px] leading-relaxed text-gray-500">실천 가이드: {actionText}</p>
          <p className="text-[11px] leading-relaxed text-gray-500">균형 메모: {cautionText}</p>
        </div>
      </div>
    )
  }, [lucky, strongestElement, pillarName, yinYang, elementLabel, energyText, actionText, cautionText])

  const adviceTab = useMemo(() => {
    return <ActionCardDeck cards={actionCards} />
  }, [actionCards])

  const tabs = useMemo(() => {
    return [
      { id: 'analysis', label: '해석', content: analysisTab },
      { id: 'advice', label: '조언', content: adviceTab }
    ]
  }, [analysisTab, adviceTab])

  return <ResultCard entry={historyEntry} metrics={metrics} summary={`행운 조합과 보너스 ${lucky.bonus}을(를) 참고해 가볍게 즐겨보세요.`} tabs={tabs} />
}

interface CrossInsightCardProps {
  dailyFortune: DailyFortune
  mbtiResult: MbtiResult
}

export function CrossInsightCard({ dailyFortune, mbtiResult }: CrossInsightCardProps): JSX.Element {
  const { addEntry } = useResultHistory()
  const insight = useMemo(() => buildCrossInsight(dailyFortune, mbtiResult), [dailyFortune, mbtiResult])

  const metrics = useMemo(
    () => [
      { label: 'MBTI 유형', value: `${mbtiResult.type} · ${mbtiResult.summary.title}` },
      { label: '오늘의 일진', value: dailyFortune.pillarName },
      { label: '포커스', value: insight.focus }
    ],
    [mbtiResult, dailyFortune, insight.focus]
  )

  const historyEntry = useMemo(
    () => ({
      id: `cross:${dailyFortune.dateLabel}:${mbtiResult.type}`,
      kind: 'cross' as const,
      title: '교차 해석',
      subtitle: `${dailyFortune.dateLabel} · ${dailyFortune.pillarName}`,
      summary: insight.summary,
      timestamp: Date.now(),
      badge: 'CROSS INSIGHT'
    }),
    [dailyFortune, mbtiResult, insight.summary]
  )

  useEffect(() => {
    addEntry(historyEntry)
  }, [historyEntry, addEntry])

  const analysisTab = useMemo(() => {
    return (
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>{insight.summary}</p>
        <div className="rounded-xl border border-slate-200 bg-white/80 px-2 py-4 text-xs text-slate-600 sm:px-4">
          <p className="font-semibold text-slate-700">오늘의 기반 데이터</p>
          <p className="mt-1">에너지 포인트: {dailyFortune.energyText}</p>
          <p>실천 가이드: {dailyFortune.actionText}</p>
          <p>균형 메모: {dailyFortune.cautionText}</p>
        </div>
      </div>
    )
  }, [insight.summary, dailyFortune])

  const crossCards = useMemo<ActionCardData[]>(
    () => [
      { title: '오늘 해볼 것', description: insight.advice, tone: 'do' },
      { title: '피해야 할 것', description: dailyFortune.cautionText, tone: 'avoid' },
      {
        title: '대인관계/업무 팁',
        description: `${YINYANG_RELATION_TIPS[dailyFortune.yinYang]} ${mbtiResult.summary.title}의 강점을 살려 대화를 리드해 보세요.`,
        tone: 'relation'
      }
    ],
    [insight.advice, dailyFortune, mbtiResult.summary.title]
  )

  const adviceTab = useMemo(() => <ActionCardDeck cards={crossCards} />, [crossCards])

  const tabs = useMemo(() => {
    return [
      { id: 'analysis', label: '해석', content: analysisTab },
      { id: 'advice', label: '조언', content: adviceTab }
    ]
  }, [analysisTab, adviceTab])

  return <ResultCard entry={historyEntry} metrics={metrics} summary={insight.summary} tabs={tabs} />
}
