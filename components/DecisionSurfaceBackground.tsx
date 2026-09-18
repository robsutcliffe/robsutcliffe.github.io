'use client'

import React, { useEffect, useRef } from 'react'

// Cluster colour palette
const CLUSTER_COLORS: [number, number, number][] = [
  [0x40 / 255, 0x17 / 255, 0x5f / 255], // 40175F
  [0x3a / 255, 0x2b / 255, 0x66 / 255], // 3A2B66
  [0x24 / 255, 0x2c / 255, 0x7b / 255], // 242C7B
  [0x27 / 255, 0x13 / 255, 0x74 / 255], // 271374
  [0x29 / 255, 0x14 / 255, 0x7e / 255], // 29147E
  [0x2a / 255, 0x15 / 255, 0x83 / 255], // 2A1583
  [0x2d / 255, 0x18 / 255, 0x91 / 255], // 2D1891
]

const POINTS_PER_CELL = 0.18 // target density — points per grid cell; scales count with screen area
const NUM_CLUSTERS = 10
const CLUSTER_SPREAD_CELLS = 3 // std-dev of Gaussian scatter in grid cells
const CELL_SIZE_PX = 20 // pixels per grid cell — grid dimensions scale with browser size
const LERP_SPEED = 0.04 // fraction of gap closed per frame toward target grid cell
const HOP_CHANCE = 0.005 // base probability per point per frame to hop when mouse moves

// Contour settings
const KDE_BANDWIDTH = 0.12 // Gaussian kernel bandwidth (fraction of canvas)
const KDE_INTERVAL = 3 // recompute KDE every N frames
const CONTOUR_THRESHOLD = 0.15 // fraction of maxVal at which the single contour ring is drawn
const CONTOUR_MOUSE_WARP = 1.5 // how much mouse position shifts the warp sample coordinates
const WARP_STRENGTH = 0.12 // domain-warp strength (fraction of canvas) — breaks circular symmetry
const WARP_SCALE = 5.0 // noise frequency for domain warp

const vertSrc = `
  attribute vec2  a_position;
  attribute vec3  a_color;
  attribute float a_alpha;

  uniform vec2 u_resolution;

  varying vec3  v_color;
  varying float v_alpha;

  void main() {
    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
    gl_Position  = vec4(clipSpace * vec2(1, -1), 0, 1);
    gl_PointSize = 9.0;
    v_color = a_color;
    v_alpha = a_alpha;
  }
`

const fragSrc = `
  precision mediump float;
  varying vec3  v_color;
  varying float v_alpha;

  void main() {
    vec2 pc = gl_PointCoord * 2.0 - 1.0;
    // X shape: keep pixels near either diagonal
    float d1 = abs(pc.x - pc.y);
    float d2 = abs(pc.x + pc.y);
    if (d1 > 0.2 && d2 > 0.2) discard;
    // Fade toward tips
    float dist = length(pc);
    if (dist > 1.0) discard;
    float glow = 1.0 - dist;
    vec3 col = mix(v_color, vec3(0.75, 0.65, 1.0), glow * 0.35);
    gl_FragColor = vec4(col, v_alpha);
  }
`

type Point = { col: number; row: number; x: number; y: number; cluster: number }

// Marching squares look-up table — 16 cases, each case lists line segment pairs [x0,y0,x1,y1] in unit cell coords
// (values at corners: 0=bottom-left,1=bottom-right,2=top-right,3=top-left)
function marchingSquares(
  field: Float32Array,
  cols: number,
  rows: number,
  threshold: number,
  scaleX: number,
  scaleY: number,
  ctx: CanvasRenderingContext2D
) {
  const cellW = scaleX / cols
  const cellH = scaleY / rows

  ctx.beginPath()
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const bl = field[r * cols + c]
      const br = field[r * cols + c + 1]
      const tr = field[(r + 1) * cols + c + 1]
      const tl = field[(r + 1) * cols + c]

      const idx =
        (bl >= threshold ? 1 : 0) |
        (br >= threshold ? 2 : 0) |
        (tr >= threshold ? 4 : 0) |
        (tl >= threshold ? 8 : 0)

      if (idx === 0 || idx === 15) continue

      // Interpolated edge crossings
      const x0 = c * cellW
      const y0 = r * cellH
      // bottom edge (bl→br)
      const eB = bl !== br ? (threshold - bl) / (br - bl) : 0.5
      // right edge (br→tr)
      const eR = br !== tr ? (threshold - br) / (tr - br) : 0.5
      // top edge (tl→tr)
      const eT = tl !== tr ? (threshold - tl) / (tr - tl) : 0.5
      // left edge (bl→tl)
      const eL = bl !== tl ? (threshold - bl) / (tl - bl) : 0.5

      const pB: [number, number] = [x0 + eB * cellW, y0]
      const pR: [number, number] = [x0 + cellW, y0 + eR * cellH]
      const pT: [number, number] = [x0 + eT * cellW, y0 + cellH]
      const pL: [number, number] = [x0, y0 + eL * cellH]

      const segs = getSegments(idx, pB, pR, pT, pL)
      for (let i = 0; i < segs.length; i += 4) {
        ctx.moveTo(segs[i], segs[i + 1])
        ctx.lineTo(segs[i + 2], segs[i + 3])
      }
    }
  }
  ctx.stroke()
}

