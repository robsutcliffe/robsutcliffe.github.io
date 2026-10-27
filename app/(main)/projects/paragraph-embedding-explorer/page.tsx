'use client'

import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import ParagraphEmbeddingExplorerEmbed from './components/ParagraphEmbeddingExplorerEmbed'

export default function ParagraphEmbeddingExplorer() {
  return (
    <SectionContainer>
      <article>
        <PageTitle>Paragraph Embedding Explorer</PageTitle>
        <div className="mt-6 w-full">
          <ParagraphEmbeddingExplorerEmbed />
        </div>
      </article>
    </SectionContainer>
  )
}
