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
          <p className="mb-4 max-w-3xl text-sm leading-5 text-blue-800 sm:text-base sm:leading-6 md:leading-8 lg:text-lg">
            <i className="font-bold">
              I help Shopify brands ship focused UX, performance, and analytics improvements
            </i>{' '}
            that move key numbers like conversion rate, AOV, and speed—without a full rebuild.
          </p>
          <div>
            <div className="container py-4">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {posts.map((post, index) => (
                  <Card
                    key={post.title}
                    title={post.title}
                    description={post.summary || ''}
                    imgSrc={post.images?.[0] || ''}
                    blueImgSrc={post.images?.[0]?.replace(/\.(webp|png|jpg|jpeg)$/, '-blue.$1')}
                    href={`/${post.path}`}
                    nextAvailable={post.nextAvailable}
                    cost={post.cost}
                    priority={index < 2}
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
