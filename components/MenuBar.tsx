'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function MenuBar() {
  const pathname = usePathname()

  const links = [
    { href: '/services', label: 'Services' },
    { href: '/insights', label: 'Insight' },
    { href: '/case-studies', label: 'Case Study' },
    { href: '/contact', label: 'Contact Us' },
  ]

  return (
    <div className="pointer-events-auto invisible absolute top-2 right-20 z-20 flex h-18 flex-row items-center justify-between bg-white text-blue-800 md:top-4 md:right-22 lg:top-6 lg:right-24 xl:visible">
      {links.map((link) => (
        <MenuBarItem key={link.href} href={link.href} label={link.label} pathname={pathname} />
      ))}
    </div>
  )
}

function MenuBarItem({ href, label, pathname }) {
  const [isHovered, setIsHovered] = useState(false)
  const isActive = pathname.startsWith(href)

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      className={`focus-ring relative flex h-full cursor-pointer items-center px-6 py-2 transition-colors duration-300 ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white'
      }`}
    >
      <AnimatedBackground isHovered={isHovered} opacity="0.6" stroke="#180A40" />
      <span className="relative z-10">{label}</span>
    </Link>
  )
}
