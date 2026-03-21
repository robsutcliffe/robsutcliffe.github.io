import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return <h1 className="px-0 pb-6 text-blue-800">{children}</h1>
}
