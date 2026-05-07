'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import FloatingKakao from './FloatingKakao'

export default function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {children}
      </main>
      <Footer />
      <FloatingKakao />
    </>
  )
}
