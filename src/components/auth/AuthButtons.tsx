'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function AuthButtons() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null
    try {
      const supabase = createClient()
      supabase.auth.getUser().then(({ data }) => setUser(data.user))

      const { data } = supabase.auth.onAuthStateChange((_, session) => {
        setUser(session?.user ?? null)
      })
      subscription = data.subscription
    } catch {
      // Supabase not configured or unavailable
    }
    return () => { subscription?.unsubscribe() }
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (!user) {
    return (
      <Link href="/auth/login"
        className="text-sm text-gray-600 hover:text-green-deep transition-colors">
        로그인
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 hidden sm:block truncate max-w-[120px]">{user.email}</span>
      <button onClick={handleLogout}
        className="text-sm text-gray-500 hover:text-red-500 transition-colors">
        로그아웃
      </button>
    </div>
  )
}
