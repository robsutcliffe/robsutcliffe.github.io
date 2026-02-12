import 'css/tailwind.css'
import 'pliny/search/algolia.css'

import { Poppins, DM_Serif_Display } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchConfig } from 'pliny/search'
import { SearchProvider } from '@/components/SearchProvider'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
import MenuBar from '@/components/MenuBar'
import Link from 'next/link'

import Border from '@/components/Border'
import TextLogo from '@/components/TextLogoSimple'

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

const dm_serif_display = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-serif-display',
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
      className={`${poppins.variable} ${dm_serif_display.variable} scroll-smooth`}
      suppressHydrationWarning
    >
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
      <head>
        <link
          rel="preload"
          as="image"
          href="/static/images/hero/hero.webp"
          {...({ fetchPriority: 'high' } as any)}
        />
      </head>
      <body className="bg-slate-100 text-black antialiased">
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <div className="flex min-h-screen flex-col justify-between font-sans">
            <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
              <Border />
              <Link
                href="/"
                className="bg-primary invisible absolute top-12 left-33 z-10 h-24 px-6 py-4 xl:visible"
              >
                <TextLogo color="#fff" />
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
