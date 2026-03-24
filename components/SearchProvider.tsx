'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { slug as slugger } from 'github-slugger'
import dynamic from 'next/dynamic'

const KBarProvider = dynamic(() => import('kbar').then((mod) => mod.KBarProvider), { ssr: false })

const ActionRegistration = dynamic(() => Promise.resolve(InternalActionRegistration), {
  ssr: false,
})

const InternalActionRegistration = ({ actions }) => {
  const { useRegisterActions } = require('kbar')
  useRegisterActions(actions, [actions])
  return null
}

export const SearchProvider = ({
  searchConfig,
  children,
}: {
  searchConfig: any
  children: React.ReactNode
}) => {
  const router = useRouter()
  const { kbarConfig } = searchConfig
  const { searchDocumentsPath, defaultActions, onSearchDocumentsLoad } = kbarConfig
  const [searchActions, setSearchActions] = useState<any[]>([])
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    const mapPosts = (posts: any[]) => {
      const actions: any[] = []
      for (const post of posts) {
        let searchPath = post.path
        let section = 'Insights'
        if (post.path.startsWith('blog/')) {
          const tag = post.tags && post.tags.length > 0 ? slugger(post.tags[0]) : 'insights'
          searchPath = `insights/${tag}/${post.slug}`
          section = 'Insights'
        } else if (post.path.startsWith('services/')) {
          section = 'Services'
        } else if (post.path.startsWith('case-studies/')) {
          section = 'Case Studies'
        }
        actions.push({
          id: post.path,
          name: post.title,
          keywords: `${post?.summary || ''} ${post?.body || ''}`,
          section: section,
          path: searchPath,
          perform: () => router.push('/' + searchPath),
        })
      }
      return actions
    }

    async function fetchData() {
      if (searchDocumentsPath) {
        const url =
          searchDocumentsPath.indexOf('://') > 0 || searchDocumentsPath.indexOf('//') === 0
            ? searchDocumentsPath
            : new URL(searchDocumentsPath, window.location.origin)
        const res = await fetch(url)
        const json = await res.json()
        const actions = onSearchDocumentsLoad ? onSearchDocumentsLoad(json) : mapPosts(json)
        setSearchActions(actions)
        setDataLoaded(true)
      }
    }

    if (!dataLoaded && searchDocumentsPath) {
      fetchData()
    } else {
      setDataLoaded(true)
    }
  }, [defaultActions, dataLoaded, router, searchDocumentsPath, onSearchDocumentsLoad])

  return (
    <Suspense fallback={children}>
      <KBarProvider actions={defaultActions}>
        <ActionRegistration actions={searchActions} />
        {children}
      </KBarProvider>
    </Suspense>
  )
}
