import type {
  Branch,
  Element,
  Gender,
  Stem,
  YinYang
} from './constants'
import { BRANCH_ANIMALS } from './constants'
import type { SolarTermName } from '../../solarTerms'

export interface DateParts {
  lunarMonth: number
  lunarDay: number
  relatedYear: number | null
  monthLabel: string | null
  dayLabel: string | null
  yearName: string
  isLeapMonth: boolean
}

export interface HourInfo {
  stem: Stem
  branch: Branch
  range: string
}

export type PillarExtras = Partial<{
  focus: string
  lunarMonth: number
  isLeapMonth: boolean
  monthLabel: string | null
  range: string
}>

export interface Pillar extends PillarExtras {
  stem: Stem
  branch: Branch
  name: string
  stemElement: Element
  branchElement: Element
  stemYinYang: YinYang
  branchYinYang: YinYang
  animal: (typeof BRANCH_ANIMALS)[Branch]
}

export interface SummaryElement {
  element: Element
  count: number
}

export interface Summary {
  elementCounts: Record<Element, number>
  yinYangCounts: Record<YinYang, number>
  strongest: SummaryElement
  weakest: SummaryElement
  yinYangMessage: string
  elementsArray: SummaryElement[]
  totalElements: number
}

export interface SajuMeta {
  solarDate: string
  lunarDate: string
  lunarRelatedYear: number | null
  westernZodiac: string
  hasTime: boolean
  timeText: string
  gender: Gender
  genderLabel: string
}

export interface Pillars {
  year: Pillar
  month: Pillar
  day: Pillar
  hour: Pillar | null
}

export interface SajuResult {
  pillars: Pillars
  summary: Summary
  meta: SajuMeta
}

export interface ElementBar {
  element: Element
  label: string
  count: number
  ratio: number
}

export interface InterpretationCategory {
  key: string
  title: string
  description: string
}

export interface DailyFortune {
  dateLabel: string
  pillarName: string
  elementLabel: string
  yinYang: YinYang
  energyText: string
  actionText: string
  cautionText: string
}

export interface YearPillarInfo {
  year: number
  stem: Stem
  branch: Branch
  stemIndex: number
  branchIndex: number
}

export interface MonthBoundaryInfo {
  term: SolarTermName
  branch: Branch
  monthIndex: number
}
