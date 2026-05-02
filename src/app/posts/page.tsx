import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import PostCard from '@/components/PostCard'

export const metadata: Metadata = { title: '글 목록' }

export default async function PostsPage() {
  const posts = await getAllPosts()

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-green-deep">글 목록</h1>
      {posts.length === 0 ? (
        <p className="text-gray-400 text-sm">아직 작성된 글이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {posts.map(post => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
