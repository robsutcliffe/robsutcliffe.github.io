'use client'

interface CostItem {
  title: string
  description: string
  emoji: string
}

interface CostGridProps {
  items: CostItem[]
}

const CostGrid = ({ items }: CostGridProps) => {
  const parseMarkdown = (text: string) => {
    // Handle bold (**text**)
    const boldParts = text.split(/(\*\*.*?\*\*)/g)
    return boldParts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={`bold-${i}`} className="font-bold text-blue-800">
            {part.slice(2, -2)}
          </strong>
        )
      }
      // Handle italic (_text_ or *text*)
      const italicParts = part.split(/((?:_|\*)(?:(?!\*\*).)*?(?:_|\*))/g)
      return italicParts.map((iPart, j) => {
        if (
          (iPart.startsWith('_') && iPart.endsWith('_')) ||
          (iPart.startsWith('*') && iPart.endsWith('*'))
        ) {
          if (iPart.startsWith('**')) return iPart
          return <em key={`italic-${j}`}>{iPart.slice(1, -1)}</em>
        }
        return iPart
      })
    })
  }

  return (
    <div className="not-prose -mx-4 mt-4 mb-8 grid grid-cols-1 gap-2 sm:mx-0 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {items.map((item, index) => (
        <div key={index} className="shadow-inset-all p-4">
          <p className="mb-2 text-base font-bold text-blue-800 sm:mb-4">{item.title}</p>
          <p className="text-base leading-6 text-blue-800/80">{parseMarkdown(item.description)}</p>
        </div>
      ))}
    </div>
  )
}

export default CostGrid
