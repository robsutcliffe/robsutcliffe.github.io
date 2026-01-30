interface DualChecklistProps {
  leftTitle: string
  leftItems: string[]
  rightTitle: string
  rightItems: string[]
}

const ChecklistItem = ({ item }: { item: string }) => {
  const match = item.match(/^(.*?)\s*\((.*)\)$/)
  if (match) {
    const [, main, sub] = match
    return (
      <li className="flex items-start">
        <span className="mt-0.5 mr-2 flex-shrink-0 rounded-full bg-green-800 p-1 text-gray-100">
          <svg
            className="h-2 w-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <div className="flex flex-col">
          <span className="text-sm text-blue-950">{main}</span>
          <span className="text-sm text-blue-950/50">{sub}</span>
        </div>
      </li>
    )
  }

  return (
    <li className="flex items-start">
      <span className="mt-0.5 mr-2 flex-shrink-0 rounded-full bg-green-800 p-1 text-gray-100">
        <svg
          className="h-2 w-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <span className="text-sm text-blue-950">{item}</span>
    </li>
  )
}

const DualChecklist = ({ leftTitle, leftItems, rightTitle, rightItems }: DualChecklistProps) => {
  return (
    <div className="not-prose my-12 grid w-fit grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-0">
      <div className="lg:pr-12">
        <h3 className="mb-6 text-lg font-bold text-blue-950">{leftTitle}</h3>
        <ul className="space-y-6">
          {leftItems.map((item, index) => (
            <ChecklistItem key={index} item={item} />
          ))}
        </ul>
      </div>
      <div className="relative lg:pl-12">
        <div className="absolute top-0 left-0 hidden h-full w-px bg-blue-950/50 lg:block" />
        <h3 className="mb-6 text-lg font-bold text-blue-950">{rightTitle}</h3>
        <ul className="space-y-6">
          {rightItems.map((item, index) => (
            <ChecklistItem key={index} item={item} />
          ))}
        </ul>
      </div>
    </div>
  )
}

export default DualChecklist
