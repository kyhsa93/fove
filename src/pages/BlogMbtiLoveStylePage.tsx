import { JSX, useEffect } from 'react'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'

interface LoveStyleData {
  type: string
  nickname: string
  group: string
  summary: string
  strengths: string[]
  cautions: string[]
  idealDate: string
}

const LOVE_STYLES: LoveStyleData[] = [
  {
    type: 'INTJ', nickname: '전략가', group: '분석가',
    summary: '깊은 지적 연결을 원합니다. 표현은 서툴지만 한번 마음을 주면 흔들리지 않습니다.',
    strengths: ['변함없는 헌신', '파트너 성장 지원', '진지한 관계 지향'],
    cautions: ['감정 표현 부족', '높은 기대치', '완벽주의적 경향'],
    idealDate: '깊은 대화, 독서 카페, 전시관 방문'
  },
  {
    type: 'INTP', nickname: '논리술사', group: '분석가',
    summary: '감정보다 이성으로 관계를 접근합니다. 상대의 지적 자극이 없으면 금세 멀어집니다.',
    strengths: ['독립성 존중', '비판 없는 수용', '창의적 아이디어'],
    cautions: ['감정적 공감 어려움', '즉흥적 표현 부족', '일상적 배려 소홀'],
    idealDate: '퀴즈나 보드게임, 새로운 주제의 대화'
  },
  {
    type: 'ENTJ', nickname: '통솔자', group: '분석가',
    summary: '목표 지향적 연애를 합니다. 파트너를 리드하고 더 나은 방향으로 이끌고 싶어 합니다.',
    strengths: ['강력한 추진력', '명확한 목표 제시', '파트너 성공 응원'],
    cautions: ['지나친 주도성', '감정보다 논리 우선', '바쁜 일정'],
    idealDate: '새로운 도전, 계획적인 여행, 목표 공유'
  },
  {
    type: 'ENTP', nickname: '변론가', group: '분석가',
    summary: '지적 토론이 연애의 핵심입니다. 틀에 얽매이지 않는 자유로운 관계를 선호합니다.',
    strengths: ['흥미로운 대화', '개방적 마인드', '유머 감각'],
    cautions: ['논쟁적 태도', '집중력 분산', '감정 무시'],
    idealDate: '즉흥 여행, 토론 카페, 새로운 음식 탐방'
  },
  {
    type: 'INFJ', nickname: '옹호자', group: '외교관',
    summary: '깊고 의미 있는 연결을 추구합니다. 상대를 남들보다 더 잘 이해하고 싶어 합니다.',
    strengths: ['깊은 공감 능력', '진정성 있는 지지', '장기적 헌신'],
    cautions: ['지나친 기대', '혼자만의 시간 필요', '표현이 직접적이지 않음'],
    idealDate: '조용한 카페, 의미 있는 장소 방문, 독서'
  },
  {
    type: 'INFP', nickname: '중재자', group: '외교관',
    summary: '진정성과 가치 공유를 가장 중요하게 여깁니다. 깊은 감정적 연결을 꿈꿉니다.',
    strengths: ['진심 어린 감정 표현', '상대 내면 이해', '창의적 애정 표현'],
    cautions: ['이상화 경향', '갈등 회피', '감정 기복'],
    idealDate: '자연 속 산책, 글쓰기·그림 함께하기, 감성 영화'
  },
  {
    type: 'ENFJ', nickname: '주인공', group: '외교관',
    summary: '파트너의 행복을 위해 온 힘을 다합니다. 관계에서 감정 표현이 풍부합니다.',
    strengths: ['헌신적인 배려', '감성적 연결', '파트너 성장 지원'],
    cautions: ['자기 감정 억압', '과도한 책임감', '인정 욕구'],
    idealDate: '함께하는 봉사활동, 기념일 이벤트, 대화 중심 데이트'
  },
  {
    type: 'ENFP', nickname: '활동가', group: '외교관',
    summary: '열정적이고 낭만적입니다. 파트너에게 영감을 주고 함께 성장하는 관계를 원합니다.',
    strengths: ['풍부한 감정 표현', '창의적 데이트 계획', '긍정적 에너지'],
    cautions: ['쉽게 열정 식음', '계획 변경 잦음', '깊이 있는 관계 유지 어려움'],
    idealDate: '즉흥 여행, 축제, 새로운 취미 탐색'
  },
  {
    type: 'ISTJ', nickname: '물류관리자', group: '관리자',
    summary: '안정과 신뢰를 기반으로 관계를 쌓습니다. 말보다 행동으로 사랑을 증명합니다.',
    strengths: ['일관된 신뢰', '실질적인 지원', '오래 지속되는 헌신'],
    cautions: ['감정 표현 서툼', '변화에 느린 적응', '융통성 부족'],
    idealDate: '단골 식당, 집에서 함께 요리, 규칙적인 데이트'
  },
  {
    type: 'ISFJ', nickname: '수호자', group: '관리자',
    summary: '따뜻하고 세심한 배려로 관계를 지킵니다. 파트너의 필요를 먼저 챙깁니다.',
    strengths: ['세심한 배려', '안정적인 존재감', '기억력 좋은 애정 표현'],
    cautions: ['자기 표현 부족', '갈등 회피 경향', '지나친 희생'],
    idealDate: '소박한 집밥 데이트, 추억 만들기, 조용한 여행'
  },
  {
    type: 'ESTJ', nickname: '경영자', group: '관리자',
    summary: '책임감 있고 체계적으로 관계를 관리합니다. 파트너에게 안정감을 제공합니다.',
    strengths: ['믿음직한 안정감', '계획적인 배려', '명확한 의사소통'],
    cautions: ['융통성 부족', '감정보다 원칙 우선', '간섭적 태도'],
    idealDate: '계획된 여행, 공식 기념일 챙기기, 목표 공유 대화'
  },
  {
    type: 'ESFJ', nickname: '집정관', group: '관리자',
    summary: '표현이 풍부하고 관계의 조화를 최우선으로 합니다. 파트너의 감정에 민감합니다.',
    strengths: ['감성적 공감', '적극적인 애정 표현', '관계 분위기 관리'],
    cautions: ['외부 평가 의식', '갈등 회피', '감정적 의존'],
    idealDate: '가족·친구와의 만남, 특별한 이벤트 기획'
  },
  {
    type: 'ISTP', nickname: '장인', group: '탐험가',
    summary: '독립성을 유지하면서 실질적으로 파트너를 돕습니다. 행동으로 사랑을 표현합니다.',
    strengths: ['실용적인 지원', '스트레스 없는 관계', '위기 대처 능력'],
    cautions: ['감정 표현 최소화', '갑작스러운 철수', '장기 계획 부재'],
    idealDate: '함께 만들기(요리, 공작), 스포츠, 새로운 기술 도전'
  },
  {
    type: 'ISFP', nickname: '모험가', group: '탐험가',
    summary: '현재 순간에 충실한 감각적 사랑을 합니다. 진정성 있는 감정 표현을 중시합니다.',
    strengths: ['풍부한 감성', '상대 존중', '자유로운 연애 스타일'],
    cautions: ['미래 계획 소홀', '감정 억압', '갈등 시 침묵'],
    idealDate: '예술 전시, 자연 속 피크닉, 감성적인 음악 공연'
  },
  {
    type: 'ESTP', nickname: '사업가', group: '탐험가',
    summary: '활동적이고 즉흥적입니다. 파트너와 새로운 경험을 함께 탐구하는 것을 즐깁니다.',
    strengths: ['활기찬 에너지', '현실 문제 해결', '즉흥적 낭만'],
    cautions: ['깊이 있는 감정 어려움', '장기 계획 부재', '자극 추구 경향'],
    idealDate: '스포츠, 즉흥 여행, 새로운 활동 도전'
  },
  {
    type: 'ESFP', nickname: '연예인', group: '탐험가',
    summary: '생기 있고 즐거운 연애를 만듭니다. 파트너를 웃게 하고 함께하는 순간을 소중히 합니다.',
    strengths: ['긍정적인 에너지', '다채로운 데이트', '즉각적인 감정 표현'],
    cautions: ['미래 계획 어려움', '주의 분산', '깊이 있는 관계 회피'],
    idealDate: '파티, 콘서트, 새로운 맛집 탐방'
  }
]

