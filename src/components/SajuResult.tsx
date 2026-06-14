import { JSX, useCallback } from 'react'
import {
  BRANCH_YINYANG,
  CAREER_BY_ELEMENT,
  ELEMENT_ACTION_AVOID,
  ELEMENT_ACTION_DO,
  ELEMENT_KEYWORDS,
  ELEMENT_LABELS,
  ELEMENT_CONTROLS,
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


// ── 원국표 스타일 상수 ────────────────────────────────────────────────────────
const ELEMENT_CELL_BG: Record<Element, string> = {
  목: 'bg-emerald-50 border-emerald-200',
  화: 'bg-rose-50 border-rose-200',
  토: 'bg-amber-50 border-amber-200',
  금: 'bg-slate-100 border-slate-200',
  수: 'bg-sky-50 border-sky-200',
}

const ELEMENT_CHAR_COLOR: Record<Element, string> = {
  목: 'text-emerald-700',
  화: 'text-rose-600',
  토: 'text-amber-700',
  금: 'text-slate-600',
  수: 'text-sky-700',
}

const PILLAR_ONELINER: Record<PillarKey, Record<Element, string>> = {
  year: {
    목: '성장 지향적 환경이 추진력과 도전 정신을 키워줬을 거예요.',
    화: '활기차고 표현이 풍부한 분위기가 기질 형성에 영향을 줬을 거예요.',
    토: '안정적이고 실용적인 환경이 든든한 삶의 기반이 됐을 거예요.',
    금: '원칙과 기준이 명확한 환경에서 자라 책임감이 강해졌을 거예요.',
    수: '변화 많은 초년이 자연스럽게 뛰어난 적응력을 길러줬어요.',
  },
  month: {
    목: '직업·사회활동에서 주도적인 역할을 맡는 경향이 두드러져요.',
    화: '열정과 표현력을 발휘할 때 직업적으로 가장 빛나는 타입이에요.',
    토: '꾸준하고 실용적인 방식으로 사회적 신뢰를 쌓아가는 흐름이에요.',
    금: '전문성과 원칙을 바탕으로 실력으로 인정받는 직업 흐름이에요.',
    수: '유연한 사고와 정보 감각으로 다양한 분야를 아우를 수 있어요.',
  },
  day: {
    목: '내면은 성장과 도전을 즐기며, 관계에서도 주도성을 선호하는 타입이에요.',
    화: '열정적이고 직관적인 성품으로 주변에 에너지를 전파해요.',
    토: '현실적이고 균형 잡힌 성품으로 신뢰받는 존재가 되는 타입이에요.',
    금: '예리하고 분석적이며 원칙을 중시하는 성품을 지녔어요.',
    수: '깊은 통찰력과 감수성으로 변화에 유연하게 반응하는 타입이에요.',
  },
  hour: {
    목: '말년에 새로운 도전과 성장의 기회가 이어질 가능성이 높아요.',
    화: '자녀·후배와의 따뜻하고 활기찬 인연이 기대되는 기운이에요.',
    토: '안정과 여유를 누릴 수 있는 말년 기운이 흘러요.',
    금: '원칙 있는 삶의 결실이 말년에 드러날 흐름이에요.',
    수: '지혜롭고 감각적인 말년을 보낼 수 있는 기운이 있어요.',
  },
}

// ── 십신(十神) 계산 ─────────────────────────────────────────────────────────
const TEN_GOD_LABEL: Record<string, string> = {
  '일간': '일간',
  '비견': '비견', '겁재': '겁재',
  '식신': '식신', '상관': '상관',
  '편재': '편재', '정재': '정재',
  '편관': '편관', '정관': '정관',
  '편인': '편인', '정인': '정인',
}

const TEN_GOD_DESC: Record<string, string> = {
  일간: '나 자신·주체·사주의 기준점',
  비견: '자아·독립·경쟁심',
  겁재: '야망·도전·재물 기복',
  식신: '표현력·창의·식복',
  상관: '재능·반항·기획력',
  편재: '사업·변동·재물 추구',
  정재: '안정 수입·근면·현실감',
  편관: '권위·극복·도전',
  정관: '규범·명예·안정',
  편인: '학문·직관·독립심',
  정인: '지혜·학습·보호',
}

const TEN_GOD_COLOR: Record<string, string> = {
  일간: 'bg-amber-100 border-amber-300 text-amber-800',
  비견: 'bg-amber-50 border-amber-200 text-amber-800',
  겁재: 'bg-orange-50 border-orange-200 text-orange-800',
  식신: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  상관: 'bg-teal-50 border-teal-200 text-teal-800',
  편재: 'bg-blue-50 border-blue-200 text-blue-800',
  정재: 'bg-sky-50 border-sky-200 text-sky-800',
  편관: 'bg-rose-50 border-rose-200 text-rose-800',
  정관: 'bg-pink-50 border-pink-200 text-pink-800',
  편인: 'bg-violet-50 border-violet-200 text-violet-800',
  정인: 'bg-indigo-50 border-indigo-200 text-indigo-800',
}

import type { YinYang } from '../lib/saju'

function getTenGod(
  dayEl: Element, dayYY: YinYang,
  targetEl: Element, targetYY: YinYang
): string {
  const same = dayYY === targetYY
  if (dayEl === targetEl) return same ? '비견' : '겁재'
  if (ELEMENT_PRODUCES[dayEl] === targetEl) return same ? '식신' : '상관'
  if (ELEMENT_PRODUCES[targetEl] === dayEl) return same ? '편인' : '정인'
  if (ELEMENT_CONTROLS[dayEl] === targetEl) return same ? '편재' : '정재'
  if (ELEMENT_CONTROLS[targetEl] === dayEl) return same ? '편관' : '정관'
  return '-'
}

// ── 사주 원국표 ───────────────────────────────────────────────────────────────
function OriginChart({ result }: { result: SajuResult }): JSX.Element {
  const KEYS: PillarKey[] = ['year', 'month', 'day', 'hour']
  const dayPillar = result.pillars.day
  const dayEl = dayPillar.stemElement
  const dayYY = STEM_YINYANG[dayPillar.stem]

  return (
    <div className="bg-white/90 border border-amber-100 rounded-2xl shadow-sm px-2 py-4 space-y-5 sm:px-6 sm:py-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">사주 원국표 <span className="text-sm font-normal text-gray-400">(四柱原局表)</span></h2>
        <p className="text-xs text-gray-500 mt-0.5">태어난 연·월·일·시의 기운을 팔자(八字)로 나타낸 원국입니다. 위 칸은 천간(天干·겉 성향), 아래 칸은 지지(地支·내면)입니다.</p>
      </div>

      {/* 원국 그리드 */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {KEYS.map((key) => {
          const pillar = result.pillars[key]

          if (!pillar) {
            return (
              <div key={key} className="flex flex-col items-center gap-1 text-center">
                <p className="text-[10px] font-bold text-slate-500">{PILLAR_LABELS[key]}</p>
                <p className="text-[9px] text-slate-400">{PILLAR_FOCUS[key]}</p>
                <div className="w-full rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-5 mt-1 opacity-50">
                  <p className="text-[10px] text-slate-400">시간 미입력</p>
                </div>
              </div>
            )
          }

          const isDay = key === 'day'
          const stemTG = isDay ? null : getTenGod(dayEl, dayYY, pillar.stemElement, STEM_YINYANG[pillar.stem])
          const branchTG = getTenGod(dayEl, dayYY, pillar.branchElement, BRANCH_YINYANG[pillar.branch])

          return (
            <div key={key} className="flex flex-col items-center gap-0.5 text-center">
              <p className="text-[10px] font-bold text-slate-600">{PILLAR_LABELS[key]}</p>
              <p className="text-[9px] text-slate-400 leading-tight">{PILLAR_FOCUS[key]}</p>

              {/* 천간 */}
              <div className={`w-full mt-1.5 rounded-t-xl border px-1 py-3 ${ELEMENT_CELL_BG[pillar.stemElement]}`}>
                <p className="text-[9px] font-semibold text-slate-500 min-h-[13px]">
                  {isDay ? '일간(日干)' : (stemTG && stemTG !== '-' ? stemTG : '')}
                </p>
                <p className={`text-3xl font-bold leading-tight mt-0.5 ${ELEMENT_CHAR_COLOR[pillar.stemElement]}`}>{pillar.stem}</p>
                <p className="text-[9px] text-slate-400 mt-1">{STEM_YINYANG[pillar.stem]}·{ELEMENT_LABELS[pillar.stemElement]}</p>
              </div>

              {/* 구분 */}
              <div className="w-full h-[3px] bg-white" />

              {/* 지지 */}
              <div className={`w-full rounded-b-xl border-x border-b px-1 py-3 ${ELEMENT_CELL_BG[pillar.branchElement]}`}>
                <p className={`text-3xl font-bold leading-tight ${ELEMENT_CHAR_COLOR[pillar.branchElement]}`}>{pillar.branch}</p>
                <p className="text-[9px] text-slate-400 mt-1">{BRANCH_YINYANG[pillar.branch]}·{ELEMENT_LABELS[pillar.branchElement]}</p>
                <p className="text-[9px] font-semibold text-slate-500 min-h-[13px] mt-0.5">
                  {branchTG && branchTG !== '-' ? branchTG : ''}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* 오행 색상 범례 */}
      <div className="flex flex-wrap gap-1.5">
        {(['목', '화', '토', '금', '수'] as Element[]).map((el) => (
          <span key={el} className={`text-[10px] font-semibold rounded-full border px-2 py-0.5 ${ELEMENT_CELL_BG[el]} ${ELEMENT_CHAR_COLOR[el]}`}>
            {ELEMENT_LABELS[el]}
          </span>
        ))}
        <span className="text-[10px] text-slate-400 self-center ml-1">— 칸 색상은 오행을 나타내요</span>
      </div>

      {/* 기둥별 한 줄 해설 */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">기둥별 한 줄 해설</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {KEYS.map((key) => {
            const pillar = result.pillars[key]
            const oneliner = pillar ? PILLAR_ONELINER[key][pillar.stemElement] : null
            return (
              <div key={key} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-slate-700">{PILLAR_LABELS[key]}</span>
                  <span className="text-[10px] text-slate-400">{PILLAR_FOCUS[key]}</span>
                  {pillar && (
                    <span className={`ml-auto text-[10px] font-semibold rounded-full border px-1.5 py-0.5 ${ELEMENT_CELL_BG[pillar.stemElement]} ${ELEMENT_CHAR_COLOR[pillar.stemElement]}`}>
                      {pillar.stem}·{ELEMENT_LABELS[pillar.stemElement]}
                    </span>
                  )}
                </div>
                {pillar ? (
                  <p className="text-xs text-slate-600 leading-relaxed">{oneliner}</p>
                ) : (
                  <p className="text-xs text-slate-400">태어난 시간을 입력하면 시주 해설을 확인할 수 있어요.</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 읽는 법 안내 */}
      <details>
        <summary className="cursor-pointer text-xs font-semibold text-amber-700 hover:text-amber-800 select-none">원국표·십신 읽는 법 ▾</summary>
        <div className="mt-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-3 text-xs text-amber-800 space-y-1.5">
          <p><strong>천간(天干)·위 칸</strong> — 겉으로 드러나는 성향과 행동 스타일을 나타냅니다.</p>
          <p><strong>지지(地支)·아래 칸</strong> — 내면의 성향과 실제 생활 패턴을 나타냅니다.</p>
          <p><strong>기둥 순서</strong> — 연주(조상·초년) → 월주(부모·청년) → 일주(본성·배우자) → 시주(자녀·말년)</p>
          <p><strong>십신(十神)</strong> — 일주 천간(일간)을 기준으로 각 글자가 나에게 어떤 역할을 하는지 분류한 것입니다. 비견·겁재(나와 비슷한 기운), 식신·상관(내가 생하는 기운), 편재·정재(내가 극하는 기운), 편관·정관(나를 극하는 기운), 편인·정인(나를 생하는 기운)으로 나뉩니다.</p>
        </div>
      </details>
    </div>
  )
}

function EightCharsGrid({ result }: { result: SajuResult }): JSX.Element {
  const dayPillar = result.pillars.day
  const dayEl = dayPillar.stemElement
  const dayYY = STEM_YINYANG[dayPillar.stem]

  const PILLAR_KEYS: Array<'year' | 'month' | 'day' | 'hour'> = ['year', 'month', 'day', 'hour']
  const pillars = PILLAR_KEYS.map((k) => result.pillars[k])

  // 십신 (일간 기준, 일주는 '-')
  const stemTenGods = pillars.map((p, i) => {
    if (!p) return null
    if (i === 2) return null // 일간은 자기 자신
    return getTenGod(dayEl, dayYY, p.stemElement, STEM_YINYANG[p.stem])
  })
  const branchTenGods = pillars.map((p) => {
    if (!p) return null
    return getTenGod(dayEl, dayYY, p.branchElement, BRANCH_YINYANG[p.branch])
  })

  return (
    <div className="bg-white/90 border border-slate-100 rounded-2xl shadow-sm px-2 py-4 space-y-4 sm:px-6 sm:py-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">심화 사주 — 8글자 일람</h2>
        <p className="text-xs text-gray-500 mt-0.5">일간(일주 천간)을 기준으로 각 글자의 십신(十神)을 표시해요.</p>
      </div>

      {/* 8글자 그리드 */}
      <div className="grid grid-cols-4 gap-2">
        {PILLAR_KEYS.map((key, i) => {
          const p = pillars[i]
          if (!p) {
            return (
              <div key={key} className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-2 text-center space-y-3 opacity-40">
                <p className="text-[10px] text-slate-400">{key === 'hour' ? '시주' : '—'}</p>
                <p className="text-xs text-slate-300">미입력</p>
              </div>
            )
          }

          const stemTG = stemTenGods[i]
          const branchTG = branchTenGods[i]

          return (
            <div key={key} className="rounded-xl border border-slate-100 bg-white p-2 text-center space-y-1.5">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{PILLAR_LABELS[key]}</p>

              {/* 천간 */}
              <div className="space-y-0.5">
                {stemTG && stemTG !== '-' ? (
                  <span className={`inline-block text-[9px] font-bold rounded-full border px-1.5 py-0.5 ${TEN_GOD_COLOR[stemTG] ?? 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    {stemTG}
                  </span>
                ) : i === 2 ? (
                  <span className="inline-block text-[9px] font-bold rounded-full border px-1.5 py-0.5 bg-amber-100 border-amber-300 text-amber-800">일간</span>
                ) : null}
                <p className="text-xl font-bold text-slate-900">{p.stem}</p>
                <p className="text-[10px] text-slate-400">{STEM_YINYANG[p.stem]}·{ELEMENT_LABELS[p.stemElement]}</p>
              </div>

              <div className="h-px bg-slate-100" />

              {/* 지지 */}
              <div className="space-y-0.5">
                {branchTG && branchTG !== '-' ? (
                  <span className={`inline-block text-[9px] font-bold rounded-full border px-1.5 py-0.5 ${TEN_GOD_COLOR[branchTG] ?? 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    {branchTG}
                  </span>
                ) : null}
                <p className="text-xl font-bold text-slate-900">{p.branch}</p>
                <p className="text-[10px] text-slate-400">{BRANCH_YINYANG[p.branch]}·{ELEMENT_LABELS[p.branchElement]}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* 일간 설명 */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 space-y-1">
        <p className="text-xs font-bold text-amber-800">일간(日干)이란?</p>
        <p className="text-[11px] text-amber-700 leading-relaxed">
          일간은 태어난 날의 천간(天干)으로, 사주에서 <strong>나 자신</strong>을 뜻합니다.
          십신(十神)은 모두 일간을 기준으로 나머지 7글자가 나와 어떤 관계인지를 나타내는 분류입니다.
          일주(日柱) 천간 칸에 십신 대신 <span className="font-semibold">일간</span>이 표시되는 이유가 바로 이 때문입니다.
        </p>
      </div>

      {/* 십신 범례 */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500">십신(十神) 해설</p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
          {Object.entries(TEN_GOD_DESC).filter(([tg]) => tg !== '일간').map(([tg, desc]) => (
            <div key={tg} className={`rounded-lg border px-2 py-1.5 text-center ${TEN_GOD_COLOR[tg]}`}>
              <p className="text-xs font-bold">{TEN_GOD_LABEL[tg]}</p>
              <p className="text-[10px] opacity-70 leading-tight">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
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
      `나의 사주를 확인해보세요: ${typeof window !== 'undefined' ? window.location.origin : ''}/saju`
    ].join('\n')

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Fove 사주 풀이', text, url: `${typeof window !== 'undefined' ? window.location.origin : ''}/saju` })
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

      {/* 사주 원국표 + 기둥별 한 줄 해설 */}
      <OriginChart result={result} />

      {/* 사주 카드 */}
      <div className="grid gap-4 md:grid-cols-2">
        {(Object.entries(result.pillars) as Array<[PillarKey, Pillar | null]>).map(([key, pillar]) => {
          if (!pillar) return null
          return <PillarCard key={key} pillarKey={key} pillar={pillar} />
        })}
      </div>

      {/* 심화 사주 — 8글자 십신 */}
      <EightCharsGrid result={result} />

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
