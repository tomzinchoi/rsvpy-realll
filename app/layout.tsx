import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RSVPY - Event Management and RSVP System',
  description: 'Create, manage and share invitations with ease. Get RSVPs in real-time.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <AuthProvider>
          <Header />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <footer className="mt-auto py-6 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4 text-center text-sm text-gray-600">
              <p>© {new Date().getFullYear()} RSVPY. All rights reserved.</p>
              <div className="mt-2 space-x-4">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Terms of Service</a>
                <a href="#" className="hover:underline">Contact</a>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
