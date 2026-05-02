'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Comment } from '@/types/board'

interface Props {
  postId: number
  initialComments: Comment[]
  currentUserId?: string
  isAdmin: boolean
}

export default function CommentSection({ postId, initialComments, currentUserId, isAdmin }: Props) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('comments')
      .insert({ post_id: postId, content: content.trim(), author_id: user.id })
      .select('*, profiles!author_id(username, is_admin)')
      .single()

    if (!error && data) {
      setComments(prev => [...prev, data as Comment])
      setContent('')
    }
    setLoading(false)
  }

  async function handleDelete(commentId: number) {
    if (!confirm('댓글을 삭제하시겠습니까?')) return
    const supabase = createClient()
    const { error } = await supabase.from('comments').delete().eq('id', commentId)
    if (!error) setComments(prev => prev.filter(c => c.id !== commentId))
  }

  return (
    <section className="space-y-6">
      <h2 className="text-base font-semibold text-gray-800">댓글 {comments.length}</h2>

      <div className="space-y-0 divide-y divide-border">
        {comments.length === 0 && (
          <p className="text-sm text-gray-400 py-4">첫 번째 댓글을 남겨보세요.</p>
        )}
        {comments.map(comment => (
          <div key={comment.id} className="py-4 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-medium text-gray-700">{comment.profiles.username}</span>
                {comment.profiles.is_admin && (
                  <span className="px-1.5 py-0.5 bg-green-deep text-cream rounded text-[10px]">관리자</span>
                )}
                <span>·</span>
                <time>{new Date(comment.created_at).toLocaleDateString('ko-KR')}</time>
              </div>
              {currentUserId && (currentUserId === comment.author_id || isAdmin) && (
                <button onClick={() => handleDelete(comment.id)}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                  삭제
                </button>
              )}
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
          </div>
        ))}
      </div>

      {currentUserId ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
            placeholder="댓글을 입력하세요..."
            className="w-full px-4 py-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:border-green-deep transition-colors"
          />
          <button type="submit" disabled={loading || !content.trim()}
            className="px-4 py-2 bg-green-deep text-cream text-sm rounded-lg hover:bg-green-mid transition-colors disabled:opacity-50">
            {loading ? '등록 중...' : '댓글 등록'}
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 py-3 border-t border-border">
          댓글을 작성하려면{' '}
          <a href="/auth/login" className="text-green-deep hover:underline">로그인</a>이 필요합니다.
        </p>
      )}
    </section>
  )
}
