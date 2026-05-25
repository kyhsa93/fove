import { JSX, MouseEvent } from 'react'
import type { RoutePath } from '../routes'
import { footerLinks, blogLinks } from '../routes'

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
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-2 text-sm sm:px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">읽어보기</p>
            <nav className="flex flex-wrap gap-2" aria-label="블로그 글 링크">
              {blogLinks.map((item) => {
                const active = currentPath === item.path
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    onClick={(event) => handleNavigate(event, item.path)}
                    className={`rounded-full px-3 py-1 transition ${
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
          </div>

          <nav className="flex flex-wrap gap-2" aria-label="법적 고지 및 지원 링크">
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
        </div>

        <p className="text-xs text-slate-400">© {year} Fove. All rights reserved.</p>
      </div>
    </footer>
  )
}
