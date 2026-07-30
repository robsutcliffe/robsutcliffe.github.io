'use client'

import { useEffect, useRef, useState } from 'react'
import { GLOSSARY, type GlossaryKey } from './glossary'

export { GlossaryKey }

interface HelpTipProps {
  term: GlossaryKey
}

const EDGE_MARGIN = 12 // px gap to keep from viewport edges

export default function Index({ term }: HelpTipProps) {
  const { term: label, definition } = GLOSSARY[term]
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const [tooltipOffset, setTooltipOffset] = useState(0)

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

  useEffect(() => {
    if (!open || !tooltipRef.current) return
    const rect = tooltipRef.current.getBoundingClientRect()
    const vw = window.innerWidth
    let offset = 0
    if (rect.right > vw - EDGE_MARGIN) {
      offset = vw - EDGE_MARGIN - rect.right
    } else if (rect.left < EDGE_MARGIN) {
      offset = EDGE_MARGIN - rect.left
    }
    setTooltipOffset(offset)
  }, [open])

  return (
    <span ref={ref} className="relative inline-flex align-middle font-sans">
      <button
        type="button"
        onClick={() => { setTooltipOffset(0); setOpen((o) => !o) }}
        aria-label={`What is “${label}”?`}
        aria-expanded={open}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-current/70 text-xs leading-none font-semibold text-current transition-colors hover:border-indigo-400 hover:text-indigo-500 focus:ring-1 focus:ring-indigo-400 focus:outline-none"
      >
        ?
      </button>
      {open && (
        <span
          ref={tooltipRef}
          role="tooltip"
          style={{ transform: `translateX(calc(-50% + ${tooltipOffset}px))` }}
          className="absolute top-full left-1/2 z-30 mt-1.5 w-56 rounded-lg border border-slate-200 bg-white p-3 text-left text-xs leading-relaxed font-normal tracking-normal text-slate-600 normal-case shadow-lg"
        >
          <span className="mb-1 block text-[13px] font-semibold text-slate-800">{label}</span>
          {definition}
        </span>
      )}
    </span>
  )
}
