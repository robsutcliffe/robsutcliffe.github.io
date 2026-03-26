import dynamic from 'next/dynamic'
import { ReactNode, Suspense, lazy } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, CaseStudy, Service, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

const Calendly = lazy(() => import('@/components/Calendly'))

interface LayoutProps {
  content: CoreContent<Blog | CaseStudy | Service>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  authorDetails: CoreContent<Authors>[]
}

export default function PostLayout({ content, next, prev, authorDetails, children }: LayoutProps) {
  const { slug, title } = content

  return (
    <>
      <SectionContainer>
        <ScrollTopAndComment />
        <article>
          <div className="grid-rows-[auto_1fr] xl:divide-y-0">
            <div className="xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8">{children}</div>
            </div>
            {siteMetadata.comments && (
              <div className="pt-6 pb-6 text-center text-gray-700" id="comment">
                <Comments slug={slug} />
              </div>
            )}
            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev && prev.path && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/${prev.path}`}
                      className="text-primary-500 hover:text-primary-600"
                      aria-label={`Previous post: ${prev.title}`}
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && next.path && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/${next.path}`}
                      className="text-primary-500 hover:text-primary-600"
                      aria-label={`Next post: ${next.title}`}
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </article>
      </SectionContainer>
      <Suspense fallback={null}>
        <Calendly />
      </Suspense>
    </>
  )
}
