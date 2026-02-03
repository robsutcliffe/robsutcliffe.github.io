import React from 'react'
import CtaButton from './CtaButton'

interface HighlightBoxProps {
  title?: string
  items?: string[]
  ctaText?: string
  className?: string
}

const HighlightBox = ({
  title,
  items,
  ctaText = 'Book Strategy Call',
  className = '',
}: HighlightBoxProps) => {
  const parseMarkdown = (text: string) => {
    // Handle bold (**text**)
    const boldParts = text.split(/(\*\*.*?\*\*)/g)
    return boldParts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`bold-${i}`} className="text-white">
            {part.slice(2, -2)}
          </strong>
        )
      }
      // Handle italic (_text_ or *text*)
      // Use a non-greedy match that doesn't include delimiters in the middle
      const italicParts = part.split(/((?:_|\*)(?:(?!\*\*).)*?(?:_|\*))/g)
      return italicParts.map((iPart, j) => {
        if (
          (iPart.startsWith('_') && iPart.endsWith('_')) ||
          (iPart.startsWith('*') && iPart.endsWith('*'))
        ) {
          // Double check it's not actually bold that was somehow split
          if (iPart.startsWith('**')) return iPart
          return <em key={`italic-${j}`}>{iPart.slice(1, -1)}</em>
        }
        return iPart
      })
    })
  }

  return (
    <div
      className={`not-prose mt-4 mb-8 overflow-hidden bg-blue-950 px-8 pb-2 text-white ${className}`}
    >
      <div className="prose prose-invert prose-headings:m-0 prose-strong:text-white max-w-none text-white/80">
        {title && (
          <h2 className="mb-4 font-serif text-3xl !leading-tight text-white md:text-4xl">
            {title}
          </h2>
        )}
        {items && (
          <ul className="mb-4 space-y-2 pl-1">
            {items.map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-blue-50/90">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-200" />
                <span>{parseMarkdown(item)}</span>
              </li>
            ))}
          </ul>
        )}
        <CtaButton text={ctaText} />
      </div>
    </div>
  )
}

export default HighlightBox
