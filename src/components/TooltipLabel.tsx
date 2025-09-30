import { JSX, useId } from 'react'

interface TooltipLabelProps {
  text: string
  description: string
  className?: string
}

export function TooltipLabel({ text, description, className }: TooltipLabelProps): JSX.Element {
  const tooltipId = useId()
  const classes = ['inline-flex items-center gap-1 text-inherit', className].filter(Boolean).join(' ')

  return (
    <span className={classes}>
      <span>{text}</span>
      <span className="group relative inline-flex">
        <button
          type="button"
          aria-describedby={tooltipId}
          className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-600 transition hover:bg-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-400"
        >
          ?
        </button>
        <span
          role="tooltip"
          id={tooltipId}
          className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 rounded-md bg-gray-900 px-3 py-2 text-[11px] leading-relaxed text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100"
        >
          {description}
        </span>
      </span>
    </span>
  )
}
