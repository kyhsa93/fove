import { JSX } from 'react'

export function scoreColor(score: number): string {
  if (score >= 80) return 'bg-emerald-400'
  if (score >= 65) return 'bg-amber-400'
  return 'bg-rose-400'
}

export function ScoreBar({ score, colorClass, className = 'h-2' }: {
  score: number
  colorClass?: string
  className?: string
}): JSX.Element {
  return (
    <div className={`w-full rounded-full bg-indigo-100 overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass ?? scoreColor(score)}`}
        style={{ width: `${score}%` }}
      />
    </div>
  )
}
