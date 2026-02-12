import MenuIcon from '@/components/MenuIcon'
import { motion } from 'framer-motion'
import { KBarSearch } from 'kbar'

export default function MenuTop({ hover, open, setHover, setOpen }) {
  return (
    <motion.div
      className="group pointer-events-auto relative flex cursor-pointer justify-end gap-6 bg-white p-3"
      animate={open ? (hover ? 'openHover' : 'open') : hover ? 'closedHover' : 'closed'}
      onMouseOut={() => setHover(false)}
      onMouseOver={() => setHover(true)}
    >
      {open && (
        <div className="w-full">
          <KBarSearch
            className="focus-ring w-full border-0 bg-gray-100 text-2xl"
            placeholder="search"
          />
        </div>
      )}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="focus-ring"
        aria-label={open ? 'Close Menu' : 'Open Menu'}
      >
        <MenuIcon
          className="relative z-10 h-12 w-12 cursor-pointer"
          stroke="#080417"
          aria-hidden="true"
        />
      </button>
    </motion.div>
  )
}
