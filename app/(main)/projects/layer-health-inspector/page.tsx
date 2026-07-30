'use client'

import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import LayerHealthInspectorEmbed from './components/LayerHealthInspectorEmbed'

export default function LayerHealthInspector() {
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
          <LayerHealthInspectorEmbed />
        </div>
      </article>
    </SectionContainer>
  )
}
