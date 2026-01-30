'use client'

import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBackground from '@/components/AnimatedBackground'

const ScrollTopAndComment = () => {
  const [show, setShow] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 50) setShow(true)
      else setShow(false)
    }

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0 })
  }
  const handleScrollToComment = () => {
    document.getElementById('comment')?.scrollIntoView()
  }
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed right-2 bottom-2 hidden flex-col gap-3 md:right-4 md:bottom-4 md:flex lg:right-6 lg:bottom-6"
        >
          {siteMetadata.comments?.provider && (
            <button
              aria-label="Scroll To Comment"
              onClick={handleScrollToComment}
              className="focus-ring rounded-full bg-gray-200 p-2 text-gray-500 transition-all hover:bg-gray-300"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <button
            aria-label="Scroll To Top"
            onClick={handleScrollTop}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="focus-ring relative flex h-18 w-18 cursor-pointer items-center justify-center overflow-hidden border-t border-l border-gray-100/50 bg-blue-950 text-white transition-all duration-300 hover:bg-blue-500"
          >
            <AnimatedBackground isHovered={isHovered} opacity="0.5" stroke="#061E2A" />
            <span className="relative z-10">
              <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ScrollTopAndComment
