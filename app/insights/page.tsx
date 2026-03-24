import dynamic from 'next/dynamic'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import { Suspense, lazy } from 'react'

const Cta = lazy(() => import('@/components/Cta'))

const POSTS_PER_PAGE = 5

export const metadata = genPageMetadata({ title: 'Insights' })

export default function InsightsPage() {
  const posts = allCoreContent(sortPosts(allBlogs))
  const pageNumber = 1
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  )
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  }

  return (
    <>
      <ListLayout
        posts={posts}
        initialDisplayPosts={initialDisplayPosts}
        pagination={pagination}
        title="Insights"
      />
      <Suspense fallback={null}>
        <Cta />
      </Suspense>
    </>
  )
}
