import React from 'react'
import CtaButton from './CtaButton'

interface BottomLineProps {
  text1?: string
  text2?: string
  text3?: string
  ctaText?: string
}

const BottomLine = ({ text1, text2, text3, ctaText }: BottomLineProps) => {
  const highlightBold = (text: string) => {
    if (!text) return null
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>
      }
      return part
    })
  }

  return (
    <div className="not-prose my-12 border-l-4 border-blue-800 bg-blue-500/5 px-8 pt-8 pb-1">
      <h3 className="mb-4 text-lg font-bold text-blue-800">The Bottom Line:</h3>
      <div className="flex flex-col text-xs leading-relaxed font-medium text-blue-800/80 md:text-sm">
        {text1 && <div>{highlightBold(text1)}</div>}
        {text2 && <div>{highlightBold(text2)}</div>}
        {text3 && <div className="mt-2 text-sm text-blue-800">{highlightBold(text3)}</div>}
      </div>
      {ctaText && <CtaButton text={ctaText} />}
    </div>
  )
}

export default BottomLine
