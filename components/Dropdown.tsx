import Link from '@/components/Link'
import CaretIcon from '@/components/CaretIcon'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { toTitleCase } from '@/data/utils/textUtils'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function Dropdown({ options }) {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(false)

  const selected = options.find((option) => option.selected) || { text: 'All Posts' }

  return (
    <div className="relative flex w-full flex-col" onMouseLeave={() => setOpen(false)}>
      <motion.div
        animate={open ? 'open' : 'closed'}
        onMouseEnter={() => setOpen(true)}
        className="text-ff-navy upercase pointer-events-auto relative flex h-24 shrink-0 cursor-pointer items-center bg-white px-8 pr-32 text-3xl leading-9 font-extrabold tracking-tight transition-all duration-300"
      >
        <Link className="w-full hover:underline" href={selected.href}>
          {toTitleCase(selected.text)}
        </Link>
        <button
          onClick={() => setOpen((prev) => !prev)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="hover:bg-ff-blue focus-ring absolute top-0 right-0 flex h-24 w-24 transform items-center justify-center overflow-hidden bg-blue-950 duration-300"
        >
          <AnimatedBackground isHovered={hover} opacity="0.5" stroke="#061E2A" />
          <CaretIcon stroke="#ffffff" className="relative z-10 h-10 w-10" />
        </button>
      </motion.div>
      {open && (
        <div className="pointer-events-auto absolute top-24 z-40 w-full max-w-full flex-1 overflow-y-scroll bg-blue-950">
          {options.map((option) => {
            return <DropdownOption key={option.text} option={option} />
          })}
        </div>
      )}
    </div>
  )
}

function DropdownOption({ option }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={option.href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className="group border-b-ff-blue/20 hover:bg-ff-blue focus:bg-ff-blue focus-ring relative block border-b-2 bg-transparent leading-9 font-extrabold tracking-tight text-white transition-all duration-300"
      aria-label={`View posts tagged ${toTitleCase(option.text)}`}
    >
      <div className="relative z-10 flex h-24 items-center px-8 text-3xl transition-colors duration-300">
        <AnimatedBackground isHovered={isHovered} opacity="0.5" stroke="#061E2A" />
        <span className="relative z-10 flex items-center">
          {toTitleCase(option.text)}{' '}
          {!!option.count && (
            <span className="bg-ff-blue group-hover:bg-ff-navy group-focus:bg-ff-navy ml-4 flex h-5 w-5 items-center justify-center rounded-full text-center text-sm text-white transition-all duration-300">
              {option.count}
            </span>
          )}
        </span>
      </div>
    </Link>
  )
}
