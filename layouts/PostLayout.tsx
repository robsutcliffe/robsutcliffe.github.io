import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import { formatDate } from 'pliny/utils/formatDate'
import Calendly from '@/components/Calendly'

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
          <div className="flex flex-row items-center gap-3 tracking-wide text-blue-950">
            <div className="py-1">
              By <b>{authorDetails.map((author) => author.name)}</b>
            </div>
            <span className="opacity-20">◼</span>
            <div className="py-1">
              Published <b>{formatDate(date, siteMetadata.locale)}</b>
            </div>
          </div>
          <div className="grid-rows-[auto_1fr] divide-y divide-gray-200 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <div className="divide-y divide-gray-200 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose dark:prose-invert max-w-none py-10">{children}</div>
            </div>
          </div>
        </article>
      </SectionContainer>
      <Calendly />
    </>
  )
}
