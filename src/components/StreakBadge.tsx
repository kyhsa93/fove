import { JSX } from 'react'
import { getStreakCount } from '../lib/streak'

const MILESTONES = new Set([7, 30, 100])

interface StreakBadgeProps {
  className?: string
}

export function StreakBadge({ className = '' }: StreakBadgeProps): JSX.Element | null {
  const count = getStreakCount()
  if (count < 2) return null

  const isMilestone = MILESTONES.has(count)

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        isMilestone
          ? 'border-amber-400/40 bg-amber-400/20 text-amber-300'
          : 'border-white/20 bg-white/10 text-white/80'
      } ${className}`}
    >
      🔥 {count}일 연속
    </span>
  )
}
