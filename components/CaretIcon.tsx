'use client'

import { motion, Transition } from 'framer-motion'
const transition: Transition = { duration: 0.2, ease: 'easeInOut' }

export default function CaretIcon({ stroke = '#061E2A', ...props }) {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <motion.path
        d="M10.0933 20.4365L25.2832 5.24664L40.4426 20.4061"
        transition={transition}
        stroke={stroke}
        stroke-width={3}
        stroke-miterlimit="1.5"
        stroke-linejoin="round"
        variants={{
          closed: {
            y: 0,
          },
          open: {
            y: 20,
          },
        }}
      />
      <motion.path
        d="M10.0937 29.453L25.2836 44.6429L40.443 29.4835"
        transition={transition}
        stroke={stroke}
        stroke-width={3}
        stroke-miterlimit="1.5"
        stroke-linejoin="round"
        variants={{
          closed: {
            y: 0,
          },
          open: {
            y: -20,
          },
        }}
      />
    </svg>
  )

  // <svg {...props} viewBox="0 0 50 50" fill="none">
  //       <motion.path
  //         stroke={stroke}
  //         strokeWidth="3"
  //         transition={transition}
  //         d="M3.52625 3.5462L46.4196 46.4598"
  //         initial={{ pathLength: 0, pathOffset: 0.5 }}
  //         variants={{
  //           closed: {
  //             pathOffset: 0,
  //             pathLength: 0.52,
  //             y: 10,
  //           },
  //           open: {
  //             pathLength: 0.5,
  //             pathOffset: 0.25,
  //           },
  //           closedHover: {
  //             pathOffset: 0,
  //             pathLength: 0.52,
  //             y: 15,
  //           },
  //           openHover: {
  //             pathLength: 0.52,
  //             pathOffset: 0.48,
  //             y: -10,
  //           },
  //         }}
  //       />
  //
  //       <motion.path
  //         stroke={stroke}
  //         strokeWidth="3"
  //         transition={transition}
  //         d="M46.5419 3.5462L3.64851 46.4598"
  //         initial={{ pathLength: 0, pathOffset: 0.5 }}
  //         variants={{
  //           closed: {
  //             pathOffset: 0,
  //             pathLength: 0.52,
  //             y: 10,
  //           },
  //           open: {
  //             pathLength: 0.5,
  //             pathOffset: 0.25,
  //           },
  //           closedHover: {
  //             pathOffset: 0,
  //             pathLength: 0.52,
  //             y: 15,
  //           },
  //           openHover: {
  //             pathLength: 0.52,
  //             pathOffset: 0.48,
  //             y: -10,
  //           },
  //         }}
  //       />
  //     </svg>
}
