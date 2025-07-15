import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Walmart Toy Coin',
  description: 'The official Walmart Toy Coin. Join us on X, Telegram, and Discord!',
  generator: 'v0.dev',
  openGraph: {
    title: 'Walmart Toy Coin',
    description: 'The official Walmart Toy Coin. Join us on X, Telegram, and Discord!',
    url: 'https://walmarttoycoin.com',
    siteName: 'Walmart Toy Coin',
    images: [
      {
        url: '/shareimage.jpg',
        width: 1200,
        height: 630,
        alt: 'Walmart Toy Coin',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@WalmartToyCoin',
    title: 'Walmart Toy Coin',
    description: 'The official Walmart Toy Coin. Join us on X, Telegram, and Discord!',
    images: ['/shareimage.jpg'],
  },
  metadataBase: new URL('https://walmarttoycoin.com'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/Walmart Toy Coin.png" type="image/png" />
        {/* Discord social preview */}
        <meta property="og:title" content="Walmart Toy Coin" />
        <meta property="og:description" content="The official Walmart Toy Coin. Join us on X, Telegram, and Discord!" />
        <meta property="og:image" content="/shareimage.jpg" />
        <meta property="og:url" content="https://walmarttoycoin.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@WalmartToyCoin" />
        <meta name="twitter:title" content="Walmart Toy Coin" />
        <meta name="twitter:description" content="The official Walmart Toy Coin. Join us on X, Telegram, and Discord!" />
        <meta name="twitter:image" content="/shareimage.jpg" />
        {/* Telegram preview (uses Open Graph) */}
        {/* Discord invite (optional, for direct linking) */}
        <meta property="og:see_also" content="https://discord.gg/your-discord-invite" />
        <meta property="og:see_also" content="https://t.me/your-telegram-link" />
        <meta property="og:see_also" content="https://x.com/WalmartToyCoin" />
      </head>
      <body>{children}</body>
    </html>
  )
}
