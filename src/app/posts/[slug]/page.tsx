import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug)
    return { title: post.title, description: post.description }
  } catch {
    return {}
  }
}

export default async function PostPage({ params }: Props) {
  let post
  try {
    post = await getPostBySlug(params.slug)
  } catch {
    notFound()
  }

  return (
    <article className="space-y-8">
      <header className="space-y-3 pb-8 border-b border-border">
        {post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-green-light text-green-deep rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 leading-snug">{post.title}</h1>
        <div className="flex gap-3 text-sm text-gray-400">
          <time>{post.date}</time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
      </header>

      <div className="prose prose-stone max-w-none prose-a:text-green-deep hover:prose-a:text-green-mid">
        <MDXRemote source={post.content} />
      </div>
    </article>
  )
}
