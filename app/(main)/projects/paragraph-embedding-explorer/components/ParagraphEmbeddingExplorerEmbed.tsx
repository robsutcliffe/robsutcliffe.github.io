'use client'

import { useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

type Section = 'Transport' | 'Community' | 'Food & drink' | 'Music' | 'Paragraph'

interface Article {
  id: string
  title: string
  section: Section
  x: number
  y: number
  isParagraph?: boolean
  paragraphIndex?: number
  paragraphText?: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const SOURCE_ARTICLE_TITLE = 'City Park Summer Festival'

const PARAGRAPHS: { label: string; shortLabel: string; text: string }[] = [
  {
    label: 'Paragraph 1 — Performers',
    shortLabel: 'Performers',
    text: 'Headline acts include jazz quartet Riverside Collective and indie band The Hollow Keys, who will take to the main stage at 7 pm and 9 pm respectively. Supporting acts cover folk, electronic, and spoken word, with a dedicated acoustic tent running throughout the afternoon.',
  },
  {
    label: 'Paragraph 2 — Road closures',
    shortLabel: 'Road closures',
    text: 'Organisers have confirmed that Elm Avenue and the northern end of Park Road will be closed to through traffic from Friday evening until Sunday midnight. A signed diversion route via the ring road will be in place, and residents on the affected streets are advised to move vehicles before 6 pm on Friday.',
  },
  {
    label: 'Paragraph 3 — Food stalls',
    shortLabel: 'Food stalls',
    text: 'More than forty street-food traders will line the festival perimeter, with offerings ranging from wood-fired pizza and pulled pork to vegan mezze and artisan ice cream. The annual cake competition returns on Saturday afternoon, judged by local chef Maria Okonkwo.',
  },
]

const ARTICLES: Article[] = [
  // Transport cluster (top-left)
  {
    id: 'a1',
    title: 'Roadworks close High Street for six weeks',
    section: 'Transport',
    x: 0.08,
    y: 0.82,
  },
  {
    id: 'a2',
    title: 'New cycle lane approved for Bridge Road',
    section: 'Transport',
    x: 0.14,
    y: 0.72,
  },
  {
    id: 'a3',
    title: 'Bus route 47 diverted due to flooding',
    section: 'Transport',
    x: 0.06,
    y: 0.62,
  },
  {
    id: 'a4',
    title: 'Park-and-ride scheme extended to weekends',
    section: 'Transport',
    x: 0.2,
    y: 0.78,
  },
  {
    id: 'a5',
    title: 'Road closures planned for half marathon',
    section: 'Transport',
    x: 0.16,
    y: 0.65,
  },

  // Music cluster (top-right)
  {
    id: 'b1',
    title: 'Jazz Collective returns for sold-out autumn tour',
    section: 'Music',
    x: 0.82,
    y: 0.78,
  },
  {
    id: 'b2',
    title: 'Indie band The Hollow Keys release debut album',
    section: 'Music',
    x: 0.88,
    y: 0.7,
  },
  {
    id: 'b3',
    title: 'Acoustic sessions return to the arts centre',
    section: 'Music',
    x: 0.76,
    y: 0.82,
  },
  {
    id: 'b4',
    title: 'Folk festival announces headline lineup',
    section: 'Music',
    x: 0.84,
    y: 0.62,
  },
  {
    id: 'b5',
    title: 'Electronic music venue opens in old mill',
    section: 'Music',
    x: 0.78,
    y: 0.68,
  },

  // Food & drink cluster (bottom-right)
  {
    id: 'c1',
    title: 'Riverside food market returns this Saturday',
    section: 'Food & drink',
    x: 0.8,
    y: 0.22,
  },
  {
    id: 'c2',
    title: 'New vegan café opens on Market Street',
    section: 'Food & drink',
    x: 0.86,
    y: 0.3,
  },
  {
    id: 'c3',
    title: 'Local bakery wins national award',
    section: 'Food & drink',
    x: 0.74,
    y: 0.18,
  },
  {
    id: 'c4',
    title: 'Street-food traders expand to city centre',
    section: 'Food & drink',
    x: 0.82,
    y: 0.14,
  },
  {
    id: 'c5',
    title: 'Chef Maria Okonkwo opens second restaurant',
    section: 'Food & drink',
    x: 0.76,
    y: 0.28,
  },

  // Community cluster (bottom-left)
  {
    id: 'd1',
    title: 'Volunteer day at the community garden',
    section: 'Community',
    x: 0.18,
    y: 0.22,
  },
  {
    id: 'd2',
    title: 'Summer festival brings thousands to City Park',
    section: 'Community',
    x: 0.26,
    y: 0.18,
  },
  {
    id: 'd3',
    title: 'Parish council approves new play area',
    section: 'Community',
    x: 0.12,
    y: 0.3,
  },
  {
    id: 'd4',
    title: 'Arts centre launches youth programme',
    section: 'Community',
    x: 0.22,
    y: 0.26,
  },
  {
    id: 'd5',
    title: 'Annual cake competition returns to park',
    section: 'Community',
    x: 0.3,
    y: 0.22,
  },

  // Paragraphs — positioned based on semantic proximity to nearest cluster
  {
    id: 'p1',
    title: `${SOURCE_ARTICLE_TITLE} — Performers`,
    section: 'Paragraph',
    x: 0.72,
    y: 0.74,
    isParagraph: true,
    paragraphIndex: 0,
    paragraphText: PARAGRAPHS[0].text,
  },
  {
    id: 'p2',
    title: `${SOURCE_ARTICLE_TITLE} — Road closures`,
    section: 'Paragraph',
    x: 0.22,
    y: 0.72,
    isParagraph: true,
    paragraphIndex: 1,
    paragraphText: PARAGRAPHS[1].text,
  },
  {
    id: 'p3',
    title: `${SOURCE_ARTICLE_TITLE} — Food stalls`,
    section: 'Paragraph',
    x: 0.68,
    y: 0.24,
    isParagraph: true,
    paragraphIndex: 2,
    paragraphText: PARAGRAPHS[2].text,
  },
]

const PARAGRAPH_NEIGHBOURS: Record<string, string[]> = {
  p1: ['b1', 'b2', 'b3'],
  p2: ['a1', 'a5', 'a3'],
  p3: ['c1', 'c4', 'c5'],
}

// ─── Palette ─────────────────────────────────────────────────────────────────

const AXIS_COLOR = '#241169'

// ── Edit these colours to restyle all dots and legend at once ──
const COLOURS = ['#17922E', '#177B92', '#7B9217', '#983117']
// [0] Transport / Paragraph, [1] Music, [2] Food & drink, [3] Community

const SECTION_COLOURS: Record<Section, { fill: string; text: string }> = {
  Transport: { fill: COLOURS[0], text: '#17922E' },
  Music: { fill: COLOURS[1], text: '#177B92' },
  'Food & drink': { fill: COLOURS[2], text: '#7B9217' },
  Community: { fill: COLOURS[3], text: '#983117' },
  Paragraph: { fill: '#241169', text: '#241169' },
}

const PARAGRAPH_ACCENT = [COLOURS[1], COLOURS[0], COLOURS[3]]

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
}
function pctX(svgX: number) {
  return `${(svgX / VW) * 100}%`
}
function pctY(svgY: number) {
  return `${(svgY / VH) * 100}%`
}

// ─── Legend ───────────────────────────────────────────────────────────────────

function Legend() {
  const sections: Section[] = ['Transport', 'Music', 'Food & drink', 'Community']
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 p-1 py-1.5 text-xs">
      {sections.map((s) => (
        <span key={s} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: SECTION_COLOURS[s].fill }}
          />
          <span className="text-blue-800">{s}</span>
        </span>
      ))}
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2 w-2 rotate-45 border border-blue-700" />
        <span style={{ color: AXIS_COLOR }}>Paragraph</span>
      </span>
    </div>
  )
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

