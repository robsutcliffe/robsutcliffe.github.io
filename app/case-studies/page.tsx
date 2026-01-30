import { allCaseStudies } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'
import SectionContainer from '@/components/SectionContainer'
import React from 'react'
import PageTitle from '@/components/PageTitle'
import Cta from '@/components/Cta'

export const metadata = genPageMetadata({ title: 'Case Studies' })

export default function CaseStudiesPage() {
  const posts = allCoreContent(sortPosts(allCaseStudies))

  return (
    <>
      <SectionContainer>
        <article>
          <PageTitle>Case Studies</PageTitle>
          <p className="max-w-3xl py-3 text-base text-blue-950/80 lg:text-lg">
            <i className="font-bold">Before-and-after stories from projects</i> where we simplified
            UX, improved performance, and clarified the data picture so teams could ship with more
            confidence.
          </p>
          <div className="container -ml-6">
            <div className="flex flex-wrap">
              {posts.map((post) => (
                <Card
                  key={post.title}
                  title={post.title}
                  description={post.summary || ''}
                  imgSrc={post.images?.[0] || ''}
                  href={`/${post.path}`}
                />
              ))}
            </div>
          </div>
        </article>
      </SectionContainer>
      <Cta />
    </>
  )
}
