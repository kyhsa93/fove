import { JSX, useCallback, useEffect, useMemo, useState } from 'react'
import HomePage from './pages/HomePage'
import SajuPage from './pages/SajuPage'
import MbtiPage from './pages/MbtiPage'
import FortunePage from './pages/FortunePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import ContactPage from './pages/ContactPage'
import FortuneWeekPage from './pages/FortuneWeekPage'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
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
  const match = routeKeys.find((key) => key === cleaned)
  return match ?? ROUTE_PATHS.home
}

const getInitialPath = (): RoutePath => {
  if (typeof window === 'undefined') return ROUTE_PATHS.home
  return normalizePath(window.location.pathname)
}

export default function App(): JSX.Element {
  const [currentPath, setCurrentPath] = useState<RoutePath>(() => getInitialPath())

  useEffect(() => {
    if (typeof window === 'undefined') return
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname))
    }
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
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
    if (window.location.pathname !== currentPath) {
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

  return (
    <div className={`flex min-h-screen flex-col text-slate-900 ${backgroundClass}`}>
      <a href="#main-content" className="skip-link">
        본문으로 바로가기
      </a>
      <Header currentPath={currentPath} onNavigate={navigate} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <CurrentPage />
      </main>
      <Footer currentPath={currentPath} onNavigate={navigate} />
    </div>
  )
}
