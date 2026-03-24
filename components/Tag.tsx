import { toTitleCase } from '@/data/utils/textUtils'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <div className="focus-ring mr-3 py-1 text-base font-bold text-red-700 transition-all duration-300 hover:text-red-600">
      {toTitleCase(text)}
    </div>
  )
}

export default Tag
