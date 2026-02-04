'use client'

import React from 'react'
import Link from '@/components/Link'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import Tag from '@/components/Tag'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function HoverLink({ href, date, title, tags, summary }) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="group focus-ring relative border-b-1 border-blue-950/20 px-12 py-6 hover:border-blue-950 lg:border-blue-950/50"
    >
      <AnimatedBackground isHovered={isHovered} stroke="#136988" opacity="0.15" />
      <article className="relative z-10 flex flex-col space-y-2 xl:space-y-0">
        <div className="flex flex-wrap">
          {tags?.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
        <h2 className="!-mt-1 -ml-6 inline-block w-fit p-3 px-6 text-2xl leading-8 font-bold text-blue-950 transition duration-300 group-hover:bg-blue-950 group-hover:text-red-200 group-focus:bg-blue-950 group-focus:text-red-200">
          {title}
        </h2>
        <div className="prose text-ff-navy/70 group-hover:text-ff-navy max-w-none leading-normal">
          {summary}
        </div>
        <time
          className="mt-2 text-base leading-6 font-light text-blue-950/50 transition duration-300 group-hover:text-blue-950"
          dateTime={date}
        >
          {formatDate(date, siteMetadata.locale)}
        </time>
      </article>
    </Link>
  )
}
