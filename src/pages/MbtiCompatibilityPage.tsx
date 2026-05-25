import { JSX, useEffect } from 'react'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'

type Rating = 'excellent' | 'good' | 'moderate'

interface TypeMatch {
  type: string
  rating: Rating
  reason: string
}

interface MbtiTypeData {
  type: string
  nickname: string
  group: string
  loveStyle: string
  matches: TypeMatch[]
}

const MBTI_DATA: MbtiTypeData[] = [
  {
    type: 'INTJ', nickname: '전략가', group: '분석가',
    loveStyle: '깊은 지적 연결을 추구하며 파트너의 성장을 돕습니다. 감정 표현은 서툴지만 헌신은 강합니다.',
    matches: [
      { type: 'ENFP', rating: 'excellent', reason: 'INTJ의 구조적 사고와 ENFP의 창의적 에너지가 서로를 완성합니다.' },
      { type: 'ENTP', rating: 'good', reason: '지적 토론과 아이디어 교환으로 자극을 주고받는 관계입니다.' },
      { type: 'ENTJ', rating: 'good', reason: '같은 목표 지향성으로 서로의 전략을 존중하며 성장합니다.' }
    ]
  },
  {
    type: 'INTP', nickname: '논리술사', group: '분석가',
    loveStyle: '논리와 이성으로 관계를 접근합니다. 감정적 요구보다 지적 호기심을 나눌 때 편안함을 느낍니다.',
    matches: [
      { type: 'ENTJ', rating: 'excellent', reason: 'INTP의 아이디어를 ENTJ가 현실로 구현하는 이상적 조합입니다.' },
      { type: 'INTJ', rating: 'good', reason: '같은 내향적 사고 방식으로 조용한 이해를 나눕니다.' },
      { type: 'INFJ', rating: 'good', reason: '깊은 내면 탐구를 공유하며 서로의 차이를 보완합니다.' }
    ]
  },
  {
    type: 'ENTJ', nickname: '통솔자', group: '분석가',
    loveStyle: '주도적이고 목표 지향적인 연애를 합니다. 파트너의 발전을 지지하며 강한 결속력을 추구합니다.',
    matches: [
      { type: 'INTP', rating: 'excellent', reason: 'INTP의 깊은 분석과 ENTJ의 실행력이 탁월한 시너지를 냅니다.' },
      { type: 'INFP', rating: 'good', reason: 'ENTJ의 추진력과 INFP의 가치 지향이 균형을 이룹니다.' },
      { type: 'INTJ', rating: 'good', reason: '전략적 사고를 공유하며 상호 존중하는 관계를 형성합니다.' }
    ]
  },
  {
    type: 'ENTP', nickname: '변론가', group: '분석가',
    loveStyle: '지적 자극과 토론을 즐깁니다. 틀에 얽매이지 않는 자유로운 관계를 선호합니다.',
    matches: [
      { type: 'INFJ', rating: 'excellent', reason: 'ENTP의 외향적 직관과 INFJ의 내향적 직관이 깊은 연결을 만듭니다.' },
      { type: 'INTJ', rating: 'good', reason: '지적 도전을 주고받으며 서로를 성장시킵니다.' },
      { type: 'ENFJ', rating: 'good', reason: 'ENTP의 아이디어를 ENFJ가 따뜻하게 수용하는 관계입니다.' }
    ]
  },
  {
    type: 'INFJ', nickname: '옹호자', group: '외교관',
    loveStyle: '깊고 의미 있는 관계를 추구합니다. 상대를 깊이 이해하려 하며 관계에 헌신적입니다.',
    matches: [
      { type: 'ENTP', rating: 'excellent', reason: 'INFJ의 통찰력과 ENTP의 탐구심이 강렬한 지적 유대감을 형성합니다.' },
      { type: 'ENFP', rating: 'good', reason: '공유하는 이상주의와 서로에 대한 깊은 이해로 따뜻한 관계를 만듭니다.' },
      { type: 'INTJ', rating: 'good', reason: '같은 직관 우세형으로 깊은 내면 소통이 가능합니다.' }
    ]
  },
  {
    type: 'INFP', nickname: '중재자', group: '외교관',
    loveStyle: '진정성과 깊은 감정적 연결을 중시합니다. 상대의 내면을 이해하는 데 탁월합니다.',
    matches: [
      { type: 'ENFJ', rating: 'excellent', reason: 'ENFJ의 리더십이 INFP를 지지하고, INFP의 진정성이 ENFJ에게 안정감을 줍니다.' },
      { type: 'ENTJ', rating: 'good', reason: 'INFP의 이상과 ENTJ의 실행력이 상호보완적으로 작용합니다.' },
      { type: 'ENFP', rating: 'good', reason: '같은 감정적 깊이와 이상주의를 공유합니다.' }
    ]
  },
  {
    type: 'ENFJ', nickname: '주인공', group: '외교관',
    loveStyle: '파트너의 성장과 행복을 위해 헌신합니다. 감정적으로 풍부하고 관계에서 주도적입니다.',
    matches: [
      { type: 'INFP', rating: 'excellent', reason: 'ENFJ의 따뜻한 에너지가 INFP를 이끌고 INFP의 깊이가 ENFJ를 채웁니다.' },
      { type: 'ISFP', rating: 'good', reason: '감성적 연결과 현재를 즐기는 방식이 조화롭습니다.' },
      { type: 'INTP', rating: 'good', reason: 'ENFJ의 감성이 INTP의 이성을 따뜻하게 감쌉니다.' }
    ]
  },
  {
    type: 'ENFP', nickname: '활동가', group: '외교관',
    loveStyle: '자유롭고 열정적인 연애를 합니다. 상대에게 영감을 주고 함께 성장하는 관계를 추구합니다.',
    matches: [
      { type: 'INTJ', rating: 'excellent', reason: 'ENFP의 무한한 가능성과 INTJ의 집중된 실행력이 완벽한 균형을 이룹니다.' },
      { type: 'INFJ', rating: 'good', reason: '같은 이상주의와 깊은 감정적 연결을 공유합니다.' },
      { type: 'ENTP', rating: 'good', reason: '창의적 에너지와 탐구심이 맞아 활기찬 관계를 만듭니다.' }
    ]
  },
  {
    type: 'ISTJ', nickname: '물류관리자', group: '관리자',
    loveStyle: '안정적이고 신뢰 있는 관계를 추구합니다. 말보다 행동으로 헌신을 보여줍니다.',
    matches: [
      { type: 'ESFP', rating: 'excellent', reason: 'ISTJ의 안정감이 ESFP를 지지하고, ESFP의 활기가 ISTJ에게 활력을 줍니다.' },
      { type: 'ESTP', rating: 'good', reason: '현실적인 문제 해결 방식을 공유하며 서로를 보완합니다.' },
      { type: 'ISFJ', rating: 'good', reason: '같은 가치관과 안정 지향으로 편안한 관계를 형성합니다.' }
    ]
  },
  {
    type: 'ISFJ', nickname: '수호자', group: '관리자',
    loveStyle: '헌신적이고 배려 깊은 파트너입니다. 관계의 안정과 조화를 최우선으로 합니다.',
    matches: [
      { type: 'ESTP', rating: 'excellent', reason: 'ISFJ의 세심한 배려와 ESTP의 활동적인 에너지가 서로를 활성화합니다.' },
      { type: 'ESFP', rating: 'good', reason: '따뜻한 감성을 공유하며 즐거운 순간을 함께 만듭니다.' },
      { type: 'ISTJ', rating: 'good', reason: '같은 헌신과 책임감으로 든든한 관계를 쌓습니다.' }
    ]
  },
  {
    type: 'ESTJ', nickname: '경영자', group: '관리자',
    loveStyle: '책임감 있고 체계적인 관계를 만듭니다. 파트너에게 안정과 방향성을 제공합니다.',
    matches: [
      { type: 'ISFP', rating: 'excellent', reason: 'ESTJ의 구조와 ISFP의 유연함이 서로의 빈자리를 채웁니다.' },
      { type: 'ISTP', rating: 'good', reason: '현실적인 문제 해결에 뛰어나며 서로를 효율적으로 보완합니다.' },
      { type: 'ISFJ', rating: 'good', reason: '공통된 책임감과 전통적 가치관으로 안정적 관계를 형성합니다.' }
    ]
  },
  {
    type: 'ESFJ', nickname: '집정관', group: '관리자',
    loveStyle: '따뜻하고 표현적인 연애를 합니다. 파트너의 필요를 먼저 챙기고 관계의 조화를 중시합니다.',
    matches: [
      { type: 'ISTP', rating: 'excellent', reason: 'ESFJ의 감성과 ISTP의 실용성이 서로의 약점을 보완합니다.' },
      { type: 'ISFP', rating: 'good', reason: '감성적 온기를 나누며 따뜻한 관계를 유지합니다.' },
      { type: 'INFP', rating: 'good', reason: '진정성을 중시하는 공통점으로 깊은 유대를 형성합니다.' }
    ]
  },
  {
    type: 'ISTP', nickname: '장인', group: '탐험가',
    loveStyle: '독립성을 유지하면서 파트너를 실질적으로 지원합니다. 행동으로 사랑을 표현합니다.',
    matches: [
      { type: 'ESFJ', rating: 'excellent', reason: 'ISTP의 실용적 지원과 ESFJ의 감성적 표현이 완벽하게 맞물립니다.' },
      { type: 'ESTJ', rating: 'good', reason: '실용적이고 현실적인 접근 방식을 공유합니다.' },
      { type: 'ENFJ', rating: 'good', reason: 'ENFJ의 따뜻함이 ISTP의 내면을 열어주는 관계입니다.' }
    ]
  },
  {
    type: 'ISFP', nickname: '모험가', group: '탐험가',
    loveStyle: '현재의 순간을 소중히 여기며 진정성 있는 감정 표현을 합니다. 자유롭고 감각적인 연애를 선호합니다.',
    matches: [
      { type: 'ENFJ', rating: 'excellent', reason: 'ENFJ의 리더십이 ISFP를 안내하고 ISFP의 진정성이 ENFJ를 깊이 움직입니다.' },
      { type: 'ESTJ', rating: 'good', reason: 'ESTJ의 안정감이 ISFP에게 든든한 바탕을 제공합니다.' },
      { type: 'ESFJ', rating: 'good', reason: '따뜻한 감성과 현재를 즐기는 공통점이 있습니다.' }
    ]
  },
  {
    type: 'ESTP', nickname: '사업가', group: '탐험가',
    loveStyle: '활동적이고 즉흥적인 연애를 합니다. 파트너와 함께 새로운 경험을 탐구하는 것을 즐깁니다.',
    matches: [
      { type: 'ISFJ', rating: 'excellent', reason: 'ESTP의 활기찬 에너지와 ISFJ의 안정적인 배려가 균형을 이룹니다.' },
      { type: 'ISTJ', rating: 'good', reason: '현실 기반의 문제 해결로 효율적인 파트너십을 구성합니다.' },
      { type: 'INFJ', rating: 'good', reason: 'INFJ의 깊이가 ESTP에게 새로운 관점을 열어줍니다.' }
    ]
  },
  {
    type: 'ESFP', nickname: '연예인', group: '탐험가',
    loveStyle: '즐겁고 생기 있는 관계를 만듭니다. 파트너를 즐겁게 해주고 현재의 행복을 함께 만들어갑니다.',
    matches: [
      { type: 'ISTJ', rating: 'excellent', reason: 'ESFP의 활기가 ISTJ에게 즐거움을 주고 ISTJ의 안정감이 ESFP를 지지합니다.' },
      { type: 'ISFJ', rating: 'good', reason: '따뜻한 감성을 나누며 서로를 배려하는 관계입니다.' },
      { type: 'INTJ', rating: 'good', reason: 'INTJ의 심층적 시각이 ESFP에게 새로운 깊이를 더합니다.' }
    ]
  }
]