function getSegments(
  idx: number,
  pB: [number, number],
  pR: [number, number],
  pT: [number, number],
  pL: [number, number]
): number[] {
  switch (idx) {
    case 1:
    case 14:
      return [...pB, ...pL]
    case 2:
    case 13:
      return [...pB, ...pR]
    case 3:
    case 12:
      return [...pL, ...pR]
    case 4:
    case 11:
      return [...pR, ...pT]
    case 5:
      return [...pB, ...pR, ...pL, ...pT]
    case 6:
    case 9:
      return [...pB, ...pT]
    case 7:
    case 8:
      return [...pL, ...pT]
    case 10:
      return [...pB, ...pL, ...pR, ...pT]
    default:
      return []
  }
}

// Simple 2D value noise — used for domain warping the KDE field so contours look organic
function valueNoise2D(x: number, y: number, seed: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  // Smoothstep
  const ux = xf * xf * (3 - 2 * xf)
  const uy = yf * yf * (3 - 2 * yf)
  const h = (a: number, b: number): number => {
    let n = ((a * 1973 + b * 9737 + seed * 7919) | 0) & 0x7fffffff
    n = (((n >> 14) ^ n) * 0x45d9f3b) | 0
    n = (((n >> 14) ^ n) * 0x45d9f3b) | 0
    n = ((n >> 14) ^ n) | 0
    return ((n >>> 0) & 0xff) / 255.0
  }
  const aa = h(xi, yi)
  const ba = h(xi + 1, yi)
  const ab = h(xi, yi + 1)
  const bb = h(xi + 1, yi + 1)
  return aa + ux * (ba - aa) + uy * (ab - aa) + ux * uy * (aa - ba - ab + bb)
}

function rgbToRgba(rgb: [number, number, number], alpha: number): string {
  return `rgba(${Math.round(rgb[0] * 255)},${Math.round(rgb[1] * 255)},${Math.round(rgb[2] * 255)},${alpha})`
}

