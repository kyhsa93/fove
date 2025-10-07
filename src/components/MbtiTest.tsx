import { JSX, useEffect, useMemo, useRef, useState } from 'react'
import { ResultCard } from './ResultCard'
import { useResultHistory } from '../hooks/useResultHistory'
import { useToast } from './ToastProvider'
import { ActionCardDeck, type ActionCardData } from './ActionCards'
import { TooltipLabel } from './TooltipLabel'

export type Dimension = 'EI' | 'SN' | 'TF' | 'JP'
export type MbtiLetter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'
export type MbtiType = `${'E' | 'I'}${'S' | 'N'}${'T' | 'F'}${'J' | 'P'}`
export type ResponseValue = -2 | -1 | 0 | 1 | 2

interface MbtiQuestion {
  id: string
  dimension: Dimension
  prompt: string
  options: Array<{ label: string; detail: string; value: ResponseValue }>
}

const DIMENSION_PAIRS: Record<Dimension, [MbtiLetter, MbtiLetter]> = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P']
}

const DIMENSION_LABEL: Record<Dimension, string> = {
  EI: '에너지 방향 (외향-내향)',
  SN: '정보 수집 (감각-직관)',
  TF: '판단 기준 (사고-감정)',
  JP: '생활 양식 (계획-유연)'
}

const DIMENSION_SHORT_LABEL: Record<MbtiLetter, string> = {
  E: 'E (외향)',
  I: 'I (내향)',
  S: 'S (감각)',
  N: 'N (직관)',
  T: 'T (사고)',
  F: 'F (감정)',
  J: 'J (계획)',
  P: 'P (유연)'
}

const MBTI_STORAGE_KEY = 'fove:mbti-answers'
const RESPONSE_VALUES: ResponseValue[] = [-2, -1, 0, 1, 2]

const loadPersistedAnswers = (): Record<string, ResponseValue> => {
  if (typeof window === 'undefined') {
    return {}
  }

  try {
    const raw = window.localStorage.getItem(MBTI_STORAGE_KEY)
    if (!raw) return {}

    const parsed = JSON.parse(raw) as Record<string, unknown>
    return Object.entries(parsed).reduce<Record<string, ResponseValue>>((acc, [key, value]) => {
      if (typeof value === 'number' && RESPONSE_VALUES.includes(value as ResponseValue)) {
        acc[key] = value as ResponseValue
      }
      return acc
    }, {})
  } catch (error) {
    console.warn('Failed to load saved MBTI answers:', error)
    return {}
  }
}

const buildRandomAnswers = (): Record<string, ResponseValue> => {
  return QUESTIONS.reduce<Record<string, ResponseValue>>((acc, question) => {
    const randomIndex = Math.floor(Math.random() * RESPONSE_VALUES.length)
    acc[question.id] = RESPONSE_VALUES[randomIndex]
    return acc
  }, {})
}

export interface MbtiSummary {
  title: string
  description: string
  strengths: string[]
  cautions: string[]
}

