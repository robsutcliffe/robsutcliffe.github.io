'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DotBackground = ({
  fill = '#136988',
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
                id={`dots-${id}`}
                patternUnits="userSpaceOnUse"
                width="3"
                height="3"
                patternTransform="rotate(45)"
              >
                <motion.circle
                  cx="1.5"
                  cy="1.5"
                  r="0.5"
                  fill={fill}
                  fillOpacity={opacity}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    duration: 4,
                    ease: 'circOut',
                  }}
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#dots-${id})`} />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DotBackground
