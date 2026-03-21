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
    <div className="not-prose mt-4 mb-8 grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {items.map((item, index) => (
        <div key={index} className="border border-blue-800/50 p-6">
          <p className="mb-2 text-base font-bold text-blue-800">{item.title}</p>
          <p className="text-sm text-blue-800/80">{parseMarkdown(item.description)}</p>
        </div>
      ))}
    </div>
  )
}

export default CostGrid