const QUESTIONS: MbtiQuestion[] = [
  {
    id: 'q1',
    dimension: 'EI',
    prompt: '새로운 모임에서 가장 편안한 위치는 어디인가요?',
    options: [
      { label: '에너지 넘치는 중심', detail: '자연스럽게 대화를 주도하며 사람들을 연결한다', value: 2 },
      { label: '적극적으로 어울리는 편', detail: '대화에 잘 섞이며 다양한 사람과 이야기 나눈다', value: 1 },
      { label: '상황을 봐가며 참여', detail: '필요할 때 이야기하고 과도하게 나서지는 않는다', value: 0 },
      { label: '가까운 사람과 조용히', detail: '믿음이 가는 소수와 깊이 있는 대화를 나눈다', value: -1 },
      { label: '관찰하며 천천히 적응', detail: '분위기를 살피고 자연스럽게 끼어들 기회를 기다린다', value: -2 }
    ]
  },
  {
    id: 'q2',
    dimension: 'EI',
    prompt: '긴 하루를 보낸 뒤, 에너지를 가장 잘 회복하는 방법은?',
    options: [
      { label: '새로운 활동 찾기', detail: '즐거운 이벤트나 모임을 계획하며 기운을 충전한다', value: 2 },
      { label: '친구와 수다 떨기', detail: '가까운 사람들과 만나 이야기를 나누며 스트레스를 푼다', value: 1 },
      { label: '상황에 따라 유동적', detail: '혼자 혹은 함께, 그날의 컨디션에 맞춘다', value: 0 },
      { label: '혼자만의 힐링', detail: '조용한 공간에서 좋아하는 취미를 즐긴다', value: -1 },
      { label: '완전한 고독', detail: '연락을 최소화하고 생각을 정리할 시간을 확보한다', value: -2 }
    ]
  },
  {
    id: 'q3',
    dimension: 'EI',
    prompt: '새로운 아이디어를 발견했을 때의 반응은?',
    options: [
      { label: '즉시 공유', detail: '곧바로 주변에 알리고 함께 실험해 본다', value: 2 },
      { label: '빠른 토론', detail: '몇몇 지인에게 의견을 물으며 아이디어를 다듬는다', value: 1 },
      { label: '일단 정리', detail: '핵심만 정리해 두고 상황을 지켜본다', value: 0 },
      { label: '조용한 분석', detail: '혼자 충분히 검토한 뒤 필요하면 공유한다', value: -1 },
      { label: '개인 기록', detail: '일기나 메모 등 개인적인 공간에 담아둔다', value: -2 }
    ]
  },
  {
    id: 'q4',
    dimension: 'EI',
    prompt: '새로운 팀에 합류했을 때 스스로를 어떻게 소개하나요?',
    options: [
      { label: '밝은 첫인사', detail: '가볍게 농담도 건네며 분위기를 빠르게 띄운다', value: 2 },
      { label: '대화 주도', detail: '먼저 질문을 던지며 서로 알아가는 시간을 만든다', value: 1 },
      { label: '필요한 만큼', detail: '업무와 관련된 정보 위주로 차분히 소개한다', value: 0 },
      { label: '선 관찰 후 대화', detail: '구성원을 살핀 뒤 자연스러운 타이밍을 기다린다', value: -1 },
      { label: '간결한 소개', detail: '최소한의 정보만 전하고 상황에 익숙해질 시간을 갖는다', value: -2 }
    ]
  },
  {
    id: 'q5',
    dimension: 'SN',
    prompt: '새로운 프로젝트를 시작할 때 가장 먼저 떠올리는 것은?',
    options: [
      { label: '구체적인 실행 리스트', detail: '필요한 자원과 일정부터 세부적으로 정리한다', value: 2 },
      { label: '현실적인 체크포인트', detail: '무엇이 가능한지, 위험 요소는 무엇인지 파악한다', value: 1 },
      { label: '전체 그림 확인', detail: '목표와 과정, 리스크를 균형 있게 바라본다', value: 0 },
      { label: '새로운 가능성 탐색', detail: '기존과 다른 방식으로 접근할 아이디어를 구상한다', value: -1 },
      { label: '큰 비전 상상', detail: '장기적인 영향과 확장성을 먼저 그림으로 그린다', value: -2 }
    ]
  },
  {
    id: 'q6',
    dimension: 'SN',
    prompt: '정보를 이해할 때 더 신뢰하는 방식은?',
    options: [
      { label: '눈으로 확인된 사실', detail: '데이터와 증거가 분명할 때 가장 안심한다', value: 2 },
      { label: '경험에서 나온 패턴', detail: '이미 겪어본 사례를 통해 판단한다', value: 1 },
      { label: '상황에 따른 선택', detail: '사실과 가능성을 균형 있게 고려한다', value: 0 },
      { label: '가능성의 흐름', detail: '눈앞의 사실보다는 다음 단계로 이어질 변화를 상상한다', value: -1 },
      { label: '미래의 시나리오', detail: '지금은 보이지 않아도 확장될 방향을 중시한다', value: -2 }
    ]
  },
  {
    id: 'q7',
    dimension: 'SN',
    prompt: '회의에서 나온 추상적인 아이디어를 들었을 때의 반응은?',
    options: [
      { label: '현실성 검증', detail: '예산과 일정 등 실행 가능성을 즉시 따져본다', value: 2 },
      { label: '사례 찾기', detail: '과거 유사한 경험이나 벤치마킹 자료를 조사한다', value: 1 },
      { label: '균형 잡힌 논의', detail: '아이디어와 실행력을 모두 고려해 의견을 보탠다', value: 0 },
      { label: '확장 아이디어 제시', detail: '아이디어가 발전할 새로운 방향을 상상한다', value: -1 },
      { label: '미래 가치 강조', detail: '장기적 파급력과 혁신 가능성을 중심으로 이야기한다', value: -2 }
    ]
  },
  {
    id: 'q8',
    dimension: 'SN',
    prompt: '새로운 기술을 배울 때의 접근법은?',
    options: [
      { label: '매뉴얼부터 숙지', detail: '기본 규칙과 사용 방법을 꼼꼼히 익힌다', value: 2 },
      { label: '실습과 반복', detail: '직접 사용하며 몸으로 익히는 편이다', value: 1 },
      { label: '필요한 부분만 선별', detail: '현재 상황에 맞춰 필요한 만큼 학습한다', value: 0 },
      { label: '실험적인 활용', detail: '새로운 방식으로 응용하면서 이해한다', value: -1 },
      { label: '원리 파악', detail: '동작 원리와 미래 응용 가능성을 먼저 탐구한다', value: -2 }
    ]
  },
  {
    id: 'q9',
    dimension: 'TF',
    prompt: '팀 갈등 상황에서 먼저 떠올리는 해결책은?',
    options: [
      { label: '명확한 기준 제시', detail: '규칙과 목표를 다시 확인하며 판단한다', value: 2 },
      { label: '논리적 설득', detail: '객관적인 근거로 설득을 시도한다', value: 1 },
      { label: '상황별 조율', detail: '사실과 감정을 모두 고려해 해결책을 찾는다', value: 0 },
      { label: '감정 케어', detail: '각자의 감정을 우선적으로 이해하고 다독인다', value: -1 },
      { label: '공감과 화해', detail: '분위기를 부드럽게 만들며 신뢰 회복을 돕는다', value: -2 }
    ]
  },
  {
    id: 'q10',
    dimension: 'TF',
    prompt: '중요한 결정을 내릴 때 가장 믿는 것은?',
    options: [
      { label: '원칙과 사실', detail: '객관적인 데이터와 논리 구조가 탄탄한 근거', value: 2 },
      { label: '장단점 분석', detail: '이성적으로 비교하며 최선의 선택을 찾는다', value: 1 },
      { label: '상황에 따른 균형', detail: '논리와 감정을 모두 검토한다', value: 0 },
      { label: '사람들의 감정', detail: '관련된 사람들이 느낄 감정과 관계를 고려한다', value: -1 },
      { label: '조화로운 분위기', detail: '모두가 편안하고 만족할 선택을 중시한다', value: -2 }
    ]
  },
  {
    id: 'q11',
    dimension: 'TF',
    prompt: '피드백을 줄 때 어떤 방식이 더 자연스러운가요?',
    options: [
      { label: '직접적이고 솔직하게', detail: '문제를 명확히 지적하고 해결 방향을 제시한다', value: 2 },
      { label: '구체적 제안과 함께', detail: '문제를 설명하고 개선 아이디어를 전한다', value: 1 },
      { label: '균형 잡힌 피드백', detail: '잘한 점과 개선점을 모두 전달한다', value: 0 },
      { label: '부드럽고 배려 있게', detail: '감정을 상하지 않게 톤을 조절한다', value: -1 },
      { label: '격려 중심', detail: '장점을 강조하며 긍정적인 분위기를 만든다', value: -2 }
    ]
  },
  {
    id: 'q12',
    dimension: 'TF',
    prompt: '의견이 맞지 않는 동료에게 어떤 말을 건네나요?',
    options: [
      { label: '논리적 반박', detail: '근거와 사실로 내 주장을 명확히 한다', value: 2 },
      { label: '대안 제시', detail: '더 나은 해결책을 찾기 위해 토론한다', value: 1 },
      { label: '공동 해결 모색', detail: '각자의 입장을 비교하며 타협점을 찾는다', value: 0 },
      { label: '감정 이해 표현', detail: '상대의 감정을 먼저 공감하고 입장을 전한다', value: -1 },
      { label: '관계 회복 우선', detail: '갈등을 최소화하며 관계를 유지하는 데 집중한다', value: -2 }
    ]
  },
  {
    id: 'q13',
    dimension: 'JP',
    prompt: '하루 일정을 계획할 때의 스타일은?',
    options: [
      { label: '시간 단위 계획', detail: '세부 일정과 우선순위를 구체적으로 정한다', value: 2 },
      { label: '할 일 리스트', detail: '해야 할 일을 정리하고 순서대로 처리한다', value: 1 },
      { label: '대략적 가이드', detail: '해야 할 일을 정리하되 일정은 유연하게 둔다', value: 0 },
      { label: '즉흥적 선택', detail: '그때그때 상황에 따라 진행한다', value: -1 },
      { label: '자유로운 흐름', detail: '일정에 얽매이지 않고 자연스러운 흐름을 따른다', value: -2 }
    ]
  },
  {
    id: 'q14',
    dimension: 'JP',
    prompt: '마감이 다가올 때 보이는 모습은?',
    options: [
      { label: '이미 다 끝냈다', detail: '미리 준비해 여유 있게 검토한다', value: 2 },
      { label: '계획대로 진행', detail: '일정에 맞춰 착실히 마무리한다', value: 1 },
      { label: '필요에 따라 조정', detail: '상황에 따라 계획과 즉흥을 섞어 대응한다', value: 0 },
      { label: '몰입해서 마무리', detail: '마감 직전 집중력을 끌어올린다', value: -1 },
      { label: '압박감 속에서 번뜩', detail: '시간 압박이 있어야 최고의 결과를 낸다', value: -2 }
    ]
  },
  {
    id: 'q15',
    dimension: 'JP',
    prompt: '예상치 못한 변화가 생겼을 때의 반응은?',
    options: [
      { label: '대비 플랜 활용', detail: '이미 준비해 둔 대안 계획을 즉시 실행한다', value: 2 },
      { label: '우선순위 재정비', detail: '영향도를 따져 새 일정을 세운다', value: 1 },
      { label: '상황 파악 후 결정', detail: '잠시 상황을 지켜보고 필요 시 조정한다', value: 0 },
      { label: '유연하게 수용', detail: '변화에 맞춰 자연스럽게 움직인다', value: -1 },
      { label: '즉흥적 해결', detail: '그때 떠오르는 아이디어로 문제를 풀어낸다', value: -2 }
    ]
  },
  {
    id: 'q16',
    dimension: 'JP',
    prompt: '여행을 떠날 때의 준비 패턴은?',
    options: [
      { label: '세부 일정 완벽 준비', detail: '하루 단위로 시간표를 세우고 필요한 것을 사전에 점검한다', value: 2 },
      { label: '필수 요소 체크', detail: '숙소, 교통, 핵심 일정 위주로 미리 예매한다', value: 1 },
      { label: '핵심만 계획', detail: '가보고 싶은 장소와 대략적인 동선만 정한다', value: 0 },
      { label: '자유 여행', detail: '그날의 기분과 상황에 맞춰 즉흥적으로 움직인다', value: -1 },
      { label: '현지에서 흡수', detail: '현지에서 얻는 정보와 영감으로 즉석에서 결정한다', value: -2 }
    ]
  },
  {
    id: 'q17',
    dimension: 'EI',
    prompt: '새로운 관계를 만들 때 가장 중요한 태도는?',
    options: [
      { label: '먼저 다가가기', detail: '눈에 띄는 에너지로 먼저 인사하고 대화를 시작한다', value: 2 },
      { label: '기회를 만들기', detail: '공통 관심사를 찾아 자연스럽게 대화를 이어간다', value: 1 },
      { label: '상대에 맞추기', detail: '상황을 보아가며 필요한 만큼만 소통한다', value: 0 },
      { label: '반응 살피기', detail: '상대의 시그널을 기다리며 천천히 다가간다', value: -1 },
      { label: '깊이 있는 연결', detail: '시간을 두고 천천히 신뢰를 쌓는 편이다', value: -2 }
    ]
  },
  {
    id: 'q18',
    dimension: 'SN',
    prompt: '문제를 해결할 때 가장 먼저 하는 일은?',
    options: [
      { label: '현실 조건 파악', detail: '사용 가능한 자원과 제약을 구체적으로 정리한다', value: 2 },
      { label: '직접 시도', detail: '작은 실험을 통해 즉각적인 피드백을 확인한다', value: 1 },
      { label: '다각도로 분석', detail: '사실과 아이디어를 균형 있게 비교한다', value: 0 },
      { label: '아이디어 확장', detail: '대안을 폭넓게 탐색하며 새로운 연결고리를 찾는다', value: -1 },
      { label: '큰 그림 재정의', detail: '문제가 가지는 의미와 장기적 방향을 재점검한다', value: -2 }
    ]
  },
  {
    id: 'q19',
    dimension: 'TF',
    prompt: '칭찬을 들었을 때 더 기쁜 말은?',
    options: [
      { label: '정확하고 논리적이야', detail: '분석력과 결정의 타당성을 인정받을 때', value: 2 },
      { label: '객관적으로 뛰어나', detail: '성과와 실력을 이유로 칭찬받을 때', value: 1 },
      { label: '신뢰할 수 있어', detail: '능력과 인간미 모두를 인정받을 때', value: 0 },
      { label: '배려가 느껴져', detail: '사람을 존중하고 감정을 세심하게 챙겼다는 말을 들을 때', value: -1 },
      { label: '따뜻한 사람이야', detail: '주변에 긍정적인 영향을 주었다는 말을 들을 때', value: -2 }
    ]
  },
  {
    id: 'q20',
    dimension: 'JP',
    prompt: '장기 프로젝트를 관리할 때 선호하는 방식은?',
    options: [
      { label: '정기 점검과 보고', detail: '체계적인 체크리스트와 일정으로 관리한다', value: 2 },
      { label: '마일스톤 기반', detail: '중요한 단계마다 점검하며 유연하게 조정한다', value: 1 },
      { label: '센터를 유지', detail: '큰 줄기를 유지하며 필요할 때 세부를 조정한다', value: 0 },
      { label: '유연한 흐름', detail: '필요한 순간에 집중해 몰입하며 진행한다', value: -1 },
      { label: '감각적인 추진', detail: '영감이 올 때 강하게 추진하고 흐름을 따른다', value: -2 }
    ]
  }
]

