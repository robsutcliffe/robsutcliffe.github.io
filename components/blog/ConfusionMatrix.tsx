'use client'

import React, { useEffect, useState } from 'react'

export type ConfusionCell = {
  label: string
  value: string
  highlight?: boolean
}

export type ConfusionGroup = {
  title: string
  /** Row 0 = Recidivated, Row 1 = Did not; Col 0 = Predicted No, Col 1 = Predicted Yes */
  cells: [[ConfusionCell, ConfusionCell], [ConfusionCell, ConfusionCell]]
}

export type ConfusionMatrixGroupProps = {
  groups: ConfusionGroup[]
  title?: string
  subtitle?: string
  xLabel?: string
  yLabel?: string
  rowLabels?: [string, string]
  colLabels?: [string, string]
  /** Which axis the percentages sum across — draws a bold divider to make the orientation clear */
  divideBy?: 'row' | 'col'
  fontFamily?: string
}

const HIGHLIGHT_FILL = '#F39AE0'
const HIGHLIGHT_TEXT = '#92178C'
const NEUTRAL_FILL = '#FCE9F7'
const STROKE = '#BB1FAE'
const NEUTRAL_TEXT = '#BB1FAE'
const AXIS_COLOR = '#241169'
const DIVIDE_COLOR = '#BB1FAE'
const BG_TINT = '#E424CE'

const LABEL_FULL: Record<string, string> = {
  TP: 'True Positive',
  FP: 'False Positive',
  TN: 'True Negative',
  FN: 'False Negative',
}

