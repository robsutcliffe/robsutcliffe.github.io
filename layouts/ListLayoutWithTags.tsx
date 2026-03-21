/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import HoverLink from '@/components/HoverLink'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex justify-between">
        {!prevPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!prevPage}
            aria-label="Previous Page"
          >
            Previous
          </button>
        )}
        {prevPage && (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            aria-label="Previous Page"
          >
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button
            className="cursor-auto disabled:opacity-50"
            disabled={!nextPage}
            aria-label="Next Page"
          >
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next" aria-label="Next Page">
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <SectionContainer>
      <article>
        <PageTitle>Insights</PageTitle>
        <p className="max-w-3xl py-3 text-base text-blue-800 lg:text-lg">
          <i className="font-bold">Short, practical pieces from real client work</i>: experiments
          that worked, things that didn’t, and the dashboards, interfaces, and flows that actually
          changed behaviour.
        </p>
        <div className="my-12 flex flex-col border-t-1 border-blue-800 hover:border-blue-800 lg:border-blue-900">
          {displayPosts.map((post) => {
            const { path, date, title, summary, tags, slug: postSlug } = post
            const tag = tags && tags.length > 0 ? slug(tags[0]) : 'insights'
            const href = `/insights/${tag}/${postSlug}`
            return (
              <HoverLink
                key={path}
                href={href}
                date={date}
                title={title}
                tags={tags}
                summary={summary}
              />
            )
          })}
          {pagination && pagination.totalPages > 1 && (
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          )}
        </div>
      </article>
    </SectionContainer>
  )
}
