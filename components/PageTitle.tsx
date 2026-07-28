import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function PageTitle({ children }: Props) {
  return (
    <h1 className="mb-4 max-w-2xl px-0 text-2xl leading-8 font-extrabold tracking-tight text-blue-800 sm:text-3xl sm:leading-[3rem] md:text-4xl">
      {children}
    </h1>
  )
}
