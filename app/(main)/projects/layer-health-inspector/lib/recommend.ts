// Turns a layer's raw numbers (current width + live directions) into a plain,
// action-oriented shrink recommendation for a non-technical reader.
//
// "Live directions" = directions carrying real information. "Redundant capacity"
// = width the layer probably isn't using. A shrink target must always stay at or
// above the live-direction count (with a buffer) — you can't keep fewer than the
// information the layer actually uses without expecting quality loss.

import type { Layer } from './types'

// Practical widths hardware/frameworks are happy with. Targets snap to these.
export const TARGET_WIDTHS = [32, 48, 64, 80, 96, 128, 160, 192, 256, 320, 384, 448, 512] as const

export type Risk = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High' | 'Critical'
export type Savings = 'High' | 'Medium' | 'Low'
export type Opportunity = 'High' | 'Medium' | 'Low' | 'None'

export interface Recommendation {
  width: number // current width
  live: number // live directions at the current cutoff
  redundant: number // width - live
  redundantPct: number // 0..1 — likely redundant capacity
  aggressive: number | null // tighter target width (stretch)
  conservative: number | null // roomier target width (safe first test)
  recommended: number // headline "test first" width (= width when not a candidate)
  compressionPct: number // 0..1 — savings if we adopt `recommended`
  risk: Risk
  savings: Savings
  opportunity: Opportunity
  isCandidate: boolean // is there a sensible shrink to test at all?
  sentence: string // manager-ready one-liner
}

