// Derives a per-head view of an attention layer from its ranked singular values.
// Heads use a standard dimension (64/48/32) chosen so the layer splits into at
// least four heads. Each head's "activity" is the singular-value mass assigned
// to its slice of directions, and heads are ordered most → least active so the
// width slider can drop whole low-activity heads from the right.

export interface HeadInfo {
  label: number // the head's index in the layer (display number)
  activity: number // summed singular values of this head's directions
  dims: number // directions per head (the standard head dimension)
}

const STANDARD_HEAD_DIMS = [64, 48, 32] as const

// Pick the standard head dimension for a layer width: the largest that divides
// the width into at least four heads, falling back to any clean divisor.
export function headDimFor(size: number): number {
  for (const d of STANDARD_HEAD_DIMS) {
    if (size % d === 0 && size / d >= 4) return d
  }
  for (const d of STANDARD_HEAD_DIMS) {
    if (size % d === 0) return d
  }
  return size
}

// Deterministic label shuffle so head numbers read like real (unordered) head
// indices rather than 1..n in activity order. Same seed → same labels.
function permuteLabels(n: number, seed: number): number[] {
  const labels = Array.from({ length: n }, (_, i) => i + 1)
  let s = seed
  for (let i = n - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = s % (i + 1)
    ;[labels[i], labels[j]] = [labels[j], labels[i]]
  }
  return labels
}

// Split the ranked singular values into equal head-sized slices. Because the
// values are already sorted strongest → weakest, the resulting heads come out
// ordered by historical activity, matching how the slider drops them.
export function attentionHeads(values: number[], size: number, seed = 1): HeadInfo[] {
  const dims = headDimFor(size)
  const n = Math.max(1, Math.floor(size / dims))
  const labels = permuteLabels(n, seed + size)
  return Array.from({ length: n }, (_, h) => ({
    label: labels[h],
    activity: values.slice(h * dims, (h + 1) * dims).reduce((a, b) => a + b, 0),
    dims,
  }))
}
