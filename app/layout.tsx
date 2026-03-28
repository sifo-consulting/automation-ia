import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Automation for SMEs | 500€',
  description: 'Automate your business processes with AI. Save time and money.',
  keywords: 'AI automation, SME, cost savings, business automation',
  openGraph: {
    title: 'AI Automation for SMEs',
    description: 'Automate your business processes with AI',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  )
}
