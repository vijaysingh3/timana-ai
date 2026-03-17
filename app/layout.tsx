import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Timana AI - Your Personal Assistant',
  description: 'Timana AI - Hindi mein baat karo, smart kaam karo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi" style={{ height: '100%' }}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#343541" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased" style={{ height: '100%', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}