const SUMMARIES: Record<MbtiType, MbtiSummary> = {
  ENFJ: {
    title: '따뜻한 조력자',
    description: '사람들의 가능성을 북돋고 가치를 함께 만들 때 큰 만족을 느낍니다.',
    strengths: ['팀워크를 주도하며 조화로운 분위기 형성', '상대의 감정 변화를 빠르게 감지'],
    cautions: ['스스로를 돌보는 시간을 잊지 않기', '과한 책임감으로 번아웃 주의']
  },
  ENFP: {
    title: '아이디어 탐험가',
    description: '새로운 가능성을 향한 호기심으로 사람과 세상을 연결합니다.',
    strengths: ['뛰어난 공감 능력과 창의적인 발상', '변화하는 상황에 빠르게 적응'],
    cautions: ['아이디어를 실행 계획으로 구체화하기', '흥미가 떨어져도 꾸준함 유지']
  },
  ENTJ: {
    title: '전략적 리더',
    description: '장기적인 목표를 세우고 실행 전략을 설계하는 데 강점이 있습니다.',
    strengths: ['논리적인 판단과 추진력', '위기 상황에서도 침착한 의사 결정'],
    cautions: ['팀원의 감정과 동기를 함께 살피기', '완벽주의로 인한 독주 경계']
  },
  ENTP: {
    title: '도전하는 발명가',
    description: '기존 틀에 의문을 던지고 새로운 해법을 찾는 데 즐거움을 느낍니다.',
    strengths: ['빠른 문제 해결과 설득력', '다양한 시각에서 사물을 바라봄'],
    cautions: ['아이디어 단계에서 끝나지 않도록 실행력 확보', '토론이 갈등으로 번지지 않게 조율']
  },
  ESFJ: {
    title: '모두의 버팀목',
    description: '주변 사람들의 필요를 세심하게 챙기며 안정적인 공동체를 만듭니다.',
    strengths: ['실무를 촘촘히 관리하고 실행', '타인의 감정을 세심하게 배려'],
    cautions: ['자신의 감정과 욕구도 표현하기', '갈등을 두려워하지 말고 의견 공유']
  },
  ESFP: {
    title: '에너지 메이커',
    description: '지금 이 순간의 즐거움을 중시하며 사람들 사이에 긍정적인 분위기를 퍼뜨립니다.',
    strengths: ['유연한 대처와 즉흥적인 해결', '주변을 밝게 만드는 친근함'],
    cautions: ['장기 계획을 세우는 연습하기', '감정 소비를 줄이기 위한 휴식 확보']
  },
  ESTJ: {
    title: '실행력 있는 관리자',
    description: '명확한 규칙과 체계 덕분에 일을 계획대로 완수합니다.',
    strengths: ['위임과 관리 능력이 뛰어남', '객관적인 기준으로 의사 결정'],
    cautions: ['유연성을 잃지 않도록 다양한 의견 경청', '결과뿐 아니라 과정의 감정도 살피기']
  },
  ESTP: {
    title: '현장형 해결사',
    description: '바로 실행하며 상황을 빠르게 파악해 현실적인 해답을 제시합니다.',
    strengths: ['위기 대응 능력과 담대함', '사람들과의 즉각적인 소통'],
    cautions: ['충분한 준비와 사전 검토의 중요성 기억', '장기적 관점을 의식적으로 유지']
  },
  INFJ: {
    title: '통찰력 있는 상담가',
    description: '깊이 있는 통찰로 사람들의 가능성을 발견하고 성장 방향을 제안합니다.',
    strengths: ['장기적인 비전을 제시', '상대의 마음을 세심하게 이해'],
    cautions: ['과도한 이상화 피하기', '감정을 쌓아두지 말고 표현하기']
  },
  INFP: {
    title: '가치 중심 스토리텔러',
    description: '자신만의 신념을 바탕으로 의미 있는 삶을 추구합니다.',
    strengths: ['깊은 공감과 창의적인 상상력', '가치 있는 목표에 강한 몰입'],
    cautions: ['현실적인 실행 계획을 병행하기', '자기 비판보다 성장 관점 유지']
  },
  INTJ: {
    title: '미래 설계자',
    description: '체계적인 분석과 장기 전략으로 변화를 주도합니다.',
    strengths: ['복잡한 문제를 구조화', '독립적인 사고와 목표 지향성'],
    cautions: ['타인의 감정과 협업 리듬을 존중', '완성도를 높이는 과정에서 피드백 수용']
  },
  INTP: {
    title: '논리적 탐구자',
    description: '새로운 개념을 분석하고 원리를 이해하는 데 탁월합니다.',
    strengths: ['객관적이고 창의적인 문제 해결', '지식 탐구에 대한 깊은 몰입'],
    cautions: ['아이디어를 현실에 적용하는 연습', '결정 지연을 줄이기 위한 마감 설정']
  },
  ISFJ: {
    title: '세심한 보호자',
    description: '자신이 맡은 역할을 책임감 있게 완수하며 안정감을 줍니다.',
    strengths: ['실용적인 도움과 섬세한 배려', '꾸준하고 성실한 실행력'],
    cautions: ['변화를 두려워하지 않기', '스스로의 욕구를 명확히 표현']
  },
  ISFP: {
    title: '따뜻한 감성 아티스트',
    description: '자연스러운 감각과 섬세한 감수성으로 주변을 편안하게 만듭니다.',
    strengths: ['유연한 공감과 즉흥적인 창의력', '사람들에게 편안함 제공'],
    cautions: ['중요한 결정은 미리 준비하기', '감정을 마음속에만 담아두지 않기']
  },
  ISTJ: {
    title: '신뢰받는 실무가',
    description: '체계적이고 꾸준한 태도로 맡은 일을 정확하게 처리합니다.',
    strengths: ['세부 사항까지 꼼꼼하게 관리', '약속과 규칙을 철저히 지킴'],
    cautions: ['새로운 방식도 시도해 보기', '유연한 소통을 위한 감정 표현 연습']
  },
  ISTP: {
    title: '분석적인 장인',
    description: '문제를 구조적으로 파악해 효율적인 해결책을 찾습니다.',
    strengths: ['도구와 시스템을 활용한 실용적 해결', '위기 상황에서도 침착한 판단'],
    cautions: ['사람들과의 감정 교류에 시간 투자', '장기적인 목표 설정에 신경 쓰기']
  }
}

