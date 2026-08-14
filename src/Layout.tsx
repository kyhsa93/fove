import { JSX, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { BottomNav } from './components/BottomNav'
import { ConsentBanner } from './components/ConsentBanner'
import { InstallBanner } from './components/InstallBanner'
import { ToastProvider, useToast } from './components/ToastProvider'
import { AdConsentProvider } from './lib/adConsent'
import { injectNavigate } from './lib/router'
import {
  checkAndNotifyOnLoad,
  registerPeriodicSync,
  isOptedIn,
  getNotificationPermission,
  shouldShowEveningStreakReminder,
  markEveningStreakReminderShown,
} from './lib/notifications'
import { recordVisit, getStreakCount } from './lib/streak'
import { isStandalone, isInstalled } from './lib/installPrompt'
import { ROUTE_PATHS } from './routes'

const STREAK_MILESTONES: Record<number, string> = {
  7: '🔥 7일 연속 방문! 일주일 개근이에요!',
  30: '🔥 30일 연속! 한 달 개근 달성!',
  100: '🔥 100일 연속! 전설이 되었어요!',
}

function AppInit(): null {
  const { showToast } = useToast()

  useEffect(() => {
    const streak = recordVisit()
    if (streak.isFirstToday && streak.count >= 2) {
      const milestone = STREAK_MILESTONES[streak.count]
      if (milestone) {
        showToast(milestone, 'success', 6000)
      } else {
        showToast(`🔥 ${streak.count}일 연속 방문 중이에요`, 'info', 3000)
      }
    }

    if (streak.isFirstToday && shouldShowEveningStreakReminder()) {
      const count = getStreakCount()
      showToast(`🔥 ${count}일 스트릭 진행 중이에요. 내일도 방문하면 계속 유지돼요!`, 'info', 6000)
      markEveningStreakReminderShown()
    }

    checkAndNotifyOnLoad()
    if (isOptedIn() && getNotificationPermission() === 'granted') {
      registerPeriodicSync()
    }

    if (isStandalone() && isInstalled() && !isOptedIn()) {
      setTimeout(() => {
        showToast('알림을 켜면 매일 운세를 자동으로 받을 수 있어요!', 'info', 6000)
      }, 2000)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

import { SITE_URL, OG_IMAGE_URL } from './lib/siteUrl'

const DEFAULT_OG_IMAGE = OG_IMAGE_URL

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
  '/tarot': { title: 'Fove · 오늘의 타로 카드', description: '78장 타로 덱에서 오늘을 위한 카드 3장을 뽑고 에너지·행동·주의 포인트를 확인하세요.', ogTitle: '오늘의 타로 카드 — Fove' },
  '/taekil': { title: '택일 — 좋은 날 고르기 | Fove', description: '결혼·이사·개업·계약 등 중요한 행사에 맞는 이번 달 좋은 날을 오행 기반으로 찾아드립니다.', ogTitle: '택일 — 좋은 날 고르기 | Fove' },
  '/blood-compatibility': { title: '혈액형 궁합 — A·B·O·AB형 16조합 | Fove', description: '두 사람의 혈액형으로 성향 기반 궁합을 확인하세요. A·B·O·AB형 16가지 조합 분석을 제공합니다.', ogTitle: '혈액형 궁합 — Fove' },
  '/starsign-compatibility': { title: '별자리 궁합 — 12별자리 144조합 | Fove', description: '두 사람의 별자리로 원소 기반 궁합을 확인하세요. 12별자리 144가지 조합 분석을 제공합니다.', ogTitle: '별자리 궁합 — Fove' },
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
    if (typeof document === 'undefined') return
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
    setMeta('meta[property="og:url"]', `${SITE_URL}${location.pathname}`)
    setMeta('meta[property="og:image"]', DEFAULT_OG_IMAGE)
    setMeta('meta[property="og:image:alt"]', meta.ogTitle)
    setMeta('meta[name="twitter:title"]', meta.ogTitle)
    setMeta('meta[name="twitter:description"]', meta.description)
    setMeta('meta[name="twitter:image"]', DEFAULT_OG_IMAGE)
  }, [location.pathname])

  const backgroundClass = getBackgroundClass(location.pathname)
  const isHomeDark = location.pathname === '/'

  return (
    <ToastProvider>
      <AppInit />
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
          <InstallBanner />
        </div>
      </AdConsentProvider>
    </ToastProvider>
  )
}
