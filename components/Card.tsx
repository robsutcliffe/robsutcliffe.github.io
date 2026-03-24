'use client'

import React, { useState, useEffect } from 'react'
import Image from './Image'
import Link from './Link'
import AnimatedBackground from './AnimatedBackground'
import SlidingBackground from './SlidingBackground'

const colorMap = {
  yellow: 'group-hover:text-yellow-300 group-focus:text-yellow-300',
  purple: 'group-hover:text-purple-300 group-focus:text-purple-300',
  red: 'group-hover:text-red-300 group-focus:text-red-300',
  blue: 'group-hover:text-blue-300 group-focus:text-blue-300',
  green: 'group-hover:text-green-300 group-focus:text-green-300',
}

const Card = ({
  title,
  description,
  imgSrc,
  blueImgSrc,
  href,
  color = 'yellow',
  nextAvailable,
  cost,
  priority = false,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const hoverTextColor = 'group-hover:text-blue-900 group-focus:text-blue-900' // colorMap[color] || colorMap.yellow

  return (
    <Link
      className="md group relative max-w-[544px] outline-none"
      href={href}
      aria-label={`Link to ${title}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="shadow-inset-all relative h-full overflow-hidden rounded-xs transition duration-300 outline-none group-hover:border-blue-800 group-focus:border-blue-800 group-focus-visible:ring-2 group-focus-visible:ring-red-500 group-focus-visible:ring-offset-2 group-active:scale-95">
        <div className="absolute top-0 z-20 flex w-full justify-between text-xs tracking-wide text-white uppercase">
          {nextAvailable && (
            <div
              className={` ${nextAvailable === 'now' ? 'box-border border border-blue-600 bg-yellow-200 font-bold text-blue-800' : 'bg-blue-800'} px-3 py-2`}
            >
              {nextAvailable === 'now' ? (
                <span className="font-bold">Available Now</span>
              ) : (
                <>
                  Next Available: <span className="font-bold">{nextAvailable}</span>
                </>
              )}
            </div>
          )}
          {cost && <div className="bg-blue-800 px-3 py-2">{cost}</div>}
        </div>
        <div className="relative z-10 box-border h-40 overflow-hidden border border-blue-700 bg-white transition duration-300 md:h-36 lg:h-48">
          <Image
            alt={title}
            src={imgSrc}
            className="h-full w-full object-cover object-center transition duration-300"
            width={544}
            height={306}
            priority={priority}
          />
          {blueImgSrc && (
            <Image
              alt={title}
              src={blueImgSrc}
              className="absolute inset-0 h-full w-full object-cover object-center transition duration-300 group-hover:opacity-0 group-focus:opacity-0"
              width={544}
              height={306}
            />
          )}
        </div>
        <AnimatedBackground
          isHovered={isHovered}
          stroke="#241169"
          opacity="0.07"
          className="z-20"
        />
        <div className="relative z-30">
          <div className="px-4 sm:px-8 sm:py-4">
            <h2
              className={`relative -ml-4 inline-block px-4 py-4 text-xl leading-6 font-bold transition duration-300 group-focus:bg-yellow-200 sm:-ml-8 sm:pl-8 sm:text-2xl sm:leading-8 ${hoverTextColor}`}
            >
              <SlidingBackground isHovered={isHovered} />
              <span className="relative z-10">{title}</span>
            </h2>
            <p className="mb-4 max-w-none text-sm leading-5 text-blue-800/80 transition duration-300 group-hover:text-blue-900 sm:text-base sm:leading-6">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Card
