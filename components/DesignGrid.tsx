'use client'

import React from 'react'

const DesignGrid = () => {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-50 h-full w-full"
      style={{
        backgroundImage: `
          linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '4px 4px, 16px 16px',
      }}
    />
  )
}

export default DesignGrid
