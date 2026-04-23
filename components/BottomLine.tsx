'use client'

import React from 'react'
import CtaButton from './CtaButton'

interface BottomLineProps {
  children?: React.ReactNode
  ctaText?: string
}

const BottomLine = ({ children, ctaText }: BottomLineProps) => {
  return (
    <div className="-mx-4 my-12 flex flex-col justify-between border-l-4 border-blue-800 bg-white px-8 pt-4 pb-2 sm:mx-0 xl:flex-row">
      <div>
        <h3 className="mb-4 text-2xl leading-12 font-bold text-blue-800">What You Get</h3>
        {children}
      </div>
      <div className="flex w-full min-w-14 flex-col items-end justify-items-end sm:w-auto sm:flex-row">
        {ctaText && <CtaButton text={ctaText} />}
      </div>
    </div>
  )
}

export default BottomLine