const GROUP_COLORS: Record<string, { card: string; badge: string }> = {
  '분석가': { card: 'border-violet-100 bg-violet-50/50', badge: 'bg-violet-100 text-violet-700' },
  '외교관': { card: 'border-emerald-100 bg-emerald-50/50', badge: 'bg-emerald-100 text-emerald-700' },
  '관리자': { card: 'border-sky-100 bg-sky-50/50', badge: 'bg-sky-100 text-sky-700' },
  '탐험가': { card: 'border-amber-100 bg-amber-50/50', badge: 'bg-amber-100 text-amber-700' }
}

export default function BlogMbtiLoveStylePage(): JSX.Element {
  useEffect(() => {
    document.title = 'MBTI별 연애 스타일 완벽 정리 — 16타입 사랑 방식 | Fove'
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    const desc = 'MBTI 16타입별 연애 스타일을 완벽 정리합니다. INTJ, ENFP, INFJ, ENTP 등 각 유형이 사랑을 표현하는 방식, 강점과 주의점, 이상적인 데이트까지 분석합니다.'
    setMeta('meta[name="description"]', desc)
    setMeta('meta[property="og:title"]', 'MBTI별 연애 스타일 완벽 정리 — Fove')
    setMeta('meta[property="og:description"]', desc)
    setMeta('meta[name="twitter:title"]', 'MBTI별 연애 스타일 완벽 정리 — Fove')
    setMeta('meta[name="twitter:description"]', desc)
  }, [])

  const groups = ['분석가', '외교관', '관리자', '탐험가']

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-2xl px-4 space-y-10">
        <header className="space-y-3 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">MBTI 연애 분석</p>
          <h1 className="text-3xl font-bold text-gray-900">MBTI별 연애 스타일 완벽 정리</h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            MBTI 16가지 유형이 사랑을 표현하는 방식, 연애의 강점과 주의점, 이상적인 데이트까지 유형별로 분석합니다. 내 유형과 상대 유형을 함께 확인해보세요.
          </p>
        </header>

        {groups.map((group) => {
          const types = LOVE_STYLES.filter((t) => t.group === group)
          const colors = GROUP_COLORS[group]
          return (
            <section key={group} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className={`text-sm font-semibold rounded-full px-3 py-0.5 ${colors.badge}`}>{group}</span>
                {group} 유형의 연애
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {types.map((data) => (
                  <article key={data.type} className={`rounded-2xl border px-5 py-5 space-y-4 ${colors.card}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">{data.type}</span>
                        <span className="text-sm text-gray-500">— {data.nickname}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-xl bg-white/70 border border-white px-3 py-2.5 space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600">강점</p>
                        <ul className="space-y-0.5">
                          {data.strengths.map((s) => (
                            <li key={s} className="text-xs text-gray-700">· {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-xl bg-white/70 border border-white px-3 py-2.5 space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-500">주의</p>
                        <ul className="space-y-0.5">
                          {data.cautions.map((c) => (
                            <li key={c} className="text-xs text-gray-700">· {c}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/60 border border-white px-3 py-2 space-y-0.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">이상적 데이트</p>
                      <p className="text-xs text-gray-700">{data.idealDate}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}

        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-6 space-y-3">
          <h2 className="text-base font-semibold text-indigo-900">MBTI 궁합도 확인해보세요</h2>
          <p className="text-sm text-indigo-700 leading-relaxed">
            내 유형과 상대 유형의 궁합 점수를 매트릭스로 확인하거나, 사주 오행 기반 궁합 점수를 계산해보세요.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.mbtiCompatibility)}
              className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-600 transition shadow-sm"
            >
              MBTI 궁합 매트릭스
            </button>
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.compatibility)}
              className="rounded-full border border-indigo-200 bg-white px-5 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition"
            >
              사주 궁합 보기
            </button>
          </div>
        </section>

        <nav className="rounded-2xl border border-slate-100 bg-white/80 px-5 py-5 space-y-3">
          <h2 className="text-sm font-semibold text-slate-600">관련 글</h2>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.blogSajuBasics)}
              className="block w-full text-left text-sm text-slate-700 hover:text-rose-600 transition"
            >
              → 사주란 무엇인가? 사주팔자 기초 완벽 정리
            </button>
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.blogZodiacStandard)}
              className="block w-full text-left text-sm text-slate-700 hover:text-rose-600 transition"
            >
              → 띠 기준은 입춘인가 음력 설인가?
            </button>
          </div>
        </nav>
      </div>
    </section>
  )
}
