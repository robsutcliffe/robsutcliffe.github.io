'use client'

import { useRef } from 'react'
import CircleBackground from '@/components/CircleBackground'
import Button from '@/components/Button'
import DotBackground from '@/components/DotBackground'
import Link from 'next/link'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative m-4 flex h-[calc(100svh-2rem)] items-center overflow-hidden bg-blue-800 md:mb-0"
    >
      <CircleBackground />
      <div className="absolute top-22 bottom-0 flex w-full items-center sm:top-26 md:top-28 lg:top-30">
        <div className="z-10 flex min-h-[16rem] w-full flex-col justify-center gap-4 px-4 text-center sm:min-h-[22rem] md:min-h-[26rem] lg:min-h-[30rem]">
          <h2 className="!my-0 block h-[6rem] text-2xl leading-8 font-normal tracking-tight text-yellow-200 sm:h-[9rem] sm:text-4xl sm:leading-12 md:h-[10.5rem] md:text-5xl md:leading-14 lg:h-[12rem] lg:text-6xl lg:leading-16">
            Your traffic is there. <br />
            Your conversions aren't.
            <br />I find out why and fix it.
          </h2>
          <p className="mx-auto max-w-2xl px-4 font-sans text-xs leading-6 font-bold text-yellow-50 sm:text-base sm:leading-8 lg:font-medium xl:bg-transparent xl:px-0">
            <Link
              href="/services/shopify-conversion-rate-optimization-sprint"
              className="underline"
            >
              Conversion Rate Optimisation
            </Link>
            ,{' '}
            <Link href="/services/shopify-data-analytics-dashboard-sprint" className="underline">
              Data Analytics Dashboards,
            </Link>{' '}
            and{' '}
            <Link href="/services/shopify-speed-optimization-sprint" className="underline lg:mr-6">
              Web Performance Tuning
            </Link>
            — for teams that already have traffic but need more revenue.
          </p>
          <div className="mx-auto flex w-full flex-row items-start justify-center gap-4">
            <div>
              <Button
                href="/services"
                text="View services"
                noPadding={true}
                outline={true}
                lineOpacity={0.2}
                noHeight={true}
              />
            </div>
            <div>
              <Button
                href="/contact"
                text="Book a call"
                noPadding={true}
                lineOpacity={0.2}
                noHeight={true}
              />
            </div>
          </div>
        </div>
      </div>
      <DotBackground fill="#ffffff" opacity="0.1" />
    </div>
  )
}
