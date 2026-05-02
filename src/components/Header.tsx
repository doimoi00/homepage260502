import Link from 'next/link'
import AuthButtons from '@/components/auth/AuthButtons'

const NAV = [
  { href: '/', label: '홈' },
  { href: '/board', label: '게시판' },
  { href: '/posts', label: '글' },
  { href: '/contact', label: '문의' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-cream/90 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-lg font-bold text-green-deep hover:text-green-mid transition-colors shrink-0">
          조중혁
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="flex gap-4 sm:gap-6">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href}
                className="text-sm text-gray-600 hover:text-green-deep transition-colors">
                {label}
              </Link>
            ))}
          </nav>
          <AuthButtons />
        </div>
      </div>
    </header>
  )
}
