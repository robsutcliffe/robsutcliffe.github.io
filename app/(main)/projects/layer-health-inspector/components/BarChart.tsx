'use client'

// One thin bar per drawn information direction (strongest → weakest); its height
// is that direction's singular value. A faint "comb" behind the bars keeps every
// slot visible even when its bar is too short to see — including the kept buffer
// of near-zero directions above the live count. Only the deep tail (directions no
// sensible test width would keep) is collapsed into a single labelled grey box on
// the right. The red band is everything the current cut trims; drag its edge to
// change the test width. Bars are directions, NOT neurons.

import { useRef } from 'react'

interface BarChartProps {
  values: number[]
  keep: number // test width — how many top directions are kept
  live: number // live-direction count; directions past this carry ~no information
  shown: number // directions drawn individually; the rest are collapsed
  onKeepChange: (value: number) => void
}

const W = 720
const H = 200
const PAD = { top: 14, right: 6, bottom: 8, left: 26 }
const GAP = 0 // gap between the drawn bars and the collapsed box

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v))
}

export default function BarChart({ values, keep, live, shown, onKeepChange }: BarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  const plotW = W - PAD.left - PAD.right
  const plotH = H - PAD.top - PAD.bottom
  const plotRight = PAD.left + plotW
  const baseline = PAD.top + plotH

  const n = values.length
  const shownN = n // keep this for now clamp(shown, 1, n)
  const liveN = clamp(live, 0, shownN)
  const collapsed = n - shownN // deep-tail directions folded into the box
  const hasBox = collapsed > 0

  // Reserve a box on the right for the collapsed tail; the drawn directions spread
  // across everything that's left so they read clearly.
  const boxW = hasBox ? clamp((collapsed / n) * plotW, 44, 120) : 0
  const drawnW = plotW - (hasBox ? boxW + GAP : 0)
  const drawnRight = PAD.left + drawnW
  const boxLeft = plotRight - boxW

  // Scale the y-axis to the tallest bar, with a little headroom.
  const maxVal = Math.max(...values, 1e-9) * 1.05
  const y = (v: number) => PAD.top + plotH * (1 - v / maxVal)

  const slot = drawnW / shownN
  const cx = (i: number) => PAD.left + (i + 0.5) * slot
  const barW = clamp(slot * 0.45, 0.8, 4)
  const combW = clamp(slot * 0.4, 0.4, 2)

  // Map a "keep" count to an x position — across the drawn slots, or, once it runs
  // past them, proportionally across the collapsed box.
  const keepX = (k: number) => {
    if (!hasBox || k <= shownN) return PAD.left + clamp(k, 0, shownN) * slot
    const t = (clamp(k, shownN, n) - shownN) / Math.max(collapsed, 1)
    return boxLeft + t * boxW
  }
  const cutX = keepX(keep)

  // Inverse of keepX: an x position (in viewBox units) back to a keep count.
  const xToKeep = (x: number) => {
    if (!hasBox || x <= drawnRight) {
      return clamp(Math.round((x - PAD.left) / slot), 1, shownN)
    }
    const t = (x - boxLeft) / Math.max(boxW, 1)
    return clamp(shownN + Math.round(t * collapsed), shownN, n)
  }

  // Translate a pointer event into a keep count and push it up.
  const applyPointer = (clientX: number) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    if (rect.width === 0) return
    const x = ((clientX - rect.left) / rect.width) * W
    onKeepChange(xToKeep(x))
  }

  // A few reference gridlines on the y-axis.
  const ticks = 4
  const gridlines = Array.from({ length: ticks + 1 }, (_, i) => {
    const v = (maxVal / ticks) * i
    return { v, yy: y(v) }
  })

  const handleTop = (H - PAD.bottom - PAD.top) / 2 + PAD.top - 5

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full touch-none select-none"
      role="img"
      aria-label={`${liveN} live information directions shown as bars, ${collapsed} dead dimensions collapsed into a box. The test width keeps the top ${keep}. Drag the cut to change it.`}
    >
      {/* red band: everything the current cut trims */}
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
            {v.toFixed(1)}
          </text>
        </g>
      ))}

      {/* slot comb: one faint line per drawn direction so short bars stay placed */}
      {Array.from({ length: shownN }, (_, i) => (
        <line
          key={`c${i}`}
          x1={cx(i)}
          x2={cx(i)}
          y1={PAD.top}
          y2={baseline}
          className="stroke-blue-800"
          opacity={0.06}
          strokeWidth={combW}
        />
      ))}

      {/* bars: thin lines, one per drawn direction (buffer dirs are near-zero) */}
      {values.slice(0, shownN).map((v, i) => {
        const top = y(Math.max(v, 0))
        const height = Math.max(baseline - top, 0)
        return (
          <rect
            key={`b${i}`}
            x={cx(i) - barW / 4}
            y={top}
            width={barW / 2}
            height={height}
            className="fill-blue-800"
          >
            <title>{`Direction ${i + 1}: ${v.toFixed(4)}`}</title>
          </rect>
        )
      })}

      {/* deep tail: collapsed into a single labelled grey box */}
      {hasBox &&
        (() => {
          // 1. Cap the number of lines at half the box width
          const maxLines = Math.floor(boxW / 2)
          const totalLines = Math.min(collapsed, maxLines)

          // 2. Calculate a dynamic stroke width based on the width and line count
          // If there's only 1 line, default to a clean thin stroke (e.g., 1 or 1.5)
          const availableSpacePerLine = totalLines > 1 ? boxW / totalLines : boxW
          const dynamicStrokeWidth =
            totalLines > 1 ? Math.min(1, Math.min(2, availableSpacePerLine * 0.3)) : 1.5

          return (
            <g>
              {/* Background box */}
              <rect
                x={boxLeft}
                y={PAD.top}
                width={boxW}
                height={plotH}
                className="fill-transparent"
                strokeWidth={1}
              />

              {/* Render the capped number of vertical lines */}
              {totalLines > 0 &&
                Array.from({ length: totalLines }).map((_, index) => {
                  // Evenly space the lines across the width
                  const xPosition =
                    totalLines === 1
                      ? boxLeft + boxW / 2
                      : boxLeft + index * (boxW / (totalLines - 1))

                  return (
                    <line
                      key={index}
                      x1={xPosition}
                      y1={PAD.top}
                      x2={xPosition}
                      y2={PAD.top + plotH}
                      className="stroke-blue-800"
                      opacity={0.1}
                      strokeWidth={0.5}
                    />
                  )
                })}
            </g>
          )
        })()}

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
