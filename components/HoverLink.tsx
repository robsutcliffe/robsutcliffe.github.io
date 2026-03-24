'use client'

import React from 'react'
import Link from '@/components/Link'
import { formatDate } from 'pliny/utils/formatDate'
import siteMetadata from '@/data/siteMetadata'
import Tag from '@/components/Tag'
import AnimatedBackground from '@/components/AnimatedBackground'
import SlidingBackground from '@/components/SlidingBackground'

export default function HoverLink({ href, date, title, tags, summary }) {
  const [isHovered, setIsHovered] = React.useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="group focus-ring shadow-inset-b relative py-4 md:px-12 md:py-8"
    >
      <AnimatedBackground isHovered={isHovered} stroke="#241169" opacity="0.07" />
      <article className="relative z-10 flex flex-col">
        <div className="z-20 flex h-8 flex-wrap">
          {tags?.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
        <h2 className="relative !-mt-4 -ml-12 inline-block w-fit px-6 py-4 pl-12 text-xl leading-6 font-bold text-blue-800 transition duration-300 group-hover:text-blue-900 group-focus:bg-yellow-200 group-focus:text-blue-900 md:text-2xl md:leading-8">
          <SlidingBackground isHovered={isHovered} />
          <span className="relative z-10 tracking-tight">{title}</span>
        </h2>
        <div className="prose max-w-none text-sm leading-5 text-blue-800/70 group-hover:text-blue-800 sm:text-base sm:leading-6">
          {summary}
        </div>
        <time
          className="text-sm leading-8 font-medium text-blue-700 transition duration-300 group-hover:text-blue-900 sm:text-base"
          dateTime={date}
        >
          {formatDate(date, siteMetadata.locale)}
        </time>
      </article>
    </Link>
  )
}