interface TooltipProps {
  article: Article
  neighbours: Article[]
  cx: number
  cy: number
}

function Tooltip({ article, neighbours, cx, cy }: TooltipProps) {
  const flipX = cx > VW * 0.6
  const flipY = cy > VH * 0.45
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
        border: '1px solid #E424CE',
        borderRadius: 4,
        padding: '5px 9px',
        boxShadow: '0 4px 12px rgba(228,36,206,0.12)',
        fontSize: 11,
        lineHeight: 1.4,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 4, color: AXIS_COLOR, fontSize: 11 }}>
        {article.title}
      </div>
      {article.isParagraph && article.paragraphText && (
        <div
          style={{
            color: '#241169',
            fontSize: 10,
            marginBottom: 5,
            fontStyle: 'italic',
            borderLeft: '2px solid #241169',
            paddingLeft: 7,
          }}
        >
          {article.paragraphText.slice(0, 90)}…
        </div>
      )}
      {neighbours.length > 0 && (
        <>
          <div style={{ fontWeight: 600, color: AXIS_COLOR, marginBottom: 3, fontSize: 11 }}>
            Nearest neighbours
          </div>
          {neighbours.map((n) => (
            <div
              key={n.id}
              style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: SECTION_COLOURS[n.section].fill,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: AXIS_COLOR, fontSize: 10 }}>{n.title}</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ParagraphEmbeddingExplorerEmbed() {
  const [activeParaId, setActiveParaId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  function handleSelect(id: string) {
    setActiveParaId((prev) => (prev === id ? null : id))
  }

  const neighbourIds = new Set<string>(
    activeParaId ? (PARAGRAPH_NEIGHBOURS[activeParaId] ?? []) : []
  )
  const hovNeighbourIds = new Set<string>(hoveredId ? (PARAGRAPH_NEIGHBOURS[hoveredId] ?? []) : [])
  const activeArticle = activeParaId ? (ARTICLES.find((a) => a.id === activeParaId) ?? null) : null
  const hoveredArticle = hoveredId ? (ARTICLES.find((a) => a.id === hoveredId) ?? null) : null
  const hoveredNeighbours = hoveredId
    ? (PARAGRAPH_NEIGHBOURS[hoveredId] ?? [])
        .map((nid) => ARTICLES.find((a) => a.id === nid)!)
        .filter(Boolean)
    : []

  return (
    <div
      style={{ width: '100%', maxWidth: 720, fontFamily: 'Bw Quinta Pro, system-ui, sans-serif' }}
    >
      {/* Map */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: `${VW} / ${VH}` }}>
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
          <rect x={x0} y={y1} width={x1 - x0} height={y0 - y1} fill="#E424CE" opacity={0.04} />

          {/* Grid lines */}
          {[1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6].map((t) => (
            <g key={t}>
              <line
                x1={x0 + t * (x1 - x0)}
                x2={x0 + t * (x1 - x0)}
                y1={y0}
                y2={y1}
                stroke="#E424CE"
                strokeWidth={0.7}
                opacity={0.15}
              />
              <line
                x1={x0}
                x2={x1}
                y1={y0 + (t - 1) * (y0 - y1)}
                y2={y0 + (t - 1) * (y0 - y1)}
                stroke="#E424CE"
                strokeWidth={0.7}
                opacity={0.15}
              />
            </g>
          ))}

          {/* Axis lines */}
          <line x1={x0} x2={x1} y1={y0} y2={y0} stroke={AXIS_COLOR} strokeWidth={1.5} />
          <line x1={x0} x2={x0} y1={y0} y2={y1} stroke={AXIS_COLOR} strokeWidth={1.5} />

          {/* Connection lines for active paragraph */}
          {activeArticle &&
            Array.from(neighbourIds).map((nid) => {
              const n = ARTICLES.find((a) => a.id === nid)
              if (!n) return null
              return (
                <line
                  key={nid}
                  x1={toSvgX(activeArticle.x)}
                  y1={toSvgY(activeArticle.y)}
                  x2={toSvgX(n.x)}
                  y2={toSvgY(n.y)}
                  stroke="#E424CE"
                  strokeWidth={1.5}
                  strokeDasharray="6 4"
                  opacity={0.55}
                />
              )
            })}

          {/* Connection lines for hovered paragraph (if different from active) */}
          {hoveredId &&
            hoveredId !== activeParaId &&
            PARAGRAPH_NEIGHBOURS[hoveredId] &&
            (() => {
              const hovered = ARTICLES.find((a) => a.id === hoveredId)
              if (!hovered) return null
              return Array.from(hovNeighbourIds).map((nid) => {
                const n = ARTICLES.find((a) => a.id === nid)
                if (!n) return null
                return (
                  <line
                    key={nid}
                    x1={toSvgX(hovered.x)}
                    y1={toSvgY(hovered.y)}
                    x2={toSvgX(n.x)}
                    y2={toSvgY(n.y)}
                    stroke="#E424CE"
                    strokeWidth={1.5}
                    strokeDasharray="6 4"
                    opacity={0.3}
                  />
                )
              })
            })()}

          {/* Points */}
          {ARTICLES.map((a) => {
            const cx = toSvgX(a.x)
            const cy = toSvgY(a.y)
            const col = SECTION_COLOURS[a.section]
            const isHovered = a.id === hoveredId
            const isNeighbour = neighbourIds.has(a.id) || hovNeighbourIds.has(a.id)
            const isActive = a.id === activeParaId

            if (a.isParagraph) {
              const idx = a.paragraphIndex ?? 0
              const accent = PARAGRAPH_ACCENT[idx]
              const half = isHovered || isActive ? 7 : 5
              return (
                <g
                  key={a.id}
                  transform={`translate(${cx}, ${cy}) rotate(45)`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredId(a.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => handleSelect(a.id)}
                >
                  <rect
                    x={-half}
                    y={-half}
                    width={half * 2}
                    height={half * 2}
                    fill="#FCFCEE"
                    strokeWidth={1}
                    stroke="#241169"
                    rx={1}
                  />
                </g>
              )
            }

            const r = isHovered ? 6 : isActive ? 7 : isNeighbour ? 5 : 4
            return (
              <circle
                key={a.id}
                cx={cx}
                cy={cy}
                r={r}
                fill={col.fill}
                opacity={activeParaId && !isNeighbour && !isActive ? 0.3 : 1}
                style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
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

      <Legend />
    </div>
  )
}
