'use client'

import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import EmbeddingSpaceExplorerEmbed from './components/EmbeddingSpaceExplorerEmbed'

export default function EmbeddingSpaceExplorer() {
  return (
    <SectionContainer>
      <article>
        <PageTitle>Embedding Space Explorer</PageTitle>
        <div className="mt-6 w-full">
          <EmbeddingSpaceExplorerEmbed />
        </div>
      </article>
    </SectionContainer>
  )
}
