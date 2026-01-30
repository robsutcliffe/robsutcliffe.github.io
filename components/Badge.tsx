import React from 'react'

interface BadgeProps {
  children: React.ReactNode
}

const Badge = ({ children }: BadgeProps) => {
  return (
    <span className="not-prose my-4 inline-block bg-cyan-500/90 px-3 py-1 text-xs font-bold tracking-wide text-cyan-900 uppercase">
      {children}
    </span>
  )
}

export default Badge
