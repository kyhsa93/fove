import { JSX, MouseEvent } from 'react'
import type { RoutePath } from '../routes'
import { footerLinks } from '../routes'

type FooterProps = {
  currentPath: RoutePath
  onNavigate: (path: RoutePath) => void
}

export function Footer({ currentPath, onNavigate }: FooterProps): JSX.Element {
  const handleNavigate = (event: MouseEvent<HTMLAnchorElement>, path: RoutePath) => {
    event.preventDefault()
    onNavigate(path)
  }

  const isHome = currentPath === '/'
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200/80 bg-white/90 py-8 text-slate-600 backdrop-blur">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => onNavigate('/')}
          className={`inline-flex items-center gap-2 text-left text-base font-semibold text-slate-800 transition hover:text-amber-600 ${
            isHome ? 'text-amber-600' : ''
          }`}
        >
          <span>DotImage</span>
          <span className="hidden text-xs font-medium uppercase tracking-[0.18em] text-slate-400 sm:inline">INSIGHTS</span>
        </button>

        <nav className="flex flex-wrap gap-3">
          {footerLinks.map((item) => {
            const active = currentPath === item.path
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(event) => handleNavigate(event, item.path)}
                className={`rounded-full px-4 py-2 transition ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white/60 text-slate-600 hover:bg-slate-900/5 hover:text-slate-900'
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <p className="text-xs text-slate-400">© {year} DotImage. All rights reserved.</p>
      </div>
    </footer>
  )
}
