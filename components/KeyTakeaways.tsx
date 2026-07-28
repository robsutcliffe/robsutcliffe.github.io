interface KeyTakeawaysProps {
  items: string[]
  className?: string
}

const KeyTakeaways = ({ items, className = '' }: KeyTakeawaysProps) => {
  return (
    <div
      className={`relative -mx-8 my-8 bg-blue-800 py-2 pt-2.5 pr-8 text-[1.055rem] leading-7 font-bold ${className}`}
    >
      <ul className="z-30 pl-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="mt-[0.55rem] -ml-3.5 h-1.5 w-7 shrink-0 rounded-br-full bg-blue-500/50" />
            <span className="mt-[0.55rem] mr-3 -ml-1 h-1.5 w-5 shrink-0 rounded-tl-full rounded-br-full bg-blue-200" />
            <span className="leading-6 text-white">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default KeyTakeaways
