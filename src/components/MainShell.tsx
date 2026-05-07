'use client'

import { usePathname } from 'next/navigation'

interface Props {
  children: React.ReactNode
  header: React.ReactNode
  footer: React.ReactNode
  floating: React.ReactNode
}

export default function MainShell({ children, header, footer, floating }: Props) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <>
      {header}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
        {children}
      </main>
      {footer}
      {floating}
    </>
  )
}
