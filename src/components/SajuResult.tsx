import {
  BRANCH_YINYANG,
  ELEMENT_LABELS,
  PILLAR_FOCUS,
  PILLAR_LABELS,
  STEM_YINYANG,
  recommendLottoNumbers,
  type DailyFortune,
  type ElementBar,
  type InterpretationCategory,
  type Pillar,
  type PillarKey,
  type SajuResult
} from '../lib/saju'

interface PillarCardProps {
  pillarKey: PillarKey
  pillar: Pillar
}

function PillarCard({ pillarKey, pillar }: PillarCardProps): JSX.Element {
  const focusText = pillar.focus ?? PILLAR_FOCUS[pillarKey]
  const monthText = pillar.monthLabel ?? (pillar.lunarMonth ? `${pillar.lunarMonth}월` : '-')

  return (
    <article className="bg-white/90 border border-gray-100 rounded-2xl shadow-sm p-5 space-y-3">
      <header className="flex items-baseline justify-between">
        <h3 className="text-md font-semibold text-gray-900">{PILLAR_LABELS[pillarKey]}</h3>
        <span className="text-xs text-gray-500">{focusText}</span>
      </header>
      <p className="text-2xl font-bold text-gray-900 tracking-wide">{pillar.name}</p>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
        <div>
          <dt className="text-gray-500">천간</dt>
          <dd className="font-medium">{pillar.stem} ({STEM_YINYANG[pillar.stem]}·{ELEMENT_LABELS[pillar.stemElement]})</dd>
        </div>
        <div>
          <dt className="text-gray-500">지지</dt>
          <dd className="font-medium">{pillar.branch} ({BRANCH_YINYANG[pillar.branch]}·{ELEMENT_LABELS[pillar.branchElement]})</dd>
        </div>
        <div>
          <dt className="text-gray-500">띠</dt>
          <dd className="font-medium">{pillar.animal}</dd>
        </div>
        {pillar.range ? (
          <div>
            <dt className="text-gray-500">시각대</dt>
            <dd className="font-medium">{pillar.range}</dd>
          </div>
        ) : pillarKey === 'month' ? (
          <div>
            <dt className="text-gray-500">음력월</dt>
            <dd className="font-medium">{monthText}</dd>
          </div>
        ) : (
          <div>
            <dt className="text-gray-500">중요성</dt>
            <dd className="font-medium">{focusText}</dd>
          </div>
        )}
      </dl>
    </article>
  )
}

interface DailyFortuneCardProps {
  dailyFortune: DailyFortune
  result: SajuResult
}

function DailyFortuneCard({ dailyFortune, result }: DailyFortuneCardProps): JSX.Element {
  const lucky = recommendLottoNumbers(result, dailyFortune)
  const strongestElement = result.summary.strongest.element

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
            <p>{dailyFortune.energyText}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-rose-600 tracking-wide">ACTION</p>
            <p>{dailyFortune.actionText}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-600 tracking-wide">CARE</p>
            <p>{dailyFortune.cautionText}</p>
          </div>
        </div>
      </div>
      <div className="bg-white/80 border border-amber-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Lucky Lotto</p>
          <p className="text-xs text-gray-500">오늘의 기운을 바탕으로 추천된 번호입니다.</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {lucky.numbers.map((num) => (
            <span
              key={num}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-200 to-rose-200 text-gray-900 font-semibold shadow-sm"
            >
              {num}
            </span>
          ))}
        </div>
        <p className="text-xs text-center text-gray-600">
          보너스 번호 <span className="font-semibold text-rose-500">{lucky.bonus}</span>
        </p>
        <div className="text-xs text-gray-600 space-y-1.5">
          <p className="font-semibold text-gray-700">추천 이유</p>
          <p>
            {dailyFortune.pillarName} ({dailyFortune.yinYang}·{dailyFortune.elementLabel}) 일진과 당신 사주의 가장 강한
            {` ${strongestElement} `}기운을 조합해 상승 흐름을 끌어올릴 수 있는 조합으로 골랐어요.
          </p>
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
    </div>
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
    <div className="bg-white/90 border border-amber-100 rounded-2xl shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">오행 · 음양 분포</h2>
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
        <p>강한 오행: {strongestLabel}</p>
        <p>부족한 오행: {weakestLabel}</p>
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
    <div className="bg-white/90 border border-slate-100 rounded-2xl shadow-sm p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">심층 해석</h2>
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
  result: SajuResult
  elementBars: ElementBar[]
  interpretation: InterpretationCategory[]
  dailyFortune: DailyFortune | null
}

export function SajuResult({ result, elementBars, interpretation, dailyFortune }: SajuResultProps): JSX.Element {
  const strongestLabel = `${result.summary.strongest.element} (${result.summary.strongest.count}개)`
  const weakestLabel = `${result.summary.weakest.element} (${result.summary.weakest.count}개)`

  return (
    <section className="space-y-6">
      <div className="bg-white/90 border border-amber-100 rounded-2xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">기본 해석</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-2">
            <p className="text-sm text-gray-600">양력 기준</p>
            <p className="text-base font-semibold text-gray-900">{result.meta.solarDate}</p>
            <p className="text-sm text-gray-600">서양 별자리: {result.meta.westernZodiac}</p>
            <p className="text-sm text-gray-600">입력한 시간: {result.meta.timeText}</p>
            <p className="text-sm text-gray-600">성별: {result.meta.genderLabel}</p>
          </div>
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 space-y-2">
            <p className="text-sm text-gray-600">음력 기준</p>
            <p className="text-base font-semibold text-gray-900">{result.pillars.year.name}년 ({result.meta.lunarDate})</p>
            {result.pillars.month?.isLeapMonth ? (
              <p className="text-xs text-rose-500">※ 윤달에 해당하는 날짜입니다.</p>
            ) : null}
            {!result.meta.hasTime ? (
              <p className="text-xs text-rose-500">※ 태어난 시간을 입력하면 시주까지 확인할 수 있습니다.</p>
            ) : null}
          </div>
        </div>
      </div>

      {dailyFortune ? <DailyFortuneCard dailyFortune={dailyFortune} result={result} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        {(Object.entries(result.pillars) as Array<[PillarKey, Pillar | null]>).map(([key, pillar]) => {
          if (!pillar) return null
          return <PillarCard key={key} pillarKey={key} pillar={pillar} />
        })}
      </div>

      <ElementDistribution
        elementBars={elementBars}
        strongestLabel={strongestLabel}
        weakestLabel={weakestLabel}
        yinYangMessage={result.summary.yinYangMessage}
      />

      <InterpretationSection interpretation={interpretation} />

      <div className="bg-white/70 border border-gray-100 rounded-2xl p-5 text-sm text-gray-600 leading-relaxed">
        <p className="font-medium text-gray-800">활용 가이드</p>
        <p>
          사주팔자는 태어난 시점의 기운을 간단히 살펴보는 도구입니다. 실제 상담에서는 절기, 대운, 세운 등 다양한 요소를 함께 고려하므로 참고용으로 활용해 주세요.
        </p>
        <p className="mt-2 text-xs text-gray-500">※ 계산은 음력(중국력) 변환 결과를 기반으로 하며, 기기 환경에 따라 결과가 다소 달라질 수 있습니다.</p>
      </div>
    </section>
  )
}
