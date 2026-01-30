import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="p-2 pb-12 md:p-4 lg:p-6">
      {/*<Breadcrumb />*/}
      {/*<MenuBar />*/}
      <div className="mt-30 max-w-3xl p-6 md:mt-36 md:max-w-4xl lg:mt-40 lg:ml-36 xl:max-w-5xl">
        {children}
      </div>
    </section>
  )
}
