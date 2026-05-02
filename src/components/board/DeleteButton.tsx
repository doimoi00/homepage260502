'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Props {
  type: 'post' | 'comment'
  id: number
}

export default function DeleteButton({ type, id }: Props) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('정말 삭제하시겠습니까?')) return

    const supabase = createClient()
    const { error } = await supabase.from(type === 'post' ? 'posts' : 'comments').delete().eq('id', id)

    if (!error) {
      if (type === 'post') router.push('/board')
      else router.refresh()
    }
  }

  return (
    <button onClick={handleDelete}
      className="text-gray-500 hover:text-red-500 transition-colors">
      삭제
    </button>
  )
}
