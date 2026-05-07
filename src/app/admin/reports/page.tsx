'use client'

import { useEffect, useState } from 'react'

const REASON_LABEL: Record<string, string> = {
  privacy: '🔒 사생활 침해',
  fake: '❌ 허위 정보',
  harmful: '⚠️ 유해 콘텐츠',
  rights: '©️ 저작권 침해',
}

const CATEGORY_EMOJI: Record<string, string> = {
  Singer: '🎤', 'K-Pop': '⭐', Sports: '⚽', Actor: '🎬',
  Politician: '🏛️', Influencer: '📱', Model: '👗',
  'Gamer & E-Sports Star': '🎮', 'Business Leader': '💼',
}

export default function ReportsPage() {
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  function load() {
    setLoading(true)
    fetch('/api/admin/reports')
      .then((r) => r.json())
      .then((d) => { setGroups(d.groups ?? []); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  async function takeAction(spot_id: string, action: 'hide' | 'dismiss') {
    setActionId(spot_id)
    await fetch('/api/admin/reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spot_id, action }),
    })
    load()
    setActionId(null)
  }

  const pending = groups.filter((g) => g.reports.some((r: any) => !r.resolved))
  const resolved = groups.filter((g) => g.reports.every((r: any) => r.resolved))

  return (
    <div className="p-8 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">신고 관리</h1>
        <p className="text-gray-400 text-sm mt-1">미처리 {pending.length}건 · 처리 완료 {resolved.length}건</p>
      </div>

      {loading && <div className="text-gray-500 text-sm">불러오는 중...</div>}

      {!loading && groups.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">✅</div>
          <div className="text-gray-400">처리할 신고가 없습니다.</div>
        </div>
      )}

      {/* 미처리 신고 */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
            미처리 신고
          </h2>
          <div className="space-y-3">
            {pending.map((g) => (
              <ReportCard
                key={g.spot?.id}
                group={g}
                actionId={actionId}
                onAction={takeAction}
              />
            ))}
          </div>
        </div>
      )}

      {/* 처리 완료 */}
      {resolved.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
            처리 완료
          </h2>
          <div className="space-y-3 opacity-60">
            {resolved.map((g) => (
              <ReportCard key={g.spot?.id} group={g} actionId={null} onAction={() => {}} resolved />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ReportCard({
  group, actionId, onAction, resolved = false
}: {
  group: any
  actionId: string | null
  onAction: (id: string, action: 'hide' | 'dismiss') => void
  resolved?: boolean
}) {
  const spot = group.spot
  if (!spot) return null
  const reasonCounts: Record<string, number> = {}
  for (const r of group.reports) {
    reasonCounts[r.reason] = (reasonCounts[r.reason] ?? 0) + 1
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-start gap-4">
        {spot.photo_url ? (
          <img src={spot.photo_url} className="w-16 h-16 rounded-lg object-cover shrink-0" alt="" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center text-2xl shrink-0">
            {CATEGORY_EMOJI[spot.category] ?? '✨'}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-white">{spot.celeb_name}</span>
            {spot.is_hidden && (
              <span className="text-xs px-1.5 py-0.5 bg-red-900/40 text-red-400 rounded">숨김됨</span>
            )}
            <span className="ml-auto text-sm font-bold text-red-400">
              신고 {group.count}건
            </span>
          </div>
          <div className="text-sm text-gray-400 mb-3">📍 {spot.location_name}</div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(reasonCounts).map(([reason, count]) => (
              <span key={reason} className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-300">
                {REASON_LABEL[reason] ?? reason} ({count})
              </span>
            ))}
          </div>
        </div>
      </div>

      {!resolved && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
          <button
            onClick={() => onAction(spot.id, 'hide')}
            disabled={actionId === spot.id || spot.is_hidden}
            className="flex-1 py-2 bg-red-700/40 text-red-400 hover:bg-red-700/60 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
          >
            Spot 숨김 처리
          </button>
          <button
            onClick={() => onAction(spot.id, 'dismiss')}
            disabled={actionId === spot.id}
            className="flex-1 py-2 bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
          >
            신고 무시
          </button>
        </div>
      )}

      {resolved && (
        <div className="mt-4 pt-4 border-t border-gray-800 text-center text-gray-600 text-sm">
          처리 완료
        </div>
      )}
    </div>
  )
}
