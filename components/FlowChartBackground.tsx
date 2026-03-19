'use client'

import { motion } from 'framer-motion'

interface FlowChartProps {
  strokeWidth?: number
  opacity?: any
  className?: string
}

export default function FlowChartBackground({
  strokeWidth = 1,
  opacity = 1,
  className = '',
}: FlowChartProps) {
  // Original SVG viewBox: 0 0 3746 1717
  // Scaling factors based on the nested transforms in the original SVG
  // Original base stroke-width was 35.45px, but user wants it thinner.
  // We'll normalize the strokeWidth.
  const yellow300 = '#ffffff'
  const yellow400 = '#ffffff'
  const yellow500 = '#ffffff'
  const yellow600 = '#ffffff'
  const highlightColor = '#115669'
  const animationColor = '#115669'

  return (
    <motion.svg
      width="100%"
      height="100%"
      viewBox="0 0 3746 1717"
      preserveAspectRatio="xMidYMax meet"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      style={{
        zIndex: 2,
        fillRule: 'evenodd',
        clipRule: 'evenodd',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeMiterlimit: 1.5,
        minWidth: '1000px',
        position: 'relative',
        left: '50%',
        transform: 'translateX(-50%)',
        opacity,
      }}
    >
      <g transform="matrix(1.96071,0,0,2.14548,-3843.95,0)">
        <rect x="1960.48" y="0" width="1910.48" height="800" style={{ fill: 'none' }} />
        <clipPath id="_clip1">
          <rect x="1960.48" y="0" width="1910.48" height="800" />
        </clipPath>
        <g clipPath="url(#_clip1)">
          <path
            d="M-26739.5,64627.9L-13232.1,64627.9C-13054.7,64627.9 -12759.2,64597.3 -12531.3,64498.6C-12520.9,64494 -9243.25,63067.5 -9243.25,63067.5C-9027.52,62986.9 -8836.64,62951.4 -8550.09,62951.4C-2315.41,62951.4 -2612.3,62951.4 -2612.3,62951.4"
            transform="matrix(0.0666289,0,0,0.142496,3744.75,-8690.43)"
            style={{
              fill: 'none',
              stroke: yellow300,
              strokeWidth: strokeWidth * 35.45,
              opacity: 0.7,
            }}
          />
          <path
            d="M-24524.5,64627.9L-13232.1,64627.9C-13054.7,64627.9 -12759.2,64597.3 -12531.3,64498.6C-12520.9,64494 -8241.92,62631.7 -8241.92,62631.7C-8026.19,62551.1 -7835.31,62515.5 -7548.76,62515.5C-7129.44,62515.5 -1626.4,62515.5 -1626.4,62515.5"
            transform="matrix(0.0666289,0,0,0.142496,3978.86,-8690.43)"
            style={{
              fill: 'none',
              stroke: yellow400,
              strokeWidth: strokeWidth * 35.45,
              opacity: 0.7,
            }}
          />
          <path
            d="M-16229.5,64627.9L-13232.1,64627.9C-13054.7,64627.9 -12759.2,64597.3 -12531.3,64498.6C-12520.9,64494 -8241.92,62631.7 -8241.92,62631.7C-8026.19,62551.1 -7835.31,62515.5 -7548.76,62515.5C-7262.21,62515.5 -6183.25,62515.5 -6183.25,62515.5"
            transform="matrix(0.0666289,0,0,0.142496,4282.97,-8869.63)"
            style={{
              fill: 'none',
              stroke: yellow500,
              strokeWidth: strokeWidth * 35.45,
              opacity: 0.7,
            }}
          />
          <path
            d="M-14985.3,64627.9L-13232.1,64627.9C-13054.7,64627.9 -12759.2,64597.3 -12531.3,64498.6C-12520.9,64494 -9769.93,63296.7 -9769.93,63296.7C-9554.2,63216.1 -9363.32,63180.6 -9076.77,63180.6C-9037.91,63180.6 -5180.06,63180.6 -5180.06,63180.6"
            transform="matrix(0.0666289,0,0,-0.142496,4214.78,9549.23)"
            style={{
              fill: 'none',
              stroke: yellow300,
              strokeWidth: strokeWidth * 35.45,
              opacity: 0.7,
            }}
          />
          <path
            d="M-24524.5,64627.9L-13232.1,64627.9C-13054.7,64627.9 -12759.2,64597.3 -12531.3,64498.6C-12520.9,64494 -11276.2,63952.3 -11276.2,63952.3C-11060.5,63871.7 -10869.6,63836.2 -10583.1,63836.2C-4822.39,63836.2 -4848.15,63836.2 -4848.15,63836.2"
            transform="matrix(0.0666289,0,0,0.142496,4192.78,-8690.43)"
            style={{
              fill: 'none',
              stroke: yellow400,
              strokeWidth: strokeWidth * 35.45,
              opacity: 0.7,
            }}
          />
          <path
            d="M-24524.5,64627.9L-13232.1,64627.9C-13054.7,64627.9 -12759.2,64597.3 -12531.3,64498.6C-12520.9,64494 -10675.7,63690.9 -10675.7,63690.9C-10460,63610.4 -10269.1,63574.8 -9982.53,63574.8L-1294.49,63574.8"
            transform="matrix(0.0666289,0,0,-0.142496,3884.28,9727.99)"
            style={{
              fill: 'none',
              stroke: yellow500,
              strokeWidth: strokeWidth * 35.45,
              opacity: 0.7,
            }}
          />
          <path
            d="M-24524.5,64627.9L-13232.1,64627.9C-13054.7,64627.9 -12759.2,64597.3 -12531.3,64498.6C-12520.9,64494 -9965.48,63387.5 -9965.48,63387.5C-9749.75,63306.9 -9558.87,63271.3 -9272.32,63271.3C-6834.05,63271.3 -3274.04,63271.3 -3274.04,63271.3"
            transform="matrix(0.0666289,0,0,-0.142496,4088.34,9727.99)"
            style={{
              fill: 'none',
              stroke: yellow300,
              strokeWidth: strokeWidth * 35.45,
              opacity: 0.7,
            }}
          />
          <path
            d="M-24524.5,64627.9L-13232.1,64627.9C-13054.7,64627.9 -12759.2,64597.3 -12531.3,64498.6C-12520.9,64494 -11425.8,64011.5 -11425.8,64011.5C-11210.1,63930.9 -11019.2,63895.3 -10732.6,63895.3L-1680.12,63895.3"
            transform="matrix(0.0666289,0,0,-0.142496,3814.34,9727.99)"
            style={{
              fill: 'none',
              stroke: yellow400,
              strokeWidth: strokeWidth * 35.45,
              opacity: 0.7,
            }}
          />
          <path
            d="M-24524.5,64627.9L-13232.1,64627.9C-13054.7,64627.9 -12759.2,64597.3 -12531.3,64498.6C-12520.9,64494 -9184.2,63053.6 -9184.2,63053.6C-8968.47,62973 -8777.59,62937.4 -8491.04,62937.4L1669.25,62937.4"
            transform="matrix(0.0666289,0,0,-0.142496,3742.97,9727.99)"
            style={{
              fill: 'none',
              stroke: yellow500,
              strokeWidth: strokeWidth * 35.45,
              opacity: 0.7,
            }}
          />
          <g transform="matrix(0.0666289,0,0,0.142496,3816.7,-8690.43)">
            <path
              d="M-24942.2,64627.9L-13232.1,64627.9C-13054.7,64627.9 -12759.2,64597.3 -12531.3,64498.6C-12520.9,64494 -10205.8,63486.4 -10205.8,63486.4C-9990.04,63405.8 -9799.16,63370.3 -9512.61,63370.3C-9397.95,63370.3 -3277.93,63370.3 -3277.93,63370.3"
              style={{
                fill: 'none',
                stroke: highlightColor,
                strokeWidth: strokeWidth * 35.45,
              }}
            />
            <motion.path
              d="M-24942.2,64627.9L-13232.1,64627.9C-13054.7,64627.9 -12759.2,64597.3 -12531.3,64498.6C-12520.9,64494 -10205.8,63486.4 -10205.8,63486.4C-9990.04,63405.8 -9799.16,63370.3 -9512.61,63370.3C-9397.95,63370.3 -3277.93,63370.3 -3277.93,63370.3"
              style={{
                fill: 'none',
                stroke: animationColor,
                strokeWidth: strokeWidth * 35.45 * 1.5,
              }}
              animate={{
                strokeDasharray: ['400, 22000'],
                strokeDashoffset: [400, -21600],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </g>
          <path
            d="M-13966.2,64627.9L-13232.1,64627.9C-13054.7,64627.9 -12759.2,64597.3 -12531.3,64498.6C-12520.9,64494 -11630.7,64106.6 -11630.7,64106.6C-11414.9,64026 -11224.1,63990.4 -10937.5,63990.4L-4456.56,63990.4"
            transform="matrix(0.0666289,0,0,-0.142496,4167.97,9878.18)"
            style={{
              fill: 'none',
              stroke: yellow300,
              strokeWidth: strokeWidth * 35.45,
              opacity: 0.7,
            }}
          />
          <path
            d="M-14448.6,64627.9L-13232.1,64627.9C-13054.7,64627.9 -12759.2,64597.3 -12531.3,64498.6C-12520.9,64494 -11630.7,64106.6 -11630.7,64106.6C-11414.9,64026 -11224.1,63990.4 -10937.5,63990.4L-7057.95,63990.4"
            transform="matrix(0.0666289,0,0,0.142496,4340.66,-8540.52)"
            style={{
              fill: 'none',
              stroke: yellow400,
              strokeWidth: strokeWidth * 35.45,
              opacity: 0.7,
            }}
          />
          <rect
            x="-7523.11"
            y="59424.4"
            width="764.448"
            height="764.448"
            transform="matrix(0.0114124,0.0104296,-0.0114124,0.0104296,4381.57,-209.017)"
            style={{ fill: 'rgb(21,8,56)' }}
          />
          <rect
            x="-7523.11"
            y="59424.4"
            width="764.448"
            height="764.448"
            transform="matrix(0.0114124,0.0104296,-0.0114124,0.0104296,4351.11,-269.483)"
            style={{
              fill: 'none',
              stroke: yellow300,
              strokeWidth: strokeWidth * 263.34,
              opacity: 0.7,
            }}
          />
          <rect
            x="-7523.11"
            y="59424.4"
            width="764.448"
            height="764.448"
            transform="matrix(0.0114124,0.0104296,-0.0114124,0.0104296,4374.33,-269.483)"
            style={{
              fill: 'none',
              stroke: yellow500,
              strokeWidth: strokeWidth * 263.34,
              opacity: 0.7,
            }}
          />
          <rect
            x="-7523.11"
            y="59424.4"
            width="764.448"
            height="764.448"
            transform="matrix(0.0114124,0.0104296,-0.0114124,0.0104296,4397.1,-269.483)"
            style={{
              fill: 'none',
              stroke: yellow600,
              strokeWidth: strokeWidth * 263.34,
              opacity: 0.7,
            }}
          />
          <rect
            x="-7523.11"
            y="59424.4"
            width="764.448"
            height="764.448"
            transform="matrix(0.0114124,0.0104296,-0.0114124,0.0104296,4483.3,73.7621)"
            style={{
              fill: 'none',
              stroke: yellow300,
              strokeWidth: strokeWidth * 263.34,
              opacity: 0.7,
            }}
          />
          <rect
            x="-7523.11"
            y="59424.4"
            width="764.448"
            height="764.448"
            transform="matrix(0.0114124,0.0104296,-0.0114124,0.0104296,4576.56,119.345)"
            style={{
              fill: 'none',
              stroke: yellow500,
              strokeWidth: strokeWidth * 263.34,
              opacity: 0.7,
            }}
          />
          <rect
            x="-7523.11"
            y="59424.4"
            width="764.448"
            height="764.448"
            transform="matrix(0.0114124,0.0104296,-0.0114124,0.0104296,4597.65,119.345)"
            style={{
              fill: 'none',
              stroke: yellow500,
              strokeWidth: strokeWidth * 263.34,
              opacity: 0.7,
            }}
          />
        </g>
      </g>
    </motion.svg>
  )
}
