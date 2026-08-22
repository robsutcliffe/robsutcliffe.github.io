'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Data Generation ────────────────────────────────────────────────────────

// Condition number per step (κ)
const conditionNumbers = [
  120,
  210,
  380,
  490,
  610,
  730,
  820,
  910,
  980,
  995, // Steps 1-10: stable <1000
  3200,
  8500,
  12000, // Steps 11-13: warning ~1.2e4
  45000,
  88000,
  120000,
  140000, // Steps 14-17: critical ~1.4e5
  Infinity,
  Infinity,
  Infinity, // Steps 18-20: failed NaN
]

// Loss values per step (unused — kept for reference)
const _lossValues = [
  2.85,
  2.61,
  2.34,
  2.12,
  1.93,
  1.78,
  1.65,
  1.54,
  1.46,
  1.41, // stable
  1.52,
  1.71,
  2.1, // warning (rising)
  3.4,
  5.8,
  9.2,
  18.5, // critical (exploding)
  NaN,
  NaN,
  NaN, // failed
]

// Gradient norm point cloud per step
function generateGradientPoints(step: number) {
  const s = step - 1
  const points = []
  const count = 60

  let spread
  if (s < 10) {
    spread = 0.04 + s * 0.006
  } else if (s < 13) {
    spread = 0.1 + (s - 10) * 0.15
  } else if (s < 17) {
    spread = 0.55 + (s - 13) * 0.4
  } else {
    spread = 2.5
  }

  const centerX = 0.5 as const
  const centerY = 0.5 as const

  for (let i = 0; i < count; i++) {
    const u1 = Math.random()
    const u2 = Math.random()
    const z0 = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.cos(2 * Math.PI * u2)
    const z1 = Math.sqrt(-2 * Math.log(Math.max(u1, 1e-10))) * Math.sin(2 * Math.PI * u2)
    // @ts-ignore
    points.push({
      x: Math.max(0.02, Math.min(0.98, centerX + z0 * spread * 0.25)),
      y: Math.max(0.02, Math.min(0.98, centerY + z1 * spread * 0.25)),
    })
  }
  return points
}

const _gradientClouds = Array.from({ length: 20 }, (_, i) => generateGradientPoints(i + 1))

// ─── Status helpers ─────────────────────────────────────────────────────────

function getStatus(step: number) {
  if (step <= 10) return 'STABLE'
  if (step <= 13) return 'WARNING'
  if (step <= 17) return 'CRITICAL'
  return 'FAILED'
}

const statusConfig = {
  STABLE: {
    label: 'STABLE',
    bg: 'bg-green-500/20',
    text: 'text-green-600',
    border: 'border-green-500/50',
    dot: 'bg-green-600',
  },
  WARNING: {
    label: 'WARNING',
    bg: 'bg-yellow-300/20',
    text: 'text-yellow-600',
    border: 'border-yellow-500/70',
    dot: 'bg-yellow-600',
  },
  CRITICAL: {
    label: 'CRITICAL',
    bg: 'bg-red-500/20',
    text: 'text-red-600',
    border: 'border-red-600/70',
    dot: 'bg-red-600',
  },
  FAILED: {
    label: 'FAILED',
    bg: 'bg-red-500/20',
    text: 'text-red-600',
    border: 'border-red-600/70',
    dot: 'bg-red-600',
  },
}

// ─── Condition Number Bar ────────────────────────────────────────────────────

