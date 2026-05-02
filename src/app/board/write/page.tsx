import type { Metadata } from 'next'
import PostForm from '@/components/board/PostForm'

export const metadata: Metadata = { title: '글쓰기' }

export default function WritePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-green-deep">글쓰기</h1>
      <PostForm />
    </div>
  )
}
