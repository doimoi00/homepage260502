import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PostForm from '@/components/board/PostForm'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: '글 수정' }

export default async function EditPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single()
  if (!post) notFound()

  const { data: profile } = await supabase
    .from('profiles').select('is_admin').eq('id', user.id).single()
  const isAdmin = profile?.is_admin ?? false

  if (user.id !== post.author_id && !isAdmin) redirect('/board')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-deep">글 수정</h1>
      <PostForm postId={post.id} initialTitle={post.title} initialContent={post.content} />
    </div>
  )
}
