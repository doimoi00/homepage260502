import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'IT 정보 게시판' }

export default async function BoardPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, created_at, profiles!author_id(username)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-deep">IT 정보 게시판</h1>
          <p className="text-sm text-gray-500 mt-1">IT와 인공지능에 관한 정보를 자유롭게 공유해주세요.</p>
        </div>
        <Link href="/board/write"
          className="px-4 py-2 bg-green-deep text-cream text-sm rounded-lg hover:bg-green-mid transition-colors shrink-0">
          글쓰기
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <p className="text-center text-gray-400 py-20 text-sm">첫 번째 글을 작성해보세요!</p>
      ) : (
        <div className="border-t border-border divide-y divide-border">
          {posts.map((post, index) => {
            const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
            return (
              <Link key={post.id} href={`/board/${post.id}`}
                className="flex items-center gap-4 py-4 px-2 hover:bg-green-light/20 rounded transition-colors group">
                <span className="text-xs text-gray-300 w-8 text-right shrink-0">
                  {posts.length - index}
                </span>
                <span className="flex-1 text-sm font-medium text-gray-900 group-hover:text-green-deep transition-colors truncate">
                  {post.title}
                </span>
                <div className="flex gap-3 text-xs text-gray-400 shrink-0">
                  <span>{(profile as { username: string })?.username ?? '알 수 없음'}</span>
                  <span>{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
