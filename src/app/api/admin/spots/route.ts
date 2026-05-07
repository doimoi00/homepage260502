import { NextRequest, NextResponse } from 'next/server'
import { getCelebHereAdmin } from '@/lib/supabase/celebhere-admin'

export async function GET(req: NextRequest) {
  const db = getCelebHereAdmin()
  const { searchParams } = new URL(req.url)
  const filter = searchParams.get('filter') ?? 'all'
  const search = searchParams.get('search') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1')
  const pageSize = 20
  const from = (page - 1) * pageSize

  let query = db.from('spots')
    .select('id, celeb_name, location_name, category, created_at, expires_at, likes_count, still_here_count, nobody_count, is_hidden, photo_url, profiles(nickname)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + pageSize - 1)

  const now = new Date().toISOString()
  if (filter === 'active') query = query.eq('is_hidden', false).gt('expires_at', now)
  else if (filter === 'hidden') query = query.eq('is_hidden', true)
  else if (filter === 'expired') query = query.lt('expires_at', now)

  if (search) query = query.ilike('celeb_name', `%${search}%`)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ spots: data, total: count ?? 0, page, pageSize })
}

export async function PATCH(req: NextRequest) {
  const db = getCelebHereAdmin()
  const { id, is_hidden } = await req.json()
  const { error } = await db.from('spots').update({ is_hidden }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const db = getCelebHereAdmin()
  const { id } = await req.json()
  const { error } = await db.from('spots').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
