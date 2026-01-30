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
  lineOpacity?: string
  noHeight?: boolean
}

export default function Button({
  text,
  href,
  outline,
  extraClasses,
  lineOpacity = '0.4',
  noHeight = false,
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const isLeftAligned = extraClasses?.includes('justify-start')

  return (
    <div
      className={`flex ${noHeight ? '' : 'h-24'} w-full items-center ${isLeftAligned ? 'justify-start' : 'justify-end'} px-4 lg:px-0`}
    >
      <Link
        href={href}
        onMouseEnter={() => !outline && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => !outline && setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className={`${outline ? 'ring ring-red-500 ring-inset' : 'bg-blue-500'} focus-ring relative flex cursor-pointer flex-row items-center overflow-hidden rounded-xs py-4 text-white transition duration-300 ${extraClasses}`}
      >
        <AnimatedBackground isHovered={isHovered} opacity={lineOpacity} stroke="#080417" />
        <motion.div
          className="relative z-10 flex flex-row items-center"
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
                  fill="#ffffff"
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
