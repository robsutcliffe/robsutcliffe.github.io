import Link from 'next/link'
import AnimatedBackground from '@/components/AnimatedBackground'
import React, { useState, useEffect, useRef } from 'react'
import { KBarSearch } from 'kbar'
import { useMatches, useKBar } from 'kbar'
import { usePathname } from 'next/navigation'
import MultiIcon from '@/components/MultiIcon'
import { motion, AnimatePresence } from 'framer-motion'

export default function SearchBar() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)
  const pathname = usePathname()
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

  const { searchQuery } = useKBar((state) => ({
    searchQuery: state.searchQuery,
  }))
  const hasSearchTerm = searchQuery.trim().length > 0

  const { results } = useMatches()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        const searchButton = (event.target as HTMLElement).closest('button')
        if (searchButton && searchButton.id === 'search-bar-toggle') {
          return
        }
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  const headings = [
    { name: 'Services', href: '/services' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Insights', href: '/insights' },
    { name: 'Contact', href: '/contact' },
  ]

  const actionResults = results.filter((item) => typeof item !== 'string')

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
        <AnimatePresence>
          {open && (
            <motion.div
              ref={searchContainerRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-auto absolute top-0 right-0 left-0 bg-yellow-50"
            >
              <KBarSearch
                defaultPlaceholder="Search..."
                className="shadow-inset-all h-16 w-full border-0 bg-white px-12 text-2xl"
              />
              <div className="h-[calc(100svh-6rem)] overflow-y-scroll border-blue-800">
                <div className="space-y-0">
                  {headings.map((heading) => {
                    const sectionResults = hasSearchTerm
                      ? actionResults.filter(
                          (item) => item.section?.toLowerCase() === heading.name.toLowerCase()
                        )
                      : []

                    return (
                      <div key={heading.name}>
                        <Link
                          href={heading.href}
                          className="group focus-ring flex flex-row items-center gap-4 border-b border-yellow-200 bg-yellow-50 py-3 font-semibold text-blue-700 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white"
                        >
                          <div className="h-0.25 w-8 bg-blue-700 group-hover:bg-yellow-50 group-focus:bg-yellow-50" />
                          {heading.name}
                        </Link>

                        {heading.name !== 'Contact' &&
                          hasSearchTerm &&
                          sectionResults.length > 0 && (
                            <div className="space-y-px">
                              {sectionResults.map((item, index) => (
                                <div key={item.id || index}>
                                  <Link
                                    href={'/' + (item.path || item.id)}
                                    className="focus-ring relative flex cursor-pointer justify-between border-b border-yellow-200 px-12 py-3 text-blue-600 transition-all duration-300 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white"
                                  >
                                    <AnimatedBackground
                                      isHovered={false}
                                      stroke="#061E2A"
                                      opacity={0.3}
                                    />
                                    <div className="relative z-10 flex space-x-2 text-lg">
                                      <div className="block">
                                        <div>{item.name}</div>
                                      </div>
                                    </div>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
