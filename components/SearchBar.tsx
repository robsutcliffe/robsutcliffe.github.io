import React, { useState, useEffect, useRef } from 'react'
import MultiIcon from '@/components/MultiIcon'
import { motion, AnimatePresence } from 'framer-motion'
import SearchWrapper from './SearchWrapper'

export default function SearchBar() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    const handleResize = () => setWindowWidth(window.innerWidth)

    handleScroll()
    handleResize()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getVariant = () => {
    if (open) return 'open'
    if (!mounted) return 'search'
    if (scrollY > 50 || windowWidth < 1200) return 'menu'
    return 'search'
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="pointer-events-none fixed inset-0 z-50 bg-blue-900/50 [filter:saturate(0.85)_brightness(0.92)_grayscale(1)] backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
      <nav className="pointer-events-none fixed top-4 right-4 left-4 z-50 h-16">
        <SearchWrapper open={open} setOpen={setOpen} searchContainerRef={searchContainerRef} />
        <motion.button
          id="search-bar-toggle"
          animate={getVariant()}
          onClick={() => setOpen((prev) => !prev)}
          className={`${open ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white'} focus-ring pointer-events-auto absolute right-0 flex h-full w-16 cursor-pointer items-center justify-center p-2 transition duration-300`}
          aria-label={open ? 'Close Search and Menu' : 'Open Search and Menu'}
        >
          <MultiIcon />
        </motion.button>
      </nav>
    </>
  )
}
