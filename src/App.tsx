import { JSX, useCallback, useEffect, useMemo, useState } from 'react'
import HomePage from './pages/HomePage'
import SajuPage from './pages/SajuPage'
import MbtiPage from './pages/MbtiPage'
import FortunePage from './pages/FortunePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import ContactPage from './pages/ContactPage'
import FortuneWeekPage from './pages/FortuneWeekPage'
import FortuneMonthPage from './pages/FortuneMonthPage'
import FortuneYearPage from './pages/FortuneYearPage'
import ZodiacPage from './pages/ZodiacPage'
import InsightPage from './pages/InsightPage'
import CompatibilityPage from './pages/CompatibilityPage'
import QuizPage from './pages/QuizPage'
import SajuYearPage from './pages/SajuYearPage'
import MbtiCompatibilityPage from './pages/MbtiCompatibilityPage'
import ZodiacCompatPage from './pages/ZodiacCompatPage'
import CombinedCompatPage from './pages/CombinedCompatPage'
import BlogSajuBasicsPage from './pages/BlogSajuBasicsPage'
import BlogZodiacStandardPage from './pages/BlogZodiacStandardPage'
import BlogMbtiLoveStylePage from './pages/BlogMbtiLoveStylePage'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { BottomNav } from './components/BottomNav'
import { ConsentBanner } from './components/ConsentBanner'
import { AdConsentProvider } from './lib/adConsent'
import type { RoutePath } from './routes'
import { ROUTE_PATHS, footerLinks } from './routes'

type RouteConfig = {
  component: () => JSX.Element
  title: string
  description: string
  ogTitle: string
}