function ConditionBar({ step }: { step: number }) {
  const kappa = conditionNumbers[step - 1]
  const isNaN_ = !isFinite(kappa)

  const logMin = Math.log10(100)
  const logMax = Math.log10(1e6)
  const logVal = isNaN_ ? logMax : Math.log10(Math.max(100, kappa))
  const fraction = Math.min(1, Math.max(0, (logVal - logMin) / (logMax - logMin)))

  const status = getStatus(step)
  const barColor = {
    STABLE: '#46C34C',
    WARNING: '#AEC43E',
    CRITICAL: '#C3381E',
    FAILED: '#C3381E',
  }[status]

  const displayKappa = isNaN_
    ? 'NaN'
    : kappa >= 1e5
      ? `${(kappa / 1e5).toFixed(1)}×10⁵`
      : kappa >= 1e4
        ? `${(kappa / 1e4).toFixed(1)}×10⁴`
        : kappa >= 1e3
          ? `${(kappa / 1e3).toFixed(1)}×10³`
          : kappa.toFixed(0)

  return (
    <div className="flex flex-1 items-center gap-3">
      <span className="text-sm font-semibold whitespace-nowrap">κ Condition:</span>
      <span className="text-right font-mono text-sm font-bold" style={{ color: barColor }}>
        {displayKappa}
      </span>
    </div>
  )
}

// ─── Panel C: Loss Landscape ────────────────────────────────────────────────

function buildLandscapeCurve(step: number, totalPoints = 120) {
  const s = step - 1
  const curve = []

  const ph1 = s * 0.71
  const ph2 = s * 1.37
  const ph3 = s * 0.53

  const bowlDepth = s < 10 ? 2.2 : Math.max(0.8, 2.2 - (s - 9) * 0.12)

  const rippleAmp =
    s < 10 ? 0.04 + s * 0.018 : s < 14 ? 0.22 + (s - 10) * 0.18 : 0.94 + (s - 14) * 0.22

  const ridgeAmp = s < 10 ? 0 : s < 14 ? (s - 10) * 0.07 : 0.28 + (s - 14) * 0.14

  for (let i = 0; i < totalPoints; i++) {
    const t = (i / (totalPoints - 1)) * 2 - 1
    let loss = 1.4 + bowlDepth * t * t
    loss += rippleAmp * Math.sin(4.5 * t + ph1)
    loss += rippleAmp * 0.4 * Math.sin(11 * t + ph2)
    if (s >= 10) loss += ridgeAmp * Math.abs(Math.sin(8 * t + ph1))
    if (s >= 17) loss += 1.6 * Math.sin(18 * t + ph3) * Math.cos(7 * t + ph2)
    // @ts-ignore
    curve.push({ t, loss })
  }
  return curve
}

const landscapeCurves = Array.from({ length: 20 }, (_, i) => buildLandscapeCurve(i + 1))

function stepToT(step: number) {
  if (step <= 10) return -0.05 + (step - 1) * 0.008
  if (step <= 17) return 0.03 + (step - 10) * 0.12
  return 0.87 + (step - 17) * 0.06
}

