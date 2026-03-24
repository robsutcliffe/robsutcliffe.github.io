import 'css/tailwind.css'

import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchConfig } from 'pliny/search'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
import MenuBar from '@/components/MenuBar'
import Link from 'next/link'
import localFont from 'next/font/local'
import Script from 'next/script'

import Border from '@/components/Border'
import TextLogo from '@/components/TextLogoSimple'
import ScrollToTop from '@/components/ScrollToTop'
import { Suspense, lazy } from 'react'

const SearchProvider = lazy(() =>
  import('@/components/SearchProvider').then((mod) => ({ default: mod.SearchProvider }))
)

const bwQuintaPro = localFont({
  src: [
    {
      path: '../public/static/fonts/Bw Quinta Pro/Light/Bw Quinta Pro - Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/static/fonts/Bw Quinta Pro/Light Italic/Bw Quinta Pro - Light Italic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/static/fonts/Bw Quinta Pro/Regular/Bw Quinta Pro - Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/static/fonts/Bw Quinta Pro/Regular Italic/Bw Quinta Pro - Regular Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/static/fonts/Bw Quinta Pro/Medium/Bw Quinta Pro - Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/static/fonts/Bw Quinta Pro/Medium Italic/Bw Quinta Pro - Medium Italic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/static/fonts/Bw Quinta Pro/Bold/Bw Quinta Pro - Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/static/fonts/Bw Quinta Pro/Bold Italic/Bw Quinta Pro - Bold Italic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/static/fonts/Bw Quinta Pro/Black/Bw Quinta Pro - Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/static/fonts/Bw Quinta Pro/Black Italic/Bw Quinta Pro - Black Italic.woff2',
      weight: '900',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-bw-quinta-pro',
  adjustFontFallback: 'Arial',
})

const bwDarius = localFont({
  src: [
    {
      path: '../public/static/fonts/Bw Darius/Light/Bw Darius - Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/static/fonts/Bw Darius/Light Italic/Bw Darius - Light Italic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/static/fonts/Bw Darius/Regular/Bw Darius - Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/static/fonts/Bw Darius/Regular Italic/Bw Darius - Regular Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/static/fonts/Bw Darius/Medium/Bw Darius - Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/static/fonts/Bw Darius/Medium Italic/Bw Darius - Medium Italic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../public/static/fonts/Bw Darius/Bold/Bw Darius - Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/static/fonts/Bw Darius/Bold Italic/Bw Darius - Bold Italic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/static/fonts/Bw Darius/ExtraBold/Bw Darius - ExtraBold.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/static/fonts/Bw Darius/ExtraBold Italic/Bw Darius - ExtraBold Italic.woff2',
      weight: '800',
      style: 'italic',
    },
    {
      path: '../public/static/fonts/Bw Darius/Black/Bw Darius - Black.woff2',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../public/static/fonts/Bw Darius/Black Italic/Bw Darius - Black Italic.woff2',
      weight: '900',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-bw-darius',
  adjustFontFallback: 'Times New Roman',
})

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteMetadata.language}
      className={`${bwQuintaPro.variable} ${bwDarius.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/favicons/favicon-16x16.png" />
        <link rel="icon" href="/static/favicons/favicon.ico" />
        <link rel="manifest" href="/static/favicons/site.webmanifest" />
        <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        <link
          rel="preload"
          href="/static/fonts/Bw Quinta Pro/Regular/Bw Quinta Pro - Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/static/fonts/Bw Darius/Regular/Bw Darius - Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://plausible.io" />
        <Script
          async
          defer
          data-domain="firefields.com"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-w-[320px] bg-yellow-50/80 text-blue-800 antialiased">
        {/*<div*/}
        {/*  className="pointer-events-none absolute inset-0 z-50 h-full w-full"*/}
        {/*  style={{*/}
        {/*    backgroundImage: `*/}
        {/*      linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 1px),*/}
        {/*      linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)*/}
        {/*    `,*/}
        {/*    backgroundSize: '4px 4px, 16px 16px',*/}
        {/*  }}*/}
        {/*/>*/}
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <Suspense fallback={null}>
            <ScrollToTop />
          </Suspense>
          <div className="flex min-h-svh flex-col justify-between font-sans">
            <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
              <Border />
              <Link
                href="/"
                className="invisible absolute top-12 left-20 z-10 h-20 bg-red-500 py-6 pr-6 pl-2 md:visible"
                aria-label="Home"
              >
                <TextLogo color="#FDFCED" />
              </Link>
              <MenuBar />
              {/*<Header />*/}
              <main className="mb-auto">{children}</main>
            </SearchProvider>
            <Footer />
          </div>
        </ThemeProviders>
      </body>
    </html>
  )
}
