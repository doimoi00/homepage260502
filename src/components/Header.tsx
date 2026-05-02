import Link from 'next/link'

const NAV = [
  { href: '/', label: '홈' },
  { href: '/posts', label: '글' },
  { href: '/contact', label: '문의' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-cream/90 backdrop-blur-sm">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-green-deep hover:text-green-mid transition-colors">
          조중혁
        </Link>
        <nav className="flex gap-6">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-gray-600 hover:text-green-deep transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
