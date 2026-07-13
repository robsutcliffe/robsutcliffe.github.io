'use client'

import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import OverallStats from './components/OverallStats'
import dataSet from '@/data/projects/layer_health_inspector_dataset.json'
import { useState, useMemo, useEffect } from 'react'
import HelpTip from '@/components/help-tip'
import NetworkOverview from './components/NetworkOverview'
import LayerDetail from './components/LayerDetail'
import { bestCandidate, recommend, OPPORTUNITY_STYLE } from './lib/recommend'
import type { Dataset, Layer } from './lib/types'

export default function LayerHealthInspector() {
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
      // Start the cut at the recommended test width (the buffer above the live
      // directions); drag can move it anywhere from 1 up to the current width.
      const live = layer.numerical_rank_at_threshold
      setKeep(recommend(layer.size, live, layer.type).recommended)
    }
  }, [selectedId])

  return (
    <SectionContainer>
      <article>
        <PageTitle>Layer Health Inspector</PageTitle>
        <p className="mb-4 max-w-3xl text-sm leading-5 text-blue-800 sm:text-base sm:leading-6 md:leading-8 lg:text-lg">
          <i className="font-bold">
            Each layer reserves a fixed width, but many use far fewer live directions
          </i>{' '}
          than they reserve. This tool flags where that spare capacity is and what width to test
          shrinking to first.
        </p>
        <p>
          Prototype of a tool to analyze the health of layers in a neural network model. Uses mock
          data to similate an image recognision model, tool has exagerated wasted dimensions on some
          layers to visualise how a layer health check tool may look.
        </p>
        <div className="mt-6 w-full">
          <OverallStats layers={data.layers} onSelect={setSelectedId} />
          <section className="border-t border-blue-950">
            <div className="flex items-center justify-between bg-blue-800 px-1 py-3 text-xs tracking-widest text-blue-500 uppercase">
              <span className="flex items-center gap-1 px-6 text-sm font-black tracking-wide text-white uppercase">
                Model overview
                <HelpTip term="overview" align="start" />
              </span>
            </div>
            {layer && (
              <NetworkOverview
                layers={data.layers}
                selectedId={layer.id}
                onSelect={setSelectedId}
              />
            )}
            {layer && keep && (
              <section className="border-r border-b border-l border-blue-800 p-5 shadow-sm">
                <LayerDetail layer={layer} keep={keep} onKeepChange={setKeep} />
              </section>
            )}
          </section>
        </div>
      </article>
    </SectionContainer>
  )
}
