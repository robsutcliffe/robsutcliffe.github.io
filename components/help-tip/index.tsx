'use client'

import { useEffect, useRef, useState } from 'react'
import { GLOSSARY, type GlossaryKey } from './glossary'

export { GlossaryKey }

interface HelpTipProps {
  term: GlossaryKey
  // Where the popover sits relative to the "?" icon. Use "end" near a right edge
  // so it doesn't run off screen.
  align?: 'center' | 'start' | 'end'
}

const ALIGN: Record<NonNullable<HelpTipProps['align']>, string> = {
  center: 'left-1/2 -translate-x-1/2',
  start: 'left-0',
  end: 'right-0',
}

export default function Index({ term, align = 'center' }: HelpTipProps) {
  const { term: label, definition } = GLOSSARY[term]
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <span ref={ref} className="relative inline-flex align-middle">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`What is “${label}”?`}
        aria-expanded={open}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current/70 text-xs leading-none font-semibold text-current transition-colors hover:border-indigo-400 hover:text-indigo-500 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          className={`absolute top-full z-30 mt-1.5 w-56 rounded-lg border border-slate-200 bg-white p-3 text-left text-xs leading-relaxed font-normal tracking-normal text-slate-600 normal-case shadow-lg ${ALIGN[align]}`}
        >
          <span className="mb-1 block text-[13px] font-semibold text-slate-800">{label}</span>
          {definition}
        </span>
      )}
    </span>
  )
}
