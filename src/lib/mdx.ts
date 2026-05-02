import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  readingTime: string
}

export interface Post extends PostMeta {
  content: string
}

export async function getAllPosts(): Promise<PostMeta[]> {
  if (!fs.existsSync(POSTS_DIR)) return []

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'))

  const posts = files.map((filename): PostMeta => {
    const slug = filename.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8')
    const { data, content } = matter(raw)

    return {
      slug,
      title: data.title ?? slug,
      date: data.date ? String(data.date) : '',
      description: data.description ?? '',
      tags: data.tags ?? [],
      readingTime: readingTime(content).text,
    }
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? slug,
    date: data.date ? String(data.date) : '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    readingTime: readingTime(content).text,
    content,
  }
}
