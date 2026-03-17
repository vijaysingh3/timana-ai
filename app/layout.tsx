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
    <html lang="hi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}