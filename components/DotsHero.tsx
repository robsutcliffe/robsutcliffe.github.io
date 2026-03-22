'use client'

import { useRef, useState, useEffect } from 'react'
import CircleBackground from '@/components/CircleBackground'
import Button from '@/components/Button'
import DotBackground from '@/components/DotBackground'
import Link from 'next/link'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative m-2 mb-0 flex h-[calc(100dvh-1rem)] min-h-72 min-w-[320px] items-center overflow-hidden bg-blue-800 md:m-4 md:mb-0 md:h-[calc(100dvh-2rem)] lg:m-6 lg:mb-0 lg:h-[calc(100dvh-3rem)]"
    >
      <CircleBackground />
      <div className="absolute top-26 bottom-0 flex w-full items-center md:top-28 lg:top-30">
        <div className="z-10 flex w-full flex-col gap-6 text-center">
          <h2 className="!my-0 text-2xl leading-8 font-normal tracking-tight text-yellow-200 sm:text-4xl sm:leading-12 md:text-5xl md:leading-14 lg:text-6xl lg:leading-16">
            Your traffic is there. <br />
            Your conversions aren't.
            <br />I find out why and fix it.
          </h2>
          <p className="mx-auto max-w-2xl px-4 font-sans text-xs leading-relaxed font-bold text-yellow-50 sm:text-sm md:text-base lg:font-medium xl:bg-transparent xl:px-0">
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
            <Link href="/services/shopify-speed-optimization-sprint" className="underline">
              Web Performance Tuning
            </Link>
            <br />— for teams that already have traffic but need more revenue.
          </p>
          <div className="mx-auto flex w-full flex-row items-start justify-center gap-4">
            <div>
              <Button
                href="/services"
                text="View services"
                noPadding={true}
                outline={true}
                extraClasses="!text-white !bg-blue-800"
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
      <DotBackground fill="#ffffff" opacity="0.1" />
    </div>
  )
}
