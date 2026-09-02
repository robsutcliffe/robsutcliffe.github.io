'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useMemo, useState } from 'react'

const WaterfallPlot = dynamic(() => import('./WaterfallPlot'), {
  ssr: false,
  loading: () => (
    <div className="flex h-120 w-full items-center justify-center border border-blue-800/20 bg-yellow-100/10 text-xs text-blue-800">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-800/30 border-t-blue-800" />
        <span>Loading...</span>
      </div>
    </div>
  ),
})

const FALLBACK_SPACE_ID = 'firefields/benefit-decision-shap-waterfall'

type BenefitKey = 'snap' | 'wic' | 'ssi' | 'ui' | 'housing' | 'medicaid'

const BENEFIT_LABELS: Record<BenefitKey, string> = {
  snap: 'SNAP',
  wic: 'WIC',
  ssi: 'SSI',
  ui: 'Unemployment Insurance',
  housing: 'Housing Assistance',
  medicaid: 'Medicaid',
}

const BENEFIT_ORDER: BenefitKey[] = ['snap', 'wic', 'ssi', 'ui', 'housing', 'medicaid']

interface ShapFeature {
  feature: string
  label: string
  value: number | string | boolean
  value_str: string
  attribution: number
  cumulative: number
}

interface BenefitPrediction {
  benefit_name: BenefitKey
  predicted_score: number
  population_baseline: number
  shap_values: ShapFeature[]
}

type BenefitResults = Partial<Record<BenefitKey, BenefitPrediction>>

