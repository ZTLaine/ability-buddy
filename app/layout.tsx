import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/components/providers/session-provider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Ability Buddy',
  description: 'Ability Buddy is a platform for creating and sharing disability-related resources.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
