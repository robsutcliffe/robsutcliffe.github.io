import dynamic from 'next/dynamic'
import { allCaseStudies } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import Card from '@/components/Card'
import { genPageMetadata } from '../seo'
import SectionContainer from '@/components/SectionContainer'
import React, { Suspense, lazy } from 'react'
import PageTitle from '@/components/PageTitle'

const Cta = lazy(() => import('@/components/Cta'))

export const metadata = genPageMetadata({ title: 'Case Studies' })

export default function CaseStudiesPage() {
  const posts = allCoreContent(sortPosts(allCaseStudies))

  return (
    <>
      <SectionContainer>
        <article>
          <PageTitle>Case Studies</PageTitle>
          <p className="mb-4 max-w-3xl text-sm leading-5 text-blue-800 sm:text-base sm:leading-6 md:leading-8 lg:text-lg">
            <i className="font-bold">Before-and-after stories from projects</i> where we simplified
            UX, improved performance, and clarified the data picture so teams could ship with more
            confidence.
          </p>
          <div className="container py-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {posts.map((post) => (
                <Card
                  color="yellow"
                  key={post.title}
                  title={post.title}
                  description={post.summary || ''}
                  imgSrc={post.images?.[0] || ''}
                  href={`/${post.path}`}
                  nextAvailable={post.nextAvailable}
                  cost={post.cost}
                />
              ))}
            </div>
          </div>
        </article>
      </SectionContainer>
      <Suspense fallback={null}>
        <Cta />
      </Suspense>
    </>
  )
}
