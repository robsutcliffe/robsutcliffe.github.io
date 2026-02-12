import Link from 'next/link'
import AnimatedBackground from '@/components/AnimatedBackground'
import React, { useState, useEffect, useRef } from 'react'
import { KBarSearch } from 'kbar'
import { useMatches, useKBar } from 'kbar'
import { usePathname } from 'next/navigation'
import MultiIcon from '@/components/MultiIcon'
import { motion, AnimatePresence } from 'framer-motion'

export default function SearchBar() {
  const [open, setOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [windowWidth, setWindowWidth] = useState(0)
  const pathname = usePathname()
  const searchContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
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
      <nav className="pointer-events-none fixed top-2 right-2 left-2 z-50 h-18 md:top-4 md:right-4 md:left-4 lg:top-6 lg:right-6 lg:left-6">
        <AnimatePresence>
          {open && (
            <motion.div
              ref={searchContainerRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="pointer-events-auto absolute top-0 right-0 left-2 bg-blue-950 p-[1.5px] lg:right-18 lg:left-27"
            >
              <KBarSearch
                placeholder="Search..."
                className="focus-ring h-17.5 w-full border-0 bg-white px-12 text-2xl"
              />
              <div className="h-[calc(100vh-6rem)] overflow-y-scroll lg:h-[calc(100vh-12rem)]">
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
                          className="focus-ring flex flex-row items-center gap-4 bg-blue-950 py-3 font-semibold text-white hover:bg-blue-500"
                        >
                          <div className="h-0.25 w-8 bg-white" />
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
                                    className="focus-ring relative flex cursor-pointer justify-between px-12 py-3 text-blue-100/80 transition-all duration-300 hover:bg-blue-500 hover:text-white"
                                  >
                                    <AnimatedBackground
                                      isHovered={false}
                                      stroke="#061E2A"
                                      opacity="0.3"
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
          className={`${open ? 'bg-blue-500 text-white' : 'bg-white hover:bg-blue-500 hover:text-white'} focus-ring pointer-events-auto absolute right-0 flex h-full w-18 cursor-pointer items-center justify-center p-2 transition duration-300`}
          aria-label={open ? 'Close Search and Menu' : 'Open Search and Menu'}
        >
          <MultiIcon />
        </motion.button>
      </nav>
    </>
  )
}
