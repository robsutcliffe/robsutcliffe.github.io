'use client'

import Link from 'next/link'
import AnimatedBackground from '@/components/AnimatedBackground'
import React from 'react'
import { motion } from 'framer-motion'

export default function BigButton({ text, href }) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <Link
      href={href}
      className="group text-ff-navy relative flex h-24 w-full cursor-pointer flex-row overflow-hidden bg-white font-bold"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/*<AnimatedBackground isHovered={isHovered} opacity="0.1" stroke="#061E2A" />*/}
      <div className="relative z-10 flex-1 px-8 py-4 text-3xl leading-16 group-hover:underline">
        {text}
      </div>
      <div className="bg-ff-navy group-hover:bg-secondary relative flex flex-row transition duration-300">
        <AnimatedBackground isHovered={isHovered} opacity="0.3" stroke="#061E2A" />
        <motion.div
          initial="initial"
          animate={isHovered ? 'hover' : 'initial'}
          variants={{
            initial: { width: 0, opacity: 0, marginLeft: 0 },
            hover: { width: 'auto', opacity: 1, marginLeft: 28 },
          }}
          className="relative z-10 overflow-hidden leading-24 whitespace-nowrap text-white"
        >
          View All
        </motion.div>
        <div className="relative z-10 flex h-24 w-24 items-center justify-center">
          <svg className="h-8 w-8 rotate-90" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              fill="#ffffff"
              d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </Link>
  )
}