export default function DecisionSurfaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contourCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const contourCanvas = contourCanvasRef.current
    if (!canvas || !contourCanvas) return

    const gl = canvas.getContext('webgl', { alpha: true })
    if (!gl) return

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    function createShader(type: number, src: string): WebGLShader | null {
      const s = gl!.createShader(type)
      if (!s) return null
      gl!.shaderSource(s, src)
      gl!.compileShader(s)
      if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
        console.error(gl!.getShaderInfoLog(s))
        gl!.deleteShader(s)
        return null
      }
      return s
    }

    const vs = createShader(gl.VERTEX_SHADER, vertSrc)
    const fs = createShader(gl.FRAGMENT_SHADER, fragSrc)
    if (!vs || !fs) return

    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog))
      return
    }

    const posLoc = gl.getAttribLocation(prog, 'a_position')
    const colLoc = gl.getAttribLocation(prog, 'a_color')
    const alphaLoc = gl.getAttribLocation(prog, 'a_alpha')
    const resLoc = gl.getUniformLocation(prog, 'u_resolution')

    const posBuf = gl.createBuffer()
    const colBuf = gl.createBuffer()
    const alphaBuf = gl.createBuffer()

    // Grid dimensions derived from current canvas size
    let gridCols = Math.max(1, Math.round((canvas.clientWidth || window.innerWidth) / CELL_SIZE_PX))
    let gridRows = Math.max(
      1,
      Math.round((canvas.clientHeight || window.innerHeight) / CELL_SIZE_PX)
    )

    function initPoints(cols: number, rows: number): Point[] {
      const numPoints = Math.max(50, Math.round(cols * rows * POINTS_PER_CELL))
      const centers = Array.from({ length: NUM_CLUSTERS }, () => ({
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
      }))
      return Array.from({ length: numPoints }, () => {
        const clusterIdx = Math.floor(Math.random() * NUM_CLUSTERS)
        const cluster = centers[clusterIdx]
        const angle = Math.random() * Math.PI * 2
        const r = Math.sqrt(-2 * Math.log(Math.random() + 0.0001)) * CLUSTER_SPREAD_CELLS
        const col = Math.max(0, Math.min(cols - 1, Math.round(cluster.col + Math.cos(angle) * r)))
        const row = Math.max(0, Math.min(rows - 1, Math.round(cluster.row + Math.sin(angle) * r)))
        return {
          col,
          row,
          x: (col + 0.5) / cols,
          y: (row + 0.5) / rows,
          cluster: clusterIdx,
        }
      })
    }

    let pts: Point[] = initPoints(gridCols, gridRows)

    // Per-point colour from cluster palette
    let ptColors = pts.map((p) => CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length])

    // Smoothed mouse position in [-0.5, 0.5] normalised coords
    let mouseNX = 0
    let mouseNY = 0
    let prevMouseNX = 0
    let prevMouseNY = 0
    let targetNX = 0
    let targetNY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetNX = (e.clientX - rect.left) / rect.width - 0.5
      targetNY = (e.clientY - rect.top) / rect.height - 0.5
    }

    window.addEventListener('mousemove', handleMouseMove)

    let animationId: number
    let frameCount = 0
    // Cached KDE fields per cluster (recomputed every KDE_INTERVAL frames)
    let cachedFields: Float32Array[] | null = null
    let cachedKCols = 0
    let cachedKRows = 0

    const render = () => {
      prevMouseNX = mouseNX
      prevMouseNY = mouseNY
      mouseNX += (targetNX - mouseNX) * 0.06
      mouseNY += (targetNY - mouseNY) * 0.06

      // Mouse velocity this frame (scaled up so small moves still register)
      const vx = (mouseNX - prevMouseNX) * 60
      const vy = (mouseNY - prevMouseNY) * 60
      const speed = Math.sqrt(vx * vx + vy * vy)

      const W = canvas.clientWidth
      const H = canvas.clientHeight
      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W
        canvas.height = H
        contourCanvas.width = W
        contourCanvas.height = H
        // Recompute grid dimensions; if they changed, reinitialise all points
        const newCols = Math.max(1, Math.round(W / CELL_SIZE_PX))
        const newRows = Math.max(1, Math.round(H / CELL_SIZE_PX))
        if (newCols !== gridCols || newRows !== gridRows) {
          gridCols = newCols
          gridRows = newRows
          pts = initPoints(gridCols, gridRows)
          ptColors = pts.map((p) => CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length])
        }
      }

      // Hop to adjacent grid cell (driven by mouse velocity) then lerp toward target
      for (const p of pts) {
        if (speed > 0.01 && Math.random() < HOP_CHANCE * speed) {
          // Bias hop direction toward mouse movement; add small random nudge
          const dx = Math.sign(vx + (Math.random() - 0.5) * 1.5) || (Math.random() < 0.5 ? -1 : 1)
          const dy = Math.sign(vy + (Math.random() - 0.5) * 1.5) || (Math.random() < 0.5 ? -1 : 1)
          p.col = Math.max(0, Math.min(gridCols - 1, p.col + dx))
          p.row = Math.max(0, Math.min(gridRows - 1, p.row + dy))
        }
        // Glide toward the centre of the target grid cell
        const tx = (p.col + 0.5) / gridCols
        const ty = (p.row + 0.5) / gridRows
        p.x += (tx - p.x) * LERP_SPEED
        p.y += (ty - p.y) * LERP_SPEED
      }

      const N = pts.length
      const positions = new Float32Array(N * 2)
      const colors = new Float32Array(N * 3)
      const alphas = new Float32Array(N)

      for (let i = 0; i < N; i++) {
        positions[i * 2] = pts[i].x * W
        positions[i * 2 + 1] = pts[i].y * H
        const c = ptColors[i]
        colors[i * 3] = c[0]
        colors[i * 3 + 1] = c[1]
        colors[i * 3 + 2] = c[2]
        alphas[i] = 1.0
      }

      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(prog)
      gl.uniform2f(resLoc, canvas.width, canvas.height)

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(posLoc)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, colBuf)
      gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(colLoc)
      gl.vertexAttribPointer(colLoc, 3, gl.FLOAT, false, 0, 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, alphaBuf)
      gl.bufferData(gl.ARRAY_BUFFER, alphas, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(alphaLoc)
      gl.vertexAttribPointer(alphaLoc, 1, gl.FLOAT, false, 0, 0)

      gl.drawArrays(gl.POINTS, 0, N)

      frameCount++

      // Draw contours on 2D canvas
      const ctx = contourCanvas.getContext('2d')
      if (ctx && W > 0 && H > 0) {
        // Use the same grid as the points so contour squares align perfectly with cross centres
        const kCols = gridCols
        const kRows = gridRows

        // Recompute KDE fields: always when mouse moves, otherwise every KDE_INTERVAL frames
        const mouseMoving =
          Math.abs(mouseNX - prevMouseNX) + Math.abs(mouseNY - prevMouseNY) > 0.0001
        if (
          mouseMoving ||
          frameCount % KDE_INTERVAL === 1 ||
          !cachedFields ||
          cachedKCols !== kCols ||
          cachedKRows !== kRows
        ) {
          cachedKCols = kCols
          cachedKRows = kRows
          const bw2 = KDE_BANDWIDTH * KDE_BANDWIDTH
          cachedFields = Array.from({ length: NUM_CLUSTERS }, (_, ci) => {
            const f = new Float32Array(kCols * kRows)
            for (let kr = 0; kr < kRows; kr++) {
              for (let kc = 0; kc < kCols; kc++) {
                const fx = (kc + 0.5) / kCols
                const fy = (kr + 0.5) / kRows
                // Domain warp: offset the sample point by two octaves of value noise
                const warpSeed = ci * 1000
                // Mouse position shifts the warp sample coordinates, morphing the contour shape
                const wx =
                  (valueNoise2D(
                    fx * WARP_SCALE + mouseNX * CONTOUR_MOUSE_WARP,
                    fy * WARP_SCALE + mouseNY * CONTOUR_MOUSE_WARP,
                    warpSeed
                  ) -
                    0.5) *
                  2 *
                  WARP_STRENGTH
                const wy =
                  (valueNoise2D(
                    fx * WARP_SCALE + mouseNX * CONTOUR_MOUSE_WARP + 31.7,
                    fy * WARP_SCALE + mouseNY * CONTOUR_MOUSE_WARP + 17.3,
                    warpSeed
                  ) -
                    0.5) *
                  2 *
                  WARP_STRENGTH
                const sx = fx + wx
                const sy = fy + wy
                let val = 0
                for (const p of pts) {
                  if (p.cluster !== ci) continue
                  const dx = p.x - sx
                  const dy = p.y - sy
                  val += Math.exp(-(dx * dx + dy * dy) / bw2)
                }
                f[kr * kCols + kc] = val
              }
            }
            return f
          })
        }

        ctx.clearRect(0, 0, W, H)
        for (let ci = 0; ci < NUM_CLUSTERS; ci++) {
          const field = cachedFields[ci]
          let maxVal = 0
          for (let k = 0; k < field.length; k++) if (field[k] > maxVal) maxVal = field[k]
          if (maxVal < 0.5) continue

          const clusterColor = CLUSTER_COLORS[ci % CLUSTER_COLORS.length]
          // Fill the contour region with 0.3 opacity
          ctx.fillStyle = rgbToRgba(clusterColor, 0.3)
          const cellW = W / kCols
          const cellH = H / kRows
          for (let kr = 0; kr < kRows; kr++) {
            for (let kc = 0; kc < kCols; kc++) {
              if (field[kr * kCols + kc] >= maxVal * CONTOUR_THRESHOLD) {
                ctx.fillRect(kc * cellW, kr * cellH, cellW + 1, cellH + 1)
              }
            }
          }
        }
      }

      animationId = requestAnimationFrame(render)
    }

    animationId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <canvas
        ref={contourCanvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
    </>
  )
}
