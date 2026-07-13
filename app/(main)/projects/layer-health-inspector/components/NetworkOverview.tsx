import { motion } from 'framer-motion'
import type { Layer } from '../lib/types'
import { recommend, OPPORTUNITY_STYLE } from '../lib/recommend'

interface NetworkOverviewProps {
  layers: Layer[]
  selectedId: string
  onSelect: (id: string) => void
}

// row geometry (must match the classes on the boxes/connectors below)
const PADDING_LEFT = 28 // px-7
const BOX_WIDTH = 82 // w-20.5
const CONNECTOR_WIDTH = 14.5 // w-[14.5px]
const ARROW_SIZE = 24 // w-6

export default function NetworkOverview({ layers, selectedId, onSelect }: NetworkOverviewProps) {
  const selectedIndex = Math.max(
    0,
    layers.findIndex((l) => l.id === selectedId)
  )
  // center of the selected box, minus half the arrow so the diamond is centered
  const arrowX =
    PADDING_LEFT + selectedIndex * (BOX_WIDTH + CONNECTOR_WIDTH) + BOX_WIDTH / 2 - ARROW_SIZE / 2

  return (
    <div className="flex flex-col gap-3 bg-blue-800">
      <div className="relative flex items-end overflow-x-auto overflow-y-hidden px-7 pt-2 pb-6">
        {layers.map((l, i) => {
          const live = l.numerical_rank_at_threshold
          const rec = recommend(l.size, live, l.type)
          const style = OPPORTUNITY_STYLE[rec.opportunity]
          const active = l.id === selectedId
          const liveFrac = l.size > 0 ? live / l.size : 0

          return (
            <div key={l.id} className="flex items-center">
              <button
                onClick={() => onSelect(l.id)}
                aria-current={active}
                title={`${l.name}: ${rec.sentence}`}
                className={`relative flex h-full w-20.5 shrink-0 flex-col justify-between gap-1 border text-left shadow-2xl transition-all ${active ? 'border-white bg-blue-600' : 'border-blue-600 bg-blue-700/80 hover:brightness-95'}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`flex h-5 w-5 items-center justify-center ${active ? 'bg-white text-blue-800' : 'bg-blue-600 text-white'} text-xs font-semibold`}
                  >
                    {l.name.split(' ')[1]}
                  </span>
                  <span className="px-1 text-[9px] tracking-wide text-blue-100 uppercase">
                    {l.type}
                  </span>
                </div>

                <div className="px-1 font-mono text-lg font-semibold text-white tabular-nums">
                  {l.size}
                  <span className="ml-0.5 text-[10px] font-normal text-blue-200">wide</span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className={`mx-1.5 h-1 overflow-hidden bg-red-500`}>
                    <div
                      className={`h-full bg-white`}
                      style={{ width: `${Math.round(liveFrac * 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span
                      className="mx-1.5 font-mono text-[9px] text-white"
                      title="Live directions / total width"
                    >
                      {live}/{l.size}
                    </span>
                    <span
                      className={`mt-1 p-1 pl-1.5 text-[9px] font-semibold ${active ? 'bg-white text-blue-800' : 'bg-blue-600 text-white'}`}
                    >
                      {rec.isCandidate ? `${Math.round(rec.compressionPct * 100)}%` : style.label}
                    </span>
                  </div>
                </div>
              </button>

              {/* connector to the next layer */}
              {i < layers.length - 1 && <div className="h-px w-[14.5px] shrink-0 bg-blue-600" />}
            </div>
          )
        })}
        <motion.div
          className="absolute bottom-1 -mb-3.5 h-5 w-5 rotate-45 border-t border-l border-blue-800 bg-yellow-50"
          initial={false}
          animate={{ left: arrowX }}
          transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        />
      </div>
    </div>
  )
}
