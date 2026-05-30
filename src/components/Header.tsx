import { JSX, MouseEvent } from 'react'
import type { RoutePath } from '../routes'
import { ROUTE_PATHS, navLinks } from '../routes'

type HeaderProps = {
  currentPath: RoutePath
  onNavigate: (path: RoutePath) => void
  isDark?: boolean
}

export function Header({ currentPath, onNavigate, isDark = false }: HeaderProps): JSX.Element {
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, path: RoutePath) => {
    event.preventDefault()
    onNavigate(path)
  }

  const headerClass = isDark
    ? 'sticky top-0 z-30 border-b border-white/10 bg-slate-900/80 backdrop-blur'
    : 'sticky top-0 z-30 border-b border-slate-200/60 bg-white/90 backdrop-blur'

  const logoClass = isDark
    ? 'flex items-center gap-2 text-base font-semibold tracking-tight text-white'
    : 'flex items-center gap-2 text-base font-semibold tracking-tight text-slate-900'

  const logoBadgeClass = isDark
    ? 'inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm text-slate-900 shadow-sm'
    : 'inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm text-white shadow-sm'

  const getNavItemClass = (active: boolean) => {
    if (isDark) {
      return `rounded-full px-4 py-2 transition ${
        active
          ? 'bg-white/20 text-white shadow-sm'
          : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`
    }
    return `rounded-full px-4 py-2 transition ${
      active
        ? 'bg-slate-900 text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-900/5 hover:text-slate-900'
    }`
  }

  return (
    <header className={headerClass}>
      <div className="mx-auto flex max-w-4xl items-center justify-between px-3 py-3 sm:px-6">
        <a
          href={ROUTE_PATHS.home}
          onClick={(event) => handleNavigate(event, ROUTE_PATHS.home)}
          className={logoClass}
        >
          <span className={logoBadgeClass}>F</span>
          Fove
        </a>

        <nav className="hidden items-center gap-1 text-sm font-medium sm:flex" aria-label="주요 페이지">
          {navLinks.map((item) => {
            const active = currentPath === item.path
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(event) => handleNavigate(event, item.path)}
                className={getNavItemClass(active)}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </a>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