const RATING_LABEL: Record<Rating, string> = {
  excellent: '최고 궁합',
  good: '좋은 궁합',
  moderate: '보통 궁합'
}

const RATING_COLOR: Record<Rating, string> = {
  excellent: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  good: 'bg-sky-100 text-sky-700 border-sky-200',
  moderate: 'bg-slate-100 text-slate-600 border-slate-200'
}

const GROUP_COLORS: Record<string, string> = {
  '분석가': 'border-violet-200 bg-violet-50',
  '외교관': 'border-emerald-200 bg-emerald-50',
  '관리자': 'border-sky-200 bg-sky-50',
  '탐험가': 'border-amber-200 bg-amber-50'
}

const GROUP_BADGE: Record<string, string> = {
  '분석가': 'bg-violet-100 text-violet-700',
  '외교관': 'bg-emerald-100 text-emerald-700',
  '관리자': 'bg-sky-100 text-sky-700',
  '탐험가': 'bg-amber-100 text-amber-700'
}

export default function MbtiCompatibilityPage(): JSX.Element {
  useEffect(() => {
    document.title = 'MBTI 16타입 궁합 매트릭스 — 나와 맞는 유형은? | Fove'
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    const desc = 'MBTI 16타입별 연애 궁합을 확인하세요. INTJ, ENFP, INFJ, ENTP 등 각 유형의 최고 궁합과 연애 스타일을 분석합니다.'
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', 'MBTI 16타입 궁합 매트릭스 — Fove')
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[name="twitter:title"]', 'MBTI 16타입 궁합 매트릭스 — Fove')
    setMeta('meta[name="twitter:description"]', desc)
  }, [])

  const groups = ['분석가', '외교관', '관리자', '탐험가']

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-4xl px-4 space-y-10">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl font-bold text-gray-900">MBTI 16타입 궁합 매트릭스</h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            MBTI 유형별 연애 궁합과 스타일을 분석합니다. 인지 기능의 상호보완성을 바탕으로 최고 궁합·좋은 궁합을 정리했습니다. 참고 자료로 활용하되, 실제 관계는 두 사람의 노력이 더 중요합니다.
          </p>
        </header>

        {groups.map((group) => {
          const types = MBTI_DATA.filter((t) => t.group === group)
          return (
            <section key={group} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className={`text-sm font-semibold rounded-full px-3 py-0.5 ${GROUP_BADGE[group]}`}>{group}</span>
                {group} 유형 궁합
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {types.map((data) => (
                  <article key={data.type} className={`rounded-2xl border px-5 py-5 space-y-4 ${GROUP_COLORS[data.group]}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">{data.type}</span>
                        <span className="text-sm text-gray-600">— {data.nickname}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{data.loveStyle}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">추천 궁합</p>
                      {data.matches.map((match) => (
                        <div key={match.type} className="rounded-xl bg-white/70 border border-white px-3 py-2.5 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900">{match.type}</span>
                            <span className={`text-[10px] font-semibold rounded-full border px-2 py-0.5 ${RATING_COLOR[match.rating]}`}>
                              {RATING_LABEL[match.rating]}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{match.reason}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}

        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-6 space-y-3">
          <h2 className="text-base font-semibold text-indigo-900">직접 궁합 점수 확인하기</h2>
          <p className="text-sm text-indigo-700 leading-relaxed">
            사주 오행을 기반으로 두 사람의 생년월일 궁합 점수를 계산합니다. MBTI와 사주를 함께 참고하면 더 입체적인 관계 분석이 가능합니다.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.compatibility)}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition shadow-sm"
            >
              사주 궁합 보기
            </button>
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.mbti)}
              className="rounded-full border border-indigo-200 bg-white px-5 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition"
            >
              MBTI 검사하기
            </button>
          </div>
        </section>
      </div>
    </section>
  )
}
