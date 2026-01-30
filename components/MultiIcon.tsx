'use client'

import { motion, Transition } from 'framer-motion'
const transition: Transition = { duration: 0.7, ease: 'easeInOut' }

export default function MultiIcon({ stroke = '#080417', strokeWidth = 1.3, ...props }) {
  return (
    <svg {...props} viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.path
        d="M37 16L11 16C7.13401 16 4 12.866 4 9C4 5.13401 7.13401 2 11 2C11.1289 2 11.257 2.00348 11.3842 2.01036L28 4C31.3923 4.48523 34 7.47353 34 11C34 12.7135 33.4364 14.1974 32.4142 15.4142L14.4142 33.4142C13.5 34.3284 12.3853 34.5 11.5 34.5C9.15279 34.5 7.5 32.5972 7.5 30.25C7.5 29.3148 7.5 28 9 26.5L19 16.5C20.32 15.5392 22.2424 15 24 15C28.4183 15 32 18.5817 32 23C32 27.4183 28.4183 31 24 31C19.5817 31 16 27.4183 16 23C16 20.3394 17.2482 17.7845 19.2464 16.33"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        transition={transition}
        initial={{
          pathLength: 0,
          pathOffset: 0.5,
        }}
        variants={{
          menu: {
            pathOffset: 0,
            pathLength: 0.09,
            y: 0,
          },
          open: {
            pathLength: 0.123,
            pathOffset: 0.436,
            y: 0.9,
          },
          search: {
            pathLength: 0.28,
            pathOffset: 0.725,
            y: 0,
          },
        }}
      />
      <motion.path
        d="M12 24H38.5C42.0899 24 45 21.0899 45 17.5C45 16.4814 44.9176 15.6627 44.5 14.8045C40.8237 7.78759 33.4709 3 25 3C12.8497 3 3 12.8497 3 25C3 37.1503 12.8497 47 25 47C37.1503 47 47 37.1503 47 25C47 21.497 46.1813 18.1851 44.7247 15.2455C44.6773 15.1498 44.6293 15.0546 44.5806 14.9598"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        transition={transition}
        initial={{
          pathLength: 0,
          pathOffset: 0.5,
        }}
        variants={{
          menu: {
            pathLength: 0.15,
            pathOffset: 0,
            strokeWidth: strokeWidth / 1.06,
            opacity: 1,
          },
          open: {
            pathLength: 0.8,
            pathOffset: 0.21,
            strokeWidth: strokeWidth / 2,
            opacity: 0.3,
          },
          search: {
            pathLength: 0.8,
            pathOffset: 0.21,
            strokeWidth: strokeWidth / 2,
            opacity: 0.3,
          },
        }}
      />
      <motion.path
        d="M39 32.4142H13C9.13401 32.4142 6 35.5482 6 39.4142C6 43.2802 9.13401 46.4142 13 46.4142C13.1289 46.4142 13.257 46.4107 13.3842 46.4039L30 44.4142C33.3923 43.929 36 40.9407 36 37.4142C36 35.7007 35.4364 34.2168 34.4142 33L16.4142 15"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        transition={transition}
        initial={{
          pathLength: 0,
          pathOffset: 0.5,
        }}
        variants={{
          menu: {
            pathLength: 0.155,
            pathOffset: 0.1,
            y: 0,
          },
          open: {
            pathLength: 0.215,
            pathOffset: 0.775,
            y: 1,
          },
          search: {
            pathLength: 0.08,
            pathOffset: 0.75,
            y: 0,
          },
        }}
      />
    </svg>
  )
}
