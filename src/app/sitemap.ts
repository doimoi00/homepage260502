import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'

const BASE_URL = 'https://homepage260502.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()

  const postEntries = posts.map(post => ({
    url: `${BASE_URL}/posts/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/posts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...postEntries,
  ]
}
