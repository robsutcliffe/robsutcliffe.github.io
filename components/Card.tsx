'use client'

import React, { useState } from 'react'
import Image from './Image'
import Link from './Link'
import AnimatedBackground from './AnimatedBackground'

const colorMap = {
  yellow: 'group-hover:text-yellow-300 group-focus:text-yellow-300',
  purple: 'group-hover:text-purple-300 group-focus:text-purple-300',
  red: 'group-hover:text-red-300 group-focus:text-red-300',
  blue: 'group-hover:text-blue-300 group-focus:text-blue-300',
  green: 'group-hover:text-green-300 group-focus:text-green-300',
}

const Card = ({ title, description, imgSrc, href, color = 'yellow', nextAvailable, cost }) => {
  const [isHovered, setIsHovered] = useState(false)
  const hoverTextColor = colorMap[color] || colorMap.yellow

  return (
    <Link
      className="md group relative max-w-[544px] p-6 outline-none md:w-1/2"
      href={href}
      aria-label={`Link to ${title}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full overflow-hidden rounded-xs border border-blue-950/50 transition duration-300 outline-none group-hover:border-blue-950 group-focus:border-blue-950 group-focus-visible:ring-2 group-focus-visible:ring-red-500 group-focus-visible:ring-offset-2 group-active:scale-95">
        <div className="absolute top-0 z-30 flex w-full justify-between text-xs tracking-wide text-white uppercase">
          <div className="bg-blue-950 px-3 py-2">
            {nextAvailable ? (
              <>
                Next Available: <span className="font-bold">{nextAvailable}</span>
              </>
            ) : (
              <b>Available Now</b>
            )}
          </div>
          <div className="bg-blue-950 px-3 py-2">{cost}</div>
        </div>
        <Image
          alt={title}
          src={imgSrc}
          className="h-40 object-cover object-center grayscale-100 transition duration-300 group-hover:grayscale-0 group-focus:grayscale-0 md:h-36 lg:h-48"
          width={544}
          height={306}
        />
        <AnimatedBackground
          isHovered={isHovered}
          stroke="#33400A"
          opacity="0.06"
          className="z-10"
        />
        <div className="relative z-20">
          <div className="p-6">
            <h2
              className={`-ml-6 inline-block p-3 pl-6 text-2xl leading-8 font-bold transition duration-300 group-hover:bg-blue-950 group-focus:bg-blue-950 ${hoverTextColor}`}
            >
              {title}
            </h2>
            <p className="prose max-w-none text-blue-950/50 transition duration-300 group-hover:text-blue-950">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Card