const routes: Record<RoutePath, RouteConfig> = {
  [ROUTE_PATHS.home]: {
    component: HomePage,
    title: 'Fove · 하루 인사이트 허브',
    description: '사주 계산, MBTI 성향 진단, 오늘의 운세를 한 곳에서 확인하세요. 생년월일 기반 맞춤 인사이트를 제공합니다.',
    ogTitle: 'Fove · 하루 인사이트 허브'
  },
  [ROUTE_PATHS.saju]: {
    component: SajuPage,
    title: 'Fove · 사주 풀이',
    description: '생년월일과 태어난 시간으로 사주팔자를 계산하고 오행 밸런스와 사주 해석을 확인하세요.',
    ogTitle: '사주 풀이 — Fove'
  },
  [ROUTE_PATHS.mbti]: {
    component: MbtiPage,
    title: 'Fove · MBTI 성향 진단',
    description: '20문항으로 빠르게 MBTI 성향을 진단하고 사주 운세와 교차 인사이트를 받아보세요.',
    ogTitle: 'MBTI 성향 진단 — Fove'
  },
  [ROUTE_PATHS.fortune]: {
    component: FortunePage,
    title: 'Fove · 오늘의 운세',
    description: '사주와 일진을 조합해 오늘의 에너지 흐름, 분야별 운세(일·사랑·재물·건강), 행운 요소를 확인하세요.',
    ogTitle: '오늘의 운세 — Fove'
  },
  [ROUTE_PATHS.fortuneWeek]: {
    component: FortuneWeekPage,
    title: 'Fove · 이번 주 일진 흐름',
    description: '이번 주 7일의 일진 천간·지지와 오행 에너지 흐름을 한눈에 확인하세요.',
    ogTitle: '이번 주 일진 — Fove'
  },
  [ROUTE_PATHS.fortuneMonth]: {
    component: FortuneMonthPage,
    title: 'Fove · 이번 달 일진 달력',
    description: '이번 달 매일의 일진 천간·지지와 오행 기운을 달력 형태로 한눈에 확인하세요.',
    ogTitle: '이번 달 일진 달력 — Fove'
  },
  [ROUTE_PATHS.fortuneYear]: {
    component: FortuneYearPage,
    title: 'Fove · 연간 운세',
    description: '올해 12개월의 월주 오행 흐름을 확인하고 시기별 에너지와 행동 방향을 파악하세요.',
    ogTitle: '연간 운세 — Fove'
  },
  [ROUTE_PATHS.zodiac]: {
    component: ZodiacPage,
    title: 'Fove · 띠별 운세',
    description: '12간지 띠별 기질·관계·직업·건강 특성과 사주 오행 분석을 확인하세요.',
    ogTitle: '띠별 운세 — Fove'
  },
  [ROUTE_PATHS.insight]: {
    component: InsightPage,
    title: 'Fove · 사주·MBTI 통합 인사이트',
    description: '타고난 사주 성향과 현재 MBTI 성향을 결합해 나만의 맞춤 성향 리포트를 확인하세요.',
    ogTitle: '사주·MBTI 통합 인사이트 — Fove'
  },
  [ROUTE_PATHS.compatibility]: {
    component: CompatibilityPage,
    title: 'Fove · 궁합 보기',
    description: '두 사람의 생년월일과 사주 오행을 분석해 연인·친구·직장 궁합 점수를 확인하세요.',
    ogTitle: '궁합 보기 — Fove'
  },
  [ROUTE_PATHS.quiz]: {
    component: QuizPage,
    title: 'Fove · 운세 심리테스트',
    description: '가벼운 심리테스트로 나의 운 흐름과 성향을 확인하고 결과를 공유해 보세요.',
    ogTitle: '운세 심리테스트 — Fove'
  },
  [ROUTE_PATHS.sajuYear]: {
    component: SajuYearPage,
    title: 'Fove · 생년별 사주 특성',
    description: '생년별 사주 연주(年柱) 오행 특성, 성향, 직업, 재물, 건강 분석을 확인하세요.',
    ogTitle: '생년별 사주 특성 — Fove'
  },
  [ROUTE_PATHS.mbtiCompatibility]: {
    component: MbtiCompatibilityPage,
    title: 'MBTI 16타입 궁합 매트릭스 — 나와 맞는 유형은? | Fove',
    description: 'MBTI 16타입별 연애 궁합을 확인하세요. INTJ, ENFP, INFJ, ENTP 등 각 유형의 최고 궁합과 연애 스타일을 분석합니다.',
    ogTitle: 'MBTI 16타입 궁합 매트릭스 — Fove'
  },
  [ROUTE_PATHS.zodiacCompatibility]: {
    component: ZodiacCompatPage,
    title: '띠 궁합 — 12간지 궁합 보기 | Fove',
    description: '쥐띠·소띠·호랑이띠 등 12간지 띠별 궁합을 확인하세요. 삼합·육합·충 기반으로 연인·친구·직장 궁합을 분석합니다.',
    ogTitle: '띠 궁합 — 12간지 궁합 보기 | Fove'
  },
  [ROUTE_PATHS.combinedCompatibility]: {
    component: CombinedCompatPage,
    title: '사주+MBTI 통합 궁합 | Fove',
    description: '사주 오행(40%)과 MBTI 인지기능(60%)을 결합한 통합 궁합을 확인하세요. 두 사람의 에너지 흐름과 소통 방식을 교차 분석합니다.',
    ogTitle: '사주+MBTI 통합 궁합 — Fove'
  },
  [ROUTE_PATHS.blogSajuBasics]: {
    component: BlogSajuBasicsPage,
    title: '사주란 무엇인가? 사주팔자 기초 완벽 정리 | Fove',
    description: '사주(四柱)의 개념부터 천간·지지·오행·60갑자까지. 사주팔자 계산 방법과 연주·월주·일주·시주의 기준을 쉽게 설명합니다.',
    ogTitle: '사주란 무엇인가? — Fove'
  },
  [ROUTE_PATHS.blogZodiacStandard]: {
    component: BlogZodiacStandardPage,
    title: '띠 기준은 입춘인가 음력 설인가? 완벽 정리 | Fove',
    description: '1~2월생이 혼란스러워하는 띠 기준을 완벽 정리합니다. 입춘 기준과 음력 설 기준의 차이, 사주명리학의 올바른 연주 계산법을 설명합니다.',
    ogTitle: '띠 기준은 입춘인가 음력 설인가? — Fove'
  },
  [ROUTE_PATHS.blogMbtiLoveStyle]: {
    component: BlogMbtiLoveStylePage,
    title: 'MBTI별 연애 스타일 완벽 정리 — 16타입 사랑 방식 | Fove',
    description: 'MBTI 16타입별 연애 스타일을 완벽 정리합니다. 각 유형이 사랑을 표현하는 방식, 강점과 주의점, 이상적인 데이트까지 분석합니다.',
    ogTitle: 'MBTI별 연애 스타일 완벽 정리 — Fove'
  },
  [ROUTE_PATHS.privacyPolicy]: {
    component: PrivacyPolicyPage,
    title: 'Fove 개인정보 처리방침',
    description: 'Fove 서비스의 개인정보 처리방침을 확인하세요.',
    ogTitle: '개인정보 처리방침 — Fove'
  },
  [ROUTE_PATHS.termsOfService]: {
    component: TermsOfServicePage,
    title: 'Fove 이용약관',
    description: 'Fove 서비스 이용약관을 확인하세요.',
    ogTitle: '이용약관 — Fove'
  },
  [ROUTE_PATHS.contact]: {
    component: ContactPage,
    title: 'Fove 문의하기',
    description: 'Fove 서비스에 대한 문의와 피드백을 보내주세요.',
    ogTitle: '문의하기 — Fove'
  }
}

