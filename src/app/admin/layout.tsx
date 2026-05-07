'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const NAV = [
  { href: '/admin', label: '대시보드', icon: '📊' },
  { href: '/admin/spots', label: 'Spots', icon: '📍' },
  { href: '/admin/users', label: '사용자', icon: '👥' },
  { href: '/admin/reports', label: '신고', icon: '🚨' },
  { href: '/admin/notifications', label: '푸시 알림', icon: '🔔' },
]

const ADMIN_EMAIL = 'doimoi00@gmail.com'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user || user.email !== ADMIN_EMAIL) {
        router.replace('/auth/login?next=/admin')
      } else {
        setChecking(false)
      }
    })
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-gray-400 text-sm">인증 확인 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* 사이드바 */}
      <aside className="w-56 bg-gray-900 border-r border-gray-800 flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="px-5 py-5 border-b border-gray-800">
          <div className="text-white font-bold text-base leading-tight">Celeb Here</div>
          <div className="text-pink-400 text-xs font-semibold mt-0.5">Admin Panel</div>
        </div>
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {NAV.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="text-gray-600 text-xs">v1.0 · Celeb Here</div>
        </div>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 ml-56 min-h-screen">
        {children}
      </main>
    </div>
  )
}
