import Hero from '@/components/Hero'
import { slug } from 'github-slugger'
import Card from '@/components/Card'
import HoverLink from '@/components/HoverLink'
import Button from '@/components/Button'
import React from 'react'
import Cta from '@/components/Cta'

const MAX_DISPLAY = 3

export default function Home({ posts, services, caseStudies }) {
  return (
    <>
      <Hero />
      <div className="px-2 md:px-4 lg:mr-26 lg:ml-36 lg:px-6">
        <div className="flex h-24 flex-row items-center gap-2 md:gap-4">
          <div className="h-0.25 w-4 bg-blue-950 md:w-8" />
          <p className="text-xl tracking-tight text-blue-950">
            Recommended <b className="">Services</b>
          </p>
        </div>
        <div className="max-w-3xl md:max-w-4xl md:pl-8 lg:pl-12 xl:max-w-5xl">
          <div className="-my-4 flex flex-wrap md:-mx-2 md:-my-6 lg:-m-6">
            {services.slice(0, 2).map((service) => (
              <Card
                key={service.title}
                title={service.title}
                color="yellow"
                description={service.summary || ''}
                imgSrc={service.images?.[0] || ''}
                href={`/${service.path}`}
              />
            ))}
          </div>
          <Button href="/services" text="View All Services" />
        </div>
      </div>
      <div className="relative border-t border-b border-blue-950/50 bg-blue-950/5">
        <div className="px-2 md:px-4 lg:mr-26 lg:ml-36 lg:px-6">
          <div className="flex h-24 flex-row items-center gap-4">
            <div className="h-0.25 w-8 bg-blue-950" />
            <p className="text-xl tracking-tight text-blue-950">
              Latest <b className="">Insights</b>
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="flex flex-col border-t border-blue-950/20 lg:border-blue-950/50">
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
          <Button text="View All Insights" href="/insights" />
        </div>
      </div>
      <div className="px-2 md:px-4 lg:mr-26 lg:ml-36 lg:px-6">
        <div className="flex h-24 flex-row items-center gap-2 md:gap-4">
          <div className="h-0.25 w-4 bg-blue-950 md:w-8" />
          <p className="text-xl tracking-tight text-blue-950">
            Latest <b className="">Case Studies</b>
          </p>
        </div>
        <div className="max-w-3xl md:max-w-4xl md:pl-8 lg:pl-12 xl:max-w-5xl">
          <div className="-my-4 flex flex-wrap md:-mx-2 md:-my-6 lg:-m-6">
            {caseStudies.slice(0, 2).map((study) => (
              <Card
                key={study.title}
                color="purple"
                title={study.title}
                description={study.summary || ''}
                imgSrc={study.images?.[0] || ''}
                href={`/${study.path}`}
              />
            ))}
          </div>
          <Button href="/case-studies" text="View All Case Studies" />
        </div>
      </div>
      <Cta />
    </>
  )
}
