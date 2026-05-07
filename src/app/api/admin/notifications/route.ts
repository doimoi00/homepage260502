import { NextRequest, NextResponse } from 'next/server'
import { getCelebHereAdmin } from '@/lib/supabase/celebhere-admin'

export async function POST(req: NextRequest) {
  const db = getCelebHereAdmin()
  const { title, body, tier } = await req.json()

  if (!title || !body) {
    return NextResponse.json({ error: '제목과 내용을 입력하세요.' }, { status: 400 })
  }

  let query = db.from('profiles').select('push_token').not('push_token', 'is', null)
  if (tier && tier !== 'all') query = query.eq('subscription_tier', tier)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const tokens = (data ?? []).map((p: any) => p.push_token).filter(Boolean)
  if (tokens.length === 0) {
    return NextResponse.json({ sent: 0, message: '푸시 토큰이 없습니다.' })
  }

  // Expo Push API 배치 전송 (100개씩)
  const batchSize = 100
  let sent = 0
  for (let i = 0; i < tokens.length; i += batchSize) {
    const batch = tokens.slice(i, i + batchSize).map((token: string) => ({
      to: token,
      title,
      body,
      sound: 'default',
      data: { type: 'admin_broadcast' },
    }))
    const res = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(batch),
    })
    if (res.ok) sent += batch.length
  }

  return NextResponse.json({ sent, total: tokens.length })
}
