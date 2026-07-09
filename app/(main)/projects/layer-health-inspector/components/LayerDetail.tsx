// The single detail panel for the selected layer. Leads with the recommendation
// (what to test, how much, how risky), backs it with a compact stat grid and one
// bar chart of ranked information directions. The test-width slider lets you
// preview a shrink; it starts at the recommended width.

import type { Layer } from '../lib/types'
import { recommend, rate, compact, RISK_STYLE } from '../lib/recommend'
import type { GlossaryKey } from '@/components/help-tip'
import BarChart from './BarChart'
import HelpTip from '@/components/help-tip'

interface LayerDetailProps {
  layer: Layer
  keep: number // test width — how many top directions to keep
  onKeepChange: (value: number) => void
}

function StatRow({
  label,
  value,
  sub,
  tone = 'default',
  help,
  helpAlign = 'center',
}: {
  label: string
  value: string
  sub?: string
  tone?: 'default' | 'accent' | 'muted'
  help?: GlossaryKey
  helpAlign?: 'center' | 'start' | 'end'
}) {
  const valueClass =
    tone === 'accent' ? 'text-red-500' : tone === 'muted' ? 'text-blue-800/50' : 'text-blue-800'
  return (
    <div className="flex items-center justify-between gap-3 border-r border-b border-blue-800 px-3 py-2">
      <div className="flex items-center gap-1 text-sm text-blue-800">
        {label}
        {help && <HelpTip term={help} align={helpAlign} />}
      </div>
      <div className="flex items-baseline gap-2 text-right">
        {sub && <span className="text-[11px] text-blue-800">{sub}</span>}
        <span className={`font-mono text-sm font-semibold tabular-nums ${valueClass}`}>
          {value}
        </span>
      </div>
    </div>
  )
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))
const RISK_ORDER: Record<string, number> = { Low: 0, Medium: 1, High: 2 }

export default function LayerDetail({ layer, keep, onKeepChange }: LayerDetailProps) {
  const values = layer.singular_values
  const size = layer.size
  // The recommendation is based on the layer's own live directions, so it stays
  // stable while you drag the cut.
  const live = layer.numerical_rank_at_threshold
  const rec = recommend(size, live)

  // Directions drawn individually in the chart. Past ~2.5× the live count risk is
  // already Low and keeping more only costs savings, so everything beyond that
  // (and beyond the recommended width) is the "dead" tail we collapse into a box.
  const shown = clamp(
    Math.round(Math.max(live * 2.5, rec.recommended)),
    Math.min(live + 2, size),
    size
  )

  // Live figures for the current cut, and how it compares to the recommendation.
  const cur = rate(size, live, keep)
  const weightsNow = size * size
  const saved = weightsNow - keep * keep
  const savedPct = weightsNow > 0 ? 1 - (keep * keep) / weightsNow : 0
  const savedRec = weightsNow - rec.recommended * rec.recommended
  const savedDelta = saved - savedRec
  const riskCmp = RISK_ORDER[cur.risk] - RISK_ORDER[rec.risk]

  return (
    <div className="flex flex-col gap-5">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-row gap-4">
          <h2 className="text-3xl font-extrabold text-blue-800">{layer.name}</h2>
        </div>
        <span className="inline-flex h-7 items-center gap-1 rounded-full border border-blue-700 px-2 py-0.5 text-xs font-medium text-blue-700">
          {layer.type}
          <HelpTip term="layerType" />
        </span>
      </div>

      {/* stat table */}
      <div className="border border-blue-700">
        <div className="-mr-px -mb-px grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <StatRow label="Current width" value={String(rec.width)} />
          <StatRow
            label="Live directions"
            value={String(rec.live)}
            sub="carry real information"
            help="liveDirections"
          />
          <StatRow
            label="Redundant capacity"
            value={String(rec.redundant)}
            sub={`${Math.round(rec.redundantPct * 100)}% of width`}
            help="redundantCapacity"
          />
          <StatRow
            label="Compression opportunity"
            value={`${Math.round(rec.compressionPct * 100)}%`}
            tone={rec.isCandidate ? 'accent' : 'muted'}
            help="compressionOpportunity"
            helpAlign="end"
          />
          <StatRow
            label="Conservative target"
            value={rec.conservative != null ? String(rec.conservative) : '—'}
            sub={rec.conservative != null ? 'safer first test' : 'keep as-is'}
            tone={rec.conservative != null ? 'default' : 'muted'}
            help="conservativeTarget"
          />
          <StatRow
            label="Aggressive target"
            value={rec.aggressive != null ? String(rec.aggressive) : '—'}
            sub={rec.aggressive != null ? 'stretch goal' : 'keep as-is'}
            tone={rec.aggressive != null ? 'default' : 'muted'}
            help="aggressiveTarget"
          />
          <StatRow
            label="Risk"
            value={rec.isCandidate ? rec.risk : '—'}
            tone={rec.isCandidate ? 'default' : 'muted'}
            help="risk"
          />
          <StatRow
            label="Recommended test width"
            value={rec.isCandidate ? String(rec.recommended) : '—'}
            tone={rec.isCandidate ? 'accent' : 'muted'}
            help="recommendedTestWidth"
            helpAlign="end"
          />
        </div>
      </div>

      {/* one bar chart: ranked information directions */}
      <div>
        <div className="flex items-baseline justify-between">
          <h3 className="flex items-center gap-1 text-xl font-extrabold tracking-tight text-blue-800">
            Ranked information directions
            <HelpTip term="rankedDirections" />
          </h3>
          <p className="mt-3 flex items-center gap-1 pr-1 text-[11px] text-blue-600 uppercase">
            Drag the edge of the red band to test a different width
            <HelpTip term="testWidth" align="start" />
          </p>
        </div>
        <BarChart
          values={values}
          keep={keep}
          live={live}
          shown={shown}
          onKeepChange={onKeepChange}
        />

        {/* live readout for the current cut */}

        <div className="mt-2 ml-10 bg-yellow-100">
          <div className="-mr-px -mb-px flex flex-row gap-6 pl-4">
            {/* test width */}
            <div className="flex flex-col px-3 py-2">
              <div className="text-xs font-bold tracking-wide text-blue-800 uppercase">
                Test width
              </div>
              <span className="font-mono text-xl font-light text-blue-800">
                <span className="font-extrabold">{keep}</span>/{size}
              </span>
            </div>
            {/* weights saved */}
            <div className="flex flex-col px-3 py-2">
              <div className="text-xs font-bold tracking-wide text-blue-800 uppercase">
                Weights saved
              </div>
              <span className="font-mono text-xl font-semibold text-blue-800">
                ≈ {compact(saved)}{' '}
                <span className="text-sm font-light">({Math.round(savedPct * 100)}% smaller)</span>
              </span>
            </div>
            {/* risk */}
            <div className="flex flex-col px-3 py-2">
              <div className="text-xs font-bold tracking-wide text-blue-800 uppercase">Risk</div>
              <span
                className={`font-mono text-xl font-extrabold ${cur.risk === 'High' ? 'text-red-500' : 'text-blue-800'} `}
              >
                {cur.risk}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
