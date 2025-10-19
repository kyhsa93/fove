import type { RoutePath } from '../routes'
import { ROUTE_PATHS } from '../routes'
import type { ResultKind } from '../hooks/useResultHistory'

export const resultKindToRoute: Record<ResultKind, RoutePath> = {
  saju: ROUTE_PATHS.saju,
  mbti: ROUTE_PATHS.mbti,
  fortune: ROUTE_PATHS.fortune
}
