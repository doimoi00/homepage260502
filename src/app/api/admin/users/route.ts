import { NextRequest, NextResponse } from 'next/server'
import { getCelebHereAdmin } from '@/lib/supabase/celebhere-admin'

export async function GET(req: NextRequest) {
  const db = getCelebHereAdmin()
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const tier = searchParams.get('tier') ?? 'all'
  const page = parseInt(searchParams.get('page') ?? '1')
  const pageSize = 20
  const from = (page - 1) * pageSize

  let query = db.from('profiles')
    .select('id, nickname, avatar_url, subscription_tier, created_at, push_token', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + pageSize - 1)

  if (tier !== 'all') query = query.eq('subscription_tier', tier)
  if (search) query = query.ilike('nickname', `%${search}%`)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ users: data, total: count ?? 0, page, pageSize })
}

export async function PATCH(req: NextRequest) {
  const db = getCelebHereAdmin()
  const { id, subscription_tier } = await req.json()
  const { error } = await db.from('profiles').update({ subscription_tier }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
