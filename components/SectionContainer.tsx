import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="p-2 pb-12 md:p-4 lg:p-6">
      {/*<Breadcrumb />*/}
      {/*<MenuBar />*/}
      <div className="mt-30 max-w-3xl px-12 py-4 md:mt-36 md:max-w-4xl lg:mt-40 lg:ml-35 lg:border-l lg:border-blue-800 lg:px-8 xl:max-w-5xl">
        {children}
      </div>
    </section>
  )
}
