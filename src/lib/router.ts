import type { RoutePath } from '../routes'

export const navigateTo = (path: RoutePath) => {
  if (typeof window === 'undefined') return
  if (window.location.pathname === path) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
