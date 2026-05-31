import { JSX, useMemo, useState } from 'react'
import { getDailyDraw } from '../lib/tarotDraw'
import { POSITIONS } from '../data/tarot'
import { navigateTo } from '../lib/router'
import { ROUTE_PATHS } from '../routes'

const ARCANA_LABEL: Record<string, string> = {
  major: '메이저 아르카나',
  cups: '컵 (물·감정)',
  wands: '완드 (불·열정)',
  swords: '소드 (바람·생각)',
  pentacles: '펜타클 (흙·물질)',
}

const ARCANA_COLOR: Record<string, string> = {
  major:     'border-violet-200 bg-violet-50 text-violet-900',
  cups:      'border-blue-200 bg-blue-50 text-blue-900',
  wands:     'border-rose-200 bg-rose-50 text-rose-900',
  swords:    'border-emerald-200 bg-emerald-50 text-emerald-900',
  pentacles: 'border-amber-200 bg-amber-50 text-amber-900',
}

const BACK_STYLE = 'border-slate-200 bg-gradient-to-br from-indigo-900 to-violet-950 text-white'

function CardFace({ card, isReversed, position, revealed, onClick }: {
  card: { name: string; emoji: string; arcana: string; upright: string; reversed: string; advice: string }
  isReversed: boolean
  position: typeof POSITIONS[number]
  revealed: boolean
  onClick: () => void
}): JSX.Element {
  if (!revealed) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`w-full rounded-2xl border-2 ${BACK_STYLE} px-4 py-8 space-y-3 text-center transition hover:scale-[1.02] hover:shadow-xl cursor-pointer`}
      >
        <p className="text-3xl">🔮</p>
        <p className="text-sm font-semibold opacity-70">{position.label}</p>
        <p className="text-xs opacity-50">탭해서 카드 확인</p>
      </button>
    )
  }

  const meaning = isReversed ? card.reversed : card.upright
  const colorClass = ARCANA_COLOR[card.arcana] ?? ARCANA_COLOR.major

  return (
    <div className={`w-full rounded-2xl border-2 px-4 py-5 space-y-3 text-center ${colorClass} transition-all duration-500`}>
      <div className="space-y-1">
        <p className="text-xs font-semibold opacity-60">{position.icon} {position.label}</p>
        <p className="text-xs opacity-50">{position.desc}</p>
      </div>
      <div className={`text-4xl ${isReversed ? 'rotate-180' : ''} transition-transform`}>{card.emoji}</div>
      <div className="space-y-0.5">
        <p className="text-base font-bold">{card.name}</p>
        {isReversed && (
          <span className="inline-block text-[10px] font-semibold border rounded-full px-2 py-0.5 opacity-60">역방향</span>
        )}
        <p className="text-[10px] opacity-50">{ARCANA_LABEL[card.arcana]}</p>
      </div>
      <p className="text-sm leading-relaxed opacity-90">{meaning}</p>
      <div className="rounded-xl bg-white/40 border border-white/30 px-3 py-2">
        <p className="text-xs font-semibold opacity-70 mb-0.5">오늘의 조언</p>
        <p className="text-xs leading-relaxed font-medium">{card.advice}</p>
      </div>
    </div>
  )
}

export default function TarotPage(): JSX.Element {
  const draw = useMemo(() => getDailyDraw(), [])
  const [revealed, setRevealed] = useState<[boolean, boolean, boolean]>([false, false, false])
  const allRevealed = revealed.every(Boolean)

  const now = new Date()
  const dateLabel = new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(now)

  const revealCard = (idx: 0 | 1 | 2) => {
    setRevealed((prev) => {
      const next: [boolean, boolean, boolean] = [...prev] as [boolean, boolean, boolean]
      next[idx] = true
      return next
    })
  }

  const revealAll = () => setRevealed([true, true, true])

  return (
    <section className="py-6 sm:py-8">
      <div className="mx-auto max-w-lg px-4 space-y-8">
        <header className="text-center space-y-2">
          <div className="inline-block rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
            오늘의 타로
          </div>
          <h1 className="text-3xl font-bold text-gray-900">✨ 타로 카드</h1>
          <p className="text-sm text-gray-500">{dateLabel}</p>
          <p className="text-xs text-gray-400">오늘 하루를 위한 세 장의 카드가 준비됐어요</p>
        </header>

        {/* 카드 3장 */}
        <div className="space-y-4">
          {draw.cards.map((card, i) => (
            <CardFace
              key={i}
              card={card}
              isReversed={draw.reversed[i]}
              position={POSITIONS[i]}
              revealed={revealed[i]}
              onClick={() => revealCard(i as 0 | 1 | 2)}
            />
          ))}
        </div>

        {!allRevealed && (
          <button
            type="button"
            onClick={revealAll}
            className="w-full rounded-2xl border border-violet-200 bg-violet-50 py-3 text-sm font-medium text-violet-700 hover:bg-violet-100 transition"
          >
            카드 모두 공개하기
          </button>
        )}

        {/* 전체 해석 요약 */}
        {allRevealed && (
          <div className="rounded-2xl border border-violet-100 bg-white/80 px-5 py-5 space-y-3 shadow-sm">
            <p className="text-sm font-semibold text-violet-900">오늘의 타로 요약</p>
            <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
              <p>
                <span className="font-medium text-violet-700">에너지:</span>{' '}
                {draw.reversed[0] ? draw.cards[0].reversed : draw.cards[0].upright}
              </p>
              <p>
                <span className="font-medium text-violet-700">행동:</span>{' '}
                {draw.cards[1].advice}
              </p>
              <p>
                <span className="font-medium text-violet-700">주의:</span>{' '}
                {draw.reversed[2] ? draw.cards[2].reversed : draw.cards[2].upright}
              </p>
            </div>
          </div>
        )}

        {allRevealed && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.fortune)}
              className="flex-1 rounded-full bg-amber-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-amber-600 transition"
            >
              오늘의 운세 보기
            </button>
            <button
              type="button"
              onClick={() => navigateTo(ROUTE_PATHS.saju)}
              className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              사주 풀이 보기
            </button>
          </div>
        )}

        <p className="text-center text-xs text-slate-400">
          오늘의 카드는 매일 새벽 자동으로 바뀌어요. 타로는 재미로 보는 참고 정보예요.
        </p>
      </div>
    </section>
  )
}
