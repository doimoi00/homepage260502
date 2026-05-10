import { NextRequest, NextResponse } from 'next/server'
import { getCelebHereAdmin } from '@/lib/supabase/celebhere-admin'

const DEFAULT_EXPIRY = 15

export async function GET() {
  const db = getCelebHereAdmin()
  const { data, error } = await db
    .from('app_settings')
    .select('value')
    .eq('key', 'default_expiry_minutes')
    .single()

  if (error || !data) {
    return NextResponse.json({ value: DEFAULT_EXPIRY })
  }
  return NextResponse.json({ value: parseInt(data.value, 10) || DEFAULT_EXPIRY })
}

export async function PUT(req: NextRequest) {
  const db = getCelebHereAdmin()
  const { value } = await req.json()

  const allowed = [15, 60, 180, 1440, 2160]
  if (!allowed.includes(value)) {
    return NextResponse.json({ error: '허용되지 않은 값입니다.' }, { status: 400 })
  }

  const { error } = await db
    .from('app_settings')
    .upsert({ key: 'default_expiry_minutes', value: String(value), updated_at: new Date().toISOString() }, { onConflict: 'key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, value })
}
