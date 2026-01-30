interface ChecklistProps {
  items: string[]
}

const Checklist = ({ items }: ChecklistProps) => {
  return (
    <ul className="not-prose my-6 space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="mr-3 flex-shrink-0 rounded-full bg-green-800 p-1 text-gray-100">
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span className="text-gray-700 dark:text-gray-300">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default Checklist
