import React from 'react'

type PredictionArea = {
  x0?: number
  x1?: number
  y0?: number
  y1?: number
  points?: { x: number; y: number }[]
  fill?: string
  stroke?: string
  strokeWidth?: number
  label?: string
  labelColor?: string
}

type Datum = {
  x: number
  y: number
  label?: string
  color?: string
  fill?: string
  r?: number
}

type Annotation = {
  x: number
  y: number
  text: string
  color?: string
  fontSize?: number
  fontWeight?: number | string
  dx?: number
  dy?: number
  textAnchor?: 'start' | 'middle' | 'end'
}

type HighlightBand = {
  y0: number
  y1: number
  fill?: string
}

export type SvgScatterPlotProps = {
  data: Datum[]
  width?: number
  height?: number
  xDomain?: [number, number]
  yDomain?: [number, number]
  xTicks?: number[]
  yTicks?: number[]
  xLabel?: string
  yLabel?: string
  title?: string
  subtitle?: string
  highlightBand?: HighlightBand
  predictionAreas?: PredictionArea[]
  annotations?: Annotation[]
  padding?: { top: number; right: number; bottom: number; left: number }
  background?: string
  axisColor?: string
  labelColor?: string
  pointStroke?: string
  pointFill?: string
  pointRadius?: number
  fontFamily?: string
  showTickLabels?: boolean
  showDataLabels?: boolean
  showCorrelationLine?: boolean
  correlationLineColor?: string
  correlationLineWidth?: number
}

const defaultPadding = { top: 80, right: 300, bottom: 90, left: 70 }
const linePadding = { top: 20, right: 300, bottom: 90, left: 70 }
const pairPadding = { top: 80, right: 80, bottom: 100, left: 70 }

function extent(values: number[]): [number, number] {
  return [Math.min(...values), Math.max(...values)]
}

function makeLinearScale(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain
  const [r0, r1] = range
  const m = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0)

  return (value: number) => r0 + (value - d0) * m
}

