import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="px-6 py-6 text-4xl leading-10 font-bold tracking-wide text-blue-950 sm:text-4xl md:text-6xl md:leading-16 lg:px-0 lg:leading-18">
      {children}
    </h1>
  )
}