export interface MbtiResult {
  type: MbtiType
  totals: Record<Dimension, number>
  positives: Record<Dimension, number>
  negatives: Record<Dimension, number>
  summary: MbtiSummary
}

const MBTI_RELATION_TIPS: Record<string, string> = {
  EJ: '회의 전 5분을 투자해 목적과 기대치를 공유하면 팀의 흐름이 빨라집니다.',
  EP: '즉흥 아이디어를 나눌 짧은 체크인 시간을 만들면 사람들과 호흡이 맞습니다.',
  IJ: '필요한 정보와 마감 시점을 명확히 안내하면 파트너가 안심합니다.',
  IP: '상대에게 생각할 여유를 주면서 핵심 메시지를 간결하게 전달하세요.'
}

function buildMbtiActionCards(result: MbtiResult): ActionCardData[] {
  const summary = result.summary
  const primaryStrength = summary.strengths[0] ?? '자신만의 강점'
  const primaryCaution = summary.cautions[0] ?? '과도한 자기비판'
  const relationKey = `${result.type[0]}${result.type[3]}`
  const relationTip = MBTI_RELATION_TIPS[relationKey] ?? '상대의 페이스를 존중하며 오늘의 목표를 나누세요.'

  return [
    {
      title: '오늘 해볼 것',
      description: `${primaryStrength}을(를) 살릴 수 있는 활동을 오늘 일정에 30분이라도 배치해 보세요.`,
      tone: 'do'
    },
    {
      title: '피해야 할 것',
      description: `${primaryCaution} 신호가 오면 잠시 호흡을 고르고 시선을 바꿔 주세요.`,
      tone: 'avoid'
    },
    {
      title: '대인관계/업무 팁',
      description: relationTip,
      tone: 'relation'
    }
  ]
}

