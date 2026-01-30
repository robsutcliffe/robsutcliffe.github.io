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
  return (
    <div className="not-prose my-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <div key={index} className="border border-blue-950/50 p-6">
          <p className="mb-2 font-sans text-lg">{item.title}</p>
          <p className="text-sm text-blue-950/50">{item.description}</p>
        </div>
      ))}
    </div>
  )
}

export default CostGrid
