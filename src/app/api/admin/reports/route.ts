import { NextRequest, NextResponse } from 'next/server'
import { getCelebHereAdmin } from '@/lib/supabase/celebhere-admin'

export async function GET() {
  const db = getCelebHereAdmin()
  const { data, error } = await db.from('reports')
    .select('id, reason, created_at, resolved, spot_id, spots(id, celeb_name, location_name, category, is_hidden, photo_url, expires_at)')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // spot_id 기준으로 그룹핑
  const grouped: Record<string, { spot: any; reports: any[]; count: number }> = {}
  for (const r of (data ?? [])) {
    const sid = r.spot_id
    if (!grouped[sid]) {
      grouped[sid] = { spot: r.spots, reports: [], count: 0 }
    }
    grouped[sid].reports.push({ id: r.id, reason: r.reason, created_at: r.created_at, resolved: r.resolved })
    grouped[sid].count++
  }

  return NextResponse.json({ groups: Object.values(grouped) })
}

export async function PATCH(req: NextRequest) {
  const db = getCelebHereAdmin()
  const { spot_id, action } = await req.json()
  if (action === 'hide') {
    await db.from('spots').update({ is_hidden: true }).eq('id', spot_id)
    await db.from('reports').update({ resolved: true }).eq('spot_id', spot_id)
  } else if (action === 'dismiss') {
    await db.from('reports').update({ resolved: true }).eq('spot_id', spot_id)
  }
  return NextResponse.json({ ok: true })
}
