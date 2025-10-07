import type { RoutePath } from '../routes'
import type { ResultKind } from '../hooks/useResultHistory'

export const resultKindToRoute: Record<ResultKind, RoutePath> = {
  saju: '/',
  mbti: '/mbti',
  fortune: '/fortune',
  lotto: '/fortune',
  cross: '/fortune'
}
