import Link from 'next/link'
import type { PostMeta } from '@/lib/mdx'

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/posts/${post.slug}`} className="block group">
      <article className="px-5 py-4 rounded-lg border border-border group-hover:border-green-deep group-hover:bg-green-light/30 transition-all">
        <h3 className="font-semibold text-gray-900 group-hover:text-green-deep transition-colors">
          {post.title}
        </h3>
        {post.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.description}</p>
        )}
        <div className="flex gap-3 mt-2 text-xs text-gray-400">
          <time>{post.date}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </article>
    </Link>
  )
}
