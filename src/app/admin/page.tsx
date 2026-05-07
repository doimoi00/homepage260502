'use client'

import { useEffect, useState } from 'react'

const CATEGORY_EMOJI: Record<string, string> = {
  Singer: '🎤', 'K-Pop': '⭐', Sports: '⚽', Actor: '🎬',
  Politician: '🏛️', Influencer: '📱', Model: '👗',
  'Gamer & E-Sports Star': '🎮', 'Business Leader': '💼', Other: '✨',
}

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (s < 60) return `${s}초 전`
  if (s < 3600) return `${Math.floor(s / 60)}분 전`
  if (s < 86400) return `${Math.floor(s / 3600)}시간 전`
  return `${Math.floor(s / 86400)}일 전`
}

interface Stats {
  totalUsers: number
  totalSpots: number
  activeSpots: number
  todaySpots: number
  pendingReports: number
  hiddenSpots: number
  recentSpots: any[]
  tierBreakdown: { free: number; basic: number; premium: number }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="p-8 text-gray-400 text-sm">데이터 불러오는 중...</div>
  )
  if (!stats) return null

  const statCards = [
    { label: '전체 사용자', value: stats.totalUsers, icon: '👥', color: 'text-blue-400' },
    { label: '전체 Spots', value: stats.totalSpots, icon: '📍', color: 'text-purple-400' },
    { label: '활성 Spots', value: stats.activeSpots, icon: '🟢', color: 'text-green-400' },
    { label: '오늘 Spots', value: stats.todaySpots, icon: '📅', color: 'text-yellow-400' },
    { label: '미처리 신고', value: stats.pendingReports, icon: '🚨', color: 'text-red-400' },
    { label: '숨김 처리', value: stats.hiddenSpots, icon: '🙈', color: 'text-gray-400' },
  ]

  const total = stats.tierBreakdown.free + stats.tierBreakdown.basic + stats.tierBreakdown.premium || 1

  return (
    <div className="p-8 text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <p className="text-gray-400 text-sm mt-1">Celeb Here 실시간 현황</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {statCards.map((c) => (
          <div key={c.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{c.label}</span>
              <span className="text-xl">{c.icon}</span>
            </div>
            <div className={`text-3xl font-bold ${c.color}`}>{c.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 구독 현황 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">구독 현황</h2>
          <div className="space-y-3">
            {[
              { label: 'Free', count: stats.tierBreakdown.free, color: 'bg-gray-600' },
              { label: 'Basic', count: stats.tierBreakdown.basic, color: 'bg-blue-500' },
              { label: 'Premium', count: stats.tierBreakdown.premium, color: 'bg-pink-500' },
            ].map((t) => (
              <div key={t.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{t.label}</span>
                  <span className="text-white font-semibold">{t.count}</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${t.color}`}
                    style={{ width: `${(t.count / total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 Spots */}
        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-300 mb-4">최근 Spots</h2>
          <div className="space-y-2">
            {stats.recentSpots.length === 0 && (
              <div className="text-gray-600 text-sm">Spots가 없습니다.</div>
            )}
            {stats.recentSpots.map((s: any) => (
              <div key={s.id} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
                <span className="text-lg w-6 text-center">
                  {CATEGORY_EMOJI[s.category] ?? '✨'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{s.celeb_name}</div>
                  <div className="text-xs text-gray-500 truncate">{s.location_name}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-gray-400">{timeAgo(s.created_at)}</div>
                  {s.is_hidden && (
                    <span className="text-xs text-red-400 font-medium">숨김</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
