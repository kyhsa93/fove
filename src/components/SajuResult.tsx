import { JSX, useCallback } from 'react'
import {
  BRANCH_YINYANG,
  CAREER_BY_ELEMENT,
  ELEMENT_ACTION_AVOID,
  ELEMENT_ACTION_DO,
  ELEMENT_KEYWORDS,
  ELEMENT_LABELS,
  HEALTH_TIPS_BY_ELEMENT,
  LUCKY_COLOR,
  LUCKY_DIRECTION,
  LUCKY_FOOD,
  ELEMENT_PRODUCES,
  PILLAR_FOCUS,
  PILLAR_LABELS,
  RELATIONSHIP_BY_ANIMAL,
  STEM_YINYANG,
  TEMPERAMENT_BY_ELEMENT,
  type Element,
  type ElementBar,
  type InterpretationCategory,
  type Pillar,
  type PillarKey,
  type SajuResult
} from '../lib/saju'
import { TooltipLabel } from './TooltipLabel'
import { ActionCardDeck, type ActionCardData } from './ActionCards'
import { useToast } from './ToastProvider'


function buildSajuActionCards(result: SajuResult): ActionCardData[] {
  const strongestElement = result.summary.strongest.element
  const weakestElement = result.summary.weakest.element
  const dayBranch = result.pillars.day.branch

  return [
    {
      title: '오늘 해볼 것',
      description: `${ELEMENT_ACTION_DO[strongestElement]} ${result.summary.yinYangMessage}`,
      tone: 'do'
    },
    {
      title: '피해야 할 것',
      description: ELEMENT_ACTION_AVOID[weakestElement],
      tone: 'avoid'
    },
    {
      title: '대인관계/업무 팁',
      description: `${RELATIONSHIP_BY_ANIMAL[dayBranch]} ${CAREER_BY_ELEMENT[strongestElement]}`,
      tone: 'relation'
    }
  ]
}

interface PillarCardProps {
  pillarKey: PillarKey
  pillar: Pillar
}

function PillarCard({ pillarKey, pillar }: PillarCardProps): JSX.Element {
  const focusText = pillar.focus ?? PILLAR_FOCUS[pillarKey]
  const monthText = pillar.monthLabel ?? (pillar.lunarMonth ? `${pillar.lunarMonth}월` : '-')

  return (
    <article className="bg-white/90 border border-gray-100 rounded-2xl shadow-sm px-2 py-4 space-y-3 sm:px-4 sm:py-5">
      <header className="flex items-baseline justify-between">
        <h3 className="text-md font-semibold text-gray-900">{PILLAR_LABELS[pillarKey]}</h3>
        <span className="text-xs text-gray-500">{focusText}</span>
      </header>
      <p className="text-2xl font-bold text-gray-900 tracking-wide">{pillar.name}</p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
        <div>
          <dt className="text-gray-500">
            <TooltipLabel text="천간" description="하늘의 기운을 뜻하며, 사주에서 겉으로 드러나는 성향을 읽는 기준이 됩니다." />
          </dt>
          <dd className="font-medium">{pillar.stem} ({STEM_YINYANG[pillar.stem]}·{ELEMENT_LABELS[pillar.stemElement]})</dd>
        </div>
        <div>
          <dt className="text-gray-500">
            <TooltipLabel text="지지" description="땅의 기운을 의미하며, 실제 생활 속에서 드러나는 행동 패턴을 보여줍니다." />
          </dt>
          <dd className="font-medium">{pillar.branch} ({BRANCH_YINYANG[pillar.branch]}·{ELEMENT_LABELS[pillar.branchElement]})</dd>
        </div>
        <div>
          <dt className="text-gray-500">
            <TooltipLabel text="띠" description="해당 지지에 해당하는 십이지 동물입니다. 인간관계와 기질의 힌트를 줍니다." />
          </dt>
          <dd className="font-medium">{pillar.animal}</dd>
        </div>
        {pillar.range ? (
          <div>
            <dt className="text-gray-500">시각대</dt>
            <dd className="font-medium">{pillar.range}</dd>
          </div>
        ) : pillarKey === 'month' ? (
          <div>
            <dt className="text-gray-500">
              <TooltipLabel text="음력월" description="태어난 해의 음력 월 정보를 뜻하며, 계절의 기운을 이해하는 포인트입니다." />
            </dt>
            <dd className="font-medium">{monthText}</dd>
          </div>
        ) : (
          <div>
            <dt className="text-gray-500">
              <TooltipLabel text="중요성" description="각 기둥이 읽어내는 삶의 영역입니다. 연주=초년, 월주=청년, 일주=본성, 시주=말년." />
            </dt>
            <dd className="font-medium">{focusText}</dd>
          </div>
        )}
      </dl>
    </article>
  )
}

interface ElementDistributionProps {
  elementBars: ElementBar[]
  strongestLabel: string
  weakestLabel: string
  yinYangMessage: string
}

