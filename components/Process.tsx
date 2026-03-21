import React from 'react'

interface ProcessStage {
  number: number
  title: string
  items: string[]
  outcome?: string
}

interface ProcessProps {
  stages: ProcessStage[]
}

const Process = ({ stages }: ProcessProps) => {
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
    <div className="not-prose mt-4 mb-8">
      <div className="space-y-0">
        {stages.map((stage, index) => (
          <div key={index} className="relative flex pb-6 last:pb-0">
            {/* Line connecting circles */}
            {index !== stages.length - 1 && (
              <div
                className="absolute top-12 left-6 -ml-px h-full w-[1px] bg-blue-800/50"
                aria-hidden="true"
              />
            )}

            {/* Circle with number */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-1 border-blue-800 bg-gray-100 text-blue-800">
              {stage.number}
            </div>

            <div className="mt-6 -mr-3 h-[1px] w-9 bg-blue-800/50" />

            {/* Content */}
            <div className="pt-3">
              <h3 className="mb-4 pl-7 text-base font-bold text-blue-800">{stage.title}</h3>
              <ul className="mb-3 space-y-2 text-sm">
                {stage.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center gap-4 text-blue-800/80">
                    <span className="ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-800" />
                    <span>{parseMarkdown(item)}</span>
                  </li>
                ))}
              </ul>
              {stage.outcome && (
                <div className="bg-blue-500/5 px-4 py-2">
                  <p className="text-sm font-medium text-blue-800">
                    {parseMarkdown(stage.outcome)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Process
