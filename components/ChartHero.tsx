'use client'

import { useRef, useState, useEffect } from 'react'
import DotBackground from '@/components/DotBackground'
import FlowChartBackground from '@/components/FlowChartBackground'
import Button from '@/components/Button'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-0.002rem)] min-h-[640px] overflow-hidden bg-cyan-100/50 p-2 pb-0 text-slate-900 md:h-[calc(100vh-0.005rem)] md:p-4 md:pb-0 lg:h-[calc(100vh-1.5rem)] lg:p-6 lg:pb-0"
    >
      <div className="relative h-full w-full pt-24 md:pt-30 lg:pt-36">
        <div className="absolute top-1/2 z-10 w-full -translate-y-1/2">
          <div className="m-6">
            <FlowChartBackground strokeWidth={0.4} className={mounted ? '' : 'invisible'} />
          </div>
          <div className="absolute bottom-[calc(56%)] z-20 w-full text-center xl:bottom-[calc(35%)] xl:left-36 xl:w-auto xl:text-left">
            <h2 className="pb-6 font-serif text-4xl leading-tight font-light tracking-tighter text-cyan-800 sm:text-5xl">
              <span className="text-cyan-600">
                Your traffic is there. <br />
                Your conversions aren't.
              </span>{' '}
              <br />I find out why and fix it.
            </h2>
          </div>
          <div className="absolute top-[calc(68%)] z-20 flex w-full flex-col gap-4 text-center xl:left-36 xl:w-fit xl:text-left 2xl:flex-row 2xl:items-center 2xl:gap-12">
            <p className="mx-auto max-w-2xl font-sans text-sm leading-relaxed font-medium text-cyan-800 md:text-base lg:text-base xl:mx-0">
              CRO sprints, data-driven UX audits, and dashboard readability <br />— for teams that
              already have traffic but need more revenue.
            </p>
            <div className="mx-auto flex w-full flex-row items-start justify-center gap-4 xl:justify-start">
              <div>
                <Button
                  href="/services"
                  text="View services"
                  noPadding={true}
                  outline={true}
                  extraClasses="!text-primary"
                  lineOpacity="0.2"
                  noHeight={true}
                />
              </div>
              <div>
                <Button
                  href="/contact"
                  text="Book a call"
                  noPadding={true}
                  extraClasses="bg-red-500"
                  lineOpacity="0.2"
                  noHeight={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <DotBackground fill="#115669" opacity="0.2" />
    </div>
  )
}
