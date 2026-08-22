'use client'

import React from 'react'

export type LossLandscape3DProps = {
  width?: number
  height?: number
  biasRange?: [number, number]
  weightRange?: [number, number]
  lossRange?: [number, number]
  /** bias value of the model position marker */
  modelBias?: number
  /** weight value of the model position marker */
  modelWeight?: number
  /** loss function: given bias and weight, returns loss */
  lossFunction?: (bias: number, weight: number) => number
  biasLabel?: string
  weightLabel?: string
  lossLabel?: string
  fontFamily?: string
  axisColor?: string
  labelColor?: string
  gridResolution?: number
}

/** Interpolate between blue (#1a3a8c) and yellow (#f5c518) based on t in [0,1] */
function lerpColor(t: number): string {
  // low loss → deep blue, high loss → yellow
  const r = Math.round(26 + (245 - 26) * t)
  const g = Math.round(58 + (197 - 58) * t)
  const b = Math.round(140 + (24 - 140) * t)
  return `rgb(${r},${g},${b})`
}

/**
 * Oblique projection matching the reference matplotlib 3D view:
 *   bias   → x-axis, increases to the RIGHT   (front-left to front-right)
 *   weight → y-axis, increases into depth      (front → back; projects upper-LEFT)
 *   loss   → z-axis, increases UPWARD
 *
 * Canvas origin (cx, cy) sits at the front-left base corner
 * (bias = biasRange[0], weight = weightRange[0], loss = lossRange[0]).
 */
function makeProject(
  cx: number,
  cy: number,
  xStep: number,
  zStep: number,
  depthX: number,
  depthY: number,
  biasRange: [number, number],
  weightRange: [number, number],
  lossRange: [number, number]
) {
  const biasSpan = biasRange[1] - biasRange[0]
  const weightSpan = weightRange[1] - weightRange[0]
  const lossSpan = lossRange[1] - lossRange[0]

  return (bias: number, weight: number, loss: number) => {
    const bNorm = (bias - biasRange[0]) / biasSpan   // 0 = left, 1 = right
    const wNorm = (weight - weightRange[0]) / weightSpan // 0 = front, 1 = back
    const lNorm = (loss - lossRange[0]) / lossSpan    // 0 = bottom, 1 = top

    // bias → right; weight → upper-left (depth); loss → up
    const px = cx + bNorm * xStep - wNorm * depthX
    const py = cy - lNorm * zStep - wNorm * depthY
    return { px, py }
  }
}

function defaultLoss(bias: number, weight: number): number {
  return 1.2 * (bias - 4) * (bias - 4) + 8 * (weight - 0.75) * (weight - 0.75)
}

