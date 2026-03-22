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

const Card = ({ title, description, imgSrc, href, color = 'yellow', nextAvailable, cost }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [hasBlueImg, setHasBlueImg] = useState(false)

  const blueImgSrc = imgSrc?.replace(/\.(webp|png|jpg|jpeg)$/, '-blue.$1')

  useEffect(() => {
    if (blueImgSrc) {
      const img = new window.Image()
      img.src = blueImgSrc
      img.onload = () => setHasBlueImg(true)
      img.onerror = () => setHasBlueImg(false)
    }
  }, [blueImgSrc])

  const hoverTextColor = 'group-hover:text-blue-900 group-focus:text-blue-900' // colorMap[color] || colorMap.yellow

  return (
    <Link
      className="md group relative max-w-[544px] p-6 outline-none md:w-1/2"
      href={href}
      aria-label={`Link to ${title}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full overflow-hidden rounded-xs border border-blue-600 transition duration-300 outline-none group-hover:border-blue-800 group-focus:border-blue-800 group-focus-visible:ring-2 group-focus-visible:ring-red-500 group-focus-visible:ring-offset-2 group-active:scale-95">
        <div className="absolute top-0 z-20 flex w-full justify-between text-xs tracking-wide text-white uppercase">
          {nextAvailable && (
            <div
              className={` ${nextAvailable === 'now' ? 'border-r border-b border-blue-600 bg-yellow-200 font-bold text-blue-800' : 'bg-blue-800'} px-3 py-2`}
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
        <div className="relative z-10 h-40 overflow-hidden bg-white transition duration-300 md:h-36 lg:h-48">
          <Image
            alt={title}
            src={imgSrc}
            className="h-full w-full object-cover object-center transition duration-300"
            width={544}
            height={306}
          />
          {hasBlueImg && (
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
          <div className="px-6 pb-6">
            <h2
              className={`relative !mt-3 -ml-6 inline-block p-3 pl-6 text-2xl leading-8 font-bold transition duration-300 group-focus:bg-blue-800 ${hoverTextColor}`}
            >
              <SlidingBackground isHovered={isHovered} />
              <span className="relative z-10">{title}</span>
            </h2>
            <p className="max-w-none text-blue-800/80 transition duration-300 group-hover:text-blue-900">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Card
