import { JSX, useState } from 'react'
import { recordCheckin, getTodayCheckin, MOOD_META } from '../lib/checkin'
import type { CheckinMood } from '../lib/checkin'

export function FortuneCheckin(): JSX.Element {
  const [saved, setSaved] = useState<CheckinMood | null>(() => getTodayCheckin())
  const [isSelecting, setIsSelecting] = useState(false)

  const handleSelect = (mood: CheckinMood) => {
    if (isSelecting) return
    setIsSelecting(true)
    recordCheckin(mood)
    setSaved(mood)
  }

  if (saved) {
    const meta = MOOD_META[saved]
    return (
      <div className={`rounded-2xl border px-4 py-3 flex items-center gap-3 ${meta.color}`}>
        <span className="text-xl">{meta.emoji}</span>
        <div className="min-w-0">
          <p className="text-xs font-semibold">오늘 체크인 완료</p>
          <p className="text-sm">{meta.label} — 내일도 기록해보세요!</p>
        </div>
        <button
          type="button"
          onClick={() => setSaved(null)}
          className="ml-auto text-xs opacity-50 hover:opacity-80 transition shrink-0"
        >
          변경
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/70 px-4 py-4 space-y-3">
      <p className="text-sm font-semibold text-slate-700">오늘 운세 어떠셨나요?</p>
      <div className="flex gap-2">
        {(Object.keys(MOOD_META) as CheckinMood[]).map((mood) => {
          const meta = MOOD_META[mood]
          return (
            <button
              key={mood}
              type="button"
              onClick={() => handleSelect(mood)}
              disabled={isSelecting}
              aria-label={`${meta.label} 체크인`}
              className={`flex-1 rounded-xl border py-2.5 text-center transition hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed ${meta.color}`}
            >
              <p className="text-xl">{meta.emoji}</p>
              <p className="text-[10px] font-medium mt-0.5">{meta.label}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
