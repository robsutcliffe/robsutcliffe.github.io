import React from 'react'

type Datum3D = {
  sweet: number
  salty: number
  healthy: number
  label?: string
}

export type SvgScatterPlot3DProps = {
  data: Datum3D[]
  width?: number
  height?: number
  domain?: [number, number]
  sweetLabel?: string
  saltyLabel?: string
  healthyLabel?: string
  showCorrelationPlane?: boolean
  correlationPlaneColor?: string
  background?: string
  axisColor?: string
  labelColor?: string
  pointStroke?: string
  pointFill?: string
  pointRadius?: number
  fontFamily?: string
  showDataLabels?: boolean
}

// Isometric-style oblique projection for a 3D scatter plot.
// We use a right-handed coordinate system:
//   sweet  → x-axis (goes right and slightly down)
//   salty  → y-axis (goes left and slightly down, i.e. depth)
//   healthy→ z-axis (goes straight up)
//
// Projection matrix (oblique cabinet):
//   px = cx + sweet * xStep - salty * depthX
//   py = cy - healthy * zStep + salty * depthY

function makeProject(
  cx: number,
  cy: number,
  xStep: number,
  zStep: number,
  depthX: number,
  depthY: number,
  maxVal: number
) {
  return (sweet: number, salty: number, healthy: number) => {
    const px = cx + (sweet / maxVal) * xStep - (salty / maxVal) * depthX
    const py = cy - (healthy / maxVal) * zStep + (salty / maxVal) * depthY
    return { px, py }
  }
}

