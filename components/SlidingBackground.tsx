'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SlidingBackground = ({ isHovered = false, className = '' }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ x: '-110%', skewX: -45 }}
            animate={{ x: '-10%', skewX: -45 }}
            exit={{ x: '110%', skewX: -45 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-y-0 -left-1/4 w-[150%] bg-blue-800"
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default SlidingBackground
