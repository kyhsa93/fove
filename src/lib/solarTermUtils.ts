import { SOLAR_TERMS, SOLAR_TERM_ORDER } from '../solarTerms'
import type { SolarTermName } from '../solarTerms'

const KST_OFFSET_MS = 9 * 60 * 60 * 1000

interface SolarTermInfo {
  name: string
  meaning: string
  element: string
  message: string
}

const SOLAR_TERM_INFO: Record<SolarTermName, SolarTermInfo> = {
  小寒: { name: '소한', meaning: '작은 추위', element: '수(水)', message: '한 해의 기운이 가장 차갑게 모이는 시기입니다. 내면을 돌아보고 봄을 준비하세요.' },
  立春: { name: '입춘', meaning: '봄의 시작', element: '목(木)', message: '목(木) 기운이 움트기 시작합니다. 새로운 계획을 세우고 시작하기 좋은 날입니다.' },
  驚蟄: { name: '경칩', meaning: '개구리가 깨는 날', element: '목(木)', message: '만물이 활동을 재개합니다. 미뤄뒀던 일을 행동으로 옮기기 좋은 시점입니다.' },
  清明: { name: '청명', meaning: '하늘이 맑아짐', element: '토(土)', message: '기운이 맑게 정돈되는 시기입니다. 주변을 정리하고 관계를 점검해 보세요.' },
  立夏: { name: '입하', meaning: '여름의 시작', element: '화(火)', message: '화(火) 기운이 본격적으로 타오릅니다. 열정을 쏟을 일에 집중하기 좋습니다.' },
  芒種: { name: '망종', meaning: '씨 뿌리는 시기', element: '화(火)', message: '노력한 것을 심고 키우는 시기입니다. 꾸준함이 가장 큰 힘이 됩니다.' },
  小暑: { name: '소서', meaning: '작은 더위', element: '토(土)', message: '기운이 전환되는 시기입니다. 체력을 보충하고 무리하지 않도록 주의하세요.' },
  立秋: { name: '입추', meaning: '가을의 시작', element: '금(金)', message: '금(金) 기운이 시작됩니다. 결실을 위한 집중과 마무리의 시기입니다.' },
  白露: { name: '백로', meaning: '이슬이 내림', element: '금(金)', message: '차분하게 성과를 점검할 때입니다. 목표를 다시 살피고 조율해 보세요.' },
  寒露: { name: '한로', meaning: '찬 이슬', element: '수(水)', message: '기운이 수(水)로 수렴됩니다. 지식을 쌓고 내면을 단단히 하기 좋은 시기입니다.' },
  立冬: { name: '입동', meaning: '겨울의 시작', element: '수(水)', message: '수(水) 기운이 시작됩니다. 에너지를 비축하고 내년을 위한 씨앗을 심으세요.' },
  大雪: { name: '대설', meaning: '큰 눈', element: '수(水)', message: '한 해의 끝에서 기운이 깊어집니다. 한 해를 돌아보고 감사를 나누기 좋습니다.' }
}

export interface TodaySolarTerm {
  nameKr: string
  meaning: string
  element: string
  message: string
  isExactDay: boolean
}

export function getTodaySolarTerm(referenceDate: Date = new Date()): TodaySolarTerm | null {
  const kst = new Date(referenceDate.getTime() + KST_OFFSET_MS)
  const year = kst.getUTCFullYear()

  for (const y of [year - 1, year, year + 1]) {
    const isos = SOLAR_TERMS[y]
    if (!isos) continue

    for (let i = 0; i < isos.length; i++) {
      const termDate = new Date(isos[i])
      const termKst = new Date(termDate.getTime() + KST_OFFSET_MS)

      const diffMs = kst.getTime() - termKst.getTime()
      const diffDays = diffMs / (1000 * 60 * 60 * 24)

      if (diffDays >= 0 && diffDays < 2) {
        const termName = SOLAR_TERM_ORDER[i]
        const info = SOLAR_TERM_INFO[termName]
        if (!info) continue
        return {
          nameKr: info.name,
          meaning: info.meaning,
          element: info.element,
          message: info.message,
          isExactDay: diffDays < 1
        }
      }
    }
  }

  return null
}
