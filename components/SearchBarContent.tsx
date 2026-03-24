'use client'

import React, { useEffect, useRef } from 'react'
import { KBarSearch, useMatches, useKBar } from 'kbar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function SearchBarContent({
  open,
  setOpen,
  searchContainerRef,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  searchContainerRef: React.RefObject<HTMLDivElement>
}) {
  const pathname = usePathname()
  const initialPathname = useRef(pathname)

  const { searchQuery } = useKBar((state) => ({
    searchQuery: state.searchQuery,
  }))
  const hasSearchTerm = searchQuery.trim().length > 0

  const { results } = useMatches()

  useEffect(() => {
    if (initialPathname.current !== pathname) {
      setOpen(false)
    }
  }, [pathname, setOpen])

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
  }, [open, setOpen, searchContainerRef])

  const headings = [
    { name: 'Services', href: '/services' },
    { name: 'Case Studies', href: '/case-studies' },
    { name: 'Insights', href: '/insights' },
    { name: 'Contact', href: '/contact' },
  ]

  const actionResults = results.filter((item) => typeof item !== 'string')

  return (
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

                    {heading.name !== 'Contact' && hasSearchTerm && sectionResults.length > 0 && (
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
  )
}
