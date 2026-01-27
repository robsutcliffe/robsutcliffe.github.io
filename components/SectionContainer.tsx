import { ReactNode } from 'react'
import Breadcrumb from '@/components/Breadcrumb'
import MenuBar from '@/components/MenuBar'

interface Props {
  children: ReactNode
}

export default function SectionContainer({ children }: Props) {
  return (
    <section className="w-screen p-2 pb-12 md:p-4 lg:p-6">
      {/*<Breadcrumb />*/}
      {/*<MenuBar />*/}
      <div className="mt-32 max-w-3xl lg:ml-36 xl:max-w-5xl">{children}</div>
    </section>
  )
}
