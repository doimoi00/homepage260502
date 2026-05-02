'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [username, setUsername] = useState('')
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/board')
      router.refresh()
    }
  }

  return (
    <div className="max-w-sm mx-auto py-16 space-y-8">
      <h1 className="text-2xl font-bold text-center text-green-deep">회원가입</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">닉네임</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)}
            required placeholder="사용할 닉네임" className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">이메일</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            required placeholder="example@email.com" className={inputClass} />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">비밀번호 <span className="text-gray-400 font-normal">(6자 이상)</span></label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            required minLength={6} placeholder="••••••••" className={inputClass} />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-green-deep text-cream font-semibold rounded-lg hover:bg-green-mid transition-colors disabled:opacity-50">
          {loading ? '가입 중...' : '회원가입'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        이미 계정이 있으신가요?{' '}
        <Link href="/auth/login" className="text-green-deep hover:underline">로그인</Link>
      </p>
    </div>
  )
}

const inputClass = 'w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-green-deep transition-colors'
