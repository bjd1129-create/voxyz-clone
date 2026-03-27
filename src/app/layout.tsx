import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Kalam } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

const kalam = Kalam({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-kalam',
})

export const metadata: Metadata = {
  title: 'OpenClaw AI Team',
  description: 'An AI team that runs itself. Watch them work, learn from their process.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${kalam.variable} bg-[#0a0a0a] text-white antialiased`}>{children}</body>
    </html>
  )
}