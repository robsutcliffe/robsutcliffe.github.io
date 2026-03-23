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
    <div className="not-prose mt-4 mb-8 -ml-2 sm:ml-0">
      <div className="space-y-0">
        {stages.map((stage, index) => (
          <div key={index} className="relative flex pb-4 last:pb-0">
            {/* Line connecting circles */}
            {index !== stages.length - 1 && (
              <div
                className="absolute top-8 left-4 -ml-px h-full w-[1px] bg-blue-700 sm:top-12 sm:left-6"
                aria-hidden="true"
              />
            )}

            {/* Circle with number */}
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-800 text-yellow-50 sm:h-12 sm:w-12 sm:border-1 sm:border-blue-700 sm:bg-yellow-50 sm:text-blue-800">
              {stage.number}
            </div>

            <div className="mt-4 -mr-3 h-[1px] w-4 bg-blue-700 sm:mt-6 sm:w-9" />

            {/* Content */}
            <div>
              <h3 className="py-1 pl-5 text-base leading-6 font-extrabold text-blue-800 sm:py-0 sm:pl-7 sm:leading-12">
                {stage.title}
              </h3>
              <ul className="mt-2 mb-2 space-y-2 text-base sm:mt-0">
                {stage.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-center gap-2 leading-5 text-blue-800/80 sm:gap-4 sm:leading-6"
                  >
                    <span className="ml-2 h-1 w-1 shrink-0 rounded-full bg-blue-800" />
                    <span>{parseMarkdown(item)}</span>
                  </li>
                ))}
              </ul>
              {stage.outcome && (
                <div className="-ml-3 bg-yellow-200/30 py-2 pl-8 sm:pl-10">
                  <p className="text-base leading-6 font-medium text-blue-800 sm:leading-8">
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
