'use client'

// Attention-layer variant of the ranked-directions chart. One wide bar per
// attention head (each a standard number of dimensions, e.g. 48 or 64); bar
// height is that head's historical activity, ordered most → least active. The
// red band covers the heads the current test drops — drag its edge to remove or
// restore whole heads from the quiet end, just like the direction slider.

import { useRef } from 'react'
import type { HeadInfo } from '../lib/heads'

interface AttentionHeadChartProps {
  heads: HeadInfo[] // most → least active
  keepHeads: number // how many of the most active heads the test keeps
  onKeepHeadsChange: (value: number) => void
}

const W = 720
const H = 200
const PAD = { top: 14, right: 6, bottom: 26, left: 26 }

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

export default function AttentionHeadChart({
  heads,
  keepHeads,
  onKeepHeadsChange,
}: AttentionHeadChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const plotRight = PAD.left + plotW
  const baseline = PAD.top + plotH

  const n = heads.length
  const kept = clamp(keepHeads, 1, n)

  const slot = plotW / n
  const barW = slot * 0.55

  // Scale the y-axis to the busiest head, with a little headroom.
  const maxVal = Math.max(...heads.map((h) => h.activity), 1e-9) * 1.05
  const y = (v: number) => PAD.top + plotH * (1 - v / maxVal)

  const cutX = PAD.left + kept * slot

  // Translate a pointer event into a kept-head count and push it up.
  const applyPointer = (clientX: number) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    if (rect.width === 0) return
    const x = ((clientX - rect.left) / rect.width) * W
    onKeepHeadsChange(clamp(Math.round((x - PAD.left) / slot), 1, n))
  }

  // A few reference gridlines on the y-axis.
  const ticks = 4
  const gridlines = Array.from({ length: ticks + 1 }, (_, i) => {
    const v = (maxVal / ticks) * i
    return { v, yy: y(v) }
  })

  const handleTop = (baseline - PAD.top) / 2 + PAD.top - 5

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full touch-none select-none"
      role="img"
      aria-label={`${n} attention heads of ${heads[0]?.dims ?? 0} dimensions each, ordered by historical activity. The test keeps the ${kept} most active heads. Drag the cut to change it.`}
    >
      {/* red band: the heads the current test drops */}
      {cutX < plotRight && (
        <rect
          x={cutX}
          y={PAD.top}
          width={plotRight - cutX}
          height={plotH}
          className="fill-red-500/20"
        />
      )}

      {/* gridlines + y labels */}
      {gridlines.map(({ v, yy }, i) => (
        <g key={i}>
          <line
            x1={PAD.left}
            x2={plotRight}
            y1={yy}
            y2={yy}
            className="stroke-blue-100"
            opacity={0.06}
            strokeWidth={1}
          />
          <text
            x={PAD.left - 8}
            y={yy + 3}
            textAnchor="end"
            className="fill-blue-800 font-mono text-[8px]"
          >
            {v.toFixed(0)}
          </text>
        </g>
      ))}

      {/* one bar per head, most → least active */}
      {heads.map((h, i) => {
        const top = y(Math.max(h.activity, 0))
        const height = Math.max(baseline - top, 0)
        const x = PAD.left + i * slot + (slot - barW) / 2
        return (
          <g key={`h${i}`}>
            <rect x={x} y={top} width={barW} height={height} className="fill-blue-800" />
            <text
              x={PAD.left + (i + 0.5) * slot}
              y={baseline + 12}
              textAnchor="middle"
              className={`fill-blue-800 font-mono text-[9px] font-semibold`}
            >
              {`H${h.label}`}
            </text>
          </g>
        )
      })}

      {/* transparent overlay captures drags anywhere across the plot */}
      <rect
        x={PAD.left}
        y={PAD.top - 12}
        width={plotW}
        height={plotH + 12}
        fill="transparent"
        style={{ cursor: 'ew-resize' }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          applyPointer(e.clientX)
        }}
        onPointerMove={(e) => {
          if (e.buttons === 0) return
          applyPointer(e.clientX)
        }}
      />

      {/* cut line + grab handle */}
      <line
        x1={cutX}
        x2={cutX}
        y1={PAD.top}
        y2={baseline}
        className="stroke-red-700"
        strokeWidth={1.5}
        pointerEvents="none"
      />
      <g pointerEvents="none">
        <rect
          x={cutX - 5}
          y={handleTop - 2}
          width={10}
          height={14}
          rx={2}
          className="fill-red-700"
        />
        {[-2, 0, 2].map((dx) => (
          <line
            key={dx}
            x1={cutX + dx}
            x2={cutX + dx}
            y1={handleTop + 1}
            y2={handleTop + 9}
            className="stroke-white"
            strokeWidth={0.75}
          />
        ))}
      </g>
    </svg>
  )
}
