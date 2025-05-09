import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MerchantDataProvider } from '@/components/providers/MerchantDataProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Travel Platform',
  description: 'Discover authentic travel experiences, find local spots, and share your travel moments',
  keywords: 'travel, explore, food, attractions, hotel, luxury, drink, accommodation, nightlife, experiences',
  authors: [{ name: 'Travel Platform Team' }],
  creator: 'Travel Platform Team',
  publisher: 'Travel Platform',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://travel-platform.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Travel Platform',
    description: 'Discover authentic travel experiences, find local spots, and share your travel moments',
    siteName: 'Travel Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Platform',
    description: 'Discover authentic travel experiences, find local spots, and share your travel moments',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
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