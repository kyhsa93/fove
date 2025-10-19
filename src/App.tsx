import { JSX, useCallback, useEffect, useMemo, useState } from 'react'
import HomePage from './pages/HomePage'
import SajuPage from './pages/SajuPage'
import MbtiPage from './pages/MbtiPage'
import FortunePage from './pages/FortunePage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import ContactPage from './pages/ContactPage'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import type { RoutePath } from './routes'
import { BASE_PATH, ROUTE_PATHS, footerLinks } from './routes'

type RouteConfig = {
  component: () => JSX.Element
  title: string
}

const routes: Record<RoutePath, RouteConfig> = {
  [ROUTE_PATHS.home]: {
    component: HomePage,
    title: 'Fove · 하루 인사이트 허브'
  },
  [ROUTE_PATHS.saju]: {
    component: SajuPage,
    title: 'Fove · 사주 풀이'
  },
  [ROUTE_PATHS.mbti]: {
    component: MbtiPage,
    title: 'Fove · MBTI 성향 진단'
  },
  [ROUTE_PATHS.fortune]: {
    component: FortunePage,
    title: 'Fove · 오늘의 운세'
  },
  [ROUTE_PATHS.privacyPolicy]: {
    component: PrivacyPolicyPage,
    title: 'Fove 개인정보 처리방침'
  },
  [ROUTE_PATHS.termsOfService]: {
    component: TermsOfServicePage,
    title: 'Fove 이용약관'
  },
  [ROUTE_PATHS.contact]: {
    component: ContactPage,
    title: 'Fove 문의하기'
  }
}

const routeKeys = Object.keys(routes) as RoutePath[]

const normalizePath = (rawPath: string): RoutePath => {
  if (!rawPath) return ROUTE_PATHS.home
  const cleaned = rawPath.replace(/\/+$/, '') || '/'
  if (cleaned === '/') return ROUTE_PATHS.home
  const match = routeKeys.find((key) => key === cleaned)
  if (match) return match
  if (cleaned.startsWith('/') && !cleaned.startsWith(BASE_PATH)) {
    const candidate = `${BASE_PATH}${cleaned}` as RoutePath
    if (routeKeys.includes(candidate)) {
      return candidate
    }
  }
  return ROUTE_PATHS.home
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
    if (meta) {
      document.title = meta.title
    }
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