const routeKeys = Object.keys(routes) as RoutePath[]

const normalizePath = (rawPath: string): RoutePath => {
  if (!rawPath) return ROUTE_PATHS.home
  const cleaned = rawPath.replace(/\/+$/, '') || '/'
  if (cleaned === ROUTE_PATHS.zodiacCompatibility) return ROUTE_PATHS.zodiacCompatibility
  if (cleaned.startsWith('/zodiac')) return ROUTE_PATHS.zodiac
  if (/^\/saju\/\d{4}$/.test(cleaned)) return ROUTE_PATHS.sajuYear
  const match = routeKeys.find((key) => key === cleaned)
  return match ?? ROUTE_PATHS.home
}

const normalizePathWithQuery = (rawPath: string): RoutePath => {
  // strip query string before matching
  return normalizePath(rawPath.split('?')[0])
}

const getInitialPath = (): RoutePath => {
  if (typeof window === 'undefined') return ROUTE_PATHS.home
  return normalizePathWithQuery(window.location.pathname + window.location.search)
}

export default function App(): JSX.Element {
  const [currentPath, setCurrentPath] = useState<RoutePath>(() => getInitialPath())

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handlePopState = () => {
      setCurrentPath(normalizePathWithQuery(window.location.pathname + window.location.search))
    }
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    // zodiac·saju-year 세부 페이지는 해당 컴포넌트 내부에서 메타 처리
    const actualPath = typeof window !== 'undefined' ? window.location.pathname : currentPath
    if (actualPath.startsWith('/zodiac/')) return
    if (/^\/saju\/\d{4}$/.test(actualPath)) return
    const meta = routes[currentPath]
    if (!meta) return
    document.title = meta.title
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector)
      if (el) el.setAttribute('content', content)
    }
    setMeta('meta[name="description"]', meta.description)
    setMeta('meta[property="og:title"]', meta.ogTitle)
    setMeta('meta[property="og:description"]', meta.description)
    setMeta('meta[name="twitter:title"]', meta.ogTitle)
    setMeta('meta[name="twitter:description"]', meta.description)
  }, [currentPath])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const actual = window.location.pathname
    // zodiac·saju-year 세부 경로는 pushState로 이미 정확히 설정됨 — replaceState 불필요
    if (actual.startsWith('/zodiac/')) return
    if (/^\/saju\/\d{4}$/.test(actual)) return
    if (actual !== currentPath) {
      window.history.replaceState({}, '', currentPath)
    }
  }, [currentPath])

  const navigate = useCallback((nextPath: RoutePath) => {
    if (typeof window === 'undefined') return
    if (nextPath === currentPath) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.history.pushState({}, '', nextPath)
    setCurrentPath(nextPath)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPath])

  const CurrentPage = useMemo(() => routes[currentPath]?.component ?? HomePage, [currentPath])
  const backgroundClass =
    currentPath === ROUTE_PATHS.home
      ? 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900'
      : currentPath === ROUTE_PATHS.saju
        ? 'bg-gradient-to-b from-amber-50 via-white to-rose-50'
        : currentPath === ROUTE_PATHS.mbti
          ? 'bg-gradient-to-b from-indigo-50 via-white to-slate-100'
          : currentPath === ROUTE_PATHS.fortune
            ? 'bg-gradient-to-b from-rose-50 via-white to-emerald-50'
            : 'bg-slate-100'

  const isHomeDark = currentPath === ROUTE_PATHS.home

  return (
    <AdConsentProvider>
      <div className={`flex min-h-screen flex-col text-slate-900 ${backgroundClass}`}>
        <a href="#main-content" className="skip-link">
          본문으로 바로가기
        </a>
        <Header currentPath={currentPath} onNavigate={navigate} isDark={isHomeDark} />
        <main id="main-content" tabIndex={-1} className="flex-1 pb-16 sm:pb-0 focus:outline-none">
          <CurrentPage />
        </main>
        <Footer currentPath={currentPath} onNavigate={navigate} />
        <BottomNav currentPath={currentPath} onNavigate={navigate} isDark={isHomeDark} />
        <ConsentBanner />
      </div>
    </AdConsentProvider>
  )
}
