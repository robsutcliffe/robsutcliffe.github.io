interface KeyTakeawaysProps {
  items: string[]
  className?: string
}

const KeyTakeaways = ({ items, className = '' }: KeyTakeawaysProps) => {
  return (
    <div className={`my-8 bg-yellow-100 py-2 pr-8 font-semibold ${className}`}>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-blue-800" />
            <span className="leading-6 text-blue-800">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default KeyTakeaways
