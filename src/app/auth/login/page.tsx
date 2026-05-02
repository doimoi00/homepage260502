'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
    } else {
      router.push('/board')
      router.refresh()
    }
  }

  return (
    <div className="max-w-sm mx-auto py-16 space-y-8">
      <h1 className="text-2xl font-bold text-center text-green-deep">로그인</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">이메일</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            required placeholder="example@email.com" className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">비밀번호</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            required placeholder="••••••••" className={inputClass} />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-green-deep text-cream font-semibold rounded-lg hover:bg-green-mid transition-colors disabled:opacity-50">
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        계정이 없으신가요?{' '}
        <Link href="/auth/signup" className="text-green-deep hover:underline">회원가입</Link>
      </p>
    </div>
  )
}

const inputClass = 'w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-green-deep transition-colors'
