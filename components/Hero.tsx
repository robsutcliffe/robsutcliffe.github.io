'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import TextLogo from '@/components/TextLogoSimple'
import AnimatedBackground from '@/components/AnimatedBackground'
import Button from '@/components/Button'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const opacityBase = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const opacityBase2 = useTransform(scrollYProgress, [0, 0.5], [1, 0.1])
  const opacityBase3 = useTransform(scrollYProgress, [0, 0.8], [1, 0.5])

  return (
    <div
      ref={containerRef}
      className="relative h-[calc(100vh-0.002rem)] overflow-hidden bg-black p-2 text-white md:h-[calc(100vh-0.005rem)] md:p-4 lg:h-[calc(100vh-1.5rem)] lg:p-6"
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
      <div className="absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-2 pt-20 text-center md:w-min md:px-4 md:pt-26 lg:px-6">
        <p className="mx-auto mb-6 w-fit bg-cyan-500/90 px-4 py-2 text-xs font-bold tracking-wide whitespace-nowrap text-cyan-900 uppercase">
          Conversion Optimisation Services
        </p>
        <p className="mx-auto w-fit bg-blue-800/50 px-6 pt-4 pb-0 text-right font-serif text-4xl leading-tight font-light tracking-tight text-white [filter:saturate(0.85)_brightness(0.92)] backdrop-blur-sm sm:text-5xl md:px-12 md:text-7xl md:leading-24 md:whitespace-nowrap lg:text-8xl">
          Convert <i className="text-xl sm:text-2xl md:text-5xl">traffic</i>
        </p>
        <p className="mx-auto w-fit bg-blue-800/50 px-6 pt-2 pb-6 text-right font-serif text-4xl leading-tight font-light tracking-tight text-white [filter:saturate(0.85)_brightness(0.92)] backdrop-blur-sm sm:text-5xl md:px-12 md:text-7xl md:leading-24 md:whitespace-nowrap lg:text-8xl">
          <i className="text-xl sm:text-2xl md:text-5xl">into</i> Loyal Customers
        </p>
        <p className="mx-auto w-fit bg-blue-800/50 px-6 pb-6 !font-sans text-sm leading-6 tracking-wide text-cyan-200 [filter:saturate(0.85)_brightness(0.92)] backdrop-blur-sm sm:max-w-2/3 sm:text-base md:max-w-4/5 md:px-12 md:text-lg md:leading-7">
          Optimisation sprints designed to unlock meaningful revenue growth through testing,
          analysis and iteration
        </p>
        <div className="mx-auto flex w-fit flex-col justify-start bg-blue-800/50 px-6 [filter:saturate(0.85)_brightness(0.92)] backdrop-blur-sm sm:flex-row sm:py-0 md:gap-2 lg:gap-4">
          <div className="pb-4 lg:pb-6">
            <Button
              href="/services"
              text="View services"
              outline={true}
              extraClasses="hover:bg-red-500"
              lineOpacity="0.2"
              noHeight={true}
            />
          </div>
          <div className="pb-4 lg:pb-6">
            <Button
              href="/contact"
              text="Book a call"
              extraClasses="bg-red-500"
              lineOpacity="0.2"
              noHeight={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
