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
      className="group focus-ring relative border-b-1 border-blue-700 px-12 py-6 hover:border-blue-800"
    >
      <AnimatedBackground isHovered={isHovered} stroke="#241169" opacity="0.07" />
      <article className="relative z-10 flex flex-col space-y-2 xl:space-y-0">
        <div className="z-20 flex flex-wrap">
          {tags?.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </div>
        <h2 className="relative !-mt-4 -ml-6 inline-block w-fit p-3 px-6 text-2xl leading-8 font-bold text-blue-800 transition duration-300 group-hover:text-blue-900 group-focus:bg-blue-800 group-focus:text-blue-900">
          <SlidingBackground isHovered={isHovered} />
          <span className="relative z-10">{title}</span>
        </h2>
        <div className="prose max-w-none leading-normal text-blue-800/70 group-hover:text-blue-800">
          {summary}
        </div>
        <time
          className="mt-2 text-base leading-6 font-medium text-blue-700 transition duration-300 group-hover:text-blue-900"
          dateTime={date}
        >
          {formatDate(date, siteMetadata.locale)}
        </time>
      </article>
    </Link>
  )
}
