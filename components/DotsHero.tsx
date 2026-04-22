'use client'

import dynamic from 'next/dynamic'
import { useRef, Suspense } from 'react'
import Button from '@/components/Button'
import DotBackground from '@/components/DotBackground'
import Link from 'next/link'

const CircleBackground = dynamic(() => import('@/components/CircleBackground'), {
  ssr: false,
})

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className="relative m-4 flex h-[calc(100svh-2rem)] min-h-[600px] items-center overflow-hidden bg-blue-800 md:mb-0"
    >
      <Suspense fallback={null}>
        <CircleBackground />
      </Suspense>
      <div className="absolute top-22 bottom-0 flex w-full items-center sm:top-26 md:top-28 lg:top-30">
        <div className="z-10 flex w-full flex-col justify-center gap-2 px-8 text-center md:gap-4">
          <h2 className="!my-0 block text-4xl leading-10 font-normal tracking-tighter text-yellow-200 md:text-5xl md:leading-14 lg:text-6xl lg:leading-16">
            Interpretability{' '}
            <span className="-pt-[0.3em] -mx-[0.05em] text-[1.3em] font-light">&</span>{' '}
            Observability <br className="responsive" />
            Interfaces <i>for</i> AI Products.
          </h2>
          <p className="mx-auto max-w-2xl px-4 font-sans text-sm leading-6 font-bold text-yellow-50 md:text-base lg:font-medium xl:px-0">
            I'm Rob Sutcliffe — a data visualisation engineer with 20 years of frontend craft,
            <br className="responsive" /> now focused on making machine learning models legible to
            the people who use and audit them.
          </p>
          <div className="mx-auto flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
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
