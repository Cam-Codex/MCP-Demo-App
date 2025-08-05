import './globals.css'
import { BrandProvider } from '../components/BrandProvider'
import React from 'react'

export const metadata = {
  title: 'MCP Demo Builder',
  description: 'White-label demo builder powered by ThoughtSpot',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BrandProvider>{children}</BrandProvider>
      </body>
    </html>
  )
}
