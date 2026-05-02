'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  postId?: number
  initialTitle?: string
  initialContent?: string
}

export default function PostForm({ postId, initialTitle = '', initialContent = '' }: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [content, setContent] = useState(initialContent)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/auth/login')
      return
    }

    if (postId) {
      const { error } = await supabase
        .from('posts')
        .update({ title: title.trim(), content: content.trim(), updated_at: new Date().toISOString() })
        .eq('id', postId)

      if (error) { setError('수정 중 오류가 발생했습니다.'); setLoading(false); return }
      router.push(`/board/${postId}`)
      router.refresh()
    } else {
      const { data, error } = await supabase
        .from('posts')
        .insert({ title: title.trim(), content: content.trim(), author_id: user.id })
        .select('id')
        .single()

      if (error || !data) { setError('저장 중 오류가 발생했습니다.'); setLoading(false); return }
      router.push(`/board/${data.id}`)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">제목 *</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          placeholder="제목을 입력하세요"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">내용 *</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          rows={14}
          placeholder="내용을 입력하세요"
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex gap-3">
        <button type="button" onClick={() => router.back()}
          className="px-5 py-2.5 border border-border text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
          취소
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 py-2.5 bg-green-deep text-cream text-sm font-semibold rounded-lg hover:bg-green-mid transition-colors disabled:opacity-50">
          {loading ? '저장 중...' : postId ? '수정 완료' : '글 등록'}
        </button>
      </div>
    </form>
  )
}

const inputClass = 'w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-green-deep transition-colors'
