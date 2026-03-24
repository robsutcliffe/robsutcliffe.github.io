'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import TextLogo from '@/components/TextLogoSimple'
import AnimatedBackground from '@/components/AnimatedBackground'
import Button from '@/components/Button'
import Link from 'next/link'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const opacityBase = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const opacityBase2 = useTransform(scrollYProgress, [0, 0.5], [1, 0.1])
  const opacityBase3 = useTransform(scrollYProgress, [0, 0.8], [1, 0.5])

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100svh-0.002rem)] overflow-hidden bg-black p-2 text-white md:h-[calc(100svh-0.005rem)] md:p-4 lg:h-[calc(100svh-1.5rem)] lg:p-6"
    >
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url("/static/images/hero/hero.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: opacityBase,
          scale: 1.1,
        }}
        {...(mounted ? { fetchPriority: 'high' } : {})}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: 'url("/static/images/hero/hero-1.webp")',
          opacity: opacityBase2,
          scale: 1.1,
        }}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: 'url("/static/images/hero/hero-2.webp")',
          opacity: opacityBase3,
          scale: 1.1,
        }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <AnimatedBackground stroke="#66427A" opacity="0.3" />

      <div className="bg-primary absolute z-10 m-4 ml-19 h-24 px-4 py-8 sm:py-4 md:ml-23 md:px-6 lg:m-6 lg:ml-27">
        <TextLogo color="#fff" />
      </div>
      <div className="absolute top-1/2 left-32 flex w-full -translate-y-1/2 flex-col px-2 pt-20 md:w-min md:px-4 md:pt-26 lg:px-6">
        <div className="flex min-h-[12rem] flex-col justify-center sm:min-h-[14rem] md:min-h-[16rem] lg:min-h-[20rem]">
          <h2 className="block h-[4.5rem] w-fit bg-blue-800/50 px-6 pt-4 pb-0 text-left font-serif text-2xl leading-normal font-light tracking-tighter text-white [filter:saturate(0.85)_brightness(0.92)] backdrop-blur-sm sm:h-[5.625rem] sm:text-3xl md:h-[6.75rem] md:px-12 md:text-4xl md:whitespace-nowrap lg:h-[9rem] lg:text-5xl">
            Your traffic is there. <br />
            Your conversions aren't.
            <br />I find out why and fix it.
          </h2>
          <p className="w-fit bg-blue-800/50 px-6 pb-6 !font-sans text-sm leading-6 tracking-wide text-cyan-200 [filter:saturate(0.85)_brightness(0.92)] backdrop-blur-sm sm:max-w-2/3 sm:text-base md:max-w-4/5 md:px-12 md:text-lg md:leading-7">
            <Link
              href="/services/shopify-conversion-rate-optimization-sprint"
              className="underline"
            >
              CRO sprints
            </Link>
            , data-driven UX audits, and dashboard readability <br />— for teams that already have
            traffic but need more revenue.
          </p>
        </div>
        <div className="flex w-fit flex-col justify-start bg-blue-800/50 px-6 [filter:saturate(0.85)_brightness(0.92)] backdrop-blur-sm sm:flex-row sm:py-0 md:gap-2 lg:gap-4">
          <div className="pb-4 lg:pb-6">
            <Button
              href="/services"
              text="View services"
              outline={true}
              extraClasses="hover:bg-red-500"
              lineOpacity={0.2}
              noHeight={true}
            />
          </div>
          <div className="pb-4 lg:pb-6">
            <Button
              href="/contact"
              text="Book a call"
              extraClasses="bg-red-500"
              lineOpacity={0.2}
              noHeight={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
