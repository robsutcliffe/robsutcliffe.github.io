'use client'

import dynamic from 'next/dynamic'
import { slug } from 'github-slugger'
import Card from '@/components/Card'
import HoverLink from '@/components/HoverLink'
import Button from '@/components/Button'
import React, { Suspense } from 'react'

const DotsHero = dynamic(() => import('@/components/DotsHero'), {
  ssr: false,
  loading: () => <div className="m-4 h-[calc(100svh-2rem)] bg-blue-800 md:mb-0" />,
})
const Cta = dynamic(() => import('@/components/Cta'), { ssr: false })

const MAX_DISPLAY = 3

export default function Home({ posts, services, caseStudies }) {
  return (
    <>
      <Suspense fallback={<div className="m-4 h-[calc(100svh-2rem)] bg-blue-800 md:mb-0" />}>
        <DotsHero />
      </Suspense>
      <div>
        <div className="mx-8 lg:ml-26 xl:mr-26 xl:ml-36">
          <div className="flex h-24 flex-row items-center lg:gap-4">
            <div className="h-0.25 w-0 bg-blue-800 lg:w-8" />
            <p className="text-xl tracking-tight text-blue-800">
              Recommended <b className="">Services</b>
            </p>
          </div>
          <div className="w-fit max-w-3xl md:max-w-4xl lg:pl-12 xl:max-w-5xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {services.slice(0, 2).map((service, index) => (
                <Card
                  key={service.title}
                  title={service.title}
                  color="yellow"
                  description={service.summary || ''}
                  imgSrc={service.images?.[0] || ''}
                  blueImgSrc={service.images?.[0]?.replace(/\.(webp|png|jpg|jpeg)$/, '-blue.$1')}
                  href={`/${service.path}`}
                  nextAvailable={service.nextAvailable}
                  cost={service.cost}
                  priority={index === 0}
                />
              ))}
            </div>
            <Button href="/services" text="View All Services" noPadding={true} />
          </div>
        </div>
      </div>
      <div className="shadow-inset-y relative bg-yellow-100/50">
        <div className="mx-8 lg:ml-26 xl:mr-26 xl:ml-36">
          <div className="flex h-24 flex-row items-center lg:gap-4">
            <div className="h-0.25 w-0 bg-blue-800 lg:w-8" />
            <p className="text-xl tracking-tight text-blue-800">
              Latest <b className="">Insights</b>
            </p>
          </div>
          <div className="max-w-3xl divide-y divide-blue-700 md:max-w-4xl xl:max-w-5xl">
            <div className="shadow-inset-t flex flex-col">
              {posts.slice(0, MAX_DISPLAY).map((post) => {
                const { slug: postSlug, date, title, summary, tags } = post
                const tag = tags && tags.length > 0 ? slug(tags[0]) : 'insights'
                const href = `/insights/${tag}/${postSlug}`
                return (
                  <HoverLink
                    key={postSlug}
                    href={href}
                    date={date}
                    title={title}
                    tags={tags}
                    summary={summary}
                  />
                )
              })}
            </div>
          </div>
          <div className="max-w-3xl md:max-w-4xl xl:max-w-5xl">
            <Button text="View All Insights" href="/insights" noPadding={true} />
          </div>
        </div>
      </div>
      <div className="mx-8 lg:ml-26 xl:mr-26 xl:ml-36">
        <div className="flex h-24 flex-row items-center lg:gap-4">
          <div className="h-0.25 w-0 bg-blue-800 lg:w-8" />
          <p className="text-xl tracking-tight text-blue-800">
            Latest <b className="">Case Studies</b>
          </p>
        </div>
        <div className="w-fit max-w-3xl md:max-w-4xl lg:pl-12 xl:max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {caseStudies.slice(0, 2).map((study) => (
              <Card
                key={study.title}
                color="yellow"
                title={study.title}
                description={study.summary || ''}
                imgSrc={study.images?.[0] || ''}
                href={`/${study.path}`}
                nextAvailable={study.nextAvailable}
                cost={study.cost}
              />
            ))}
          </div>
          <Button href="/case-studies" text="View All Case Studies" noPadding={true} />
        </div>
      </div>
      <Suspense fallback={null}>
        <Cta />
      </Suspense>
    </>
  )
}
