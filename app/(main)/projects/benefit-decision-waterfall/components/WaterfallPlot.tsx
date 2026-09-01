'use client'

import React, { useMemo, useState } from 'react'

interface WaterfallPlotProps {
  plotData: any
  attributionData?: any
  /** Where the "goal line" (eligibility cutoff) sits, 0-100 scale. Invented
   * for case-study purposes — there is no real eligibility formula behind
   * this model, so treat this purely as an illustrative decision line. */
  thresholdPct?: number
  thresholdLabel?: string
  startLabel?: string
}

interface AttributionItem {
  rank: number | string
  feature: string
  val: string | number
  attribution: number
  text: string
  dir: string
}

interface RawBar {
  label: string
  value: number
  measure: string
  text: string
}

interface WaterfallBar {
  label: string
  value: number
  start: number
  end: number
  kind: 'increasing' | 'decreasing' | 'total'
  text: string
}

const COLORS = {
  increasing: { fill: '#24E43A', stroke: '#17922E' }, // Primary Red
  decreasing: { fill: '#EE3A24', stroke: '#983117' }, // Secondary Blue
  connector: '#7973EE',
  axis: '#241169',
  grid: 'rgba(36, 17, 105, 0.12)',
  start: '#241169',
  threshold: '#059669',
  resultAbove: '#059669',
  resultBelow: '#dc2626',
}

