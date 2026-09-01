import { useEffect, useRef, useState } from 'react'
import { SnapDecisionInput } from '../lib'

interface Preset {
  name: string
  badge?: string
  data: SnapDecisionInput
}

const PRESETS: Preset[] = [
  {
    name: 'Low Income Single Parent',
    badge: 'High Likelihood',
    data: {
      hh_size: 3,
      n_jobs: 1,
      month_ref: 6,
      job1_wks_cat: 20,
      job1_rate_cat: 2,
      job2_rate_cat: 0,
      inc_raw: 12500,
      em_wks: 40,
      prog_1: true,
      prog_2: false,
      prog_3: false,
      prog_4: true,
      prog_5: true,
      prog_6: true,
      prog_7: false,
    },
  },
  {
    name: 'Elderly / Disability Support',
    badge: 'High Likelihood',
    data: {
      hh_size: 1,
      n_jobs: 0,
      month_ref: 3,
      job1_wks_cat: 0,
      job1_rate_cat: 0,
      job2_rate_cat: 0,
      inc_raw: 8500,
      em_wks: 0,
      prog_1: false,
      prog_2: true,
      prog_3: false,
      prog_4: true,
      prog_5: true,
      prog_6: false,
      prog_7: true,
    },
  },
  {
    name: 'Dual-Earner Working Family',
    badge: 'Moderate Likelihood',
    data: {
      hh_size: 4,
      n_jobs: 2,
      month_ref: 6,
      job1_wks_cat: 48,
      job1_rate_cat: 4,
      job2_rate_cat: 3,
      inc_raw: 32000,
      em_wks: 48,
      prog_1: false,
      prog_2: false,
      prog_3: false,
      prog_4: false,
      prog_5: true,
      prog_6: true,
      prog_7: false,
    },
  },

  {
    name: 'High Income Ineligible',
    badge: 'Low Likelihood',
    data: {
      hh_size: 2,
      n_jobs: 2,
      month_ref: 9,
      job1_wks_cat: 50,
      job1_rate_cat: 8,
      job2_rate_cat: 6,
      inc_raw: 68000,
      em_wks: 50,
      prog_1: false,
      prog_2: false,
      prog_3: false,
      prog_4: false,
      prog_5: false,
      prog_6: false,
      prog_7: false,
    },
  },
  {
    name: 'Custom',
    data: {
      hh_size: 0,
      n_jobs: 0,
      month_ref: 0,
      job1_wks_cat: 0,
      job1_rate_cat: 0,
      job2_rate_cat: 0,
      inc_raw: 0,
      em_wks: 0,
      prog_1: false,
      prog_2: false,
      prog_3: false,
      prog_4: false,
      prog_5: false,
      prog_6: false,
      prog_7: false,
    },
  },
]

export default function PresetDropdown({ handlePresetSelect }) {
  const [open, setOpen] = useState(false)
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const badgeClass = (badge: string) =>
    badge === 'High Likelihood'
      ? 'border border-green-400/50 bg-green-500/20 text-green-300'
      : badge === 'Low Likelihood'
        ? 'border border-red-400/50 bg-red-500/20 text-red-300'
        : 'border border-yellow-400/50 bg-yellow-400/20 text-yellow-300'

  const selected = selectedIdx !== null ? PRESETS[selectedIdx] : null

  return (
    <div ref={containerRef} className="relative max-w-md">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded border border-blue-600 bg-blue-700/80 px-3 py-2 text-left transition-all hover:border-white hover:bg-blue-600"
      >
        {selected ? (
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="truncate font-serif text-xs font-bold text-white">
              {selected.name}
            </span>
            {selected.badge && (
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${badgeClass(selected.badge)}`}
              >
                {selected.badge}
              </span>
            )}
          </div>
        ) : (
          <span className="font-serif text-xs font-bold text-blue-100">
            Select a preset&hellip;
          </span>
        )}
        <svg
          className={`h-3 w-3 shrink-0 text-cyan-200 transition-transform ${open ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded border border-blue-600 bg-blue-800 shadow-lg">
          <ul className="max-h-80 overflow-y-auto">
            {PRESETS.map((p, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => {
                    handlePresetSelect(p.data)
                    setSelectedIdx(idx)
                    setOpen(false)
                  }}
                  className="group flex w-full cursor-pointer flex-col items-start gap-1 border-b border-blue-700/60 bg-blue-700/40 p-3 text-left transition-all last:border-b-0 hover:bg-blue-600"
                >
                  <div className="flex w-full items-center justify-between gap-1">
                    <span className="font-serif text-xs font-bold text-white group-hover:text-yellow-100">
                      {p.name}
                    </span>
                    {p.badge && (
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${badgeClass(p.badge)}`}
                      >
                        {p.badge}
                      </span>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
