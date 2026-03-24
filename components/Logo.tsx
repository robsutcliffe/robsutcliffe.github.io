'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Logo() {
  const [isSticky, setIsSticky] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setIsSticky(width > 1020)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Link href="/" aria-label="Home">
      <motion.div
        style={{
          background: '#EE3A24',
          transformOrigin: 'top left',
        }}
        whileHover="hover"
        variants={{
          hover: { left: -10 },
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`pointer-events-auto ${
          isSticky ? 'fixed' : 'absolute'
        } top-0 left-0 z-50 mt-8 flex h-20 items-center justify-center bg-white pl-0 text-black md:mt-12`}
      >
        <svg
          className="mx-6"
          width="35"
          height="35"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M79.0457 29.4749C84.4228 34.8719 88.3118 41.7669 90.0282 49.2176C92.2802 58.9601 90.8913 69.4665 86.03 78.316C80.2659 88.8125 69.7398 96.5707 57.8445 98.8724C47.3084 100.906 36.0182 98.6937 27.0001 92.6022C24.8373 91.1438 22.8234 89.4673 20.9781 87.6319C20.9483 87.6021 20.9186 87.5723 20.8888 87.5425C14.7973 81.4312 10.7197 73.3952 9.40022 64.9127C7.41602 52.2337 11.6126 38.7808 20.9284 29.465L49.997 0.396347L79.0556 29.465L79.0457 29.4749ZM70.0671 38.4533L49.997 18.3832L29.8871 38.4831C25.0258 43.3643 22.0296 50.0511 21.6626 56.9859C21.236 64.8433 24.2024 72.7899 29.7978 78.4648C29.8474 78.5243 29.907 78.5739 29.9566 78.6335C35.5223 84.1694 43.459 87.245 51.3661 86.868C60.7712 86.4215 69.8191 81.0145 74.6308 72.6411C78.9861 65.0516 79.5218 55.4382 76.1288 47.4319C74.7101 44.0885 72.6267 41.0428 70.0373 38.4732L70.0671 38.4533Z"
            fill="#FDFCED"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.35, ease: 'easeInOut', delay: 1.2 }}
          />
          <motion.path
            d="M49.7955 80.283L61.0971 68.9815C66.0509 64.0088 66.0697 55.9285 61.0971 50.9559L49.7771 62.2758C44.8233 67.2485 44.8229 75.3292 49.7955 80.283Z"
            fill="#FDFCED"
            initial={{ scale: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeInOut', delay: 1.4 }}
          />
          <motion.path
            d="M35.1562 65.083L49.811 50.4475C54.7649 45.456 54.7837 37.3749 49.811 32.421L35.1562 47.0758C30.1835 52.0485 30.2024 60.1292 35.1562 65.083Z"
            fill="#FDFCED"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeInOut', delay: 1.4 }}
          />
          <motion.path
            d="M79.0652 29.4646C84.4522 34.8705 88.3326 41.7456 90.0466 49.2046C92.3069 58.9427 90.9129 69.4535 86.0532 78.3063C80.2894 88.7979 69.7603 96.5577 57.8748 98.8557C47.3267 100.89 36.0443 98.686 27.0219 92.5832C24.8558 91.1328 22.84 89.4566 20.9941 87.6296C20.9752 87.5919 20.9379 87.5546 20.9002 87.5357C14.8163 81.4141 10.7466 73.39 9.40926 64.895C7.43149 52.2184 11.6335 38.77 20.9573 29.4462L50.0204 0.382137L79.0836 29.4462L79.0652 29.4646Z"
            stroke="#FDFCED"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, ease: 'easeInOut', delay: 0.7 }}
          />
          <motion.path
            d="M70.0779 38.4485L50.0188 18.3692L29.9211 38.4669C25.0426 43.3454 22.048 50.0323 21.6712 56.9827C21.2568 64.8373 24.2317 72.7858 29.8071 78.4554C29.8636 78.5119 29.9198 78.5686 29.9763 78.6063C35.5329 84.144 43.4823 87.2338 51.3745 86.8571C60.7924 86.405 69.8343 80.9986 74.6563 72.6354C79.0074 65.0446 79.5349 55.4192 76.1444 47.414C74.7317 44.08 72.6401 41.0286 70.0595 38.4669L70.0779 38.4485Z"
            stroke="#FDFCED"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.9 }}
          />
          <motion.path
            d="M49.7955 80.283L61.0971 68.9815C66.0509 64.0088 66.0697 55.9285 61.0971 50.9559L49.7771 62.2758C44.8233 67.2485 44.8229 75.3292 49.7955 80.283Z"
            stroke="#FDFCED"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.9 }}
          />
          <motion.path
            d="M35.1562 65.083L49.811 50.4475C54.7649 45.456 54.7837 37.3749 49.811 32.421L35.1562 47.0758C30.1835 52.0485 30.2024 60.1292 35.1562 65.083Z"
            stroke="#FDFCED"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.9 }}
          />
        </svg>
      </motion.div>
    </Link>
  )
}
