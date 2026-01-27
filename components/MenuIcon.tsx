'use client'

import { motion, Transition } from 'framer-motion'
const transition: Transition = { duration: 0.5, ease: 'easeInOut' }

export default function MenuIcon({ stroke = '#061E2A', trim = '#ed3b25', delay = 0, ...props }) {
  return (
    <svg {...props} viewBox="0 0 50 50" fill="none">
      <motion.path
        initial={{ pathLength: 0, pathOffset: 0 }}
        d="M37 16L11 16C7.13401 16 4 12.866 4 9C4 5.13401 7.13401 2 11 2C11.1289 2 11.257 2.00348 11.3842 2.01036L28 4C31.3923 4.48523 34 7.47353 34 11C34 12.7135 33.4364 14.1974 32.4142 15.4142L14.4142 33.4142"
        stroke={stroke}
        strokeWidth="3"
        transition={transition}
        variants={{
          closed: {
            pathOffset: 0,
            pathLength: 0.16,
          },
          open: {
            pathLength: 0.25,
            pathOffset: 0.75,
          },
          closedHover: {
            pathOffset: 0.085,
            pathLength: 0.16,
          },
          openHover: {
            pathLength: 0.13,
            pathOffset: 0.75,
            x: -5,
          },
        }}
      />
      <motion.path
        d="M38 32.4142L12 32.4142C8.13401 32.4142 5 35.5482 5 39.4142C5 43.2802 8.13401 46.4142 12 46.4142C12.1289 46.4142 12.257 46.4107 12.3842 46.4039L29 44.4142C32.3923 43.929 35 40.9407 35 37.4142C35 35.7007 34.4364 34.2168 33.4142 33L15.4142 15"
        initial={{ pathLength: 0, pathOffset: 0 }}
        transition={transition}
        variants={{
          closed: {
            pathLength: 0.16,
            pathOffset: 0.1,
          },
          open: {
            pathLength: 0.25,
            pathOffset: 0.75,
          },
          closedHover: {
            pathLength: 0.16,
            pathOffset: 0,
          },
          openHover: {
            pathLength: 0.13,
            pathOffset: 0.75,
            x: -5,
          },
        }}
        stroke={stroke}
        strokeWidth="3"
      />
      <motion.path
        d="M11 24H37.5C41.0899 24 44 21.0899 44 17.5C44 16.4814 43.9176 15.6627 43.5 14.8045C39.8237 7.78759 32.4709 3 24 3C11.8497 3 2 12.8497 2 25C2 37.1503 11.8497 47 24 47C36.1503 47 46 37.1503 46 25C46 21.497 45.1813 18.1851 43.7247 15.2455C43.6773 15.1498 43.6293 15.0546 43.5806 14.9598"
        initial={{ pathLength: 0, pathOffset: 0 }}
        transition={transition}
        stroke={stroke}
        strokeWidth="3"
        variants={{
          closed: {
            pathLength: 0.15,
            pathOffset: 0,
          },
          open: {
            pathLength: 0.8,
            pathOffset: 0.21,
          },
          closedHover: {
            pathLength: 0.15,
            pathOffset: 0,
          },
          openHover: {
            pathLength: 0.8,
            pathOffset: 0.21,
          },
        }}
      />
    </svg>
  )
}
