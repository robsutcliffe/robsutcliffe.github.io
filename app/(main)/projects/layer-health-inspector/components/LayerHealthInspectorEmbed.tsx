'use client'

import { useState, useMemo, useEffect } from 'react'
import HelpTip from '@/components/help-tip'
import OverallStats from './OverallStats'
import NetworkOverview from './NetworkOverview'
import LayerDetail from './LayerDetail'
import { bestCandidate, recommend } from '../lib/recommend'
import type { Dataset, Layer } from '../lib/types'
import dataSet from '@/data/projects/layer_health_inspector_dataset.json'

export default function LayerHealthInspectorEmbed() {
  const [selectedId, setSelectedId] = useState<string | null>('layer_01')
  const [keep, setKeep] = useState<number | null>(null)

  const data = dataSet as Dataset

  const best = useMemo(
    () => (data ? bestCandidate(data.layers, (l) => l.numerical_rank_at_threshold) : null),
    [data]
  )

  const layer: Layer | null = data?.layers.find((l) => l.id === selectedId) ?? null

  useEffect(() => {
    if (layer) {
      const live = layer.numerical_rank_at_threshold
      setKeep(recommend(layer.size, live, layer.type).recommended)
    }
  }, [selectedId])

  return (
    <div className="w-full">
      <OverallStats layers={data.layers} onSelect={setSelectedId} />
      <section className="border-t border-blue-950">
        <div className="flex items-center justify-between bg-blue-800 px-1 py-3 text-xs tracking-widest text-blue-500 uppercase">
          <span className="flex items-center gap-1 px-6 text-[0.65rem] font-black tracking-wide text-white uppercase md:text-sm">
            Model overview
            <HelpTip term="overview" />
          </span>
        </div>
        {layer && (
          <NetworkOverview layers={data.layers} selectedId={layer.id} onSelect={setSelectedId} />
        )}
        {layer && keep && (
          <section className="border-r border-b border-l border-blue-800 p-5 shadow-sm">
            <LayerDetail layer={layer} keep={keep} onKeepChange={setKeep} />
          </section>
        )}
      </section>
    </div>
  )
}
