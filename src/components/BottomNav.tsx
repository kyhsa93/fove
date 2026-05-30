import { JSX } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../routes'

type BottomNavProps = {
  isDark?: boolean
}

function HomeIcon(): JSX.Element {
  return (
    <svg aria-hidden="true" focusable="false" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" />
    </svg>
  )
}

function SunIcon(): JSX.Element {
  return (
    <svg aria-hidden="true" focusable="false" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function CalendarIcon(): JSX.Element {
  return (
    <svg aria-hidden="true" focusable="false" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M8 2v4M16 2v4M3 10h18" />
    </svg>
  )
}

function PersonIcon(): JSX.Element {
  return (
    <svg aria-hidden="true" focusable="false" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
    </svg>
  )
}

function SparkleIcon(): JSX.Element {
  return (
    <svg aria-hidden="true" focusable="false" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z" />
    </svg>
  )
}

const TABS = [
  { path: ROUTE_PATHS.home, label: '홈', Icon: HomeIcon },
  { path: ROUTE_PATHS.fortune, label: '운세', Icon: SunIcon },
  { path: ROUTE_PATHS.saju, label: '사주', Icon: CalendarIcon },
  { path: ROUTE_PATHS.mbti, label: 'MBTI', Icon: PersonIcon },
  { path: ROUTE_PATHS.insight, label: '인사이트', Icon: SparkleIcon },
]

export function BottomNav({ isDark = false }: BottomNavProps): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const pathname = location.pathname

  const isTabActive = (tabPath: string): boolean => {
    if (tabPath === ROUTE_PATHS.fortune) {
      return pathname.startsWith('/fortune')
    }
    if (tabPath === ROUTE_PATHS.saju) {
      return pathname === '/saju' || /^\/saju\/\d{4}$/.test(pathname)
    }
    if (tabPath === ROUTE_PATHS.mbti) {
      return pathname === '/mbti' || pathname === '/mbti/compatibility'
    }
    return pathname === tabPath
  }

  const containerClass = isDark
    ? 'bg-slate-900/95 border-t border-white/10'
    : 'bg-white/95 border-t border-slate-200/60'

  const inactiveClass = isDark ? 'text-white/40' : 'text-slate-400'
  const activeClass = isDark ? 'text-white' : 'text-indigo-600'
  const dotClass = isDark ? 'bg-white' : 'bg-indigo-500'

  return (
    <nav
      aria-label="하단 탭 메뉴"
      className={`sm:hidden fixed bottom-0 inset-x-0 z-30 backdrop-blur ${containerClass}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex items-stretch" role="list">
        {TABS.map(({ path, label, Icon }) => {
          const active = isTabActive(path)
          return (
            <li key={path} className="flex-1">
              <button
                type="button"
                onClick={() => { navigate(path); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                aria-current={active ? 'page' : undefined}
                className={`relative flex w-full flex-col items-center gap-0.5 py-2.5 pt-3 text-[10px] font-semibold tracking-wide transition-colors ${active ? activeClass : inactiveClass}`}
              >
                {active && (
                  <span className={`absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full ${dotClass}`} />
                )}
                <Icon />
                <span>{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