function BenefitTabs({
  results,
  selected,
  onSelect,
}: {
  results: BenefitResults
  selected: BenefitKey
  onSelect: (b: BenefitKey) => void
}) {
  return (
    <div className="mt-4 -mb-0.5 flex w-full flex-wrap border-b border-blue-800">
      {BENEFIT_ORDER.filter((b) => results[b]).map((b) => {
        const entry = results[b]!
        const isSelected = b === selected
        return (
          <button
            key={b}
            type="button"
            onClick={() => onSelect(b)}
            className={`-mr-px flex flex-col items-start border-blue-800 px-3 py-1.5 text-left transition-all ${
              isSelected
                ? '-mt-1.5 border-t border-r border-l bg-white pt-3'
                : 'hover:bg-50/30 border bg-blue-50/50 text-blue-800/70 hover:-mt-1 hover:pt-2.5 hover:text-blue-800/80'
            }`}
          >
            <span className="font-sm flex items-center gap-3 text-base tracking-wide">
              {BENEFIT_LABELS[b]}
              {entry.predicted_score >= 0.7 && (
                <svg
                  className="5 h-4 w-4 shrink-0 text-green-700"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="4 13 9 18 20 6" />
                </svg>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// Builds a Plotly-style waterfall figure from the raw shap_values array,
// in the exact shape WaterfallPlot.getFigure() already parses (mirrors
// what the Hugging Face Space used to send directly as one of its five
// outputs, for a single benefit — now built client-side for whichever
// benefit is selected).
function buildPlotData(entry: BenefitPrediction) {
  const x: string[] = ['Baseline E[f(x)]']
  const y: number[] = [entry.population_baseline * 100]
  const measure: string[] = ['absolute']
  const text: string[] = [`${(entry.population_baseline * 100).toFixed(1)}%`]

  entry.shap_values.forEach((f) => {
    const pts = f.attribution * 100
    x.push(f.label)
    y.push(pts)
    measure.push('relative')
    text.push(`${pts >= 0 ? '+' : ''}${pts.toFixed(1)}%`)
  })

  x.push('Predicted Score f(x)')
  y.push(entry.predicted_score * 100)
  measure.push('total')
  text.push(`${(entry.predicted_score * 100).toFixed(1)}%`)

  return {
    type: 'plotly',
    plot: {
      data: [
        {
          type: 'waterfall',
          x,
          y,
          measure,
          text,
        },
      ],
      layout: {},
    },
  }
}

// Builds the {headers, data} attribution table shape WaterfallPlot's
// extractItems() reads: row[0]=rank, row[1]=feature label, row[2]=value,
// row[3]=attribution text, row[4]=direction.
function buildAttributionData(entry: BenefitPrediction) {
  const headers = [
    'Rank',
    'Feature Description',
    'Household Value',
    'Attribution (pts)',
    'Impact Direction',
  ]
  const data = entry.shap_values.map((f, i) => {
    const pts = f.attribution * 100
    const dir = pts >= 0 ? '▲ Higher Participation' : '▼ Lower Participation'
    return [i + 1, f.label, f.value_str, `${pts >= 0 ? '+' : ''}${pts.toFixed(2)}%`, dir]
  })
  return { headers, data }
}

interface ResultsProps {
  error: string | null
  result: BenefitResults | null
  spaceId?: string
  isLoading: boolean
  runPrediction: () => void
}

export default function Results({
  error,
  result,
  spaceId,
  isLoading,
  runPrediction,
}: ResultsProps) {
  const resolvedSpaceId = spaceId || FALLBACK_SPACE_ID
  const [selectedBenefit, setSelectedBenefit] = useState<BenefitKey>('snap')

  useEffect(() => {
    if (!result && !isLoading) {
      runPrediction()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (result) {
      const firstAvailable = BENEFIT_ORDER.find((b) => result[b])
      if (firstAvailable) setSelectedBenefit(firstAvailable)
    }
  }, [result])

  const selectedEntry = result?.[selectedBenefit]

  const plotData = useMemo(
    () => (selectedEntry ? buildPlotData(selectedEntry) : null),
    [selectedEntry]
  )
  const attributionData = useMemo(
    () => (selectedEntry ? buildAttributionData(selectedEntry) : null),
    [selectedEntry]
  )

  const eligibleList = BENEFIT_ORDER.filter((b) => (result?.[b]?.predicted_score || 0) >= 0.7).map(
    (b) => BENEFIT_LABELS[b]
  )

  return (
    <div className="flex flex-col bg-white lg:col-span-7">
      {/* Error Notice */}
      {error && (
        <div className="m-4 flex items-start gap-3 rounded border border-red-600/50 bg-red-50 p-4 text-red-700">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div className="space-y-1 text-xs">
            <p className="font-bold text-red-800">Execution Error</p>
            <p className="font-mono whitespace-pre-wrap">{error}</p>
            <p className="pt-1 text-[11px] text-blue-800">
              Check if the Space is online at{' '}
              <a
                href={`https://huggingface.co/spaces/${resolvedSpaceId}`}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-blue-700 underline"
              >
                huggingface.co/spaces/{resolvedSpaceId}
              </a>
            </p>
          </div>
        </div>
      )}

      {/* Content Panel */}
      <div className="flex-1 overflow-auto p-5">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-1 flex-col items-center justify-center p-12 text-center text-blue-800">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-800" />
            <h4 className="font-serif text-base font-bold text-blue-900">
              Reviewing your data and generating your report...
            </h4>
            <p className="mt-1 max-w-sm text-xs text-blue-800/70">
              Idnetifying your eligibility for: SNAP, WIC, SSI, UI, Housing, and Medicaid.
            </p>
          </div>
        )}

        {/* Results */}
        {result && !isLoading && (
          <div className="w-full space-y-5">
            {eligibleList[0] && (
              <p className="mb-1 px-1">
                <b>You are eligible for the following benefits: {eligibleList.join(', ')}</b>
              </p>
            )}
            {!eligibleList[0] && (
              <p className="mb-1 px-1">
                <b>You are not eligible for any benefits</b>
              </p>
            )}
            <p className="px-1 pb-2 italic">
              Click on the tabs below to see how much each of your attributes contributed towards
              the decision, a green bar increases your chance of recieving a benefit and a red bar
              reduces your chance. All deductions (red bars) should fit within the green area to be
              eligible for benefits.
            </p>

            <BenefitTabs
              results={result}
              selected={selectedBenefit}
              onSelect={setSelectedBenefit}
            />

            <div className="space-y-5 border border-blue-800">
              <WaterfallPlot plotData={plotData} attributionData={attributionData} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