// 947200 -> "947K", 1188864 -> "1.19M". Shared weight formatter.
export function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`
  return String(n)
}

export interface Rating {
  compressionPct: number // 0..1 — width reduction from keeping `keep`
  risk: Risk
  savings: Savings
  margin: number // keep / live — headroom over the live directions
}

// Conv layers encode spatial features that degrade less gracefully when trimmed,
// so their risk buckets demand extra headroom over the live directions.
const CONV_MARGIN_FACTOR = 1.3

// Rate an arbitrary test width (`keep`) the same way `recommend` rates its
// headline width. The single source of truth for the risk/savings buckets.
export function rate(width: number, live: number, keep: number, type?: string): Rating {
  const compressionPct = width > 0 ? 1 - keep / width : 0
  const margin = live > 0 ? keep / live : Infinity
  const f = (type ?? '').toLowerCase() === 'conv' ? CONV_MARGIN_FACTOR : 1
  let risk: Risk
  if (keep >= width) {
    // Keeping the existing width changes nothing — there is nothing to risk.
    risk = 'Very Low'
  } else if (margin >= 3.5 * f) {
    risk = 'Very Low'
  } else if (margin >= 2.5 * f) {
    risk = 'Low'
  } else if (margin >= 1.6 * f) {
    risk = 'Medium'
  } else if (margin >= 1.15 * f) {
    risk = 'High'
  } else if (margin >= 0.85 * f) {
    risk = 'Very High'
  } else {
    risk = 'Critical'
  }
  // A large cut always warrants validation, even with lots of headroom.
  if (compressionPct >= 0.65 && (risk === 'Very Low' || risk === 'Low')) risk = 'Medium'
  const savings: Savings =
    compressionPct >= 0.5 ? 'High' : compressionPct >= 0.25 ? 'Medium' : 'Low'
  return { compressionPct, risk, savings, margin }
}

const smallestAtLeast = (x: number, below: number): number | null =>
  TARGET_WIDTHS.find((w) => w >= x && w < below) ?? null

const largestBelow = (below: number): number | null => {
  const b = TARGET_WIDTHS.filter((w) => w < below)
  return b.length ? b[b.length - 1] : null
}

// Buffers over the live-direction count. The tighter (aggressive) target leaves a
// small cushion; the conservative one leaves a comfortable one.
const AGGRESSIVE_BUFFER = 1.15
const CONSERVATIVE_BUFFER = 1.6

export function recommend(width: number, live: number, type?: string): Recommendation {
  const aggressive = smallestAtLeast(live * AGGRESSIVE_BUFFER, width)

  let conservative = smallestAtLeast(live * CONSERVATIVE_BUFFER, width)
  // If there's no roomy target below the current width, step down one size.
  if (conservative === null && aggressive !== null) {
    conservative = largestBelow(width)
  }
  if (conservative !== null && aggressive !== null) {
    conservative = Math.max(conservative, aggressive)
  }

  const isCandidate = aggressive !== null

  // Lead with the safe (conservative) test when it still saves something real;
  // otherwise lead with the aggressive target.
  let recommended = width
  if (isCandidate && conservative !== null) {
    recommended = 1 - conservative / width >= 0.15 ? conservative : aggressive!
  }

  const { compressionPct, risk, savings } = rate(width, live, recommended, type)
  const redundant = width - live
  const redundantPct = width > 0 ? redundant / width : 0

  const opportunity: Opportunity = !isCandidate
    ? 'None'
    : compressionPct >= 0.5
      ? 'High'
      : compressionPct >= 0.25
        ? 'Medium'
        : 'Low'

  const sentence = isCandidate
    ? `Test resizing from ${width} to ${recommended} first; ${savings.toLowerCase()} savings, ${risk.toLowerCase()} risk.`
    : `Keep at ${width} — little redundant capacity to reclaim.`

  return {
    width,
    live,
    redundant,
    redundantPct,
    aggressive,
    conservative,
    recommended,
    compressionPct,
    risk,
    savings,
    opportunity,
    isCandidate,
    sentence,
  }
}

// Tailwind class bundles for the compression-opportunity heat used on the
// network blocks. High = loud (look here), None = quiet (leave alone).
export const OPPORTUNITY_STYLE: Record<
  Opportunity,
  { block: string; chip: string; label: string }
> = {
  High: {
    block: 'bg-red-800/70',
    chip: 'bg-red-400 text-blue-800',
    label: 'High',
  },
  Medium: {
    block: 'bg-yellow-800/70',
    chip: 'bg-yellow-400 text-blue-800',
    label: 'Medium',
  },
  Low: {
    block: 'bg-cyan-800/70',
    chip: 'bg-cyan-400 text-blue-800',
    label: 'Low',
  },
  None: {
    block: 'bg-blue-800/70',
    chip: 'bg-blue-400 text-white',
    label: 'Keep',
  },
}

export const RISK_STYLE: Record<Risk, string> = {
  'Very Low': 'bg-cyan-200 text-blue-800',
  Low: 'bg-cyan-300 text-blue-800',
  Medium: 'bg-yellow-300 text-blue-800',
  High: 'bg-red-500 text-white',
  'Very High': 'bg-red-600 text-white',
  Critical: 'bg-red-800 text-white',
}

// Risk levels that should read as a warning in the UI.
export const HIGH_RISK: ReadonlySet<Risk> = new Set(['High', 'Very High', 'Critical'])

export interface AggregateStats {
  total: number // total layers
  candidates: number // layers worth testing
  // A square layer costs width² weights; resizing to a target width costs target².
  weightsNow: number
  weightsRecommended: number
  weightsAggressive: number
  savedRecommended: number
  savedAggressive: number
  savingsPctRecommended: number // 0..1
  savingsPctAggressive: number // 0..1
  best: { layer: Layer; rec: Recommendation } | null
}

/** Model-wide totals for the summary section. */
export function aggregateStats(layers: Layer[], liveOf: (l: Layer) => number): AggregateStats {
  let weightsNow = 0
  let weightsRecommended = 0
  let weightsAggressive = 0
  let candidates = 0

  for (const layer of layers) {
    const rec = recommend(layer.size, liveOf(layer), layer.type)
    const now = layer.shape[0] * layer.shape[1]
    weightsNow += now
    weightsRecommended += rec.isCandidate ? rec.recommended ** 2 : now
    weightsAggressive += rec.isCandidate ? (rec.aggressive ?? rec.recommended) ** 2 : now
    if (rec.isCandidate) candidates++
  }

  const savedRecommended = weightsNow - weightsRecommended
  const savedAggressive = weightsNow - weightsAggressive

  return {
    total: layers.length,
    candidates,
    weightsNow,
    weightsRecommended,
    weightsAggressive,
    savedRecommended,
    savedAggressive,
    savingsPctRecommended: weightsNow > 0 ? savedRecommended / weightsNow : 0,
    savingsPctAggressive: weightsNow > 0 ? savedAggressive / weightsNow : 0,
    best: bestCandidate(layers, liveOf),
  }
}

/**
 * The single layer to start with: biggest compression opportunity, tie-broken by
 * the most directions saved. Returns null if nothing is worth shrinking.
 */
export function bestCandidate(
  layers: Layer[],
  liveOf: (l: Layer) => number
): { layer: Layer; rec: Recommendation } | null {
  let best: { layer: Layer; rec: Recommendation } | null = null
  for (const layer of layers) {
    const rec = recommend(layer.size, liveOf(layer), layer.type)
    if (!rec.isCandidate) continue
    if (
      !best ||
      rec.compressionPct > best.rec.compressionPct ||
      (rec.compressionPct === best.rec.compressionPct &&
        layer.size - rec.recommended > best.layer.size - best.rec.recommended)
    ) {
      best = { layer, rec }
    }
  }
  return best
}
