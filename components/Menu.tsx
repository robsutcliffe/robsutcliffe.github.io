'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import MenuTop from '@/components/MenuTop'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMatches, KBarResults, useKBar } from 'kbar'
import AnimatedBackground from '@/components/AnimatedBackground'

const menuItems = [
  { text: 'Services', href: '/services' },
  { text: 'Insights', href: '/insights' },
  { text: 'Case Studies', href: '/case-studies' },
  { text: 'Contact', href: '/contact' },
]

export default function Menu() {
  const { results } = useMatches()
  const pathname = usePathname()
  const [leftValue, setLeftValue] = useState('144px')

  const { searchQuery } = useKBar((state) => ({
    searchQuery: state.searchQuery,
  }))
  const hasSearchTerm = searchQuery.length > 0

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setLeftValue('144px')
      } else if (window.innerWidth >= 768) {
        setLeftValue('112px')
      } else if (window.innerWidth < 768 && window.innerWidth >= 640) {
        setLeftValue('92px')
      } else {
        setLeftValue('0px')
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <motion.div
      animate={open ? 'open' : 'closed'}
      onMouseLeave={() => setOpen(false)}
      initial={{
        left: 'auto',
        width: '74px',
        backgroundColor: 'rgba(8, 4, 23, 0)',
      }}
      variants={{
        open: {
          left: leftValue,
          width: 'auto',
          backgroundColor: 'rgba(8, 4, 23, 1)',
        },
        closed: {
          left: 'auto',
          width: '74px',
          backgroundColor: 'rgba(8, 4, 23, 0)',
        },
      }}
      className={`${open ? 'pointer-events-auto' : 'pointer-events-none'} absolute top-0 right-0 bottom-0 left-36 z-30 m-4 overflow-hidden`}
    >
      <div className="flex h-full w-full flex-col">
        <MenuTop open={open} hover={hover} setHover={setHover} setOpen={setOpen} />
        {results.length > 0 && open && hasSearchTerm ? (
          <div className="overflow-y-scroll bg-blue-950">
            <KBarResults
              items={results}
              maxHeight={99999}
              onRender={({ item, active }) => (
                <div>
                  {typeof item === 'string' ? (
                    <div className="block border-b border-blue-900 bg-blue-900 p-4 font-semibold text-white uppercase">
                      {item}
                    </div>
                  ) : (
                    <div
                      className={`relative flex cursor-pointer justify-between border-b-2 border-blue-900 p-4 transition-all duration-300 ${
                        active ? 'bg-blue-500 text-gray-100' : 'bg-transparent text-white/80'
                      }`}
                    >
                      <AnimatedBackground isHovered={active} stroke="#061E2A" opacity="0.3" />
                      <div className="relative z-10 flex space-x-2 text-3xl">
                        {item.icon && <div className="self-center">{item.icon}</div>}
                        <div className="block">
                          {item.subtitle && (
                            <div
                              className={`${active ? 'text-white' : 'text-white/50'} text-base transition-all duration-300`}
                            >
                              {item.subtitle}
                            </div>
                          )}
                          <div>{item.name}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            />
          </div>
        ) : (
          open && (
            <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
              {menuItems.map((item, index) => (
                <MenuItem key={index} item={item} index={index} pathname={pathname} />
              ))}
            </div>
          )
        )}
      </div>
    </motion.div>
  )
}

function MenuItem({ item, index, pathname }) {
  const [isHovered, setIsHovered] = useState(false)
  const isActive = pathname.startsWith(item.href)
  return (
    <Link
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      href={item.href}
      className={`${[0, 2].includes(index) ? 'lg:border-r-2 lg:border-r-blue-900' : ''} focus-ring relative flex cursor-pointer border-b-2 border-b-blue-900 font-extrabold tracking-tighter transition-all duration-300 hover:bg-blue-500 focus:bg-blue-500 ${isActive ? 'bg-blue-500' : ''}`}
    >
      <AnimatedBackground isHovered={isHovered || isActive} stroke="#061E2A" opacity="0.3" />
      <div className="relative z-10 flex h-full w-full items-center px-16 text-center text-5xl text-white">
        {item.text}
      </div>
    </Link>
  )
}