export function SvgScatterPlot3D({
  data,
  width: widthProp,
  height: heightProp,
  domain = [0, 10],
  sweetLabel = 'Sweet',
  saltyLabel = 'Salty',
  healthyLabel = 'Healthy',
  showCorrelationPlane = false,
  correlationPlaneColor = '#E424CE',
  background = 'transparent',
  axisColor = '#241169',
  labelColor = '#241169',
  pointStroke = '#E424CE',
  pointFill = '#FCE9F7',
  pointRadius = 4.7,
  fontFamily = 'Bw Quinta Pro, system-ui, sans-serif',
  showDataLabels = true,
}: SvgScatterPlot3DProps) {
  const width = widthProp ?? 900
  const height = heightProp ?? 700

  const maxVal = domain[1]

  // Projection parameters
  const cx = width * 0.26
  const cy = height * 0.68
  const xStep = width * 0.36 // sweet goes right
  const zStep = height * 0.52 // healthy goes up
  const depthX = width * 0.22 // salty goes left
  const depthY = height * 0.16 // salty goes forward/down

  const project = makeProject(cx, cy, xStep, zStep, depthX, depthY, maxVal)

  const origin = project(0, 0, 0)
  const xEnd = project(maxVal, 0, 0)
  const yEnd = project(0, maxVal, 0)
  const zEnd = project(0, 0, maxVal)

  // Grid lines on the floor plane (sweet-salty)
  const ticks = [0, 2, 4, 6, 8, 10]

  // Correlation plane: sweet + salty + healthy = 10
  // The four corners of this plane within the [0,10]^3 cube:
  //   (10,0,0), (0,10,0), (0,0,10), but also the interior triangle
  // The plane intersects the cube as a triangle with vertices:
  //   (10,0,0), (0,10,0), (0,0,10)
  const planeVertices = [project(maxVal, 0, 0), project(0, maxVal, 0), project(0, 0, maxVal)]
  const planePts = planeVertices.map((v) => `${v.px},${v.py}`).join(' ')

  // Helper for SVG text positioning
  const pctX = (svgX: number) => `${(svgX / width) * 100}%`
  const pctY = (svgY: number) => `${(svgY / height) * 100}%`

  return (
    <div
      style={{
        position: 'relative',
        marginLeft: '30px',
        width: 'calc(100% - 20px)',
        aspectRatio: `${width} / ${height}`,
        fontFamily,
      }}
    >
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMinYMid meet"
        role="img"
        aria-label="3D Scatter plot"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width={width} height={height} fill={background} />

        {/* Subtle background fills for all three faces */}
        {/* Floor (sweet × salty, healthy=0) */}
        <polygon
          points={[
            project(0, 0, 0),
            project(maxVal, 0, 0),
            project(maxVal, maxVal, 0),
            project(0, maxVal, 0),
          ]
            .map((v) => `${v.px},${v.py}`)
            .join(' ')}
          fill="#E424CE"
          opacity={0.025}
        />
        {/* Back wall (sweet × healthy, salty=0) */}
        <polygon
          points={[
            project(0, 0, 0),
            project(maxVal, 0, 0),
            project(maxVal, 0, maxVal),
            project(0, 0, maxVal),
          ]
            .map((v) => `${v.px},${v.py}`)
            .join(' ')}
          fill="#E424CE"
          opacity={0.025}
        />
        {/* Side wall (salty × healthy, sweet=0) */}
        <polygon
          points={[
            project(0, 0, 0),
            project(0, maxVal, 0),
            project(0, maxVal, maxVal),
            project(0, 0, maxVal),
          ]
            .map((v) => `${v.px},${v.py}`)
            .join(' ')}
          fill="#E424CE"
          opacity={0.025}
        />

        {/* Floor grid (sweet × salty plane at healthy=0) */}
        {ticks.map((t) => {
          const a = project(t, 0, 0)
          const b = project(t, maxVal, 0)
          return (
            <line
              key={`floor-x-${t}`}
              x1={a.px}
              y1={a.py}
              x2={b.px}
              y2={b.py}
              stroke={pointStroke}
              opacity={0.12}
              strokeWidth={0.7}
            />
          )
        })}
        {ticks.map((t) => {
          const a = project(0, t, 0)
          const b = project(maxVal, t, 0)
          return (
            <line
              key={`floor-y-${t}`}
              x1={a.px}
              y1={a.py}
              x2={b.px}
              y2={b.py}
              stroke={pointStroke}
              opacity={0.12}
              strokeWidth={0.7}
            />
          )
        })}

        {/* Back wall grid (sweet × healthy, salty=0) */}
        {ticks.map((t) => {
          const a = project(t, 0, 0)
          const b = project(t, 0, maxVal)
          return (
            <line
              key={`back-x-${t}`}
              x1={a.px}
              y1={a.py}
              x2={b.px}
              y2={b.py}
              stroke={pointStroke}
              opacity={0.12}
              strokeWidth={0.7}
            />
          )
        })}
        {ticks.map((t) => {
          const a = project(0, 0, t)
          const b = project(maxVal, 0, t)
          return (
            <line
              key={`back-z-${t}`}
              x1={a.px}
              y1={a.py}
              x2={b.px}
              y2={b.py}
              stroke={pointStroke}
              opacity={0.12}
              strokeWidth={0.7}
            />
          )
        })}

        {/* Side wall grid (salty × healthy, sweet=0) */}
        {ticks.map((t) => {
          const a = project(0, t, 0)
          const b = project(0, t, maxVal)
          return (
            <line
              key={`side-y-${t}`}
              x1={a.px}
              y1={a.py}
              x2={b.px}
              y2={b.py}
              stroke={pointStroke}
              opacity={0.12}
              strokeWidth={0.7}
            />
          )
        })}
        {ticks.map((t) => {
          const a = project(0, 0, t)
          const b = project(0, maxVal, t)
          return (
            <line
              key={`side-z-${t}`}
              x1={a.px}
              y1={a.py}
              x2={b.px}
              y2={b.py}
              stroke={pointStroke}
              opacity={0.12}
              strokeWidth={0.7}
            />
          )
        })}

        {/* Correlation plane: sweet + salty + healthy = 10 */}
        {showCorrelationPlane && (
          <>
            <polygon
              points={planePts}
              fill={correlationPlaneColor}
              fillOpacity={0.04}
              stroke={correlationPlaneColor}
              strokeWidth={0.2}
              strokeDasharray="7 4"
              strokeOpacity={0.02}
            />
            {/* Dashed edges of the triangle */}
            {[
              [planeVertices[0], planeVertices[1]],
              [planeVertices[1], planeVertices[2]],
              [planeVertices[2], planeVertices[0]],
            ].map(([a, b], i) => (
              <line
                key={`plane-edge-${i}`}
                x1={a.px}
                y1={a.py}
                x2={b.px}
                y2={b.py}
                stroke={correlationPlaneColor}
                strokeWidth={1.2}
                strokeDasharray="7 4"
                opacity={0.4}
              />
            ))}
          </>
        )}

        {/* Axes */}
        {/* Sweet (x) */}
        <line
          x1={origin.px}
          y1={origin.py}
          x2={xEnd.px}
          y2={xEnd.py}
          stroke={axisColor}
          strokeWidth={1.5}
        />
        {/* Salty (y / depth) */}
        <line
          x1={origin.px}
          y1={origin.py}
          x2={yEnd.px}
          y2={yEnd.py}
          stroke={axisColor}
          strokeWidth={1.5}
        />
        {/* Healthy (z / vertical) */}
        <line
          x1={origin.px}
          y1={origin.py}
          x2={zEnd.px}
          y2={zEnd.py}
          stroke={axisColor}
          strokeWidth={1.5}
        />

        {/* Axis tick marks */}
        {ticks.map((t) => {
          if (t === 0) return null
          const pos = project(t, 0, 0)
          return (
            <line
              key={`x-tick-${t}`}
              x1={pos.px}
              y1={pos.py - 5}
              x2={pos.px}
              y2={pos.py + 5}
              stroke={axisColor}
              strokeWidth={[0, 5, 10].includes(t) ? 1.5 : 0.7}
            />
          )
        })}
        {ticks.map((t) => {
          if (t === 0) return null
          const pos = project(0, t, 0)
          return (
            <line
              key={`y-tick-${t}`}
              x1={pos.px - 5}
              y1={pos.py}
              x2={pos.px + 5}
              y2={pos.py}
              stroke={axisColor}
              strokeWidth={[0, 5, 10].includes(t) ? 1.5 : 0.7}
            />
          )
        })}
        {ticks.map((t) => {
          if (t === 0) return null
          const pos = project(0, 0, t)
          return (
            <line
              key={`z-tick-${t}`}
              x1={pos.px - 5}
              y1={pos.py}
              x2={pos.px + 5}
              y2={pos.py}
              stroke={axisColor}
              strokeWidth={[0, 5, 10].includes(t) ? 1.5 : 0.7}
            />
          )
        })}

        {/* Data points */}
        {data.map((d, i) => {
          const { px, py } = project(d.sweet, d.salty, d.healthy)
          // Drop lines to all three walls
          const floor = project(d.sweet, d.salty, 0) // down to floor
          const backWall = project(d.sweet, 0, d.healthy) // to back wall (salty=0)
          const sideWall = project(0, d.salty, d.healthy) // to side wall (sweet=0)
          return (
            <g key={`point-${i}`}>
              {/* Drop to floor */}
              <line
                x1={px}
                y1={py}
                x2={floor.px}
                y2={floor.py}
                stroke={pointStroke}
                strokeWidth={1}
                opacity={0.25}
              />
              {/* Project to back wall */}
              <line
                x1={px}
                y1={py}
                x2={backWall.px}
                y2={backWall.py}
                stroke={pointStroke}
                strokeWidth={1}
                opacity={0.25}
              />
              {/* Project to side wall */}
              <line
                x1={px}
                y1={py}
                x2={sideWall.px}
                y2={sideWall.py}
                stroke={pointStroke}
                strokeWidth={1}
                opacity={0.25}
              />
              {/* Shadow dots on each wall */}
              <circle cx={floor.px} cy={floor.py} r={3} fill={pointStroke} opacity={0.15} />
              <circle cx={backWall.px} cy={backWall.py} r={3} fill={pointStroke} opacity={0.15} />
              <circle cx={sideWall.px} cy={sideWall.py} r={3} fill={pointStroke} opacity={0.15} />
              <circle
                cx={px}
                cy={py}
                r={pointRadius}
                fill={pointFill}
                stroke={pointStroke}
                strokeWidth={1.5}
              />
            </g>
          )
        })}
      </svg>

      {/* HTML text overlay */}

      {/* Axis labels */}
      {/* Sweet label: to the right of xEnd */}
      <div
        style={{
          position: 'absolute',
          left: pctX(xEnd.px + 10),
          top: pctY(xEnd.py),
          transform: 'translateY(-50%)',
          fontSize: '0.85rem',
          fontWeight: 500,
          color: labelColor,
          whiteSpace: 'nowrap',
        }}
      >
        {sweetLabel}
      </div>
      {/* Salty label: below/beside yEnd */}
      <div
        style={{
          position: 'absolute',
          left: pctX(yEnd.px - 60),
          top: pctY(yEnd.py + 12),
          fontSize: '0.85rem',
          fontWeight: 500,
          color: labelColor,
          whiteSpace: 'nowrap',
        }}
      >
        {saltyLabel}
      </div>
      {/* Healthy label: centered above zEnd */}
      <div
        style={{
          position: 'absolute',
          left: pctX(zEnd.px),
          top: pctY(zEnd.py - 18),
          transform: 'translateX(-50%) translateY(-100%)',
          fontSize: '0.85rem',
          fontWeight: 500,
          color: labelColor,
          whiteSpace: 'nowrap',
        }}
      >
        {healthyLabel}
      </div>

      {/* Data point labels */}
      {showDataLabels &&
        data.map((d, i) => {
          if (!d.label) return null
          const { px, py } = project(d.sweet, d.salty, d.healthy)
          return (
            <div
              key={`point-label-${i}`}
              style={{
                position: 'absolute',
                left: pctX(px),
                top: pctY(py - pointRadius),
                transform: 'translateX(-50%) translateY(-100%)',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#bb1eae',
                whiteSpace: 'nowrap',
              }}
            >
              {d.label}
            </div>
          )
        })}
    </div>
  )
}