function LossLandscape({ step }: { step: number }) {
  const W = 340,
    H = 210
  const padL = 46,
    padR = 18,
    padT = 18,
    padB = 32
  const chartW = W - padL - padR
  const chartH = H - padT - padB

  const landscape = landscapeCurves[step - 1]
  // @ts-ignore
  const allLoss = landscape.map((p) => p.loss)
  const minL = Math.min(...allLoss)
  const maxL = Math.max(...allLoss)

  function toX(t: number) {
    return padL + ((t + 1) / 2) * chartW
  }
  function toY(l: number) {
    return padT + chartH - ((l - minL) / (maxL - minL)) * chartH
  }

  // @ts-ignore
  const curvePoints = landscape.map((p) => `${toX(p.t)},${toY(p.loss)}`).join(' ')

  const tNow = stepToT(step)
  const tPrev = step > 1 ? stepToT(step - 1) : null

  function lossAtT(t: number) {
    const idx = Math.round(((t + 1) / 2) * (landscape.length - 1))
    const clamped = Math.max(0, Math.min(landscape.length - 1, idx))
    // @ts-ignore
    return landscape[clamped].loss
  }

  const prevLandscape = step > 1 ? landscapeCurves[step - 2] : null
  function lossAtTPrev(_t: number) {
    if (!prevLandscape) return null
    const idx = Math.round(((_t + 1) / 2) * (prevLandscape.length - 1))
    const clamped = Math.max(0, Math.min(prevLandscape.length - 1, idx))
    // @ts-ignore
    return prevLandscape[clamped].loss
  }

  const lossNow = lossAtT(tNow)
  const lossPrev: number | null = tPrev !== null ? lossAtT(tPrev) : null

  const status = getStatus(step)
  const dotColor = {
    STABLE: '#46C34C',
    WARNING: '#AEC43E',
    CRITICAL: '#C3381E',
    FAILED: '#C3381E',
  }[status]

  const yTicks = 5
  const yTickVals = Array.from(
    { length: yTicks },
    (_, i) => minL + (i / (yTicks - 1)) * (maxL - minL)
  )
  const xTickVals = [-1, -0.5, 0, 0.5, 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {/* Plot area background */}
      <rect x={padL} y={padT} width={chartW} height={chartH} fill="#E424CE" opacity={0.03} />

      {yTickVals.map((v, i) => {
        const isFirst = i === 0
        const isLast = i === yTicks - 1
        const isMiddle = i === Math.floor(yTicks / 2)
        const highlighted = isFirst || isLast || isMiddle
        return (
          <g key={v}>
            <line
              x1={padL}
              y1={toY(v)}
              x2={W - padR}
              y2={toY(v)}
              stroke="#E424CE"
              opacity={0.05}
              strokeWidth="0.35"
            />
            <line
              x1={isFirst || isLast ? padL + 5 : padL}
              y1={toY(v)}
              x2={highlighted ? padL - 7 : padL - 4}
              y2={toY(v)}
              stroke="#241169"
              strokeWidth={0.35}
            />
            <text x={padL - 9} y={toY(v) + 1.5} fill="#241169" fontSize="4.25" textAnchor="end">
              {v.toFixed(1)}
            </text>
          </g>
        )
      })}
      {xTickVals.map((t, i) => {
        const isFirst = i === 0
        const isLast = i === xTickVals.length - 1
        const isMiddle = i === Math.floor(xTickVals.length / 2)
        const highlighted = isFirst || isLast || isMiddle
        return (
          <g key={t}>
            <line
              x1={toX(t)}
              y1={padT}
              x2={toX(t)}
              y2={H - padB}
              stroke="#E424CE"
              opacity={0.05}
              strokeWidth="0.35"
            />
            <line
              x1={toX(t)}
              y1={isFirst || isLast ? H - padB - 5 : H - padB}
              x2={toX(t)}
              y2={highlighted ? H - padB + 7 : H - padB + 4}
              stroke="#241169"
              strokeWidth={0.35}
            />
            <text x={toX(t)} y={H - padB + 10} fill="#241169" fontSize="4.25" textAnchor="middle">
              {t.toFixed(1)}
            </text>
          </g>
        )
      })}

      <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#241169" strokeWidth="0.35" />
      <line
        x1={padL}
        y1={H - padB}
        x2={W - padR}
        y2={H - padB}
        stroke="#241169"
        strokeWidth="0.35"
      />

      <polyline
        points={curvePoints}
        fill="none"
        stroke="#E424CE"
        strokeWidth="0.35"
        strokeLinejoin="round"
      />

      {tPrev !== null && lossPrev !== null && (
        <line
          x1={toX(tPrev)}
          y1={toY(lossPrev)}
          x2={toX(tNow)}
          y2={toY(lossNow)}
          stroke={dotColor}
          strokeWidth="0.35"
          strokeDasharray="4 3"
          strokeOpacity="0.7"
        />
      )}

      {tPrev !== null && lossPrev !== null && (
        <circle
          cx={toX(tPrev)}
          cy={toY(lossPrev)}
          r="2"
          fill="#FCE9F7"
          stroke="#E424CE"
          strokeWidth="0.35"
          strokeOpacity="0.4"
        />
      )}

      <circle
        cx={toX(tNow)}
        cy={toY(lossNow)}
        r="3"
        fill="#FCE9F7"
        stroke="#E424CE"
        strokeWidth="0.75"
      />

      <text
        x={padL + chartW / 2}
        y={H - padB + 20}
        fill="#241169"
        fontSize="6.75"
        fontWeight="bold"
        textAnchor="middle"
      >
        Filter-Normalized Direction
      </text>
      <text
        x={18}
        y={padT + chartH / 2}
        fill="#241169"
        fontSize="6.75"
        fontWeight="bold"
        textAnchor="middle"
        transform={`rotate(-90, 18, ${padT + chartH / 2})`}
      >
        Loss
      </text>
    </svg>
  )
}

