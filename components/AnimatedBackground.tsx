'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const AnimatedBackground = ({
  stroke = '#136988',
  opacity = '0.3',
  isHovered = true,
  className = 'z-0',
}) => {
  const id = React.useId()
  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          className={`absolute inset-0 overflow-hidden ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <svg
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            <defs>
              <pattern
                id={`diagonal-lines-${id}`}
                patternUnits="userSpaceOnUse"
                width="3"
                height="3"
                patternTransform="rotate(45)"
              >
                <motion.line
                  x1="2"
                  y1="0"
                  x2="2"
                  y2="4"
                  stroke={stroke}
                  strokeWidth="1"
                  strokeOpacity={opacity}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ pathLength: 0, opacity: 0 }}
                  style={{ originY: '0.5', scaleY: 1 }}
                  transition={{
                    duration: 4,
                    ease: 'circOut',
                  }}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#diagonal-lines-${id})`} />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AnimatedBackground
