import { allServices } from 'contentlayer/generated'
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer'
import Card from '@/components/Card'
import { genPageMetadata } from 'app/seo'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import React from 'react'
import Cta from '@/components/Cta'

export const metadata = genPageMetadata({ title: 'Services' })

export default function ServicesPage() {
  const posts = allCoreContent(sortPosts(allServices))

  return (
    <>
      <SectionContainer>
        <article>
          <PageTitle>Services</PageTitle>
          <p className="max-w-3xl px-6 py-3 text-lg text-blue-950/80 lg:px-0">
            <i className="font-bold">
              I help Shopify brands ship focused UX, performance, and analytics improvements
            </i>{' '}
            that move key numbers like conversion rate, AOV, and speed—without a full rebuild.
          </p>
          <div>
            <div className="container py-6">
              <div className="-m-6 flex flex-wrap">
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
          </div>
        </article>
      </SectionContainer>
      <Cta />
    </>
  )
}
