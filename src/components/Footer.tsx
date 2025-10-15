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

  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200/80 bg-white/90 py-6 text-slate-600 backdrop-blur sm:py-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-2 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <nav className="flex flex-wrap gap-3" aria-label="법적 고지 및 지원 링크">
          {footerLinks.map((item) => {
            const active = currentPath === item.path
            return (
              <a
                key={item.path}
                href={item.path}
                onClick={(event) => handleNavigate(event, item.path)}
                className={`rounded-full px-2 py-1 transition sm:px-4 ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white/60 text-slate-600 hover:bg-slate-900/5 hover:text-slate-900'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </a>
            )
          })}
        </nav>

        <p className="text-xs text-slate-400">© {year} Fove. All rights reserved.</p>
      </div>
    </footer>
  )
}
