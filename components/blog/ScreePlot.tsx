'use client'

import React, { useEffect, useState } from 'react'

export type ScreePlotDatum = {
  label: string
  value: number
}

export type SvgScreePlotProps = {
  data: ScreePlotDatum[]
  title?: string
  subtitle?: string
  yLabel?: string
  width?: number
  height?: number
  barColor?: string
  axisColor?: string
  labelColor?: string
  fontFamily?: string
  showPercentage?: boolean
}

const defaultPadding = { top: 80, right: 300, bottom: 90, left: 70 }

export function SvgScreePlot({
  data,
  title,
  subtitle,
  yLabel = 'Eigenvalue (Variance)',
  width: widthProp,
  height: heightProp,
  barColor = '#E424CE',
  axisColor = '#241169',
  labelColor = '#241169',
  fontFamily = 'Bw Quinta Pro, system-ui, sans-serif',
  showPercentage = true,
}: SvgScreePlotProps) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const width = widthProp ?? 1080
  const height = heightProp ?? 720
  const basePadding = defaultPadding
  const padding = {
    ...(title ? { ...basePadding, top: Math.max(basePadding.top, 120) } : basePadding),
    ...(isMobile ? { right: 70 } : {}),
  }

  const innerWidth = width - padding.left - padding.right
  const innerHeight = height - padding.top - padding.bottom

  const total = data.reduce((s, d) => s + d.value, 0)
  const maxValue = Math.max(...data.map((d) => d.value))
  const yMax = Math.ceil(maxValue * 1.15)

  const barCount = data.length
  const barWidth = (innerWidth / barCount) * 0.55
  const barGap = innerWidth / barCount

  const yScale = (v: number) => padding.top + innerHeight - (v / yMax) * innerHeight
  const xBarStart = (i: number) => padding.left + i * barGap + barGap * 0.225

  const x0 = padding.left
  const x1 = padding.left + innerWidth
  const y0 = padding.top + innerHeight
  const y1 = padding.top

  // Helper: convert SVG coordinate to % of total SVG dimensions for HTML overlay
  const pctX = (svgX: number) => `${(svgX / width) * 100}%`
  const pctY = (svgY: number) => `${(svgY / height) * 100}%`

  // Y ticks: 0, 25%, 50%, 75%, 100% of yMax
  const yTicks = [0, 0.25, 0.5, 0.75, 1.0].map((f) => Math.round(f * yMax * 10) / 10)

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
        aria-label={title ?? 'Scree plot'}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="scree-hatch"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="8" stroke={barColor} strokeWidth="1.2" opacity="0.2" />
          </pattern>
        </defs>

        {/* Background tint */}
        <rect x={x0} y={y1} width={x1 - x0} height={y0 - y1} fill="#E424CE" opacity="0.04" />

        {/* Y grid lines */}
        {yTicks.map((tick) => (
          <line
            key={`y-grid-${tick}`}
            x1={x0}
            x2={x1}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke={barColor}
            opacity={0.15}
            strokeWidth={0.7}
          />
        ))}

        {/* Bars */}
        {data.map((d, i) => {
          const bx = xBarStart(i)
          const by = yScale(d.value)
          const bh = y0 - by
          return (
            <React.Fragment key={`bar-${i}`}>
              <rect
                x={bx}
                y={by}
                width={barWidth}
                height={bh}
                stroke={barColor}
                strokeWidth={2}
                fill="#FCEFEB"
              />
              <rect
                x={bx}
                y={by}
                width={barWidth}
                height={bh}
                fill="url(#scree-hatch)"
                stroke="none"
              />
            </React.Fragment>
          )
        })}

        {/* Axes */}
        <line x1={x0} x2={x1} y1={y0} y2={y0} stroke={axisColor} strokeWidth={1.5} />
        <line x1={x0} x2={x0} y1={y0} y2={y1} stroke={axisColor} strokeWidth={1.5} />

        {/* Y tick marks — highlighted for first, middle, last */}
        {yTicks.map((tick) => {
          const first = tick === yTicks[0]
          const last = tick === yTicks[yTicks.length - 1]
          const middle = tick === yTicks[Math.floor((yTicks.length - 1) / 2)]
          const highlighted = first || middle || last
          return (
            <line
              key={`y-tick-${tick}`}
              x1={last || first ? x0 + 10 : x0}
              x2={highlighted ? x0 - 14 : x0 - 8}
              y1={yScale(tick)}
              y2={yScale(tick)}
              stroke={axisColor}
              strokeWidth={highlighted ? 1.5 : 0.7}
            />
          )
        })}

        {/* X tick marks — one per bar */}
        {data.map((d, i) => {
          const cx = xBarStart(i) + barWidth / 2
          const first = i === 0
          const last = i === data.length - 1
          const middle = i === Math.floor((data.length - 1) / 2)
          const highlighted = first || middle || last
          return (
            <line
              key={`x-tick-${i}`}
              x1={cx}
              x2={cx}
              y1={last || first ? y0 - 10 : y0}
              y2={highlighted ? y0 + 14 : y0 + 8}
              stroke={axisColor}
              strokeWidth={highlighted ? 1.5 : 0.7}
            />
          )
        })}
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

      {/* Y tick labels */}
      {yTicks.map((tick) => (
        <div
          key={`y-tick-label-${tick}`}
          className="hidden sm:block"
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

      {/* Y axis label (rotated) */}
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

      {/* Bar labels (component name) + percentage */}
      {data.map((d, i) => {
        const bx = xBarStart(i)
        const centerX = bx + barWidth / 2
        const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : '0'
        const by = yScale(d.value)
        return (
          <React.Fragment key={`bar-label-${i}`}>
            {/* Label below x axis */}
            <div
              style={{
                position: 'absolute',
                left: pctX(centerX),
                top: pctY(y0 + 18),
                transform: 'translateX(-50%)',
                fontSize: '0.7rem',
                color: labelColor,
                whiteSpace: 'nowrap',
              }}
            >
              {d.label}
            </div>
            {/* Percentage above bar */}
            {showPercentage && (
              <div
                style={{
                  position: 'absolute',
                  left: pctX(centerX),
                  top: pctY(by - (d.r ?? 5) - 14),
                  transform: 'translateX(-50%) translateY(-100%)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#bb1eae',
                  whiteSpace: 'nowrap',
                }}
              >
                {pct}%
              </div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
