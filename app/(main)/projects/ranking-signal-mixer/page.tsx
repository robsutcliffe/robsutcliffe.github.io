'use client'

import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import RankingSignalMixerEmbed from './components/RankingSignalMixerEmbed'

export default function RankingSignalMixer() {
  return (
    <SectionContainer>
      <article>
        <PageTitle>Ranking Signal Mixer</PageTitle>
        <div className="mt-6 w-full">
          <RankingSignalMixerEmbed />
        </div>
      </article>
    </SectionContainer>
  )
}
