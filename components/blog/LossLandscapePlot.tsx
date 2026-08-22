'use client'

import React, { useEffect, useId, useState } from 'react'

export type LossLandscapePlotProps = {
  title?: string
  data: { x: number; y: number }[]
  xDomain?: [number, number]
  yDomain?: [number, number]
  xTicks?: number[]
  yTicks?: number[]
  xLabel?: string
  yLabel?: string
  width?: number
  height?: number
  padding?: { top: number; right: number; bottom: number; left: number }
  background?: string
  axisColor?: string
  labelColor?: string
  lineColor?: string
  lineWidth?: number
  fontFamily?: string
  startPoint?: { x: number; y: number }
  endPoint?: { x: number; y: number }
}

const defaultPadding = { top: 80, right: 300, bottom: 90, left: 70 }

function makeLinearScale(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain
  const [r0, r1] = range
  const m = d1 === d0 ? 0 : (r1 - r0) / (d1 - d0)
  return (value: number) => r0 + (value - d0) * m
}

export function LossLandscapePlot({
  title,
  data,
  xDomain,
  yDomain,
  xTicks,
  yTicks,
  xLabel = 'Normalised Direction α',
  yLabel = 'Loss',
  width: widthProp,
  height: heightProp,
  padding: paddingProp,
  background = 'transparent',
  axisColor = '#241169',
  labelColor = '#241169',
  lineColor = '#E424CE',
  lineWidth = 1,
  fontFamily = 'Bw Quinta Pro, system-ui, sans-serif',
  startPoint,
  endPoint,
}: LossLandscapePlotProps) {
  const uid = useId().replace(/:/g, '')
  const gradientId = `traj-grad-${uid}`
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const width = widthProp ?? 1080
  const height = heightProp ?? 720
  const basePadding = paddingProp ?? defaultPadding
  const padding = {
    ...basePadding,
    ...(title ? { top: Math.max(basePadding.top, 90) } : {}),
    ...(isMobile ? { right: 20, left: 52 } : {}),
  }

  const innerWidth = width - padding.left - padding.right
  const innerHeight = height - padding.top - padding.bottom

  const xs = data.map((d) => d.x)
  const ys = data.map((d) => d.y)

  const resolvedXDomain: [number, number] = xDomain ?? [Math.min(...xs), Math.max(...xs)]
  const resolvedYDomain: [number, number] = yDomain ?? [0, Math.max(...ys)]

  const xScale = makeLinearScale(resolvedXDomain, [padding.left, padding.left + innerWidth])
  const yScale = makeLinearScale(resolvedYDomain, [padding.top + innerHeight, padding.top])

  const x0 = padding.left
  const x1 = padding.left + innerWidth
  const y0 = padding.top + innerHeight
  const y1 = padding.top

  const resolvedXTicks =
    xTicks ??
    (() => {
      const step = (resolvedXDomain[1] - resolvedXDomain[0]) / 4
      return Array.from({ length: 5 }, (_, i) => resolvedXDomain[0] + i * step)
    })()

  const resolvedYTicks =
    yTicks ??
    (() => {
      const maxY = resolvedYDomain[1]
      const step = maxY / 4
      return Array.from({ length: 5 }, (_, i) => parseFloat((i * step).toFixed(2)))
    })()

  // Build smooth SVG path using cubic bezier curves (catmull-rom)
  const scaledPoints = data.map((d) => ({ x: xScale(d.x), y: yScale(d.y) }))
  const smoothPath = (() => {
    if (scaledPoints.length < 2) return ''
    const tension = 0.3
    let d = `M ${scaledPoints[0].x},${scaledPoints[0].y}`
    for (let i = 0; i < scaledPoints.length - 1; i++) {
      const p0 = scaledPoints[i > 0 ? i - 1 : i]
      const p1 = scaledPoints[i]
      const p2 = scaledPoints[i + 1]
      const p3 = scaledPoints[i + 2] ?? p2
      const cp1x = p1.x + (p2.x - p0.x) * tension
      const cp1y = p1.y + (p2.y - p0.y) * tension
      const cp2x = p2.x - (p3.x - p1.x) * tension
      const cp2y = p2.y - (p3.y - p1.y) * tension
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
    }
    return d
  })()

  const pctX = (svgX: number) => `${(svgX / width) * 100}%`
  const pctY = (svgY: number) => `${(svgY / height) * 100}%`

  const formatTick = (v: number) => {
    if (Number.isInteger(v)) return String(v)
    return parseFloat(v.toFixed(2)).toString()
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${width} / ${height}`,
        fontFamily,
      }}
    >
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={title ?? 'Loss landscape plot'}
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={width} height={height} fill={background} />

        {/* Plot background */}
        <rect x={x0} y={y1} width={x1 - x0} height={y0 - y1} fill="#E424CE" opacity="0.04" />

        {/* Vertical grid lines */}
        {resolvedXTicks.map((tick) => {
          const x = xScale(tick)
          return (
            <line
              key={`xg-${tick}`}
              x1={x}
              x2={x}
              y1={y0}
              y2={y1}
              stroke="#E424CE"
              opacity={0.15}
              strokeWidth={0.7}
            />
          )
        })}

        {/* Horizontal grid lines */}
        {resolvedYTicks.map((tick) => {
          const y = yScale(tick)
          return (
            <line
              key={`yg-${tick}`}
              x1={x0}
              x2={x1}
              y1={y}
              y2={y}
              stroke="#E424CE"
              opacity={0.15}
              strokeWidth={0.7}
            />
          )
        })}

        {/* Y tick marks */}
        {resolvedYTicks.map((tick) => {
          const y = yScale(tick)
          const first = tick === resolvedYTicks[0]
          const last = tick === resolvedYTicks[resolvedYTicks.length - 1]
          const middle = tick === resolvedYTicks[Math.floor((resolvedYTicks.length - 1) / 2)]
          const highlighted = first || middle || last
          return (
            <line
              key={`yt-${tick}`}
              x1={last || first ? x0 + 10 : x0}
              x2={highlighted ? x0 - 14 : x0 - 8}
              y1={y}
              y2={y}
              stroke={axisColor}
              strokeWidth={highlighted ? 1.5 : 0.7}
            />
          )
        })}

        {/* X tick marks */}
        {resolvedXTicks.map((tick) => {
          const x = xScale(tick)
          const first = tick === resolvedXTicks[0]
          const last = tick === resolvedXTicks[resolvedXTicks.length - 1]
          const middle = tick === resolvedXTicks[Math.floor((resolvedXTicks.length - 1) / 2)]
          const highlighted = first || middle || last
          return (
            <line
              key={`xt-${tick}`}
              x1={x}
              x2={x}
              y1={last || first ? y0 - 10 : y0}
              y2={highlighted ? y0 + 14 : y0 + 8}
              stroke={axisColor}
              strokeWidth={highlighted ? 1.5 : 0.7}
            />
          )
        })}

        {/* Axes */}
        <line x1={x0} x2={x1} y1={y0} y2={y0} stroke={axisColor} strokeWidth={1.5} />
        <line x1={x0} x2={x0} y1={y0} y2={y1} stroke={axisColor} strokeWidth={1.5} />

        {/* Gradient definition for trajectory line */}
        {startPoint && endPoint && (
          <defs>
            <linearGradient
              id={gradientId}
              x1={xScale(startPoint.x)}
              y1={yScale(startPoint.y)}
              x2={xScale(endPoint.x)}
              y2={yScale(endPoint.y)}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#F7C2EA" />
              <stop offset="100%" stopColor="#EE62DB" />
            </linearGradient>
          </defs>
        )}

        {/* Loss landscape line */}
        <path
          d={smoothPath}
          fill="none"
          stroke={lineColor}
          strokeWidth={lineWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Trajectory: gradient line between startPoint and endPoint */}
        {startPoint && endPoint && (
          <line
            x1={xScale(startPoint.x)}
            y1={yScale(startPoint.y)}
            x2={xScale(endPoint.x)}
            y2={yScale(endPoint.y)}
            stroke={`url(#${gradientId})`}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="6 4"
          />
        )}

        {/* Start point: smaller, semi-transparent green circle */}
        {startPoint && (
          <circle
            cx={xScale(startPoint.x)}
            cy={yScale(startPoint.y)}
            r={5}
            fill="#FCE9F7"
            stroke="#E424CE"
            strokeWidth={2}
            opacity={0.6}
          />
        )}

        {/* End point: pink circle matching Plot.tsx point style */}
        {endPoint && (
          <circle
            cx={xScale(endPoint.x)}
            cy={yScale(endPoint.y)}
            r={7}
            fill="#FCE9F7"
            stroke="#E424CE"
            strokeWidth={2}
          />
        )}
      </svg>

      {/* HTML text overlay */}

      {/* Title */}
      {title && (
        <div
          style={{
            position: 'absolute',
            left: pctX(padding.left),
            top: pctY(padding.top / 2 - 10),
            transform: 'translateY(-50%)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#bb1eae',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
      )}

      {/* X tick labels */}
      {resolvedXTicks.map((tick) => (
        <div
          key={`xl-${tick}`}
          className="hidden sm:block"
          style={{
            position: 'absolute',
            left: pctX(xScale(tick)),
            top: pctY(y0 + 18),
            transform: 'translateX(-50%)',
            fontSize: '0.7rem',
            color: labelColor,
          }}
        >
          {formatTick(tick)}
        </div>
      ))}

      {/* Y tick labels */}
      {resolvedYTicks.map((tick) => (
        <div
          key={`yl-${tick}`}
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
          {formatTick(tick)}
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
          whiteSpace: 'nowrap',
        }}
      >
        {xLabel}
      </div>

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
    </div>
  )
}
