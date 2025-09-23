import { useMemo, useState } from 'react'

type Dimension = 'EI' | 'SN' | 'TF' | 'JP'
type MbtiLetter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'
type MbtiType = `${'E' | 'I'}${'S' | 'N'}${'T' | 'F'}${'J' | 'P'}`

interface MbtiQuestion {
  id: string
  dimension: Dimension
  prompt: string
  options: Array<{ label: string; value: MbtiLetter }>
}

const QUESTIONS: MbtiQuestion[] = [
  {
    id: 'q1',
    dimension: 'EI',
    prompt: '새로운 사람들과 만나는 모임이 있을 때 어떤 편인가요?',
    options: [
      { label: '새로운 사람들과 에너지를 주고받으며 신나게 어울린다', value: 'E' },
      { label: '짧게 참여하거나 상황을 지켜보고 조용히 빠져나온다', value: 'I' }
    ]
  },
  {
    id: 'q2',
    dimension: 'EI',
    prompt: '휴식 시간이 생기면 어떤 활동을 선택하나요?',
    options: [
      { label: '친구에게 연락하거나 함께할 사람을 찾는다', value: 'E' },
      { label: '혼자만의 시간을 보내며 리프레시한다', value: 'I' }
    ]
  },
  {
    id: 'q3',
    dimension: 'SN',
    prompt: '새로운 정보를 받아들일 때 어떤 방식이 더 편한가요?',
    options: [
      { label: '구체적인 사례와 경험을 통해 이해하는 편이다', value: 'S' },
      { label: '핵심 개념과 가능성을 상상하며 이해하는 편이다', value: 'N' }
    ]
  },
  {
    id: 'q4',
    dimension: 'SN',
    prompt: '아이디어 회의에서 자신을 더 잘 나타내는 모습은?',
    options: [
      { label: '현실적으로 실행 가능한 계획을 제시한다', value: 'S' },
      { label: '새로운 가능성과 창의적 방향을 제안한다', value: 'N' }
    ]
  },
  {
    id: 'q5',
    dimension: 'TF',
    prompt: '중요한 결정을 내릴 때 더 믿는 것은?',
    options: [
      { label: '논리적인 이유와 일관된 원칙', value: 'T' },
      { label: '사람들의 감정과 조화로운 분위기', value: 'F' }
    ]
  },
  {
    id: 'q6',
    dimension: 'TF',
    prompt: '팀원과 의견이 다를 때 보이는 반응은?',
    options: [
      { label: '객관적인 근거를 제시하며 설득한다', value: 'T' },
      { label: '상대의 감정을 살피며 공감부터 표현한다', value: 'F' }
    ]
  },
  {
    id: 'q7',
    dimension: 'JP',
    prompt: '프로젝트 마감이 다가올 때 더 편한 진행 방식은?',
    options: [
      { label: '앞서 계획한 일정대로 관리하며 마무리한다', value: 'J' },
      { label: '유연하게 우선순위를 바꾸며 마감 직전 몰입한다', value: 'P' }
    ]
  },
  {
    id: 'q8',
    dimension: 'JP',
    prompt: '여행을 떠날 때의 준비 스타일은?',
    options: [
      { label: '동선과 숙소, 해야 할 일을 미리 정리한다', value: 'J' },
      { label: '대략적인 방향만 잡고 상황에 맞춰 움직인다', value: 'P' }
    ]
  }
]

