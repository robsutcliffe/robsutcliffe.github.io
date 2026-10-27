'use client'

import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Article {
  id: string
  title: string
  x: number
  y: number
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ARTICLES: Article[] = [
  // Transport cluster (top-left)
  { id: 'a1', title: 'Roadworks close High Street for six weeks', x: 0.08, y: 0.82 },
  { id: 'a2', title: 'New cycle lane approved for Bridge Road', x: 0.14, y: 0.72 },
  { id: 'a3', title: 'Bus route 47 diverted due to flooding', x: 0.06, y: 0.62 },
  { id: 'a4', title: 'Park-and-ride scheme extended to weekends', x: 0.2, y: 0.78 },
  { id: 'a5', title: 'Road closures planned for half marathon', x: 0.16, y: 0.65 },
  { id: 'a6', title: 'Speed cameras added to school routes', x: 0.1, y: 0.55 },
  { id: 'a7', title: 'Council consults on congestion zone plan', x: 0.24, y: 0.68 },

  // Food & drink cluster (bottom-right)
  { id: 'b1', title: 'Riverside food market returns this Saturday', x: 0.8, y: 0.22 },
  { id: 'b2', title: 'New vegan café opens on Market Street', x: 0.86, y: 0.3 },
  { id: 'b3', title: 'Local bakery wins national award', x: 0.74, y: 0.18 },
  { id: 'b4', title: 'Street-food traders expand to city centre', x: 0.82, y: 0.14 },
  { id: 'b5', title: 'Chef Maria Okonkwo opens second restaurant', x: 0.76, y: 0.28 },
  { id: 'b6', title: 'Farmers market to move to riverside site', x: 0.88, y: 0.2 },
  { id: 'b7', title: 'Annual food festival announces traders', x: 0.72, y: 0.12 },

  // Community cluster (centre/bottom-left — bridging Transport & Food)
  { id: 'c1', title: 'Volunteer day at the community garden', x: 0.4, y: 0.3 },
  { id: 'c2', title: 'Summer festival brings thousands to City Park', x: 0.5, y: 0.22 },
  { id: 'c3', title: 'Parish council approves new play area', x: 0.34, y: 0.38 },
  { id: 'c4', title: 'Arts centre launches youth programme', x: 0.46, y: 0.36 },
  { id: 'c5', title: 'Annual cake competition returns to park', x: 0.56, y: 0.28 },
  { id: 'c6', title: 'Neighbourhood watch launches new app', x: 0.38, y: 0.46 },
  { id: 'c7', title: 'City-wide litter pick planned for spring', x: 0.52, y: 0.44 },
]

// Pre-computed nearest neighbours (3 per article, in original embedding space)
const NEIGHBOURS: Record<string, string[]> = {
  a1: ['a2', 'a5', 'a4'],
  a2: ['a1', 'a4', 'a7'],
  a3: ['a6', 'a1', 'a5'],
  a4: ['a2', 'a1', 'a7'],
  a5: ['a1', 'a3', 'a6'],
  a6: ['a3', 'a5', 'a1'],
  a7: ['a4', 'a2', 'a1'],
  b1: ['b3', 'b4', 'b7'],
  b2: ['b5', 'b1', 'b3'],
  b3: ['b7', 'b1', 'b4'],
  b4: ['b3', 'b7', 'b1'],
  b5: ['b2', 'b1', 'b6'],
  b6: ['b1', 'b5', 'b4'],
  b7: ['b3', 'b4', 'b1'],
  c1: ['c3', 'c6', 'c4'],
  c2: ['c5', 'c4', 'c7'],
  c3: ['c1', 'c6', 'c4'],
  c4: ['c2', 'c7', 'c5'],
  c5: ['c2', 'c4', 'b1'], // cross-section: food festival → food market
  c6: ['c1', 'c3', 'a5'], // cross-section: community → transport (road closures)
  c7: ['c4', 'c2', 'c6'],
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const POINT_FILL = '#FCE9F7'
const POINT_STROKE = '#E424CE'
const AXIS_COLOR = '#241169'

// ─── Layout constants (fixed viewBox — matches SvgScatterPlot approach) ───────

const VW = 1080
const VH = 540
const PAD = { top: 0, right: 0, bottom: 0, left: 0 }

const x0 = PAD.left
const x1 = VW - PAD.right
const y0 = VH - PAD.bottom
const y1 = PAD.top

function toSvgX(nx: number) {
  return x0 + nx * (x1 - x0)
}
function toSvgY(ny: number) {
  return y0 + (ny - 1) * (y0 - y1)
} // flip Y
function pctX(svgX: number) {
  return `${(svgX / VW) * 100}%`
}
function pctY(svgY: number) {
  return `${(svgY / VH) * 100}%`
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface TooltipProps {
  article: Article
  neighbours: Article[]
  cx: number
  cy: number
}

function Tooltip({ article, neighbours, cx, cy }: TooltipProps) {
  const flipX = cx > VW * 0.6
  const flipY = cy > VH * 0.55
  const rawTop = (cy / VH) * 100
  const clampedTop = Math.min(Math.max(rawTop, 2), 92)

  return (
    <div
      style={{
        position: 'absolute',
        left: pctX(cx),
        top: `${clampedTop}%`,
        transform: `translate(${flipX ? 'calc(-100% - 10px)' : '10px'}, ${flipY ? 'calc(-100% - 10px)' : '10px'})`,
        pointerEvents: 'none',
        zIndex: 10,
        width: 260,
        background: '#FCE9F7',
        border: `1px solid ${POINT_STROKE}`,
        borderRadius: 4,
        padding: '5px 9px',
        boxShadow: '0 4px 12px rgba(228,36,206,0.12)',
        fontSize: 11,
        lineHeight: 1.4,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 2, color: AXIS_COLOR, fontSize: 12 }}>
        {article.title}
      </div>
      <div style={{ fontWeight: 600, color: '#241169', marginBottom: 3, fontSize: 10 }}>
        Nearest neighbours
      </div>
      {neighbours.map((n) => (
        <div key={n.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: POINT_FILL,
              border: `1.5px solid ${POINT_STROKE}`,
              flexShrink: 0,
            }}
          />
          <span style={{ color: AXIS_COLOR, fontSize: 10 }}>{n.title}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EmbeddingSpaceExplorerEmbed() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const neighbourIds = new Set<string>(hoveredId ? (NEIGHBOURS[hoveredId] ?? []) : [])
  const hoveredArticle = hoveredId ? (ARTICLES.find((a) => a.id === hoveredId) ?? null) : null
  const hoveredNeighbours = hoveredId
    ? (NEIGHBOURS[hoveredId] ?? [])
        .map((nid) => ARTICLES.find((a) => a.id === nid)!)
        .filter(Boolean)
    : []

  return (
    <div
      style={{
        position: 'relative',
        maxWidth: 720,
        width: '100%',
        aspectRatio: `${VW} / ${VH}`,
        fontFamily: 'Bw Quinta Pro, system-ui, sans-serif',
      }}
    >
      {/* SVG layer */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          userSelect: 'none',
        }}
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Plot background */}
        <rect x={x0} y={y1} width={x1 - x0} height={y0 - y1} fill={POINT_STROKE} opacity={0.04} />

        {/* Grid lines */}
        {[1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6].map((t) => (
          <g key={t}>
            <line
              x1={x0 + t * (x1 - x0)}
              x2={x0 + t * (x1 - x0)}
              y1={y0}
              y2={y1}
              stroke={POINT_STROKE}
              strokeWidth={0.7}
              opacity={0.15}
            />
            <line
              x1={x0}
              x2={x1}
              y1={y0 + (t - 1) * (y0 - y1)}
              y2={y0 + (t - 1) * (y0 - y1)}
              stroke={POINT_STROKE}
              strokeWidth={0.7}
              opacity={0.15}
            />
          </g>
        ))}

        {/* Axis lines */}
        <line x1={x0} x2={x1} y1={y0} y2={y0} stroke={AXIS_COLOR} strokeWidth={1} />
        <line x1={x0} x2={x0} y1={y0} y2={y1} stroke={AXIS_COLOR} strokeWidth={1} />

        {/* Connection lines for hovered */}
        {hoveredArticle &&
          Array.from(neighbourIds).map((nid) => {
            const n = ARTICLES.find((a) => a.id === nid)
            if (!n) return null
            return (
              <line
                key={nid}
                x1={toSvgX(hoveredArticle.x)}
                y1={toSvgY(hoveredArticle.y)}
                x2={toSvgX(n.x)}
                y2={toSvgY(n.y)}
                stroke={POINT_STROKE}
                strokeWidth={1.5}
                strokeDasharray="6 4"
                opacity={0.5}
              />
            )
          })}

        {/* Points */}
        {ARTICLES.map((a) => {
          const cx = toSvgX(a.x)
          const cy = toSvgY(a.y)
          const isHovered = a.id === hoveredId
          const isNeighbour = neighbourIds.has(a.id)
          const r = isHovered ? 9 : isNeighbour ? 7 : 5

          return (
            <circle
              key={a.id}
              cx={cx}
              cy={cy}
              r={r}
              fill={POINT_FILL}
              stroke={POINT_STROKE}
              strokeWidth={2}
              opacity={hoveredId && !isHovered && !isNeighbour ? 0.35 : 1}
              style={{ cursor: 'pointer', transition: 'opacity 0.15s, r 0.1s' }}
              onMouseEnter={() => setHoveredId(a.id)}
              onMouseLeave={() => setHoveredId(null)}
            />
          )
        })}
      </svg>

      {/* Tooltip — rendered outside SVG to avoid scale/unit issues */}
      {hoveredArticle && (
        <Tooltip
          article={hoveredArticle}
          neighbours={hoveredNeighbours}
          cx={toSvgX(hoveredArticle.x)}
          cy={toSvgY(hoveredArticle.y)}
        />
      )}
    </div>
  )
}
