export interface Profile {
  id: string
  username: string
  is_admin: boolean
  created_at: string
}

export interface Post {
  id: number
  title: string
  content: string
  author_id: string
  created_at: string
  updated_at: string
  profiles: { username: string; is_admin: boolean }
}

export interface Comment {
  id: number
  post_id: number
  content: string
  author_id: string
  created_at: string
  profiles: { username: string; is_admin: boolean }
}
