import 'css/tailwind.css'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import siteMetadata from '@/data/siteMetadata'
import { Metadata } from 'next'
import { ThemeProviders } from '../theme-providers'
import Link from 'next/link'
import { LazyMotion, domAnimation } from 'framer-motion'

import Border from '@/components/Border'
import TextLogo from '@/components/TextLogoSimple'
import { Suspense, lazy } from 'react'

const MenuBar = lazy(() => import('@/components/MenuBar'))
const Footer = lazy(() => import('@/components/Footer'))
const ScrollToTop = lazy(() => import('@/components/ScrollToTop'))

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProviders>
      <LazyMotion features={domAnimation}>
        <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
        <Suspense fallback={null}>
          <ScrollToTop />
        </Suspense>
        <div className="flex min-h-svh flex-col justify-between font-sans">
          <Border />
          <Link
            href="/"
            className="hi absolute top-8 left-20 z-10 h-20 bg-red-500 py-7 pr-4 pl-0 md:top-12 md:py-6 md:pr-6 md:pl-3"
            aria-label="Home"
          >
            <TextLogo color="#FDFCED" />
          </Link>
          <Suspense fallback={null}>
            <MenuBar />
          </Suspense>
          {/*<Header />*/}
          <main className="mb-auto">{children}</main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </div>
      </LazyMotion>
    </ThemeProviders>
  )
}
