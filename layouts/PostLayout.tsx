import dynamic from 'next/dynamic'
import { ReactNode, Suspense, lazy } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { formatDate } from 'pliny/utils/formatDate'

const Calendly = lazy(() => import('@/components/Calendly'))

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { date, title } = content

  return (
    <>
      <SectionContainer>
        <ScrollTopAndComment />
        <article>
          <PageTitle>{title}</PageTitle>
          <div className="flex flex-col gap-1 pl-1 text-sm tracking-wide text-blue-800 sm:flex-row sm:items-center sm:gap-3 sm:text-base">
            <div className="leading-8">
              By <b>{authorDetails.map((author) => author.name)}</b>
            </div>
            <div className="h-1 w-4 rounded-tl-full rounded-br-full bg-blue-900 sm:h-1.5 sm:w-5" />
            <div className="leading-8">
              Published <b>{formatDate(date, siteMetadata.locale)}</b>
            </div>
          </div>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none py-4 md:py-8">{children}</div>
            </div>
          </div>
        </article>
      </SectionContainer>
      <Suspense fallback={null}>
        <Calendly />
      </Suspense>
    </>
  )
}
