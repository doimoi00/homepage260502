import { NextResponse } from 'next/server'
import { getCelebHereAdmin } from '@/lib/supabase/celebhere-admin'

export async function GET() {
  const db = getCelebHereAdmin()
  const now = new Date().toISOString()
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [
    { count: totalUsers },
    { count: totalSpots },
    { count: activeSpots },
    { count: todaySpots },
    { count: pendingReports },
    { count: hiddenSpots },
    { data: recentSpots },
    { data: tierBreakdown },
  ] = await Promise.all([
    db.from('profiles').select('*', { count: 'exact', head: true }),
    db.from('spots').select('*', { count: 'exact', head: true }),
    db.from('spots').select('*', { count: 'exact', head: true })
      .eq('is_hidden', false).gt('expires_at', now),
    db.from('spots').select('*', { count: 'exact', head: true })
      .gte('created_at', todayStart.toISOString()),
    db.from('reports').select('*', { count: 'exact', head: true })
      .eq('resolved', false),
    db.from('spots').select('*', { count: 'exact', head: true })
      .eq('is_hidden', true),
    db.from('spots')
      .select('id, celeb_name, location_name, category, created_at, likes_count, is_hidden, expires_at, profiles(nickname)')
      .order('created_at', { ascending: false })
      .limit(8),
    db.from('profiles')
      .select('subscription_tier'),
  ])

  const tiers = { free: 0, basic: 0, premium: 0 }
  for (const p of (tierBreakdown ?? [])) {
    const t = (p.subscription_tier ?? 'free') as keyof typeof tiers
    if (t in tiers) tiers[t]++
  }

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    totalSpots: totalSpots ?? 0,
    activeSpots: activeSpots ?? 0,
    todaySpots: todaySpots ?? 0,
    pendingReports: pendingReports ?? 0,
    hiddenSpots: hiddenSpots ?? 0,
    recentSpots: recentSpots ?? [],
    tierBreakdown: tiers,
  })
}
