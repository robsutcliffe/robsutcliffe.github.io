// Model-wide summary — the numbers a manager wants first: how much is on the
// table, how many layers are worth testing, and where to start. All figures are
// planning estimates (resize each flagged layer to its recommended width).

import type { Layer } from '../lib/types'
import { aggregateStats, compact } from '../lib/recommend'
import type { GlossaryKey } from '@/components/help-tip'
import HelpTip from '@/components/help-tip'

interface OverallStatsProps {
  layers: Layer[]
  onSelect: (id: string) => void
}

function Card({
  label,
  help,
  value,
  sub,
  tone = 'default',
  onClick,
}: {
  label: string
  help?: GlossaryKey
  value: string
  sub?: string
  tone?: 'default' | 'accent'
  onClick?: () => void
}) {
  const inner = (
    <>
      <div className="flex items-center gap-1 text-sm font-black tracking-wide text-white uppercase">
        {label}
        {help && <HelpTip term={help} align="start" />}
      </div>
      <div className="font-mono text-2xl font-semibold text-white tabular-nums">{value}</div>
      {sub && <div className="text-xs text-blue-100">{sub}</div>}
    </>
  )

  const base = 'px-6 py-4 text-left'
  return onClick ? (
    <button onClick={onClick} className={`${base} transition-colors hover:bg-white/10`}>
      {inner}
    </button>
  ) : (
    <div className={base}>{inner}</div>
  )
}

export default function OverallStats({ layers, onSelect }: OverallStatsProps) {
  const s = aggregateStats(layers, (l) => l.numerical_rank_at_threshold)

  return (
    <section className="flex flex-col bg-blue-900">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card
          label="Potential savings"
          help="potentialSavings"
          value={`${Math.round(s.savingsPctRecommended * 100)}%`}
          sub={`≈ ${compact(s.savedRecommended)} of ${compact(s.weightsNow)} weights per run`}
          tone="accent"
        />
        <Card
          label="Layers to test"
          help="layersToTest"
          value={`${s.candidates} of ${s.total}`}
          sub="show enough spare capacity"
        />
        <Card
          label="Stretch savings"
          help="stretchSavings"
          value={`${Math.round(s.savingsPctAggressive * 100)}%`}
          sub="if tighter targets hold up"
        />
        {s.best ? (
          <Card
            label="Biggest opportunity"
            help="biggestOpportunity"
            value={`${s.best.rec.width}→${s.best.rec.recommended}`}
            sub={`${s.best.layer.name} · ${Math.round(s.best.rec.compressionPct * 100)}% smaller`}
            onClick={() => onSelect(s.best!.layer.id)}
          />
        ) : (
          <Card
            label="Biggest opportunity"
            help="biggestOpportunity"
            value="—"
            sub="no layers flagged"
          />
        )}
      </div>
    </section>
  )
}
