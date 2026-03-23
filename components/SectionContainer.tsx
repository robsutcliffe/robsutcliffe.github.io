import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="px-4 pb-8 md:px-4 lg:px-6">
      {/*<Breadcrumb />*/}
      {/*<MenuBar />*/}
      <div className="mt-30 max-w-3xl px-4 py-4 md:mt-36 md:max-w-4xl md:px-6 lg:mt-40 lg:ml-14 lg:border-l lg:border-yellow-200 lg:px-8 xl:max-w-5xl">
        {children}
      </div>
    </section>
  )
}
