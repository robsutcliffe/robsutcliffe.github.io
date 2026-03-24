'use client'

import Logo from './Logo'
import SearchBar from '@/components/SearchBar'

export default function Border() {
  return (
    <>
      <Logo />
      <SearchBar />
      {/*<Menu />*/}

      <div className="fixed top-0 right-0 left-0 z-30 h-4 w-full bg-white" />
      <div className="fixed right-0 bottom-0 left-0 z-30 h-4 w-full bg-white" />
      <div className="fixed top-0 bottom-0 left-0 z-30 h-svh w-4 bg-white" />
      <div className="fixed top-0 right-0 bottom-0 z-30 h-svh w-4 bg-white" />
    </>
  )
}
