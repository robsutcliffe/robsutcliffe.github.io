'use client'
import React, { useState } from 'react'
import { Mail, Github, Facebook, Youtube, Linkedin, Twitter, Mastodon } from './icons'
import { motion } from 'framer-motion'
import AnimatedBackground from '@/components/AnimatedBackground'

const components = {
  mail: Mail,
  github: Github,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  mastodon: Mastodon,
}

type SocialIconProps = {
  kind: keyof typeof components
  href: string | undefined
  size?: number
}

const text = {
  twitter: '@firefilds',
  github: '@robsutcliffe',
  linkedin: 'Firefields',
  mail: 'rob@firefields.com',
  facebook: 'facebook.com',
  youtube: 'youtube.com',
  mastodon: 'mastodon.social',
}

const SocialIcon = ({ kind, href, size = 4 }: SocialIconProps) => {
  const [isHovered, setIsHovered] = useState(false)

  if (!href) return null

  if (kind === 'mail' && !href.startsWith('mailto:')) {
    href = `mailto:${href}`
  }

  const SocialSvg = components[kind]

  const content = text[kind] || kind

  return (
    <motion.a
      className="focus-ring relative flex h-16 min-w-16 cursor-pointer items-center justify-center overflow-hidden border-r-1 border-blue-100/50 px-6 text-sm text-white transition-colors hover:bg-blue-500 focus:bg-blue-500"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      aria-label={kind}
      initial="initial"
      whileHover="hover"
      animate="initial"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatedBackground isHovered={isHovered} opacity="0.3" stroke="#061E2A" />
      <div className="relative z-10 flex items-center">
        <SocialSvg className={`fill-current text-white h-${size} w-${size}`} />
        <motion.span
          variants={{
            initial: { width: 0, opacity: 0, marginLeft: 0 },
            hover: { width: 'auto', opacity: 1, marginLeft: 12 },
          }}
          className="overflow-hidden whitespace-nowrap"
        >
          {content}
        </motion.span>
      </div>
    </motion.a>
  )
}

export default SocialIcon
