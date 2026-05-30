import { JSX, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { BottomNav } from './components/BottomNav'
import { ConsentBanner } from './components/ConsentBanner'
import { ToastProvider } from './components/ToastProvider'
import { AdConsentProvider } from './lib/adConsent'
import { injectNavigate } from './lib/router'
import { checkAndNotifyOnLoad, registerPeriodicSync, isOptedIn, getNotificationPermission } from './lib/notifications'
import { ROUTE_PATHS } from './routes'

type RouteMeta = { title: string; description: string; ogTitle: string }

const ROUTE_META: Record<string, RouteMeta> = {
  '/': { title: 'Fove · 하루 인사이트 허브', description: '사주 계산, MBTI 성향 진단, 오늘의 운세를 한 곳에서 확인하세요.', ogTitle: 'Fove · 하루 인사이트 허브' },
  '/saju': { title: 'Fove · 사주 풀이', description: '생년월일과 태어난 시간으로 사주팔자를 계산하고 오행 밸런스와 사주 해석을 확인하세요.', ogTitle: '사주 풀이 — Fove' },
  '/mbti': { title: 'Fove · MBTI 성향 진단', description: '20문항으로 빠르게 MBTI 성향을 진단하고 사주 운세와 교차 인사이트를 받아보세요.', ogTitle: 'MBTI 성향 진단 — Fove' },
  '/fortune': { title: 'Fove · 오늘의 운세', description: '사주와 일진을 조합해 오늘의 에너지 흐름, 분야별 운세(일·사랑·재물·건강), 행운 요소를 확인하세요.', ogTitle: '오늘의 운세 — Fove' },
  '/fortune/week': { title: 'Fove · 이번 주 일진 흐름', description: '이번 주 7일의 일진 천간·지지와 오행 에너지 흐름을 한눈에 확인하세요.', ogTitle: '이번 주 일진 — Fove' },
  '/fortune/month': { title: 'Fove · 이번 달 일진 달력', description: '이번 달 매일의 일진 천간·지지와 오행 기운을 달력 형태로 한눈에 확인하세요.', ogTitle: '이번 달 일진 달력 — Fove' },
  '/fortune/year': { title: 'Fove · 연간 운세', description: '올해 12개월의 월주 오행 흐름을 확인하고 시기별 에너지와 행동 방향을 파악하세요.', ogTitle: '연간 운세 — Fove' },
  '/zodiac': { title: 'Fove · 띠별 운세', description: '12간지 띠별 기질·관계·직업·건강 특성과 사주 오행 분석을 확인하세요.', ogTitle: '띠별 운세 — Fove' },
  '/insight': { title: 'Fove · 사주·MBTI 통합 인사이트', description: '타고난 사주 성향과 현재 MBTI 성향을 결합해 나만의 맞춤 성향 리포트를 확인하세요.', ogTitle: '사주·MBTI 통합 인사이트 — Fove' },
  '/compatibility': { title: 'Fove · 궁합 보기', description: '두 사람의 생년월일과 사주 오행을 분석해 연인·친구·직장 궁합 점수를 확인하세요.', ogTitle: '궁합 보기 — Fove' },
  '/mbti/compatibility': { title: 'MBTI 16타입 궁합 매트릭스 | Fove', description: 'MBTI 16타입별 연애 궁합을 확인하세요.', ogTitle: 'MBTI 16타입 궁합 매트릭스 — Fove' },
  '/zodiac/compatibility': { title: '띠 궁합 — 12간지 궁합 보기 | Fove', description: '12간지 띠별 궁합을 확인하세요.', ogTitle: '띠 궁합 — Fove' },
  '/compatibility/combined': { title: '사주+MBTI 통합 궁합 | Fove', description: '사주 오행과 MBTI를 결합한 통합 궁합을 확인하세요.', ogTitle: '사주+MBTI 통합 궁합 — Fove' },
  '/quiz': { title: 'Fove · 운세 심리테스트', description: '가벼운 심리테스트로 나의 운 흐름과 성향을 확인하고 결과를 공유해 보세요.', ogTitle: '운세 심리테스트 — Fove' },
  '/privacy-policy': { title: 'Fove 개인정보 처리방침', description: 'Fove 서비스의 개인정보 처리방침을 확인하세요.', ogTitle: '개인정보 처리방침 — Fove' },
  '/terms-of-service': { title: 'Fove 이용약관', description: 'Fove 서비스 이용약관을 확인하세요.', ogTitle: '이용약관 — Fove' },
  '/contact': { title: 'Fove 문의하기', description: 'Fove 서비스에 대한 문의와 피드백을 보내주세요.', ogTitle: '문의하기 — Fove' },
}

function getBackgroundClass(pathname: string): string {
  if (pathname === '/') return 'bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900'
  if (pathname === '/saju' || pathname.startsWith('/saju/')) return 'bg-gradient-to-b from-amber-50 via-white to-rose-50'
  if (pathname === '/mbti' || pathname.startsWith('/mbti/')) return 'bg-gradient-to-b from-indigo-50 via-white to-slate-100'
  if (pathname.startsWith('/fortune')) return 'bg-gradient-to-b from-rose-50 via-white to-emerald-50'
  return 'bg-slate-100'
}

export default function Layout(): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    injectNavigate(navigate)
  }, [navigate])

  useEffect(() => {
    checkAndNotifyOnLoad()
    if (isOptedIn() && getNotificationPermission() === 'granted') {
      registerPeriodicSync()
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    // 동적 메타(SajuYearPage, ZodiacPage 등)는 해당 컴포넌트에서 직접 처리
    if (/^\/saju\/\d{4}$/.test(location.pathname)) return
    if (location.pathname.startsWith('/zodiac/') && location.pathname !== '/zodiac/compatibility') return
    if (location.pathname.startsWith('/blog/')) return

    const meta = ROUTE_META[location.pathname]
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
  }, [location.pathname])

  const backgroundClass = getBackgroundClass(location.pathname)
  const isHomeDark = location.pathname === '/'

  return (
    <ToastProvider>
      <AdConsentProvider>
        <div className={`flex min-h-screen flex-col text-slate-900 ${backgroundClass}`}>
          <a href="#main-content" className="skip-link">
            본문으로 바로가기
          </a>
          <Header isDark={isHomeDark} />
          <main id="main-content" tabIndex={-1} className="flex-1 pb-16 sm:pb-0 focus:outline-none">
            <Outlet />
          </main>
          <Footer />
          <BottomNav isDark={isHomeDark} />
          <ConsentBanner />
        </div>
      </AdConsentProvider>
    </ToastProvider>
  )
}