export function LossLandscape3D({
  width: widthProp,
  height: heightProp,
  biasRange = [1, 7],
  weightRange = [-1, 3],
  lossRange = [0, 30],
  modelBias = 3.9833,
  modelWeight = 0.9333,
  lossFunction = defaultLoss,
  biasLabel = 'Bias',
  weightLabel = 'Weight',
  lossLabel = 'Loss',
  fontFamily = 'Bw Quinta Pro, system-ui, sans-serif',
  axisColor = '#241169',
  labelColor = '#241169',
  gridResolution = 14,
}: LossLandscape3DProps) {
  const width = widthProp ?? 900
  const height = heightProp ?? 680

  // origin = front-left base corner (bias=min, weight=min, loss=min)
  // bias goes RIGHT, weight goes upper-LEFT (depth), loss goes UP
  const cx = width * 0.14
  const cy = height * 0.82
  const xStep = width * 0.52   // bias axis length (right)
  const zStep = height * 0.64  // loss axis height (up)
  const depthX = width * 0.22  // weight depth: leftward component
  const depthY = height * 0.22 // weight depth: upward component

  const project = makeProject(cx, cy, xStep, zStep, depthX, depthY, biasRange, weightRange, lossRange)

  const pctX = (svgX: number) => `${(svgX / width) * 100}%`
  const pctY = (svgY: number) => `${(svgY / height) * 100}%`

  const n = gridResolution
  const biasVals = Array.from({ length: n + 1 }, (_, i) => biasRange[0] + (i / n) * (biasRange[1] - biasRange[0]))
  const weightVals = Array.from({ length: n + 1 }, (_, i) => weightRange[0] + (i / n) * (weightRange[1] - weightRange[0]))

  // Precompute loss values for colour normalization
  const allLosses: number[][] = biasVals.map((b) => weightVals.map((w) => lossFunction(b, w)))
  const flatLosses = allLosses.flat()
  const minLoss = Math.min(...flatLosses)
  const maxLoss = Math.max(...flatLosses)
  const lossSpanActual = maxLoss - minLoss || 1

  function normLoss(l: number) {
    return (l - minLoss) / lossSpanActual
  }

  // Build quads (patches), sorted back-to-front for painter's algorithm
  // Each quad: corners at (bi, wi), (bi+1, wi), (bi+1, wi+1), (bi, wi+1)
  type Quad = {
    pts: string
    avgZ: number
    color: string
    opacity: number
  }
  const quads: Quad[] = []

  for (let bi = 0; bi < n; bi++) {
    for (let wi = 0; wi < n; wi++) {
      const b0 = biasVals[bi]
      const b1 = biasVals[bi + 1]
      const w0 = weightVals[wi]
      const w1 = weightVals[wi + 1]
      const l00 = allLosses[bi][wi]
      const l10 = allLosses[bi + 1][wi]
      const l11 = allLosses[bi + 1][wi + 1]
      const l01 = allLosses[bi][wi + 1]
      const avgL = (l00 + l10 + l11 + l01) / 4

      const p00 = project(b0, w0, l00)
      const p10 = project(b1, w0, l10)
      const p11 = project(b1, w1, l11)
      const p01 = project(b0, w1, l01)

      const pts = `${p00.px},${p00.py} ${p10.px},${p10.py} ${p11.px},${p11.py} ${p01.px},${p01.py}`
      // avgZ for depth sort: higher w (depth) and lower loss → further back → lower avgZ in screen space
      const avgScreenY = (p00.py + p10.py + p11.py + p01.py) / 4
      quads.push({
        pts,
        avgZ: avgScreenY,
        color: lerpColor(normLoss(avgL)),
        opacity: 0.88,
      })
    }
  }

  // Sort back-to-front (higher screenY = closer to viewer = paint later/on top)
  quads.sort((a, b) => a.avgZ - b.avgZ)

  // Axis endpoints
  // loss axis drawn on the RIGHT side: at bias=max, weight=min — matches reference image
  const origin = project(biasRange[0], weightRange[0], lossRange[0])
  const biasEnd = project(biasRange[1], weightRange[0], lossRange[0])
  const weightEnd = project(biasRange[0], weightRange[1], lossRange[0])
  const lossOrigin = project(biasRange[1], weightRange[0], lossRange[0])
  const lossEnd = project(biasRange[1], weightRange[0], lossRange[1])

  // Axis ticks
  const biasTicks = Array.from({ length: Math.round(biasRange[1] - biasRange[0]) + 1 }, (_, i) => biasRange[0] + i)
  const weightTicks = Array.from({ length: Math.round(weightRange[1] - weightRange[0]) + 1 }, (_, i) => weightRange[0] + i)
  const lossTicks = [0, 5, 10, 15, 20, 25, 30].filter((v) => v >= lossRange[0] && v <= lossRange[1])

  // Model position marker
  const modelLoss = lossFunction(modelBias, modelWeight)
  const modelPt = project(modelBias, modelWeight, modelLoss)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${width} / ${height}`,
        fontFamily,
        marginBottom: '1rem',
      }}
    >
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMinYMid meet"
        role="img"
        aria-label="3D Loss Surface"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Surface quads */}
        {quads.map((q, i) => (
          <polygon
            key={`q-${i}`}
            points={q.pts}
            fill={q.color}
            fillOpacity={q.opacity}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={0.6}
          />
        ))}

        {/* Axes */}
        {/* Bias: front-bottom, left → right */}
        <line x1={origin.px} y1={origin.py} x2={biasEnd.px} y2={biasEnd.py} stroke={axisColor} strokeWidth={1.8} />
        {/* Weight: front-left → back-left (depth) */}
        <line x1={origin.px} y1={origin.py} x2={weightEnd.px} y2={weightEnd.py} stroke={axisColor} strokeWidth={1.8} />
        {/* Loss: right side, going up */}
        <line x1={lossOrigin.px} y1={lossOrigin.py} x2={lossEnd.px} y2={lossEnd.py} stroke={axisColor} strokeWidth={1.8} />

        {/* Bias axis ticks + labels */}
        {biasTicks.map((b) => {
          const pt = project(b, weightRange[0], lossRange[0])
          return (
            <g key={`b-tick-${b}`}>
              <line x1={pt.px} y1={pt.py - 4} x2={pt.px} y2={pt.py + 4} stroke={axisColor} strokeWidth={1.2} />
            </g>
          )
        })}

        {/* Weight axis ticks */}
        {weightTicks.map((w) => {
          const pt = project(biasRange[0], w, lossRange[0])
          return (
            <g key={`w-tick-${w}`}>
              <line x1={pt.px - 4} y1={pt.py} x2={pt.px + 4} y2={pt.py} stroke={axisColor} strokeWidth={1.2} />
            </g>
          )
        })}

        {/* Loss axis ticks — on the right side (bias=max, weight=min) */}
        {lossTicks.map((l) => {
          const pt = project(biasRange[1], weightRange[0], l)
          return (
            <g key={`l-tick-${l}`}>
              <line x1={pt.px} y1={pt.py} x2={pt.px + 6} y2={pt.py} stroke={axisColor} strokeWidth={1.2} />
            </g>
          )
        })}

        {/* Model position marker */}
        {/* Drop line from model point down to floor */}
        {(() => {
          const floorPt = project(modelBias, modelWeight, lossRange[0])
          return (
            <line
              x1={modelPt.px}
              y1={modelPt.py}
              x2={floorPt.px}
              y2={floorPt.py}
              stroke="#c0392b"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              opacity={0.8}
            />
          )
        })()}
        <circle cx={modelPt.px} cy={modelPt.py} r={7} fill="#c0392b" stroke="#fff" strokeWidth={2} opacity={0.9} />
      </svg>

      {/* HTML text overlay for labels */}
      {/* Bias axis label — below the mid-point of the front-bottom edge */}
      <div
        style={{
          position: 'absolute',
          left: pctX((origin.px + biasEnd.px) / 2),
          top: pctY(Math.max(origin.py, biasEnd.py) + 24),
          transform: 'translateX(-50%)',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: labelColor,
          whiteSpace: 'nowrap',
        }}
      >
        {biasLabel}
      </div>

      {/* Weight axis label — below the far end of the depth axis */}
      <div
        style={{
          position: 'absolute',
          left: pctX(weightEnd.px),
          top: pctY(weightEnd.py + 14),
          transform: 'translateX(-50%)',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: labelColor,
          whiteSpace: 'nowrap',
        }}
      >
        {weightLabel}
      </div>

      {/* Loss axis label — to the right of the mid-point of the right-side loss axis */}
      <div
        style={{
          position: 'absolute',
          left: pctX(lossEnd.px + 32),
          top: pctY((lossOrigin.py + lossEnd.py) / 2),
          transform: 'translateY(-50%)',
          fontSize: '0.82rem',
          fontWeight: 600,
          color: labelColor,
          whiteSpace: 'nowrap',
        }}
      >
        {lossLabel}
      </div>

      {/* Bias tick labels */}
      {biasTicks.map((b) => {
        const pt = project(b, weightRange[0], lossRange[0])
        return (
          <div
            key={`b-label-${b}`}
            style={{
              position: 'absolute',
              left: pctX(pt.px),
              top: pctY(pt.py + 6),
              transform: 'translateX(-50%)',
              fontSize: '0.68rem',
              color: labelColor,
              opacity: 0.75,
            }}
          >
            {b}
          </div>
        )
      })}

      {/* Weight tick labels */}
      {weightTicks.map((w) => {
        const pt = project(biasRange[0], w, lossRange[0])
        return (
          <div
            key={`w-label-${w}`}
            style={{
              position: 'absolute',
              left: pctX(pt.px - 8),
              top: pctY(pt.py),
              transform: 'translateX(-100%) translateY(-50%)',
              fontSize: '0.68rem',
              color: labelColor,
              opacity: 0.75,
            }}
          >
            {w.toFixed(1)}
          </div>
        )
      })}

      {/* Loss tick labels — on the right side */}
      {lossTicks.map((l) => {
        const pt = project(biasRange[1], weightRange[0], l)
        return (
          <div
            key={`l-label-${l}`}
            style={{
              position: 'absolute',
              left: pctX(pt.px + 10),
              top: pctY(pt.py),
              transform: 'translateY(-50%)',
              fontSize: '0.68rem',
              color: labelColor,
              opacity: 0.75,
            }}
          >
            {l}
          </div>
        )
      })}
    </div>
  )
}
