import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DeleteButton from '@/components/board/DeleteButton'
import CommentSection from '@/components/board/CommentSection'
import type { Comment } from '@/types/board'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('posts').select('title').eq('id', id).single()
  return { title: data?.title ?? '게시글' }
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles!author_id(username, is_admin)')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles').select('is_admin').eq('id', user.id).single()
    isAdmin = profile?.is_admin ?? false
  }

  const canModify = !!user && (user.id === post.author_id || isAdmin)

  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles!author_id(username, is_admin)')
    .eq('post_id', id)
    .order('created_at', { ascending: true })

  const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles

  return (
    <div className="space-y-10">
      <article className="space-y-6">
        <header className="space-y-3 pb-6 border-b border-border">
          <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex gap-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">
                {(profile as { username: string })?.username}
              </span>
              <span>·</span>
              <time>{new Date(post.created_at).toLocaleDateString('ko-KR')}</time>
            </div>
            {canModify && (
              <div className="flex gap-4 text-sm">
                <Link href={`/board/${post.id}/edit`}
                  className="text-gray-500 hover:text-green-deep transition-colors">
                  수정
                </Link>
                <DeleteButton type="post" id={post.id} />
              </div>
            )}
          </div>
        </header>

        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
          {post.content}
        </div>
      </article>

      <div className="pt-4 border-t border-border">
        <Link href="/board" className="text-sm text-gray-400 hover:text-green-deep transition-colors">
          ← 목록으로
        </Link>
      </div>

      <CommentSection
        postId={post.id}
        initialComments={(comments ?? []) as Comment[]}
        currentUserId={user?.id}
        isAdmin={isAdmin}
      />
    </div>
  )
}
