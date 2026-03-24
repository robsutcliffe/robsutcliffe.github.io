'use client'

import Logo from './Logo'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const SearchBar = dynamic(() => import('@/components/SearchBar'), { ssr: false })

export default function Border() {
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    const reveal = () => setShowSearch(true)
    // Defer loading search until the browser is idle (or shortly after mount)
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(reveal)
    } else {
      const t = setTimeout(reveal, 300)
      return () => clearTimeout(t)
    }
  }, [])

  return (
    <>
      <Logo />
      {showSearch ? <SearchBar /> : null}
      {/*<Menu />*/}

      <div className="fixed top-0 right-0 left-0 z-30 h-4 w-full bg-white" />
      <div className="fixed right-0 bottom-0 left-0 z-30 h-4 w-full bg-white" />
      <div className="fixed top-0 bottom-0 left-0 z-30 h-svh w-4 bg-white" />
      <div className="fixed top-0 right-0 bottom-0 z-30 h-svh w-4 bg-white" />
    </>
  )
}