// ─── Panel D: Prescriptive Card ──────────────────────────────────────────────

function PrescriptiveCard({ step }: { step: number }) {
  const status = getStatus(step)

  const content = {
    STABLE: {
      metric: 'Condition Number within optimal range (<1,000). Loss landscape: smooth convex bowl.',
      diagnosis: null,
      recommendations: [
        'No action required. The loss surface shows a well-defined single minimum — the optimizer is converging cleanly along the filter-normalized direction.',
      ],
      icon: '✅',
    },
    WARNING: {
      metric:
        'Condition Number rising rapidly (1.2 × 10⁴). Loss landscape: bowl flattening, ripples forming.',
      diagnosis:
        'The loss surface is losing its clean convex shape — visible ripples on the landscape indicate growing sensitivity to step direction. The optimizer is beginning to oscillate near the ridge.',
      recommendations: [
        'Apply Gradient Clipping (max_norm = 1.0): the sharp ridges now visible on the landscape will cause gradient spikes without clipping.',
        'Switch optimizer from SGD to AdamW: adaptive per-parameter rates compensate for the uneven curvature shown on the loss surface.',
        'Reduce learning rate by 2×: the flattening bowl means the current step size is too large relative to the narrowing basin.',
      ],
      icon: '⚠️',
    },
    CRITICAL: {
      metric:
        'Condition Number exceeded threshold (1.4 × 10⁵). Loss landscape: chaotic ridges and multiple sharp local minima.',
      diagnosis:
        'The loss surface now shows steep walls and multiple local traps — the optimizer has left the convex basin and is navigating highly non-convex terrain. Layer dynamic range is exceeding FP16/BF16 precision bounds.',
      recommendations: [
        'Inject Layer Normalization before Layer 4: this re-smooths the loss surface by normalising activations that are creating the sharp ridges visible on the landscape.',
        'Reduce global learning rate by 10× immediately: the chaotic landscape means any large step will bounce between walls rather than descend.',
        'Cast layer parameters to FP32: the extreme curvature visible at the landscape edges indicates values close to overflow — higher precision prevents silent NaN propagation.',
      ],
      icon: '🔴',
    },
    FAILED: {
      metric: 'Loss = NaN. Training collapsed. Loss landscape: surface undefined / fully chaotic.',
      diagnosis:
        'Numerical overflow occurred at step 18. The landscape is no longer a meaningful surface — gradients have overflowed and the optimizer has no valid signal to follow.',
      recommendations: [
        'Restore from Checkpoint Step 12 with Gradient Clipping (max_norm = 1.0) and Layer Normalization active — that was the last batch where the loss surface retained a clear minimum.',
        'Enable mixed-precision loss scaling (GradScaler) to prevent future FP16 overflow even when the landscape becomes steep.',
      ],
      icon: '💀',
    },
  }[status]

  return (
    <div className={`flex flex-col gap-4`}>
      <div className="-mb-4 font-serif text-lg font-bold">Metric</div>
      <div className={`text-sm font-medium`}>{content.metric}</div>

      {content.diagnosis && (
        <>
          <div className="-mb-4 font-serif text-lg font-bold">Diagnosis</div>
          <div className="text-sm font-medium">{content.diagnosis}</div>
        </>
      )}

      <div className="flex-1">
        <div className="mb-1 font-serif text-lg font-bold">
          {content.recommendations.length > 1 ? 'Recommendations' : 'Recommendation'}
        </div>
        <div className="flex flex-col gap-2">
          {content.recommendations.map((rec, i) => (
            <div key={i} className={`flex gap-3 rounded border border-yellow-400/50 p-3`}>
              <span className="text-sm leading-snug font-medium">{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function TrainingStabilityMeter() {
  const [step, setStep] = useState(1)
  const [playing, setPlaying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const tick = useCallback(() => {
    setStep((s) => {
      if (s >= 20) {
        setPlaying(false)
        return s
      }
      return s + 1
    })
  }, [])

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      clearInterval(intervalRef.current ?? undefined)
    }
    return () => clearInterval(intervalRef.current ?? undefined)
  }, [playing, tick])

  const handleReset = () => {
    setPlaying(false)
    setStep(1)
  }

  const status = getStatus(step)
  const sc = statusConfig[status]

  return (
    <div className="flex flex-col border border-blue-800 text-blue-800">
      {/* Control Bar */}
      <div className="bg-blue-800 px-6 py-2">
        <div className="flex flex-wrap items-center justify-between gap-5">
          {/* Step counter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-blue-100">Batch: </span>
            <span className="font-mono text-lg font-bold text-white">
              {String(step).padStart(2, '0')}
            </span>
            <span className="text-sm text-blue-200">/ 20</span>
          </div>

          {/* Play/Pause */}
          <div className="flex gap-2">
            <button
              onClick={() => setPlaying((p) => !p)}
              disabled={step >= 20 && !playing}
              className={`flex items-center gap-2 rounded px-4 py-2 text-sm font-semibold transition-colors ${
                step >= 20 && !playing
                  ? 'cursor-not-allowed border border-cyan-300/20 bg-cyan-500/10 text-cyan-100/30'
                  : playing
                    ? 'cursor-pointer border border-yellow-300/40 bg-yellow-500/20 text-yellow-100 hover:bg-yellow-500/30'
                    : 'cursor-pointer border border-cyan-300/60 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30'
              }`}
            >
              {playing ? (
                <>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <rect x="5" y="4" width="3" height="12" rx="1" />
                    <rect x="12" y="4" width="3" height="12" rx="1" />
                  </svg>
                  Pause
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                  Play
                </>
              )}
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              disabled={step === 1}
              className={`flex items-center gap-2 rounded border px-4 py-2 text-sm font-semibold transition-colors ${
                step === 1
                  ? 'cursor-not-allowed border-cyan-300/20 bg-cyan-500/10 text-cyan-100/30'
                  : 'cursor-pointer border-cyan-300/60 bg-cyan-500/20 text-cyan-100 hover:bg-cyan-500/30'
              }`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className="bg-blue-700 px-6 py-2">
        <input
          type="range"
          min={1}
          max={20}
          value={step}
          onChange={(e) => {
            setPlaying(false)
            setStep(Number(e.target.value))
          }}
          className="h-2 w-full cursor-pointer appearance-none rounded-full accent-white"
          style={{
            background: `linear-gradient(to right, #2563eb ${((step - 1) / 19) * 100}%, #172554 ${((step - 1) / 19) * 100}%)`,
          }}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 overflow-hidden md:grid-cols-3">
        {/* Panel C: Loss Landscape */}
        <div className="overflow-hidden border-b border-blue-800 p-6 md:col-start-1 md:col-end-3 md:border-r md:border-b-0">
          <LossLandscape step={step} />
        </div>

        {/* Panel D: Prescriptive Card */}
        <div className="md:relative">
          <div className="flex flex-col overflow-hidden md:absolute md:inset-0">
            <div className="flex gap-2 border-b border-blue-800 bg-yellow-100/50 px-6 py-4">
              <ConditionBar step={step} />
              <div
                className={`flex items-center gap-2 rounded-full border px-1 py-0.5 text-xs font-semibold ${sc.bg} ${sc.text} ${sc.border}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${sc.dot} ${status === 'FAILED' ? '' : 'animate-pulse'}`}
                />
                {sc.label}
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-yellow-100/20 p-6">
              <PrescriptiveCard step={step} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
