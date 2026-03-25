import type { Metadata } from 'next'
import './globals.css'
import ToastContainer from '@/components/Toast'

export const metadata: Metadata = {
  title: 'SideGuide - MTG Sideboard Guide Builder',
  description: 'Create and share MTG sideboard guides with visual matchup layouts',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-neutral-950 text-neutral-50">
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
