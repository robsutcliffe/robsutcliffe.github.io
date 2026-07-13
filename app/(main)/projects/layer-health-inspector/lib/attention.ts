// Groups an attention layer's ranked information directions into heads.
//
// Attention layers don't shrink dimension-by-dimension in practice — you drop
// whole heads. Each head owns a standard number of dimensions (64, 48 or 32),
// so a layer of width 256 with 64-dim heads has 4 heads. We deal the ranked
// directions into contiguous chunks, sum each head's singular values into an
// "activity" score, and present the heads strongest-first so a slider can trim
// the least active ones from the right — exactly like the direction chart.

import type { Layer } from './types'

// Standard per-head dimensions, preferred order. We pick the largest that
// divides the layer width and still leaves at least two heads.
export const STANDARD_HEAD_DIMS = [64, 48, 32] as const

export interface AttentionHead {
  head: number // the head's original number in the layer (1-based)
  activity: number // summed singular values across the head's dimensions
  values: number[] // the head's singular values, strongest first
  liveDims: number // dimensions above the live-direction cutoff
}

export interface HeadBreakdown {
  headDim: number // standard dimensions per head
  heads: AttentionHead[] // ordered by historical activity, most active first
}

export function headDimFor(size: number): number {
  for (const d of STANDARD_HEAD_DIMS) {
    if (size % d === 0 && size / d >= 2) return d
  }
  return STANDARD_HEAD_DIMS[STANDARD_HEAD_DIMS.length - 1]
}

// Deterministic pseudo-shuffle so head numbers look like real layer positions
// (activity rank rarely matches physical head order in a trained model).
function labelOrder(count: number, seed: string): number[] {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  }
  const labels = Array.from({ length: count }, (_, i) => i + 1)
  for (let i = count - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    const j = (h >>> 0) % (i + 1)
    ;[labels[i], labels[j]] = [labels[j], labels[i]]
  }
  return labels
}

/** Split a layer's ranked directions into heads, most active head first. */
export function attentionHeads(layer: Layer): HeadBreakdown {
  const headDim = headDimFor(layer.size)
  const count = Math.max(1, Math.floor(layer.size / headDim))
  const labels = labelOrder(count, layer.id)
  const live = layer.numerical_rank_at_threshold

  const heads: AttentionHead[] = Array.from({ length: count }, (_, i) => {
    const start = i * headDim
    const values = layer.singular_values.slice(start, start + headDim)
    const activity = values.reduce((s, v) => s + v, 0)
    const liveDims = Math.max(0, Math.min(headDim, live - start))
    return { head: labels[i], activity, values, liveDims }
  })

  // The chunks are taken from ranked directions, so activity already decreases
  // left to right — but sort defensively so the ordering contract holds.
  heads.sort((a, b) => b.activity - a.activity)
  return { headDim, heads }
}
