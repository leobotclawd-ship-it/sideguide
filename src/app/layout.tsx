import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SideGuide - MTG Sideboard Guide Builder',
  description: 'Create and share MTG sideboard guides with visual matchup layouts',
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
      </body>
    </html>
  )
}
