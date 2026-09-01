const DEFAULT_MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

interface DropdownOption {
  value: string | number
  label: string
}

interface MonthDropdownProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  value: string | number
  options?: DropdownOption[]
  label?: string
  placeholder?: string
  className?: string
  selectClassName?: string
}

export default function MonthDropdown({
  onChange,
  value,
  options = DEFAULT_MONTHS,
  label = 'Survey Month Reference (month_ref: 1-12)',
  placeholder,
  className,
  selectClassName,
}: MonthDropdownProps) {
  return (
    <fieldset className={`group flex flex-col gap-0 ${className ?? ''}`}>
      <label className="z-10 -mb-4 ml-2 flex h-8 w-fit flex-row items-center gap-2 bg-yellow-50 px-2 text-xs tracking-wide text-blue-700 group-focus-within:text-blue-500">
        {label}
      </label>
      <select
        className={`h-12 w-full rounded-none border border-blue-700 bg-transparent p-2 px-4 text-sm font-bold text-blue-700 transition-opacity focus:border-blue-500 focus:ring-0 disabled:opacity-50 ${selectClassName ?? ''}`}
        value={value}
        onChange={onChange}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </fieldset>
  )
}
