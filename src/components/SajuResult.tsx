import { JSX } from 'react'
import {
  BRANCH_YINYANG,
  CAREER_BY_ELEMENT,
  ELEMENT_LABELS,
  PILLAR_FOCUS,
  PILLAR_LABELS,
  RELATIONSHIP_BY_ANIMAL,
  STEM_YINYANG,
  type Element,
  type ElementBar,
  type InterpretationCategory,
  type Pillar,
  type PillarKey,
  type SajuResult
} from '../lib/saju'
import { TooltipLabel } from './TooltipLabel'
import { ActionCardDeck, type ActionCardData } from './ActionCards'

const ELEMENT_ACTION_DO: Record<Element, string> = {
  목: '새로운 아이디어를 적어 보거나 가벼운 스트레칭으로 몸을 깨워 확장 에너지를 움직여 보세요.',
  화: '짧은 발표·콘텐츠 작업처럼 열정을 쏟을 수 있는 일을 정해 추진력을 살려 보세요.',
  토: '공간 정리와 기록 정비로 안정감을 만들면 토 기운이 든든해집니다.',
  금: '중요한 자료를 분류하고 계획을 구조화하며 집중력을 발휘해 보세요.',
  수: '정보를 모으거나 글로 생각을 정리하며 유연한 흐름을 만들어 보세요.'
}

const ELEMENT_ACTION_AVOID: Record<Element, string> = {
  목: '즉흥적으로 계획을 바꾸기보다 정한 우선순위를 지켜 균형을 잡아보세요.',
  화: '감정이 과열될 때는 잠시 숨고르기 하며 급한 반응을 줄이세요.',
  토: '모든 책임을 혼자 떠안지 말고 나눌 부분이 있는지 살펴보세요.',
  금: '사소한 실수에 날카롭게 반응하기보다 한 번 더 여유를 두세요.',
  수: '생각만 반복하다 시간을 보내지 말고, 정한 마감과 휴식을 지켜 보세요.'
}

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
      <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
        {interpretation.map((item) => (
          <div key={item.key}>
            <p className="font-semibold text-gray-900">{item.title}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
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
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">SAJU INSIGHT</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">사주 풀이</h2>
          <p className="text-sm text-slate-600">{result.meta.solarDate} · {result.meta.genderLabel}</p>
        </div>
        <p className="text-sm leading-relaxed text-slate-700">{result.summary.yinYangMessage}</p>
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
