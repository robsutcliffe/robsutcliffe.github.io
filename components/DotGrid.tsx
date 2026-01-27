'use client'

import { useEffect, useRef, useState } from 'react'

const radius = 2
const grid = 16

const commonColor = '#093142'

const colours = ['#372429', '#2A3624', '#035534', '#66427A', '#126988', '#E43A24', '#ffffff']

export default function DotGrid() {
  const containerRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!containerRef.current) return

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  const cols = Math.floor(dimensions.width / grid)
  const rows = Math.floor(dimensions.height / grid)

  return (
    <svg ref={containerRef} className="bg-ff-navy h-full w-full">
      {Array.from({ length: cols * rows }, (_, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = col * grid + grid / 2
        const y = row * grid + grid / 2

        const isDifferentColor = Math.random() < 0.1
        const isDoubleSize = Math.random() < 1 / 50
        const isHidden = Math.random() < 0.2

        const fill = isDifferentColor
          ? colours[Math.floor(Math.pow(Math.random(), 14) * colours.length)]
          : commonColor
        const r = isHidden ? 0 : isDoubleSize ? radius * 2 : radius

        return <circle key={i} cx={x} cy={y} r={r} fill={fill} />
      })}
    </svg>
  )
}
