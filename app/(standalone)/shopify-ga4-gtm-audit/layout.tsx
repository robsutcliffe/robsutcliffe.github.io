import { ReactNode } from 'react'
import { ThemeProviders } from '../../theme-providers'
import { LazyMotion, domAnimation } from 'framer-motion'
import Border from '@/components/Border'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <ThemeProviders>
      <LazyMotion features={domAnimation}>
        <div className="flex min-h-svh flex-col font-sans">
          <Border showSearchBar={false} />
          <main className="mb-auto">{children}</main>
        </div>
      </LazyMotion>
    </ThemeProviders>
  )
}
