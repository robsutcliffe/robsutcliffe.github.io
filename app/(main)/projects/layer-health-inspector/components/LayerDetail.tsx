// The single detail panel for the selected layer. Leads with the recommendation
// (what to test, how much, how risky), backs it with a compact stat grid and one
// bar chart of ranked information directions. The test-width slider lets you
// preview a shrink; it starts at the recommended width.

import type { Layer } from '../lib/types'
import { recommend, rate, compact, HIGH_RISK } from '../lib/recommend'
import { attentionHeads, headDimFor } from '../lib/heads'
import type { GlossaryKey } from '@/components/help-tip'
import BarChart from './BarChart'
import AttentionHeadChart from './AttentionHeadChart'
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
const RISK_ORDER: Record<string, number> = {
  'Very Low': 0,
  Low: 1,
  Medium: 2,
  High: 3,
  'Very High': 4,
  Critical: 5,
}

export default function LayerDetail({ layer, keep, onKeepChange }: LayerDetailProps) {
  const values = layer.singular_values
  const size = layer.size
  // The recommendation is based on the layer's own live directions, so it stays
  // stable while you drag the cut.
  const live = layer.numerical_rank_at_threshold
  const rec = recommend(size, live, layer.type)

  // Attention layers are trimmed head-by-head, not direction-by-direction. Group
  // the ranked directions into standard-sized heads and snap the cut to whole heads.
  const isAttn = layer.type.toLowerCase() === 'attn'
  const headDim = headDimFor(size)
  const heads = attentionHeads(layer.singular_values, size, layer.index)
  const keepHeads = clamp(Math.round(keep / headDim), 1, heads.length)
  const effectiveKeep = isAttn ? keepHeads * headDim : keep
  const droppedHeads = heads
    .slice(keepHeads)
    .map((h) => h.label)
    .sort((a, b) => a - b)

  // Directions drawn individually in the chart. Past ~2.5× the live count risk is
  // already Low and keeping more only costs savings, so everything beyond that
  // (and beyond the recommended width) is the "dead" tail we collapse into a box.
  const shown = clamp(
    Math.round(Math.max(live * 2.5, rec.recommended)),
    Math.min(live + 2, size),
    size
  )

  // Live figures for the current cut, and how it compares to the recommendation.
  const cur = rate(size, live, effectiveKeep, layer.type)
  // Weights are width-in × width-out; a test width scales both sides proportionally.
  const [widthIn, widthOut] = layer.shape
  const weightsAt = (w: number) => widthIn * (w / size) * (widthOut * (w / size))
  const weightsNow = widthIn * widthOut
  const saved = weightsNow - weightsAt(effectiveKeep)
  const savedPct = size > 0 ? 1 - effectiveKeep / size : 0
  const savedRec = weightsNow - weightsAt(rec.recommended)
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
            {isAttn ? 'Attention heads by historical activity' : 'Ranked information directions'}
            <HelpTip term="rankedDirections" />
          </h3>
          <p className="mt-3 flex items-center gap-1 pr-1 text-[11px] text-blue-800 uppercase">
            {isAttn
              ? 'Drag the edge of the red band to drop the least active heads'
              : 'Drag the edge of the red band to test a different width'}
            <HelpTip term="testWidth" align="start" />
          </p>
        </div>
        {isAttn ? (
          <AttentionHeadChart
            heads={heads}
            keepHeads={keepHeads}
            onKeepHeadsChange={(h) => onKeepChange(h * headDim)}
          />
        ) : (
          <BarChart
            values={values}
            keep={keep}
            live={live}
            shown={shown}
            onKeepChange={onKeepChange}
          />
        )}

        {/* head-specific recommendation for attention layers */}
        {isAttn && (
          <p className="mt-1 ml-10 text-sm text-blue-800">
            {droppedHeads.length > 0 ? (
              <>
                Test without {droppedHeads.length === 1 ? 'head' : 'heads'}{' '}
                <span className="font-mono font-bold">
                  {droppedHeads.map((h) => `H${h}`).join(', ')}
                </span>{' '}
                — the {droppedHeads.length === 1 ? 'least' : `${droppedHeads.length} least`} active
                of {heads.length} heads ({headDim} dimensions each).
              </>
            ) : (
              <>Keeping all {heads.length} heads — drag the cut left to test dropping some.</>
            )}
          </p>
        )}

        {/* live readout for the current cut */}

        <div className="mt-2 ml-10 bg-yellow-100">
          <div className="-mr-px -mb-px flex flex-row justify-center gap-8 pl-4">
            {/* test width */}
            <div className="flex flex-col px-3 py-2">
              <div className="text-xs font-bold tracking-wide text-blue-800 uppercase">
                {isAttn ? 'Heads kept' : 'Test width'}
              </div>
              <span className="font-mono text-xl font-light text-blue-800">
                {isAttn ? (
                  <>
                    <span className="font-extrabold">{keepHeads}</span>/{heads.length}{' '}
                    <span className="text-sm font-light">
                      ({effectiveKeep}/{size} dims)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-extrabold">{keep}</span>/{size}
                  </>
                )}
              </span>
            </div>
            {/* weights saved */}
            <div className="flex flex-col px-3 py-2">
              <div className="text-xs font-bold tracking-wide text-blue-800 uppercase">
                Compression
              </div>
              <span className="font-mono text-xl font-semibold text-blue-800">
                {Math.round(savedPct * 100)}%{' '}
                <span className="text-sm font-light">({compact(Math.round(saved))})</span>
              </span>
            </div>
            {/* risk */}
            <div className="flex flex-col px-3 py-2">
              <div className="text-xs font-bold tracking-wide text-blue-800 uppercase">Risk</div>
              <span
                className={`font-mono text-xl font-extrabold ${HIGH_RISK.has(cur.risk) ? 'text-red-500' : 'text-blue-800'} `}
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