export default function WaterfallPlot({
  plotData,
  attributionData,
  thresholdPct = 70,
  thresholdLabel = 'Eligibility Threshold',
  startLabel = 'Starting Point',
}: WaterfallPlotProps) {
  const [viewMode, setViewMode] = useState<'waterfall' | 'd3_bars'>('waterfall')
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const getFigure = () => {
    try {
      if (!plotData) return null
      if (typeof plotData === 'string') {
        return JSON.parse(plotData)
      }
      if (typeof plotData.plot === 'string') {
        return JSON.parse(plotData.plot)
      }
      if (typeof plotData.plot === 'object') {
        return plotData.plot
      }
      if (plotData.data && plotData.layout) {
        return plotData
      }
      return null
    } catch (e: any) {
      console.error('Error parsing plot data:', e)
      return null
    }
  }

  // Reorder relative bars: largest increase first, largest decrease last.
  // Leading/trailing "total" bars (baseline & final prediction) stay pinned in place.
  const reorderBars = (raw: RawBar[]): RawBar[] => {
    if (raw.length <= 2) return raw

    const isTotal = (b: RawBar) => b.measure === 'total' || b.measure === 'absolute'
    const firstIsTotal = isTotal(raw[0])
    const lastIsTotal = isTotal(raw[raw.length - 1])

    const startIdx = firstIsTotal ? 1 : 0
    const endIdx = lastIsTotal ? raw.length - 1 : raw.length
    const middle = raw.slice(startIdx, endIdx)

    const sortedMiddle = [...middle].sort((a, b) => b.value - a.value)

    return [
      ...(firstIsTotal ? [raw[0]] : []),
      ...sortedMiddle,
      ...(lastIsTotal ? [raw[raw.length - 1]] : []),
    ]
  }

  const { bars, baselineValue, finalValue, parseError } = useMemo(() => {
    const figure = getFigure()
    if (!figure || !figure.data || !figure.data.length) {
      return {
        bars: [] as WaterfallBar[],
        baselineValue: 0,
        finalValue: 0,
        parseError: 'Waterfall plot structure not recognized.',
      }
    }

    const trace = figure.data.find((t: any) => t.type === 'waterfall') || figure.data[0]

    const xLabels: string[] = trace.x || []
    const yValues: number[] = (trace.y || []).map((v: any) => Number(v) || 0)
    const measures: string[] = trace.measure || xLabels.map(() => 'relative')
    const textVals: string[] = trace.text || []

    if (!xLabels.length || !yValues.length) {
      return {
        bars: [] as WaterfallBar[],
        baselineValue: 0,
        finalValue: 0,
        parseError: 'No waterfall data points found.',
      }
    }

    const rawBars: RawBar[] = xLabels.map((label, i) => ({
      label: String(label),
      value: yValues[i] ?? 0,
      measure: measures[i] || 'relative',
      text: textVals[i] || `${(yValues[i] ?? 0) >= 0 ? '+' : ''}${(yValues[i] ?? 0).toFixed(2)}`,
    }))

    const ordered = reorderBars(rawBars)

    let running = 0
    let baseline = 0
    const allBuilt: (WaterfallBar & { isTotalRow: boolean })[] = ordered.map((b) => {
      let start: number
      let end: number
      let kind: WaterfallBar['kind']
      const isTotalRow = b.measure === 'total' || b.measure === 'absolute'

      if (isTotalRow) {
        start = 0
        end = b.value
        running = b.value
        baseline = baseline === 0 ? b.value : baseline // first total row encountered = baseline
        kind = 'total'
      } else {
        start = running
        end = running + b.value
        running = end
        kind = b.value >= 0 ? 'increasing' : 'decreasing'
      }

      return { label: b.label, value: b.value, start, end, kind, text: b.text, isTotalRow }
    })

    // Baseline = first row's end if it's a total/absolute row, else 0.
    const baselineVal = allBuilt.length && allBuilt[0].isTotalRow ? allBuilt[0].end : 0
    // Final value = last row's end if it's a total row, else the running
    // total after the last feature contribution (these should match if the
    // model's SHAP values are additive).
    const lastRow = allBuilt[allBuilt.length - 1]
    const finalVal = lastRow?.isTotalRow ? lastRow.end : running

    // Only feature/contribution rows are actually rendered — the
    // baseline and final-total rows are represented as reference lines
    // instead (see startLabel/thresholdLabel), not as bars.
    const visible: WaterfallBar[] = allBuilt
      .filter((b) => !b.isTotalRow)
      .map(({ isTotalRow, ...rest }) => rest)

    return {
      bars: visible,
      baselineValue: baselineVal,
      finalValue: finalVal,
      parseError: null as string | null,
    }
  }, [plotData])

  const extractItems = (): AttributionItem[] => {
    if (attributionData && attributionData.data) {
      return attributionData.data.map((row: any[]) => {
        const rank = row[0]
        const feature = row[1]
        const val = row[2]
        const attrStr = String(row[3])
        const numVal = parseFloat(attrStr.replace('%', '').replace('+', ''))
        const dir = row[4]
        return { rank, feature, val, attribution: isNaN(numVal) ? 0 : numVal, text: attrStr, dir }
      })
    }
    return []
  }

  const items: AttributionItem[] = extractItems()

  return (
    <div className="flex w-full flex-col bg-white">
      {/* Main Chart Area */}
      <div className="relative flex min-h-120 flex-col justify-center bg-yellow-100/10 p-3">
        <div className="relative w-full">
          {parseError ? (
            <div className="flex h-120 flex-col items-center justify-center p-6 text-center text-blue-800">
              <p className="mb-1 text-sm font-bold text-red-600">Visualization Notice</p>
              <p className="mb-3 max-w-md text-xs text-blue-800/80">{parseError}</p>
              <button
                onClick={() => setViewMode('d3_bars')}
                className="rounded border border-blue-800 bg-blue-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Switch to Ranked Impact View
              </button>
            </div>
          ) : (
            <SvgWaterfall
              bars={bars}
              baselineValue={baselineValue}
              finalValue={finalValue}
              thresholdPct={thresholdPct}
              thresholdLabel={thresholdLabel}
              startLabel={startLabel}
              hoverIdx={hoverIdx}
              setHoverIdx={setHoverIdx}
            />
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Pure SVG horizontal waterfall chart. No external charting dependency.
 * Only feature-contribution bars are drawn; the starting point and the
 * (invented, for case-study purposes) eligibility threshold are shown as
 * dashed reference lines instead of dedicated bar rows, and the final
 * landing position is called out with a small result marker.
 */
function SvgWaterfall({
  bars,
  baselineValue,
  finalValue,
  thresholdPct,
  thresholdLabel,
  startLabel,
  hoverIdx,
  setHoverIdx,
}: {
  bars: WaterfallBar[]
  baselineValue: number
  finalValue: number
  thresholdPct: number
  thresholdLabel: string
  startLabel: string
  hoverIdx: number | null
  setHoverIdx: (i: number | null) => void
}) {
  if (!bars.length) {
    return (
      <div className="flex h-120 items-center justify-center text-sm text-blue-800/60">
        No waterfall data points found.
      </div>
    )
  }

  const width = 900
  const rowHeight = 50
  const margin = { top: 2, right: 2, bottom: 2, left: 260 }
  const innerW = width - margin.left - margin.right
  const innerH = rowHeight * bars.length
  const height = margin.top + innerH + margin.bottom

  // Left boundary: start at baselineValue (no extra left padding) unless a
  // bar ends further left — in that case include it with a small pad.
  const barValues = bars.flatMap((b) => [b.start, b.end])
  const leftMost = Math.min(baselineValue, ...barValues)
  const rightMost = Math.max(thresholdPct, finalValue, ...barValues)
  const rightPad = (rightMost - leftMost) * 0.04 || 1
  const xMin = leftMost < baselineValue ? leftMost - rightPad : leftMost
  const xMax = rightMost + rightPad

  const xScale = (v: number) => ((v - xMin) / (xMax - xMin)) * innerW

  const barHeight = rowHeight

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        className="block"
        role="img"
        aria-label="Contribution waterfall chart"
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Eligibility threshold — green filled box from threshold to right edge */}
          <rect
            x={xScale(thresholdPct)}
            y={0}
            width={Math.max(0, innerW - xScale(thresholdPct))}
            height={innerH}
            fill={COLORS.threshold}
            opacity={0.12}
          />

          {/* Starting point — solid vertical reference line, no label */}
          <line
            x1={xScale(baselineValue)}
            x2={xScale(baselineValue)}
            y1={0}
            y2={innerH}
            stroke={COLORS.start}
            strokeWidth={1}
          />

          <line
            x1={-margin.left + 12}
            x2={innerW}
            y1={0}
            y2={0}
            stroke={COLORS.grid}
            strokeWidth={1}
          />

          {/* contribution rows */}
          {bars.map((b, i) => {
            const rowY = i * rowHeight
            const y = rowY + (rowHeight - barHeight) / 2
            const xStart = xScale(Math.min(b.start, b.end))
            const xEnd = xScale(Math.max(b.start, b.end))
            const w = Math.max(1, xEnd - xStart)
            const palette = b.kind === 'increasing' ? COLORS.increasing : COLORS.decreasing
            const isHover = hoverIdx === i

            return (
              <g
                key={i}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                style={{ cursor: 'pointer' }}
              >
                <line
                  x1={-margin.left + 12}
                  x2={innerW}
                  y1={rowY + rowHeight}
                  y2={rowY + rowHeight}
                  stroke={COLORS.grid}
                  strokeWidth={1}
                />

                <foreignObject
                  x={-margin.left + 8}
                  y={rowY}
                  width={margin.left - 20}
                  height={rowHeight}
                >
                  <div
                    // @ts-ignore
                    xmlns="http://www.w3.org/1999/xhtml"
                    style={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-bw-quinta-pro), ui-sans-serif, system-ui, sans-serif',
                      fontSize: '13px',
                      lineHeight: 1.25,
                      color: '#241169',
                      fontWeight: isHover ? 700 : 600,
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word',
                    }}
                  >
                    {b.label}
                  </div>
                </foreignObject>

                <rect
                  x={xStart}
                  y={y}
                  width={w}
                  height={barHeight}
                  fill={palette.fill}
                  stroke={palette.stroke}
                  strokeWidth={isHover ? 2.5 : 1.5}
                  opacity={isHover ? 1 : 0.92}
                />
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
