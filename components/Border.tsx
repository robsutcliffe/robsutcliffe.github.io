'use client'

import Logo from './Logo'
import SearchBar from '@/components/SearchBar'

export default function Border() {
  return (
    <>
      <Logo />
      <SearchBar />
      {/*<Menu />*/}
      <div className="pointer-events-none fixed inset-0 z-30 h-dvh w-dvw">
        <div className="absolute inset-0 z-30 h-full w-full">
          <div className="absolute top-0 right-0 left-0 z-20 h-2 w-full bg-white md:h-4 lg:h-6" />
          <div className="absolute right-0 bottom-0 left-0 z-20 h-2 w-full bg-white md:h-4 lg:h-6" />
          <div className="absolute top-0 bottom-0 left-0 z-20 h-full w-2 bg-white md:w-4 lg:w-6" />
          <div className="absolute top-0 right-0 bottom-0 z-20 h-full w-2 bg-white md:w-4 lg:w-6" />
        </div>
      </div>
    </>
  )
}