const SUMMARIES: Record<MbtiType, { title: string; description: string; strengths: string[]; cautions: string[] }> = {
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

const DIMENSION_LABEL: Record<Dimension, string> = {
  EI: '에너지 방향 (외향-내향)',
  SN: '정보 수집 (감각-직관)',
  TF: '판단 기준 (사고-감정)',
  JP: '생활 양식 (계획-유연)'
}

type Tally = Record<MbtiLetter, number>

const INITIAL_TALLY: Tally = {
  E: 0,
  I: 0,
  S: 0,
  N: 0,
  T: 0,
  F: 0,
  J: 0,
  P: 0
}

const DIMENSION_PAIRS: Record<Dimension, [MbtiLetter, MbtiLetter]> = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P']
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

interface ResultState {
  type: MbtiType
  tally: Tally
}

const buildTypeFromTally = (tally: Tally): MbtiType => {
  const pick = ([a, b]: [MbtiLetter, MbtiLetter]) => (tally[a] >= tally[b] ? a : b)
  return `${pick(DIMENSION_PAIRS.EI)}${pick(DIMENSION_PAIRS.SN)}${pick(DIMENSION_PAIRS.TF)}${pick(DIMENSION_PAIRS.JP)}` as MbtiType
}

export function MbtiTest(): JSX.Element {
  const [answers, setAnswers] = useState<Record<string, MbtiLetter>>({})
  const [result, setResult] = useState<ResultState | null>(null)
  const [error, setError] = useState<string>('')

  const unansweredCount = QUESTIONS.length - Object.keys(answers).length

  const handleSelect = (questionId: string, value: MbtiLetter) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
    if (error) setError('')
  }

  const handleSubmit = () => {
    if (unansweredCount > 0) {
      setError(`아직 ${unansweredCount}개의 문항이 남아 있습니다.`)
      setResult(null)
      return
    }

    const tally = QUESTIONS.reduce<Tally>((acc, question) => {
      const answer = answers[question.id]
      if (answer) {
        acc[answer] += 1
      }
      return acc
    }, { ...INITIAL_TALLY })

    const type = buildTypeFromTally(tally)
    setResult({ type, tally })
  }

  const handleReset = () => {
    setAnswers({})
    setResult(null)
    setError('')
  }

  const dimensionBreakdown = useMemo(() => {
    if (!result) return []

    return (Object.keys(DIMENSION_PAIRS) as Dimension[]).map((dimension) => {
      const [first, second] = DIMENSION_PAIRS[dimension]
      const firstScore = result.tally[first]
      const secondScore = result.tally[second]
      const total = firstScore + secondScore
      const firstRatio = total === 0 ? 50 : Math.round((firstScore / total) * 100)

      return {
        dimension,
        first,
        second,
        firstScore,
        secondScore,
        firstRatio,
        secondRatio: 100 - firstRatio
      }
    })
  }, [result])

  const summary = result ? SUMMARIES[result.type] : null

  return (
    <section className="bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm rounded-2xl p-6 space-y-6">
      <header className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">MBTI 성향 진단</h2>
        <p className="text-sm text-gray-600">
          총 8개의 질문을 통해 현재의 성향을 간단히 살펴보세요. 모든 문항에 응답하면 결과를 확인할 수 있습니다.
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
              <div className="grid gap-3 md:grid-cols-2">
                {question.options.map((option) => {
                  const inputId = `${question.id}-${option.value}`
                  const checked = answer === option.value
                  return (
                    <label
                      key={option.value}
                      htmlFor={inputId}
                      className={`flex items-start gap-3 rounded-lg border px-3 py-2 text-sm transition ${
                        checked ? 'border-indigo-400 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
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
                      <span>{option.label}</span>
                    </label>
                  )
                })}
              </div>
              <p className="text-xs text-gray-500">{DIMENSION_LABEL[question.dimension]}</p>
            </fieldset>
          )
        })}
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
      ) : null}

      <div className="flex flex-wrap gap-3">
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

      {result && summary ? (
        <section className="space-y-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6">
          <header className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-indigo-500">당신의 성향</p>
            <h3 className="text-2xl font-bold text-indigo-800">{result.type}</h3>
            <p className="text-sm text-indigo-700">{summary.title}</p>
          </header>
          <p className="text-sm text-indigo-900/80">{summary.description}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-xl border border-indigo-200 bg-white/70 p-4">
              <h4 className="text-sm font-semibold text-indigo-800">강점</h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-indigo-900/80">
                {summary.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 rounded-xl border border-indigo-200 bg-white/70 p-4">
              <h4 className="text-sm font-semibold text-indigo-800">성장 포인트</h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-indigo-900/80">
                {summary.cautions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-indigo-200 bg-white/80 p-4">
            <h4 className="text-sm font-semibold text-indigo-800">성향 지표</h4>
            <dl className="grid gap-3 md:grid-cols-2">
              {dimensionBreakdown.map((item) => (
                <div key={item.dimension} className="space-y-1">
                  <dt className="text-xs font-medium text-indigo-500">{DIMENSION_LABEL[item.dimension]}</dt>
                  <dd className="flex flex-col gap-1 text-sm text-indigo-900/80">
                    <div className="flex items-center justify-between text-xs text-indigo-700">
                      <span>{DIMENSION_SHORT_LABEL[item.first]}</span>
                      <span>
                        {item.firstScore} : {item.secondScore} ({item.firstRatio}% vs {item.secondRatio}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-indigo-100">
                      <div
                        className="h-2 rounded-full bg-indigo-500"
                        style={{ width: `${item.firstRatio}%` }}
                      />
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}
    </section>
  )
}

