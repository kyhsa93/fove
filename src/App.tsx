import { JSX, useCallback, useEffect, useMemo, useState } from 'react'
import SajuPage from './pages/SajuPage'
import MbtiPage from './pages/MbtiPage'
import FortuneLottoPage from './pages/FortuneLottoPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import ContactPage from './pages/ContactPage'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import type { RoutePath } from './routes'
import { footerLinks } from './routes'

type RouteConfig = {
  component: () => JSX.Element
  title: string
}

const routes: Record<RoutePath, RouteConfig> = {
  '/': {
    component: SajuPage,
    title: 'Fove · 사주 풀이'
  },
  '/saju': {
    component: SajuPage,
    title: 'Fove · 사주 풀이'
  },
  '/mbti': {
    component: MbtiPage,
    title: 'Fove · MBTI 성향 진단'
  },
  '/fortune': {
    component: FortuneLottoPage,
    title: 'Fove · 오늘의 운세 & 로또 추천'
  },
  '/privacy-policy': {
    component: PrivacyPolicyPage,
    title: 'Fove 개인정보 처리방침'
  },
  '/terms-of-service': {
    component: TermsOfServicePage,
    title: 'Fove 이용약관'
  },
  '/contact': {
    component: ContactPage,
    title: 'Fove 문의하기'
  }
}

const routeKeys = Object.keys(routes) as RoutePath[]

const normalizePath = (rawPath: string): RoutePath => {
  if (!rawPath) return '/'
  const cleaned = rawPath.replace(/\/+$/, '') || '/'
  const match = routeKeys.find((key) => key === cleaned)
  return match ?? '/'
}

const getInitialPath = (): RoutePath => {
  if (typeof window === 'undefined') return '/'
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

  const CurrentPage = useMemo(() => routes[currentPath]?.component ?? SajuPage, [currentPath])
  const backgroundClass =
    currentPath === '/' || currentPath === '/saju'
      ? 'bg-gradient-to-b from-amber-50 via-white to-rose-50'
      : currentPath === '/mbti'
        ? 'bg-gradient-to-b from-indigo-50 via-white to-slate-100'
        : currentPath === '/fortune'
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
