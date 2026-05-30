import type { NavigateFunction } from 'react-router-dom'
import type { RoutePath } from '../routes'

let _navigate: NavigateFunction | null = null

export function injectNavigate(fn: NavigateFunction): void {
  _navigate = fn
}

export const navigateTo = (path: RoutePath | string): void => {
  if (typeof window === 'undefined') return
  if (_navigate) {
    _navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