interface MbtiTestProps {
  onResultChange?: (result: MbtiResult | null) => void
}

function computeMbtiResultFromAnswers(answers: Record<string, ResponseValue>): MbtiResult | null {
  const totals: Record<Dimension, number> = { EI: 0, SN: 0, TF: 0, JP: 0 }
  const positives: Record<Dimension, number> = { EI: 0, SN: 0, TF: 0, JP: 0 }
  const negatives: Record<Dimension, number> = { EI: 0, SN: 0, TF: 0, JP: 0 }

  for (const question of QUESTIONS) {
    const value = answers[question.id]
    if (value === undefined) {
      return null
    }

    totals[question.dimension] += value
    if (value > 0) {
      positives[question.dimension] += value
    } else if (value < 0) {
      negatives[question.dimension] += Math.abs(value)
    }
  }

  const type = (Object.keys(DIMENSION_PAIRS) as Dimension[])
    .map((dimension) => {
      const [first, second] = DIMENSION_PAIRS[dimension]
      return totals[dimension] >= 0 ? first : second
    })
    .join('') as MbtiType

  const summary = SUMMARIES[type]

  return {
    type,
    totals,
    positives,
    negatives,
    summary
  }
}

export function MbtiTest({ onResultChange }: MbtiTestProps): JSX.Element {
  const { addEntry } = useResultHistory()
  const { showToast } = useToast()
  const persistedAnswers = useMemo(loadPersistedAnswers, [])

  const [answers, setAnswers] = useState<Record<string, ResponseValue>>(() => {
    return Object.keys(persistedAnswers).length ? persistedAnswers : buildRandomAnswers()
  })
  const [result, setResult] = useState<MbtiResult | null>(null)
  const [error, setError] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const hydrationGuardRef = useRef(true)
  const submitTimerRef = useRef<number | null>(null)

  const answeredCount = QUESTIONS.reduce((count, question) => {
    return answers[question.id] !== undefined ? count + 1 : count
  }, 0)

  const unansweredCount = QUESTIONS.length - answeredCount

  const handleSelect = (questionId: string, value: ResponseValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    if (error) setError('')
  }

  const handleSubmit = () => {
    if (unansweredCount > 0) {
      const message = `아직 ${unansweredCount}개의 문항이 남아 있습니다.`
      setError(message)
      setResult(null)
      onResultChange?.(null)
      showToast(message, 'error')
      return
    }

    if (submitTimerRef.current) {
      window.clearTimeout(submitTimerRef.current)
    }

    setIsProcessing(true)

    submitTimerRef.current = window.setTimeout(() => {
      const nextResult = computeMbtiResultFromAnswers(answers)
      if (!nextResult) {
        const message = '결과 계산 중 문제가 발생했습니다. 다시 시도해 주세요.'
        setError(message)
        setResult(null)
        onResultChange?.(null)
        showToast(message, 'error')
        setIsProcessing(false)
        submitTimerRef.current = null
        return
      }

      setError('')
      setResult(nextResult)
      onResultChange?.(nextResult)
      setIsProcessing(false)
      submitTimerRef.current = null
    }, 220)
  }

  const handleReset = () => {
    if (submitTimerRef.current) {
      window.clearTimeout(submitTimerRef.current)
      submitTimerRef.current = null
    }
    setAnswers({})
    setResult(null)
    setError('')
    setIsProcessing(false)
    onResultChange?.(null)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (answeredCount === 0) {
      window.localStorage.removeItem(MBTI_STORAGE_KEY)
      return
    }

    try {
      window.localStorage.setItem(MBTI_STORAGE_KEY, JSON.stringify(answers))
    } catch (storageError) {
      console.warn('Failed to persist MBTI answers:', storageError)
    }
  }, [answers, answeredCount])

  useEffect(() => {
    return () => {
      if (submitTimerRef.current) {
        window.clearTimeout(submitTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!hydrationGuardRef.current) return
    hydrationGuardRef.current = false

    const initialResult = computeMbtiResultFromAnswers(answers)
    if (initialResult) {
      setResult(initialResult)
      onResultChange?.(initialResult)
    }
  }, [answers, onResultChange])

  const dimensionBreakdown = useMemo(() => {
    if (!result) return []

    return (Object.keys(DIMENSION_PAIRS) as Dimension[]).map((dimension) => {
      const [first, second] = DIMENSION_PAIRS[dimension]
      const firstScore = result.positives[dimension]
      const secondScore = result.negatives[dimension]
      const total = firstScore + secondScore
      const firstRatio = total === 0 ? 50 : Math.round((firstScore / total) * 100)

      return {
        dimension,
        first,
        second,
        firstScore,
        secondScore,
        firstRatio,
        secondRatio: 100 - firstRatio,
        net: result.totals[dimension]
      }
    })
  }, [result])

  const summary = result?.summary ?? null

  const actionCards = result ? buildMbtiActionCards(result) : []

  const dominantDimensionInfo = useMemo(() => {
    if (!result) return null
    const [dimension, value] = (Object.entries(result.totals) as Array<[Dimension, number]>)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))[0] ?? []
    if (!dimension || value === undefined) return null
    const [first, second] = DIMENSION_PAIRS[dimension]
    const label = DIMENSION_LABEL[dimension]
    const direction = value >= 0 ? DIMENSION_SHORT_LABEL[first] : DIMENSION_SHORT_LABEL[second]
    return { label, direction }
  }, [result])

  const metrics = useMemo(() => {
    if (!result || !summary) return []
    return [
      { label: '유형', value: `${result.type} · ${summary.title}` },
      dominantDimensionInfo ? { label: dominantDimensionInfo.label, value: dominantDimensionInfo.direction } : null,
      { label: '핵심 강점', value: summary.strengths[0] ?? '강점을 확인해 보세요.' }
    ].filter(Boolean) as Array<{ label: string; value: string }>
  }, [result, summary, dominantDimensionInfo])

  const historyEntry = useMemo(() => {
    if (!result || !summary) return null
    return {
      id: `mbti:${result.type}`,
      kind: 'mbti' as const,
      title: 'MBTI 성향',
      subtitle: `${result.type} · ${summary.title}`,
      summary: summary.description,
      timestamp: Date.now(),
      badge: 'MBTI INSIGHT'
    }
  }, [result, summary])

  const placeholderEntry = useMemo(
    () => ({
      id: 'mbti:placeholder',
      kind: 'mbti' as const,
      title: 'MBTI 성향',
      summary: '모든 문항에 응답하면 상세한 성향 분석이 제공됩니다.',
      timestamp: 0,
      badge: 'MBTI INSIGHT'
    }),
    []
  )

  useEffect(() => {
    if (historyEntry && !isProcessing) {
      addEntry(historyEntry)
    }
  }, [historyEntry, addEntry, isProcessing])

  const analysisTab = useMemo(() => {
    if (!result || !summary) return null

    const topDimension = [...dimensionBreakdown].sort((a, b) => Math.abs(b.net) - Math.abs(a.net))[0]
    const dominantScore = topDimension ? Math.abs(topDimension.net) : 0
    const reasonText =
      topDimension && dominantDimensionInfo
        ? `${dominantDimensionInfo.label}에서 ${dominantDimensionInfo.direction} 응답이 ${dominantScore}점 앞서 ${result.type} 유형이 형성되었어요.`
        : '모든 차원이 균형에 가까워 현재는 중립적인 흐름이 드러납니다.'
    const actionDo = actionCards[0]?.description ?? ''
    const actionAvoid = actionCards[1]?.description ?? ''
    const relationHint = actionCards[2]?.description ?? ''

    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-indigo-200 bg-white/80 p-4 text-sm text-indigo-900/80">
          <p className="text-sm font-semibold text-indigo-800">이 결과는 이렇게 읽어보세요</p>
          <ol className="mt-2 space-y-1 list-decimal pl-5">
            <li>요약 타이틀로 오늘의 에너지 방향을 먼저 파악하세요.</li>
            <li>강점·성장 포인트를 비교해 균형 잡힌 행동을 계획해 보세요.</li>
            <li>성향 지표와 실천 카드를 참고해 구체적인 행동으로 연결하세요.</li>
          </ol>
        </div>

        <div className="rounded-xl border border-indigo-100 bg-white/85 p-4 text-sm leading-relaxed text-indigo-900/80">
          <h3 className="text-sm font-semibold text-indigo-700">핵심 해설</h3>
          <dl className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-indigo-500">왜 이런 결과가 나왔나요?</dt>
              <dd>{reasonText}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-indigo-500">이 결과의 의미는?</dt>
              <dd>{summary.description}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-indigo-500">오늘 해볼 것</dt>
              <dd>{actionDo}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-xs font-medium uppercase tracking-wide text-indigo-500">주의할 점</dt>
              <dd>{actionAvoid}</dd>
            </div>
            <div className="space-y-1 md:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-indigo-500">관계 힌트</dt>
              <dd>{relationHint}</dd>
            </div>
          </dl>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 rounded-xl border border-indigo-200 bg-white/70 p-4">
            <h4 className="text-sm font-semibold text-indigo-800">
              <TooltipLabel text="강점" description="질문 응답에서 가장 일관되게 드러난 자원입니다." />
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-indigo-900/80">
              {summary.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2 rounded-xl border border-indigo-200 bg-white/70 p-4">
            <h4 className="text-sm font-semibold text-indigo-800">
              <TooltipLabel text="성장 포인트" description="균형을 위해 의식하면 좋은 보완 지점입니다." />
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-indigo-900/80">
              {summary.cautions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-indigo-200 bg-white/80 p-4">
          <h4 className="text-sm font-semibold text-indigo-800">
            <TooltipLabel text="성향 지표" description="각 차원에서 어떤 방향으로 치우쳤는지 시각화했습니다." />
          </h4>
          <dl className="grid gap-3 md:grid-cols-2">
            {dimensionBreakdown.map((item) => (
              <div key={item.dimension} className="space-y-1">
                <dt className="text-xs font-medium text-indigo-500">
                  <TooltipLabel
                    text={DIMENSION_LABEL[item.dimension]}
                    description="해당 차원에서 0에 가까울수록 균형, 값이 클수록 앞쪽 글자의 경향이 강합니다."
                    className="text-indigo-500"
                  />
                </dt>
                <dd className="flex flex-col gap-1 text-sm text-indigo-900/80">
                  <div className="flex items-center justify-between text-xs text-indigo-700">
                    <span>{DIMENSION_SHORT_LABEL[item.first]}</span>
                    <span>
                      {item.firstScore.toFixed(1)} : {item.secondScore.toFixed(1)} ({item.firstRatio}% vs {item.secondRatio}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-indigo-100">
                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${item.firstRatio}%` }} />
                  </div>
                  <p className="text-xs text-indigo-600">
                    <TooltipLabel
                      text={`순점수 ${item.net >= 0 ? '+' : ''}${item.net}`}
                      description="양수면 앞 글자(E, S, T, J)가, 음수면 뒷 글자(I, N, F, P)가 우세합니다."
                    />
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    )
  }, [result, summary, dimensionBreakdown])

  const adviceTab = useMemo(() => {
    if (!result) return null

    return (
      <div className="space-y-5">
        <ActionCardDeck cards={actionCards} />
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-sm text-indigo-900/80">
          <p className="font-medium text-indigo-700">오늘 활용 메모</p>
          <p className="mt-1 text-xs text-indigo-600">
            강점 카드에서 고른 행동을 30분만이라도 실행하고, 성장 포인트는 짧은 체크인으로 마무리해 보세요. 관계 팁을 팀/가족 일정에 바로 적용해도 좋습니다.
          </p>
        </div>
      </div>
    )
  }, [result, actionCards])

  const tabs = useMemo(() => {
    if (!analysisTab && !adviceTab) return []
    const next = [] as Array<{ id: string; label: string; content: JSX.Element }>
    if (analysisTab) next.push({ id: 'analysis', label: '해석', content: analysisTab })
    if (adviceTab) next.push({ id: 'advice', label: '조언', content: adviceTab })
    return next
  }, [analysisTab, adviceTab])

  const summaryText = summary ? summary.description : '20개의 질문에 응답하면 성향 요약과 행동 가이드를 확인할 수 있습니다.'
  const entryForCard = historyEntry ?? placeholderEntry

  return (
    <section className="space-y-6">
      <div className="space-y-6 rounded-2xl border border-indigo-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <header className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">MBTI 성향 진단</h2>
          <p className="text-sm text-gray-600">
            총 20개의 질문을 통해 현재의 성향을 세밀하게 살펴보세요. 각 문항은 강도에 따라 선택할 수 있으며, 모든 문항에 응답하면 결과를 확인할 수 있습니다.
          </p>
        </header>

        <div className="space-y-5">
          {QUESTIONS.map((question, index) => {
            const answer = answers[question.id]
            return (
              <fieldset key={question.id} className="space-y-3 rounded-xl border border-indigo-100 bg-white/80 p-4 shadow-sm">
                <legend className="text-sm font-medium text-gray-900">
                  {index + 1}. {question.prompt}
                </legend>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  {question.options.map((option, optionIndex) => {
                    const inputId = `${question.id}-${optionIndex}`
                    const checked = answer === option.value
                    return (
                      <label
                        key={optionIndex}
                        htmlFor={inputId}
                        className={`flex h-full gap-3 rounded-lg border px-3 py-2 text-sm transition ${
                          checked
                            ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                        }`}
                      >
                        <input
                          id={inputId}
                          type="radio"
                          name={question.id}
                          value={option.value}
                          checked={checked}
                          onChange={() => handleSelect(question.id, option.value)}
                          className="mt-1 h-4 w-4 text-indigo-500 focus:ring-indigo-400"
                        />
                        <div className="space-y-1">
                          <span className="font-medium">{option.label}</span>
                          <p className="text-xs text-gray-500">{option.detail}</p>
                        </div>
                      </label>
                    )
                  })}
                </div>
                <p className="text-xs text-gray-500">{DIMENSION_LABEL[question.dimension]}</p>
              </fieldset>
            )
          })}
        </div>

        <span className="sr-only" aria-live="assertive">
          {error}
        </span>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-600"
          >
            결과 보기
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-600 transition hover:border-indigo-300 hover:text-indigo-600"
          >
            다시 시작
          </button>
          <span className="text-xs text-gray-500">남은 문항 {unansweredCount}개</span>
        </div>
      </div>

      <ResultCard entry={entryForCard} metrics={metrics} summary={summaryText} tabs={tabs} loading={isProcessing} />
    </section>
  )
}
