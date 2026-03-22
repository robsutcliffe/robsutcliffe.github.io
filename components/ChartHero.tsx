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
      className="relative h-[calc(100svh-0.002rem)] min-h-[700px] min-w-[420px] overflow-hidden bg-yellow-100 p-2 pb-0 md:h-[calc(100svh-0.005rem)] md:p-4 md:pb-0 lg:h-[calc(100svh-1.5rem)] lg:p-6 lg:pb-0"
    >
      <div className="relative h-full w-full md:-mt-6 xl:mt-6">
        <div className="absolute top-24 z-20 w-full px-4 text-center md:top-16 xl:top-auto xl:bottom-[calc(35%)] xl:left-36 xl:w-auto xl:px-0 xl:text-left">
          <h2 className="pb-6 font-serif text-3xl leading-relaxed tracking-tighter text-red-500 md:text-4xl lg:text-5xl lg:leading-tight lg:font-light">
            <span className="text-blue-800">
              Your traffic is there. <br />
              Your conversions aren't.
            </span>{' '}
            <br />I find out why and fix it.
          </h2>
        </div>
        <div className="absolute top-1/2 z-10 w-full -translate-y-1/2">
          <div className="m-6">
            <FlowChartBackground strokeWidth={0.25} className={mounted ? '' : 'invisible'} />
          </div>

          <div className="absolute -bottom-20 z-20 flex w-full flex-col gap-4 text-center lg:-bottom-14 xl:top-[calc(68%)] xl:bottom-auto xl:left-36 xl:w-fit xl:text-left 2xl:flex-row 2xl:items-center 2xl:gap-12">
            <p className="mx-auto max-w-2xl bg-yellow-100 px-4 font-sans text-xs leading-relaxed font-bold text-blue-800 md:text-sm lg:text-base lg:font-medium xl:mx-0 xl:bg-transparent xl:px-0">
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
