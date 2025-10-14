import { JSX } from 'react'

export type ActionTone = 'do' | 'avoid' | 'relation'

export interface ActionCardData {
  title: string
  description: string
  tone: ActionTone
}

interface ActionCardDeckProps {
  cards: ActionCardData[]
}

const toneStyles: Record<ActionTone, string> = {
  do: 'border-emerald-100 bg-emerald-50/70 text-emerald-900/80',
  avoid: 'border-rose-100 bg-rose-50/70 text-rose-900/80',
  relation: 'border-indigo-100 bg-indigo-50/70 text-indigo-900/80'
}

export function ActionCardDeck({ cards }: ActionCardDeckProps): JSX.Element {
  if (!cards.length) {
    return <></>
  }

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">오늘의 실천 카드</h3>
      <div className="grid gap-3 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className={`rounded-2xl border px-2 py-4 text-sm leading-relaxed shadow-sm transition sm:px-4 ${toneStyles[card.tone]}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500/70">{card.title}</p>
            <p className="mt-2 text-sm">{card.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