export function ConfusionMatrixGroup({
  groups,
  title,
  subtitle,
  xLabel = 'Predicted',
  yLabel = 'Actual',
  rowLabels = ['Recidivated', 'Did not'],
  colLabels = ['Predicted No', 'Predicted Yes'],
  divideBy,
  fontFamily = 'Bw Quinta Pro, system-ui, sans-serif',
}: ConfusionMatrixGroupProps) {
  const [layoutCols, setLayoutCols] = useState<number | null>(null)
  useEffect(() => {
    const check = () => {
      const w = window.innerWidth
      if (w < 480) setLayoutCols(1)
      else if (w < 800) setLayoutCols(2)
      else setLayoutCols(groups.length)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [groups.length])

  const n = groups.length
  const numCols = Math.min(layoutCols ?? n, n)
  const numRows = Math.ceil(n / numCols)

  // Overall SVG canvas dimensions
  const width = 1080
  // Per-group row height — taller on single-column (mobile) layout so cells fit their text
  const singleGroupH = numCols === 1 ? 560 : 360
  // Space reserved at the top of each group slot for the group title heading
  const groupTitleH = 36
  const marginTop = title ? 100 : 70
  const marginBottom = 110
  const marginLeft = numCols === 1 ? 45 : 65
  const marginRight = 30

  const innerWidth = width - marginLeft - marginRight
  const innerHeight = numRows * singleGroupH
  const height = marginTop + innerHeight + marginBottom

  // Each group gets equal horizontal space within a row
  const groupWidth = innerWidth / numCols
  // Use a larger gap only along the axis where the divider line sits
  // On mobile (single column) keep gaps minimal so cells fill the space
  const smallGap = numCols === 1 ? groupWidth * 0.03 : groupWidth * 0.05
  const largeGap = numCols === 1 ? groupWidth * 0.07 : groupWidth * 0.12
  // groupPad: consistent outer padding for each group slot — keeps inter-group gap uniform
  const groupPad = smallGap
  // colGap / rowGap: inner gap between the two cells inside a group
  const colGap = divideBy === 'col' ? largeGap : smallGap
  const rowGap = divideBy === 'row' ? largeGap : smallGap
  // cellW uses groupPad (outer) + colGap (inner) so the between-block gap stays constant
  const cellW = (groupWidth - groupPad * 2 - colGap) / 2
  // cellH uses groupTitleH (title zone) + smallGap outer padding + rowGap inner gap
  const cellH = (singleGroupH - groupTitleH - smallGap * 2 - rowGap) / 2
  const cellRadius = 2

  // Grid position helpers
  const groupCol = (gi: number) => gi % numCols
  const groupRow = (gi: number) => Math.floor(gi / numCols)
  const groupX = (gi: number) => marginLeft + groupCol(gi) * groupWidth + groupPad
  const groupY = (gi: number) => marginTop + groupRow(gi) * singleGroupH
  const cellX = (gi: number, col: number) => groupX(gi) + col * (cellW + colGap)
  // cellY offset includes the groupTitleH reserved zone above the cells
  const cellY = (gi: number, row: number) =>
    groupY(gi) + groupTitleH + row * (cellH + rowGap) + smallGap

  // Axis extents
  const axisX0 = marginLeft
  const axisX1 = marginLeft + innerWidth
  const axisY0 = marginTop + innerHeight // bottom
  const axisY1 = marginTop // top

  // Helper: % of SVG for HTML text overlay
  const pctX = (x: number) => `${(x / width) * 100}%`
  const pctY = (y: number) => `${(y / height) * 100}%`

  return (
    <div className="not-prose my-4 -mr-6 sm:mr-6">
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${width} / ${height}`,
          fontFamily,
        }}
      >
        {/* SVG: shapes only */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={title ?? 'Confusion matrix'}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background tint — matches ScreePlot */}
          <rect
            x={axisX0}
            y={axisY1}
            width={axisX1 - axisX0}
            height={axisY0 - axisY1}
            fill={BG_TINT}
            opacity={0.04}
          />

          {/* Cells */}
          {groups.map((group, gi) =>
            group.cells.map((row, ri) =>
              row.map((cell, ci) => {
                const x = cellX(gi, ci)
                const y = cellY(gi, ri)
                const fill = cell.highlight ? HIGHLIGHT_FILL : NEUTRAL_FILL
                return (
                  <rect
                    key={`${gi}-${ri}-${ci}`}
                    x={x}
                    y={y}
                    width={cellW}
                    height={cellH}
                    strokeWidth={1.3}
                    stroke={STROKE}
                    opacity={0.3}
                    rx={cellRadius}
                    ry={cellRadius}
                    fill={fill}
                  />
                )
              })
            )
          )}

          {/* Divide lines — drawn on top of cells to show parity orientation */}
          {divideBy === 'row' &&
            groups.map((_, gi) => {
              // Horizontal line between row 0 and row 1, spanning both cols
              const inset = 12
              const x1 = cellX(gi, 0) + inset
              const x2 = cellX(gi, 1) + cellW - inset
              const y = cellY(gi, 0) + cellH + rowGap / 2
              return (
                <line
                  key={`divide-row-${gi}`}
                  x1={x1}
                  x2={x2}
                  y1={y}
                  y2={y}
                  stroke={DIVIDE_COLOR}
                  strokeWidth={1}
                  opacity={0.4}
                  strokeDasharray="6 3"
                />
              )
            })}

          {divideBy === 'col' &&
            groups.map((_, gi) => {
              // Vertical line between col 0 and col 1, spanning both rows
              const inset = 12
              const x = cellX(gi, 0) + cellW + colGap / 2
              const y1 = cellY(gi, 0) + inset
              const y2 = cellY(gi, 1) + cellH - inset
              return (
                <line
                  key={`divide-col-${gi}`}
                  x1={x}
                  x2={x}
                  y1={y1}
                  y2={y2}
                  stroke={DIVIDE_COLOR}
                  strokeWidth={2.5}
                  opacity={0.35}
                  strokeDasharray="6 3"
                />
              )
            })}

          {/* Left axis — full height */}
          <line
            x1={axisX0}
            x2={axisX0}
            y1={axisY0}
            y2={axisY1}
            stroke={AXIS_COLOR}
            strokeWidth={1.5}
          />

          {/* Y-axis row tick marks — one per cell row per grid row */}
          {Array.from({ length: numRows }, (_, gr) => {
            // first group index in this grid row
            const gi = gr * numCols
            return [0, 1].map((ri) => {
              const y = cellY(gi, ri) + cellH / 2
              return (
                <line
                  key={`ytick-${gr}-${ri}`}
                  x1={axisX0 - 14}
                  x2={axisX0}
                  y1={y}
                  y2={y}
                  stroke={AXIS_COLOR}
                  strokeWidth={1.5}
                />
              )
            })
          })}

          {/* X-axis col tick marks — only for groups in the last grid row */}
          {groups.map((_, gi) =>
            groupRow(gi) === numRows - 1
              ? [0, 1].map((ci) => {
                  const x = cellX(gi, ci) + cellW / 2
                  const rowBottom = groupY(gi) + singleGroupH
                  return (
                    <line
                      key={`xtick-${gi}-${ci}`}
                      x1={x}
                      x2={x}
                      y1={rowBottom}
                      y2={rowBottom + 14}
                      stroke={AXIS_COLOR}
                      strokeWidth={1.5}
                    />
                  )
                })
              : null
          )}

          {/* Horizontal axis line — bottom of the last grid row only */}
          <line
            x1={axisX0}
            x2={axisX1}
            y1={marginTop + numRows * singleGroupH}
            y2={marginTop + numRows * singleGroupH}
            stroke={AXIS_COLOR}
            strokeWidth={1.5}
          />
        </svg>

        {/* HTML text overlay — fixed font sizes, not affected by SVG scaling */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
          {/* Title */}
          {title && (
            <div
              style={{
                position: 'absolute',
                left: pctX(marginLeft),
                top: pctY(marginTop / 2 - 10),
                transform: 'translateY(-50%)',
                width: pctX(innerWidth),
                textAlign: 'center',
                color: AXIS_COLOR,
                fontWeight: 600,
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </div>
          )}

          {/* Subtitle */}
          {subtitle && (
            <div
              style={{
                position: 'absolute',
                left: pctX(marginLeft),
                top: pctY(marginTop * 0.72),
                transform: 'translateY(-50%)',
                width: pctX(innerWidth),
                textAlign: 'center',
                color: AXIS_COLOR,
                opacity: 0.65,
                fontSize: '0.75rem',
              }}
            >
              {subtitle}
            </div>
          )}

          {/* Group titles — positioned above the cells in the reserved groupTitleH zone */}
          {groups.map((group, gi) => (
            <div
              key={`gtitle-${gi}`}
              style={{
                position: 'absolute',
                left: pctX(groupX(gi)),
                top: pctY(groupY(gi) + groupTitleH / 2),
                transform: 'translateY(-50%)',
                width: pctX(groupWidth - groupPad * 2),
                textAlign: 'center',
                color: NEUTRAL_TEXT,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            >
              {group.title}
            </div>
          ))}

          {/* Y-axis row labels — repeated for each grid row, rotated 90° */}
          {Array.from({ length: numRows }, (_, gr) => {
            const gi = gr * numCols
            return rowLabels.map((label, ri) => {
              const y = cellY(gi, ri) + cellH / 2
              return (
                <div
                  key={`rowlabel-${gr}-${ri}`}
                  style={{
                    position: 'absolute',
                    left: pctX(axisX0 - 28),
                    top: pctY(y),
                    transform: 'translateX(-50%) translateY(-50%) rotate(-90deg)',
                    color: AXIS_COLOR,
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </div>
              )
            })
          })}

          {/* X-axis col labels — only for groups in the last grid row */}
          {groups.map((_, gi) =>
            groupRow(gi) === numRows - 1
              ? colLabels.map((label, ci) => {
                  const x = cellX(gi, ci)
                  const rowBottom = groupY(gi) + singleGroupH
                  return (
                    <div
                      key={`collabel-${gi}-${ci}`}
                      style={{
                        position: 'absolute',
                        left: pctX(x),
                        top: pctY(rowBottom + 18),
                        width: pctX(cellW),
                        textAlign: 'center',
                        color: AXIS_COLOR,
                        fontSize: '0.7rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {label}
                    </div>
                  )
                })
              : null
          )}

          {/* Cell content: label + value */}
          {groups.map((group, gi) =>
            group.cells.map((row, ri) =>
              row.map((cell, ci) => {
                const x = cellX(gi, ci)
                const y = cellY(gi, ri)
                const textColor = cell.highlight ? HIGHLIGHT_TEXT : NEUTRAL_TEXT
                return (
                  <div
                    key={`cell-${gi}-${ri}-${ci}`}
                    style={{
                      position: 'absolute',
                      left: pctX(x),
                      top: pctY(y),
                      width: pctX(cellW),
                      height: pctY(cellH),
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: textColor,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        lineHeight: 1.1,
                        letterSpacing: '0.03em',
                      }}
                    >
                      {cell.label}
                    </span>
                    <span
                      style={{
                        fontWeight: 400,
                        fontSize: '0.55rem',
                        lineHeight: 1.2,
                        opacity: cell.highlight ? 0.85 : 0.6,
                        letterSpacing: '0.01em',
                        marginBottom: '0.2em',
                      }}
                    >
                      {LABEL_FULL[cell.label] ?? ''}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        lineHeight: 1.1,
                      }}
                    >
                      {cell.value}
                    </span>
                  </div>
                )
              })
            )
          )}
        </div>
      </div>
    </div>
  )
}
