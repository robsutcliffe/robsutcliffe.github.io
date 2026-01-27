import Link from 'next/link'
import { slug } from 'github-slugger'
import { toTitleCase } from '@/data/utils/textUtils'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/insights/${slug(text)}`}
      className="focus-ring mr-3 py-1 text-base font-bold text-red-700 transition-all duration-300 hover:text-red-600"
    >
      {toTitleCase(text)}
    </Link>
  )
}

export default Tag
