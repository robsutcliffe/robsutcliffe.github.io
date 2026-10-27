'use client'

import { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Section = 'Transport' | 'Community' | 'Food & drink'

interface Candidate {
  id: string
  title: string
  section: Section
  x: number
  y: number
  // Normalised scores 0–1 for each signal (relative to any selected article)
  meaning: number
  location: number
  timing: number
}

// ─── Data ─────────────────────────────────────────────────────────────────────
// Each article has pre-computed signal scores relative to a reference query.
// meaning  = cosine similarity in embedding space (pre-computed)
// location = proximity score based on geographic distance
// timing   = recency / upcoming-event score

const CANDIDATES: Candidate[] = [
  {
    id: 'a1',
    title: 'Roadworks to close Main Street for three weeks',
    section: 'Transport',
    x: 0.12,
    y: 0.78,
    meaning: 0.82,
    location: 0.95,
    timing: 0.4,
  },
  {
    id: 'a2',
    title: 'Road closures planned for half marathon',
    section: 'Transport',
    x: 0.2,
    y: 0.68,
    meaning: 0.65,
    location: 0.6,
    timing: 0.85,
  },
  {
    id: 'a3',
    title: 'New cycle lane approved for Bridge Road',
    section: 'Transport',
    x: 0.08,
    y: 0.6,
    meaning: 0.45,
    location: 0.7,
    timing: 0.3,
  },
  {
    id: 'b1',
    title: 'Riverside food market returns this Saturday',
    section: 'Food & drink',
    x: 0.78,
    y: 0.24,
    meaning: 0.78,
    location: 0.8,
    timing: 0.9,
  },
  {
    id: 'b2',
    title: 'Street-food traders expand to city centre',
    section: 'Food & drink',
    x: 0.84,
    y: 0.16,
    meaning: 0.7,
    location: 0.65,
    timing: 0.5,
  },
  {
    id: 'b3',
    title: 'Annual food festival announces traders',
    section: 'Food & drink',
    x: 0.72,
    y: 0.14,
    meaning: 0.88,
    location: 0.55,
    timing: 0.75,
  },
  {
    id: 'b4',
    title: 'Thousands attend summer food festival',
    section: 'Food & drink',
    x: 0.8,
    y: 0.1,
    meaning: 0.85,
    location: 0.5,
    timing: 0.15,
  },
  {
    id: 'c1',
    title: 'Summer festival brings thousands to City Park',
    section: 'Community',
    x: 0.48,
    y: 0.24,
    meaning: 0.72,
    location: 0.75,
    timing: 0.82,
  },
  {
    id: 'c2',
    title: 'Annual cake competition returns to park',
    section: 'Community',
    x: 0.54,
    y: 0.3,
    meaning: 0.6,
    location: 0.7,
    timing: 0.88,
  },
  {
    id: 'c3',
    title: 'Volunteer day at the community garden',
    section: 'Community',
    x: 0.38,
    y: 0.32,
    meaning: 0.4,
    location: 0.6,
    timing: 0.78,
  },
  {
    id: 'q',
    title: 'Main Street closes for weekend food festival',
    section: 'Community',
    x: 0.46,
    y: 0.48,
    meaning: 1.0,
    location: 1.0,
    timing: 1.0,
  },
]

// The "query" article — this is the one whose similar articles we rank.
// Users can click any article to make it the query.
const DEFAULT_QUERY_ID = 'q'

// ─── Palette constants (matching SvgScatterPlot) ─────────────────────────────

const AXIS_COLOR = '#241169'
const POINT_STROKE = '#E424CE'

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

// ─── Colour helpers ───────────────────────────────────────────────────────────

const POINT_FILL = '#FCE9F7'

const SIGNAL_COLOURS = {
  meaning: { bar: '#241169', label: 'Meaning' },
  location: { bar: '#241169', label: 'Location' },
  timing: { bar: '#241169', label: 'Timing' },
}

// ─── Scatter Plot ─────────────────────────────────────────────────────────────

interface ScatterProps {
  queryId: string
  hoveredId: string | null
  rankedIds: string[]
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
}

function ScatterPlot({ queryId, hoveredId, rankedIds, onHover, onSelect }: ScatterProps) {
  const topSet = new Set(rankedIds.slice(0, 5))
  const query = CANDIDATES.find((a) => a.id === queryId)!

  return (
    <>
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
        <line x1={x0} x2={x1} y1={y0} y2={y0} stroke={AXIS_COLOR} strokeWidth={1.5} />
        <line x1={x0} x2={x0} y1={y0} y2={y1} stroke={AXIS_COLOR} strokeWidth={1.5} />

        {/* Connection lines from query to top-ranked candidates */}
        {CANDIDATES.filter((c) => topSet.has(c.id) && c.id !== queryId).map((c) => (
          <line
            key={c.id}
            x1={toSvgX(query.x)}
            y1={toSvgY(query.y)}
            x2={toSvgX(c.x)}
            y2={toSvgY(c.y)}
            stroke={POINT_STROKE}
            strokeWidth={1.5}
            strokeDasharray="6 4"
            opacity={0.35}
          />
        ))}

        {CANDIDATES.map((c) => {
          const cx = toSvgX(c.x)
          const cy = toSvgY(c.y)
          const isQuery = c.id === queryId
          const isHovered = c.id === hoveredId
          const isTop = topSet.has(c.id)
          const rank = rankedIds.indexOf(c.id)

          const r = isQuery ? (isHovered ? 12 : 9) : isHovered ? 9 : isTop ? 8 : 5

          return (
            <g key={c.id}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={POINT_FILL}
                stroke={POINT_STROKE}
                strokeWidth={isQuery ? 3 : 2}
                opacity={!isTop && !isHovered && !isQuery ? 0.4 : 1}
                style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                onClick={() => onSelect(c.id)}
                onMouseEnter={() => onHover(c.id)}
                onMouseLeave={() => onHover(null)}
              />
              {isTop && rank < 5 && (
                <text
                  x={cx}
                  y={cy - r - 5}
                  textAnchor="middle"
                  fontSize={16}
                  fontWeight="bold"
                  fill={AXIS_COLOR}
                  style={{ pointerEvents: 'none' }}
                >
                  #{rank + 1}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Tooltip on hover — rendered outside the SVG to avoid SVG scale/unit issues */}
      {hoveredId &&
        (() => {
          const c = CANDIDATES.find((a) => a.id === hoveredId)
          if (!c) return null
          const cx = toSvgX(c.x)
          const cy = toSvgY(c.y)
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
                border: '1px solid #E424CE',
                borderRadius: 4,
                padding: '5px 9px',
                boxShadow: '0 4px 12px rgba(228,36,206,0.12)',
                fontSize: 11,
                lineHeight: 1.4,
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: 4, color: AXIS_COLOR, fontSize: 11 }}>
                {c.title}
              </div>
              {c.id === queryId ? (
                <div style={{ color: AXIS_COLOR, fontSize: 10, fontStyle: 'italic' }}>
                  Currently selected as query — click another article to change it
                </div>
              ) : (
                (['meaning', 'location', 'timing'] as const).map((sig) => (
                  <div
                    key={sig}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 40,
                        color: AXIS_COLOR,
                        fontSize: 10,
                        flexShrink: 0,
                      }}
                    >
                      {SIGNAL_COLOURS[sig].label}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 4,
                        background: 'white',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${c[sig] * 100}%`,
                          height: '100%',
                          background: SIGNAL_COLOURS[sig].bar,
                          borderRadius: 2,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        color: AXIS_COLOR,
                        fontSize: 10,
                        width: 26,
                        textAlign: 'right',
                      }}
                    >
                      {(c[sig] * 100).toFixed(0)}%
                    </span>
                  </div>
                ))
              )}
            </div>
          )
        })()}
    </>
  )
}

// ─── Slider ───────────────────────────────────────────────────────────────────

interface SliderProps {
  label: string
  value: number
  color: string
  onChange: (v: number) => void
}

function Slider({ label, value, color, onChange }: SliderProps) {
  const pct = Math.round(value * 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          width: 64,
          flexShrink: 0,
          textAlign: 'right',
          fontSize: 12,
          fontWeight: 600,
          color,
        }}
      >
        {label}
      </span>
      <div
        style={{ flex: 1, position: 'relative', height: 20, display: 'flex', alignItems: 'center' }}
      >
        {/* Track background */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 6,
            borderRadius: 3,
            background: 'rgba(255,255,255,0.15)',
          }}
        />
        {/* Track fill */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            width: `${pct}%`,
            height: 6,
            borderRadius: 3,
            background: color,
            opacity: 0.7,
          }}
        />
        <input
          type="range"
          min={0}
          max={100}
          value={pct}
          onChange={(e) => onChange(Number(e.target.value) / 100)}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            width: '100%',
            opacity: 0,
            height: 20,
            cursor: 'pointer',
            margin: 0,
          }}
        />
        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            left: `calc(${pct}% - 9px)`,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            border: `2px solid ${color}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
            pointerEvents: 'none',
          }}
        />
      </div>
      <span
        style={{
          width: 32,
          textAlign: 'right',
          fontFamily: 'monospace',
          fontSize: 12,
          color: 'rgba(255,255,255,0.65)',
        }}
      >
        {pct}%
      </span>
    </div>
  )
}

// ─── Ranked List ──────────────────────────────────────────────────────────────

function RankedList({
  ranked,
  hoveredId,
  onHover,
  onSelect,
}: {
  ranked: { c: Candidate; score: number }[]
  hoveredId: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
}) {
  return (
    <div
      style={{
        maxHeight: 120,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        paddingRight: 4,
      }}
    >
      {ranked.map(({ c, score }, i) => {
        const isHovered = c.id === hoveredId
        return (
          <div
            key={c.id}
            className="flex items-center gap-2 rounded border px-2 py-1.5 text-xs transition-all"
            style={{
              borderColor: isHovered ? POINT_STROKE : 'rgba(255,255,255,0.2)',
              cursor: 'pointer',
            }}
            onClick={() => onSelect(c.id)}
            onMouseEnter={() => onHover(c.id)}
            onMouseLeave={() => onHover(null)}
          >
            <span className="w-5 shrink-0 text-right font-mono text-[10px] text-[#E424CE]">
              #{i + 1}
            </span>
            <span className="flex-1 leading-snug text-white">{c.title}</span>
            <span
              className="shrink-0 font-mono text-[10px]"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              {(score * 100).toFixed(0)}%
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RankingSignalMixerEmbed() {
  const [queryId, setQueryId] = useState<string>(DEFAULT_QUERY_ID)
  const [weights, setWeights] = useState({ meaning: 0.5, location: 0.3, timing: 0.2 })
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const query = CANDIDATES.find((c) => c.id === queryId)!

  const ranked = useMemo(() => {
    const total = weights.meaning + weights.location + weights.timing || 1
    return CANDIDATES.filter((c) => c.id !== queryId)
      .map((c) => ({
        c,
        score:
          (c.meaning * weights.meaning +
            c.location * weights.location +
            c.timing * weights.timing) /
          total,
      }))
      .sort((a, b) => b.score - a.score)
  }, [queryId, weights])

  const rankedIds = ranked.map((r) => r.c.id)

  function setWeight(key: keyof typeof weights) {
    return (v: number) => setWeights((w) => ({ ...w, [key]: v }))
  }

  return (
    <div
      style={{ width: '100%', maxWidth: 720, fontFamily: 'Bw Quinta Pro, system-ui, sans-serif' }}
    >
      {/* Map */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: `${VW} / ${VH}` }}>
        <ScatterPlot
          queryId={queryId}
          hoveredId={hoveredId}
          rankedIds={rankedIds}
          onHover={setHoveredId}
          onSelect={setQueryId}
        />
      </div>

      {/* Controls + ranked list */}
      <div className="grid grid-cols-1 gap-4 bg-blue-800 p-4 sm:grid-cols-[200px_1fr]">
        {/* Sliders */}
        <div>
          <div className="mb-2 text-base font-black text-white">Signal weights</div>
          <div className="flex flex-col gap-2">
            <Slider
              label="Meaning"
              value={weights.meaning}
              color="#FBF4EC"
              onChange={setWeight('meaning')}
            />
            <Slider
              label="Location"
              value={weights.location}
              color="#FBF4EC"
              onChange={setWeight('location')}
            />
            <Slider
              label="Timing"
              value={weights.timing}
              color="#FBF4EC"
              onChange={setWeight('timing')}
            />
          </div>
        </div>

        {/* Ranked list */}
        <div>
          <div className="mb-2 text-base font-black text-white">Ranked recommendations</div>
          <RankedList
            ranked={ranked}
            hoveredId={hoveredId}
            onHover={setHoveredId}
            onSelect={setQueryId}
          />
        </div>
      </div>
    </div>
  )
}
