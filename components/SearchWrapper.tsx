'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import siteMetadata from '@/data/siteMetadata'
import { SearchConfig } from 'pliny/search'

const SearchProvider = dynamic(
  () => import('@/components/SearchProvider').then((mod) => ({ default: mod.SearchProvider })),
  { ssr: false }
)

const SearchBarContent = dynamic(() => import('./SearchBarContent'), {
  ssr: false,
})

export default function SearchWrapper({
  open,
  setOpen,
  searchContainerRef,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  searchContainerRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <Suspense fallback={null}>
      <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
        {open && (
          <Suspense fallback={null}>
            <SearchBarContent
              open={open}
              setOpen={setOpen}
              searchContainerRef={searchContainerRef}
            />
          </Suspense>
        )}
      </SearchProvider>
    </Suspense>
  )
}