export function SvgScatterPlot({
  data,
  width: widthProp,
  height: heightProp,
  xDomain,
  yDomain,
  xTicks,
  yTicks,
  xLabel = 'X axis',
  yLabel = 'Y axis',
  title,
  subtitle,
  highlightBand,
  predictionAreas = [],
  annotations = [],
  padding: paddingProp,
  background = 'transparent',
  axisColor = '#241169',
  labelColor = '#241169',
  pointStroke = '#E424CE',
  pointFill = '#FCE9F7',
  pointRadius = 5,
  fontFamily = 'Bw Quinta Pro, system-ui, sans-serif',
  showTickLabels = true,
  showDataLabels = true,
  showCorrelationLine = false,
  correlationLineColor = '#E424CE',
  correlationLineWidth = 1.5,
}: SvgScatterPlotProps) {
  const resolvedXDomain = xDomain ?? extent(data.map((d) => d.x))
  const resolvedYDomain = yDomain ?? extent(data.map((d) => d.y))

  const isLineMode = resolvedYDomain[0] === resolvedYDomain[1]

  const width = widthProp ?? 1080
  const height = heightProp ?? (isLineMode ? 150 : 720)
  const basePadding = paddingProp ?? (isLineMode ? linePadding : defaultPadding)
  // Give extra top space when a title is present
  const padding = title ? { ...basePadding, top: Math.max(basePadding.top, 120) } : basePadding

  const innerWidth = width - padding.left - padding.right
  const innerHeight = height - padding.top - padding.bottom

  const xScale = makeLinearScale(resolvedXDomain, [padding.left, padding.left + innerWidth])

  const yScale = makeLinearScale(resolvedYDomain, [padding.top + innerHeight, padding.top])

  const resolvedXTicks =
    xTicks ??
    Array.from(
      { length: resolvedXDomain[1] - resolvedXDomain[0] + 1 },
      (_, i) => resolvedXDomain[0] + i
    )

  const resolvedYTicks =
    yTicks ??
    Array.from(
      { length: resolvedYDomain[1] - resolvedYDomain[0] + 1 },
      (_, i) => resolvedYDomain[0] + i
    )

  // Linear regression for correlation line
  const n = data.length
  const sumX = data.reduce((acc, d) => acc + d.x, 0)
  const sumY = data.reduce((acc, d) => acc + d.y, 0)
  const sumXY = data.reduce((acc, d) => acc + d.x * d.y, 0)
  const sumX2 = data.reduce((acc, d) => acc + d.x * d.x, 0)
  const regressionSlope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) : 0
  const regressionIntercept = n > 1 ? (sumY - regressionSlope * sumX) / n : 0

  const x0 = padding.left
  const x1 = padding.left + innerWidth
  const y0 = padding.top + innerHeight
  const y1 = padding.top

  // Helper: convert SVG coordinate to % of total SVG dimensions for HTML overlay
  const pctX = (svgX: number) => `${(svgX / width) * 100}%`
  const pctY = (svgY: number) => `${(svgY / height) * 100}%`

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${width} / ${height}`,
        fontFamily,
      }}
    >
      {/* SVG layer: all graphical shapes, no text */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={title ?? 'Scatter plot'}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={width} height={height} fill={background} />

        {highlightBand && (
          <rect
            x={x0}
            y={yScale(highlightBand.y1)}
            width={innerWidth}
            height={Math.abs(yScale(highlightBand.y0) - yScale(highlightBand.y1))}
            fill={highlightBand.fill ?? 'rgba(228,36,206,0.06)'}
          />
        )}

        {predictionAreas.map((area, i) => {
          if (area.points && area.points.length >= 3) {
            const pts = area.points.map((p) => `${xScale(p.x)},${yScale(p.y)}`).join(' ')
            return (
              <polygon
                key={`prediction-area-${i}`}
                points={pts}
                fill={area.fill ?? 'rgba(252,233,247,0.3)'}
                stroke={area.stroke ?? 'rgb(233,85,212)'}
                strokeWidth={area.strokeWidth ?? 1.5}
              />
            )
          }
          const px0 = xScale(area.x0!)
          const px1 = xScale(area.x1!)
          const py0 = yScale(area.y0!)
          const py1 = yScale(area.y1!)
          const rectX = Math.min(px0, px1)
          const rectY = Math.min(py0, py1)
          const rectW = Math.abs(px1 - px0)
          const rectH = Math.abs(py1 - py0)
          return (
            <rect
              key={`prediction-area-${i}`}
              x={rectX}
              y={rectY}
              width={rectW}
              height={rectH}
              fill={area.fill ?? 'rgba(252,233,247,0.3)'}
              stroke={area.stroke ?? 'rgb(233,85,212)'}
              strokeWidth={area.strokeWidth ?? 1.5}
            />
          )
        })}

        <rect
          x={x0}
          y={isLineMode ? y0 - 14 : y1}
          width={x1 - x0}
          height={isLineMode ? 28 : y0 - y1}
          fill="#E424CE"
          opacity="0.04"
        />

        {!isLineMode &&
          resolvedXTicks.map((tick) => {
            const x = xScale(tick)
            return (
              <line
                key={`x-grid-${tick}`}
                x1={x}
                x2={x}
                y1={y0}
                y2={y1}
                stroke={pointStroke}
                opacity={0.15}
                strokeWidth={0.7}
              />
            )
          })}

        {!isLineMode &&
          resolvedYTicks.map((tick) => {
            const y = yScale(tick)
            return (
              <line
                key={`y-grid-${tick}`}
                x1={x0}
                x2={x1}
                y1={y}
                y2={y}
                stroke={pointStroke}
                opacity={0.15}
                strokeWidth={0.7}
              />
            )
          })}

        {!isLineMode &&
          resolvedYTicks.map((tick) => {
            const y = yScale(tick)
            const first = tick === resolvedYTicks[0]
            const last = tick === resolvedYTicks[resolvedYTicks.length - 1]
            const middle = tick === resolvedYTicks[(resolvedYTicks.length - 1) / 2]
            const highlighted = first || middle || last
            return (
              <line
                key={`y-tick-mark-${tick}`}
                x1={last || first ? x0 + 10 : x0}
                x2={highlighted ? x0 - 14 : x0 - 8}
                y1={y}
                y2={y}
                stroke={axisColor}
                strokeWidth={highlighted ? 1.5 : 0.7}
              />
            )
          })}

        {resolvedXTicks.map((tick) => {
          const x = xScale(tick)
          const first = tick === resolvedXTicks[0]
          const last = tick === resolvedXTicks[resolvedXTicks.length - 1]
          const middle = tick === resolvedXTicks[(resolvedXTicks.length - 1) / 2]
          const highlighted = first || middle || last
          return (
            <line
              key={`x-tick-mark-${tick}`}
              x1={x}
              x2={x}
              y1={last || first ? y0 - 10 : y0}
              y2={highlighted ? y0 + 14 : y0 + 8}
              stroke={axisColor}
              strokeWidth={highlighted ? 1.5 : 0.7}
            />
          )
        })}

        <line x1={x0} x2={x1} y1={y0} y2={y0} stroke={axisColor} strokeWidth={1.5} />
        {!isLineMode && (
          <line x1={x0} x2={x0} y1={y0} y2={y1} stroke={axisColor} strokeWidth={1.5} />
        )}

        {showCorrelationLine && n > 1 && (
          <line
            x1={xScale(resolvedXDomain[0])}
            y1={yScale(regressionSlope * resolvedXDomain[0] + regressionIntercept)}
            x2={xScale(resolvedXDomain[1])}
            y2={yScale(regressionSlope * resolvedXDomain[1] + regressionIntercept)}
            stroke={correlationLineColor}
            strokeWidth={correlationLineWidth}
            strokeDasharray="6 4"
            opacity={0.3}
          />
        )}

        {data.map((d, i) => (
          <circle
            key={`point-${i}`}
            cx={xScale(d.x)}
            cy={yScale(d.y)}
            r={d.r ?? pointRadius}
            fill={d.fill ?? pointFill}
            stroke={d.color ?? pointStroke}
            strokeWidth={2}
          />
        ))}
      </svg>

      {/* HTML text overlay — fixed font sizes, not affected by SVG scaling */}

      {/* Title */}
      {title && (
        <div
          style={{
            position: 'absolute',
            left: pctX(padding.left),
            top: pctY(padding.top / 2 - 10),
            transform: 'translateY(-50%)',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#bb1eae',
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
            left: pctX(padding.left),
            top: pctY(padding.top * 0.75),
            transform: 'translateY(-50%)',
            fontSize: '0.75rem',
            color: labelColor,
          }}
        >
          {subtitle}
        </div>
      )}

      {/* X tick labels */}
      {showTickLabels &&
        resolvedXTicks.map((tick) => (
          <div
            key={`x-tick-label-${tick}`}
            style={{
              position: 'absolute',
              left: pctX(xScale(tick)),
              top: pctY(y0 + 10),
              transform: 'translateX(-50%)',
              fontSize: '0.7rem',
              color: labelColor,
            }}
          >
            {tick}
          </div>
        ))}

      {/* Y tick labels */}
      {!isLineMode &&
        showTickLabels &&
        resolvedYTicks.map((tick) => (
          <div
            key={`y-tick-label-${tick}`}
            style={{
              position: 'absolute',
              right: `calc(100% - ${pctX(x0 - 20)})`,
              top: pctY(yScale(tick)),
              transform: 'translateY(-50%)',
              fontSize: '0.7rem',
              color: labelColor,
              textAlign: 'right',
            }}
          >
            {tick}
          </div>
        ))}

      {/* X axis label */}
      <div
        style={{
          position: 'absolute',
          left: pctX((x0 + x1) / 2),
          bottom: pctY(height - (height - 14)),
          transform: 'translateX(-50%)',
          fontSize: '0.85rem',
          fontWeight: 500,
          color: labelColor,
        }}
      >
        {xLabel}
      </div>

      {/* Y axis label (rotated) */}
      {!isLineMode && (
        <div
          style={{
            position: 'absolute',
            left: pctX(14),
            top: pctY((y0 + y1) / 2),
            transform: 'translateX(-50%) translateY(-50%) rotate(-90deg)',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: labelColor,
            whiteSpace: 'nowrap',
          }}
        >
          {yLabel}
        </div>
      )}

      {/* Prediction area labels */}
      {predictionAreas.map((area, i) => {
        let cx: number, cy: number
        if (area.points && area.points.length >= 3) {
          cx = area.points.reduce((s, p) => s + xScale(p.x), 0) / area.points.length
          cy = area.points.reduce((s, p) => s + yScale(p.y), 0) / area.points.length
        } else {
          const px0 = xScale(area.x0!)
          const px1 = xScale(area.x1!)
          const py0 = yScale(area.y0!)
          const py1 = yScale(area.y1!)
          cx = Math.min(px0, px1) + Math.abs(px1 - px0) / 2
          cy = Math.min(py0, py1) + Math.abs(py1 - py0) / 2
        }
        return area.label ? (
          <div
            key={`prediction-label-${i}`}
            style={{
              position: 'absolute',
              left: pctX(cx),
              top: pctY(cy),
              transform: 'translateX(-50%) translateY(-50%)',
              pointerEvents: 'none',
              fontSize: '0.7rem',
              fontWeight: 600,
              color: area.labelColor ?? '#BB1EAE',
              whiteSpace: 'nowrap',
            }}
          >
            {area.label}
          </div>
        ) : null
      })}

      {/* Annotation labels */}
      {annotations.map((a, i) => (
        <div
          key={`annotation-${i}`}
          style={{
            position: 'absolute',
            left: pctX(xScale(a.x) + (a.dx ?? 0)),
            top: pctY(yScale(a.y) + (a.dy ?? -14)),
            transform:
              (a.textAnchor === 'middle' || !a.textAnchor
                ? 'translateX(-50%)'
                : a.textAnchor === 'end'
                  ? 'translateX(-100%)'
                  : '') + ' translateY(-100%)',
            fontSize: '0.75rem',
            fontWeight: a.fontWeight ?? 700,
            color: a.color ?? '#BB1EAE',
            whiteSpace: 'nowrap',
          }}
        >
          {a.text}
        </div>
      ))}

      {/* Data point labels */}
      {showDataLabels &&
        data.map((d, i) =>
          d.label ? (
            <div
              key={`point-label-${i}`}
              style={{
                position: 'absolute',
                left: pctX(xScale(d.x)),
                top: pctY(yScale(d.y) - (d.r ?? pointRadius) - (isLineMode ? 10 : 14)),
                transform: 'translateX(-50%) translateY(-100%)',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#bb1eae',
                whiteSpace: 'nowrap',
              }}
            >
              {d.label}
            </div>
          ) : null
        )}
    </div>
  )
}

type SvgScatterPlotPairProps = {
  left: SvgScatterPlotProps
  right: SvgScatterPlotProps
  gap?: number
}

export function SvgScatterPlotPair({ left, right, gap = 24 }: SvgScatterPlotPairProps) {
  const leftProps = { padding: pairPadding, showTickLabels: false, showDataLabels: false, ...left }
  const rightProps = {
    padding: pairPadding,
    showTickLabels: false,
    showDataLabels: false,
    ...right,
  }
  return (
    <div
      className="my-8 grid w-full"
      style={{
        gridTemplateColumns: '1fr 1fr',
        gap: `${gap}px`,
      }}
    >
      <SvgScatterPlot {...leftProps} />
      <SvgScatterPlot {...rightProps} />
    </div>
  )
}
