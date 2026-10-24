import './globals.css'
import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import ScrollToTop from '../components/ScrollToTop'
import TitleAnimationsScript from '../components/TitleAnimationsScript'

// Lazy load Footer for better initial page load
const Footer = dynamic(() => import('../components/Footer'), {
  ssr: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'EF Engineering | Professional Engineering Services',
  description: 'Professional Engineering and Architectural Services delivering innovative solutions for your projects.',
  keywords: 'engineering, architecture, construction, design, Ethiopia',
  authors: [{ name: 'EF Engineering' }],
  openGraph: {
    title: 'EF Engineering',
    description: 'Professional Engineering and Architectural Services',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo/newlogo.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="dns-prefetch" href="https://api.efengineering-architect.com" />
        <link rel="preconnect" href="https://api.efengineering-architect.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <ScrollToTop />
        <TitleAnimationsScript />
      </body>
    </html>
  )
}