function ElementDistribution({ elementBars, strongestLabel, weakestLabel, yinYangMessage }: ElementDistributionProps): JSX.Element {
  return (
    <div className="bg-white/90 border border-amber-100 rounded-2xl shadow-sm px-2 py-4 space-y-4 sm:px-6 sm:py-6">
      <h2 className="text-lg font-semibold text-gray-900">
        <TooltipLabel
          text="오행 · 음양 분포"
          description="오행은 목·화·토·금·수 다섯 기운, 음양은 기운의 방향성을 살펴 균형을 파악합니다."
        />
      </h2>
      <div className="grid gap-3 md:grid-cols-5">
        {elementBars.map((item) => (
          <div key={item.element} className="space-y-2">
            <p className="text-sm font-medium text-gray-700 text-center">{item.label}</p>
            <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-rose-400" style={{ width: `${item.ratio}%` }} />
            </div>
            <p className="text-xs text-gray-500 text-center">{item.count}개</p>
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <TooltipLabel text="강한 오행" description="사주에서 에너지가 가장 많이 모여 쉽게 활용할 수 있는 기운입니다." />: {strongestLabel}
        </p>
        <p>
          <TooltipLabel text="부족한 오행" description="상대적으로 줄어든 기운으로, 의식적으로 보완하면 균형이 잡힙니다." />: {weakestLabel}
        </p>
        <p>{yinYangMessage}</p>
      </div>
    </div>
  )
}

interface InterpretationSectionProps {
  interpretation: InterpretationCategory[]
}

function InterpretationSection({ interpretation }: InterpretationSectionProps): JSX.Element | null {
  if (!interpretation.length) return null

  return (
    <div className="bg-white/90 border border-slate-100 rounded-2xl shadow-sm px-2 py-4 space-y-4 sm:px-6 sm:py-6">
      <h2 className="text-lg font-semibold text-gray-900">
        <TooltipLabel text="심층 해석" description="핵심 키워드를 기반으로 삶의 흐름과 성향을 알기 쉽게 정리했습니다." />
      </h2>
      <div className="space-y-5 text-sm leading-relaxed">
        {interpretation.map((item) => (
          <div key={item.key} className="space-y-1.5">
            <p className="font-semibold text-gray-900">{item.title}</p>
            <p className="font-medium text-gray-800">{item.summary}</p>
            <p className="text-gray-500 text-xs">{item.reason}</p>
            <p className="text-amber-800 text-xs bg-amber-50 rounded-lg px-3 py-1.5">→ {item.tip}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SupplementGuide({ weakest, strongest }: { weakest: Element; strongest: Element }): JSX.Element {
  const sourceElement = ELEMENT_PRODUCES[weakest] === strongest
    ? null
    : (Object.entries(ELEMENT_PRODUCES) as [Element, Element][]).find(([, v]) => v === weakest)?.[0] ?? null

  const ITEMS = [
    { icon: '🍽️', label: '챙길 음식', value: LUCKY_FOOD[weakest] },
    { icon: '🎨', label: '보완 색상', value: LUCKY_COLOR[weakest] },
    { icon: '🧭', label: '좋은 방위', value: `${LUCKY_DIRECTION[weakest]}쪽` },
    { icon: '💪', label: '추천 활동', value: ELEMENT_ACTION_DO[weakest] },
  ]

  return (
    <div className="bg-white/90 border border-teal-100 rounded-2xl shadow-sm px-2 py-4 space-y-4 sm:px-6 sm:py-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">오행 보완 가이드</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          부족한 <span className="font-semibold text-teal-700">{weakest}({ELEMENT_LABELS[weakest]})</span> 기운을 채우면 균형이 잡혀요.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {ITEMS.map(({ icon, label, value }) => (
          <div key={label} className="rounded-xl border border-teal-100 bg-teal-50/60 px-3 py-3 space-y-0.5">
            <p className="text-xs font-semibold text-teal-600">{icon} {label}</p>
            <p className="text-sm text-teal-900 leading-relaxed">{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-3 space-y-1">
        <p className="text-xs font-semibold text-amber-700">🌿 건강 관리 포인트</p>
        <p className="text-sm text-amber-900 leading-relaxed">{HEALTH_TIPS_BY_ELEMENT[weakest]}</p>
      </div>
      {sourceElement && (
        <p className="text-xs text-gray-500">
          💡 {sourceElement}({ELEMENT_LABELS[sourceElement]}) 기운이 {weakest}을 생(生)해요 — {CAREER_BY_ELEMENT[sourceElement].slice(0, 30)}… 분야와 가까이하면 도움이 돼요.
        </p>
      )}
    </div>
  )
}

interface SajuResultProps {
  result: SajuResult | null
  elementBars: ElementBar[]
  interpretation: InterpretationCategory[]
  isLoading: boolean
}

export function SajuResult({ result, elementBars, interpretation, isLoading }: SajuResultProps): JSX.Element | null {
  const { showToast } = useToast()

  const handleShare = useCallback(async () => {
    if (!result) return
    const strongest = result.summary.strongest
    const text = [
      '[Fove 사주 풀이]',
      TEMPERAMENT_BY_ELEMENT[strongest.element],
      `강한 오행: ${strongest.element}(${strongest.count}개) · 일주: ${result.pillars.day.name}`,
      '',
      '나의 사주를 확인해보세요: https://kyhsa93.github.io/fove/saju'
    ].join('\n')

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Fove 사주 풀이', text, url: 'https://kyhsa93.github.io/fove/saju' })
        return
      } catch (e) {
        if (e instanceof Error && e.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      showToast('사주 결과를 복사했습니다.', 'success')
    } catch {
      showToast('복사에 실패했어요. 다시 시도해 주세요.', 'error')
    }
  }, [result, showToast])

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-white/60 px-4 py-5 text-sm text-gray-600">
        계산 중입니다…
      </div>
    )
  }

  if (!result) return null

  const strongestLabel = `${result.summary.strongest.element} (${result.summary.strongest.count}개)`
  const weakestLabel = `${result.summary.weakest.element} (${result.summary.weakest.count}개)`
  const actionCards = buildSajuActionCards(result)
  const luckyRange = result.pillars.hour?.range

  return (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div className="rounded-3xl border border-slate-100 bg-white/95 px-2 py-5 shadow-sm space-y-4 sm:px-6 sm:py-6">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">SAJU INSIGHT</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">사주 풀이</h2>
            <p className="text-sm text-slate-600">{result.meta.solarDate} · {result.meta.genderLabel}</p>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
          >
            <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            공유
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-base font-medium leading-relaxed text-slate-800">{TEMPERAMENT_BY_ELEMENT[result.summary.strongest.element]}</p>
          <div className="flex flex-wrap gap-1.5">
            {ELEMENT_KEYWORDS[result.summary.strongest.element].map((kw) => (
              <span key={kw} className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-full px-2.5 py-0.5">{kw}</span>
            ))}
            <span className="text-xs bg-slate-50 text-slate-600 border border-slate-200 rounded-full px-2.5 py-0.5">{result.summary.yinYangMessage}</span>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="bg-amber-50 border border-amber-100 rounded-xl px-2 py-3 space-y-1 sm:px-4">
            <p className="text-xs font-medium text-gray-500">양력</p>
            <p className="text-sm font-semibold text-gray-900">{result.meta.solarDate}</p>
            <p className="text-xs text-gray-500">서양 별자리 · {result.meta.westernZodiac}</p>
            <p className="text-xs text-gray-500">입력 시간 · {result.meta.timeText}</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-xl px-2 py-3 space-y-1 sm:px-4">
            <p className="text-xs font-medium text-gray-500">음력</p>
            <p className="text-sm font-semibold text-gray-900">{result.pillars.year.name}년 · {result.meta.lunarDate}</p>
            {result.pillars.month?.isLeapMonth ? (
              <p className="text-xs text-rose-500">※ 윤달에 해당하는 날짜입니다.</p>
            ) : null}
            {!result.meta.hasTime ? (
              <p className="text-xs text-rose-500">※ 태어난 시간 입력 시 시주까지 확인할 수 있습니다.</p>
            ) : null}
          </div>
        </div>
        {luckyRange ? (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            길한 시간대 · {luckyRange}
          </p>
        ) : null}
      </div>

      {/* 사주 카드 */}
      <div className="grid gap-4 md:grid-cols-2">
        {(Object.entries(result.pillars) as Array<[PillarKey, Pillar | null]>).map(([key, pillar]) => {
          if (!pillar) return null
          return <PillarCard key={key} pillarKey={key} pillar={pillar} />
        })}
      </div>

      {/* 오행·음양 분포 */}
      <ElementDistribution
        elementBars={elementBars}
        strongestLabel={strongestLabel}
        weakestLabel={weakestLabel}
        yinYangMessage={result.summary.yinYangMessage}
      />

      {/* 심층 해석 */}
      <InterpretationSection interpretation={interpretation} />

      {/* 오행 보완 가이드 */}
      <SupplementGuide
        weakest={result.summary.weakest.element}
        strongest={result.summary.strongest.element}
      />

      {/* 실천 카드 */}
      <ActionCardDeck cards={actionCards} />

      {/* 활용 가이드 */}
      <div className="rounded-2xl border border-gray-100 bg-white/70 px-2 py-4 text-sm text-gray-600 leading-relaxed space-y-2 sm:px-5 sm:py-5">
        <p className="font-medium text-gray-800">
          <TooltipLabel text="활용 가이드" description="실제 상담 대신 참고용으로 본인의 흐름을 점검할 때 활용하세요." />
        </p>
        <p>사주팔자는 태어난 시점의 기운을 간단히 살펴보는 도구입니다. 절기, 대운, 세운 등 다양한 요소를 종합적으로 살펴야 하므로 중요한 결정 전에는 전문가 상담과 함께 확인해 보세요.</p>
        <p className="text-xs text-gray-500">※ 계산은 음력(중국력) 변환 결과를 기반으로 하며, 기기 환경에 따라 결과가 다소 달라질 수 있습니다.</p>
      </div>
    </div>
  )
}
