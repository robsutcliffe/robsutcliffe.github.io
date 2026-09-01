'use client'

import SectionContainer from '@/components/SectionContainer'
import PageTitle from '@/components/PageTitle'
import TrainingStabilityMeterEmbed from './components/TrainingStabilityMeterEmbed'

export default function TrainingStabilityMeter() {
  return (
    <SectionContainer>
      <article>
        <PageTitle>Training Stability Meter</PageTitle>
        <div className="mt-6 w-full">
          <TrainingStabilityMeterEmbed />
        </div>
      </article>
    </SectionContainer>
  )
}
