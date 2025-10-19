import { JSX, MouseEvent } from 'react'
import type { RoutePath } from '../routes'
import { ROUTE_PATHS, navLinks } from '../routes'

type HeaderProps = {
  currentPath: RoutePath
  onNavigate: (path: RoutePath) => void
}

export function Header({ currentPath, onNavigate }: HeaderProps): JSX.Element {
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, path: RoutePath) => {
    event.preventDefault()
    onNavigate(path)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-3 py-3 sm:px-6">
        <a
          href={ROUTE_PATHS.home}
          onClick={(event) => handleNavigate(event, ROUTE_PATHS.home)}
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-slate-900"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm text-white shadow-sm">
            F
          </span>
          Fove
        </a>

        <nav className="hidden items-center gap-1 text-sm font-medium text-slate-600 sm:flex" aria-label="주요 페이지">
          {navLinks.map((item) => {
            const active = currentPath === item.path
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(event) => handleNavigate(event, item.path)}
                className={`rounded-full px-4 py-2 transition ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-900/5 hover:text-slate-900'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <nav className="sm:hidden">
          <label htmlFor="mobile-navigation" className="sr-only">
            페이지 이동
          </label>
          <select
            id="mobile-navigation"
            value={currentPath}
            onChange={(event) => onNavigate(event.target.value as RoutePath)}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            {navLinks.map((item) => (
              <option key={item.path} value={item.path}>
                {item.label}
              </option>
            ))}
          </select>
        </nav>
      </div>
    </header>
  )
}
