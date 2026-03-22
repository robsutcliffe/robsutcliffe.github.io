'use client'

import Logo from './Logo'
import SearchBar from '@/components/SearchBar'

export default function Border() {
  return (
    <>
      <Logo />
      <SearchBar />
      {/*<Menu />*/}

      <div className="fixed top-0 right-0 left-0 z-30 h-2 w-full bg-white md:h-4 lg:h-6" />
      <div className="fixed right-0 bottom-0 left-0 z-30 h-2 w-full bg-white md:h-4 lg:h-6" />
      <div className="fixed top-0 bottom-0 left-0 z-30 h-svh w-2 bg-white md:w-4 lg:w-6" />
      <div className="fixed top-0 right-0 bottom-0 z-30 h-svh w-2 bg-white md:w-4 lg:w-6" />
    </>
  )
}
