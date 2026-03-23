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
    <div className="not-prose my-12 flex flex-col justify-between border-l-4 border-blue-800 bg-white px-8 pt-4 pb-2 xl:flex-row">
      <div>
        <h3 className="mb-4 text-xl leading-12 font-bold text-blue-800">The Bottom Line:</h3>
        <div className="flex flex-col pb-4 leading-6 font-medium text-blue-800/80">
          {text1 && <div>{highlightBold(text1)}</div>}
          {text2 && <div>{highlightBold(text2)}</div>}
          {text3 && <div className="mt-2 leading-8 text-blue-800">{highlightBold(text3)}</div>}
        </div>
      </div>
      <div className="flex flex-row items-end justify-items-end">
        {ctaText && <CtaButton text={ctaText} />}
      </div>
    </div>
  )
}

export default BottomLine
