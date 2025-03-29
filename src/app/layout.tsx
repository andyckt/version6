import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MerchantDataProvider } from '@/components/providers/MerchantDataProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Travel Platform',
  description: 'Discover authentic travel experiences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <MerchantDataProvider>
          {children}
        </MerchantDataProvider>
      </body>
    </html>
  )
} 