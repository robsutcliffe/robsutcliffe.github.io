'use client'

import Link from '@/components/Link'
import React, { useState } from 'react'
import AnimatedBackground from '@/components/AnimatedBackground'
import { motion } from 'framer-motion'

type ButtonProps = {
  text: string
  href: string
  outline?: boolean
  extraClasses?: string
  lineOpacity?: number
  noPadding?: boolean
  noHeight?: boolean
}

export default function Button({
  text,
  href,
  outline,
  extraClasses,
  lineOpacity = 0.2,
  noPadding = false,
  noHeight = false,
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const isLeftAligned = extraClasses?.includes('justify-start')

  const linkClasses = `${outline ? 'bg-blue-800 text-white ring ring-blue-100 ring-inset' : 'bg-white ring ring-blue-700 ring-inset text-blue-800'} focus-ring relative flex h-12 cursor-pointer flex-row items-center overflow-hidden rounded-sm py-4 text-sm font-bold uppercase transition duration-300 sm:h-16 sm:text-base ${extraClasses}`

  return (
    <div
      className={`flex ${noHeight ? '' : 'h-24 sm:h-32'} w-full items-center ${isLeftAligned ? 'justify-start' : 'justify-end'} ${noPadding ? '' : 'px-4'} lg:px-0`}
    >
      <Link
        href={href}
        onMouseEnter={() => !outline && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => !outline && setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={linkClasses}
      >
        <AnimatedBackground isHovered={isHovered} opacity={lineOpacity} stroke="#080417" />
        <motion.div
          className="relative z-10 flex flex-row items-center"
          initial={{
            gap: '0.5rem',
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          }}
          animate={{
            gap: isHovered ? '1rem' : '0.5rem',
            paddingLeft: isHovered ? '1.25rem' : '1.5rem',
            paddingRight: isHovered ? '1.25rem' : '1.5rem',
          }}
          transition={{ duration: 0.3 }}
        >
          <span>{text}</span>
          {!outline && (
            <div className="">
              <svg className="h-4 w-4 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  fill="#241169"
                  d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </motion.div>
      </Link>
    </div>
  )
}
