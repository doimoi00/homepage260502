'use client'

import { useEffect, useState, useCallback } from 'react'

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

const FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '활성' },
  { key: 'hidden', label: '숨김' },
  { key: 'expired', label: '만료' },
]

export default function SpotsPage() {
  const [spots, setSpots] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ filter, search, page: String(page) })
    fetch(`/api/admin/spots?${params}`)
      .then((r) => r.json())
      .then((d) => { setSpots(d.spots ?? []); setTotal(d.total ?? 0); setLoading(false) })
  }, [filter, search, page])

  useEffect(() => { load() }, [load])

  async function toggleHidden(id: string, current: boolean) {
    setActionId(id)
    await fetch('/api/admin/spots', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_hidden: !current }),
    })
    load()
    setActionId(null)
  }

  async function deleteSpot(id: string, celeb: string) {
    if (!confirm(`"${celeb}" Spot을 삭제하시겠습니까?`)) return
    setActionId(id)
    await fetch('/api/admin/spots', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    load()
    setActionId(null)
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="p-8 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Spots 관리</h1>
        <p className="text-gray-400 text-sm mt-1">전체 {total.toLocaleString()}개</p>
      </div>

      {/* 필터 & 검색 */}
      <div className="flex gap-3 mb-5">
        <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1 gap-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => { setFilter(f.key); setPage(1) }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === f.key ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="셀럽명 검색..."
          className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
        />
      </div>

      {/* 테이블 */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">셀럽</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">위치</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">작성자</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">❤️</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">상태</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">시간</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">액션</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-600">불러오는 중...</td></tr>
            )}
            {!loading && spots.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-600">Spot이 없습니다.</td></tr>
            )}
            {!loading && spots.map((s) => {
              const isActive = s.expires_at ? new Date(s.expires_at) > new Date() : false
              return (
                <tr key={s.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span>{CATEGORY_EMOJI[s.category] ?? '✨'}</span>
                      <span className="font-medium text-white">{s.celeb_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 max-w-32 truncate">{s.location_name}</td>
                  <td className="px-4 py-3 text-gray-400">
                    {(s.profiles as any)?.nickname ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-center text-pink-400">{s.likes_count}</td>
                  <td className="px-4 py-3 text-center">
                    {s.is_hidden ? (
                      <span className="px-2 py-0.5 bg-red-900/40 text-red-400 rounded text-xs">숨김</span>
                    ) : isActive ? (
                      <span className="px-2 py-0.5 bg-green-900/40 text-green-400 rounded text-xs">활성</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-gray-800 text-gray-500 rounded text-xs">만료</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{timeAgo(s.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => toggleHidden(s.id, s.is_hidden)}
                        disabled={actionId === s.id}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                          s.is_hidden
                            ? 'bg-green-700/40 text-green-400 hover:bg-green-700/60'
                            : 'bg-yellow-700/40 text-yellow-400 hover:bg-yellow-700/60'
                        } disabled:opacity-40`}
                      >
                        {s.is_hidden ? '공개' : '숨김'}
                      </button>
                      <button
                        onClick={() => deleteSpot(s.id, s.celeb_name)}
                        disabled={actionId === s.id}
                        className="px-2.5 py-1 rounded text-xs font-medium bg-red-700/40 text-red-400 hover:bg-red-700/60 transition-colors disabled:opacity-40"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 hover:border-gray-500 disabled:opacity-40"
          >
            이전
          </button>
          <span className="text-gray-400 text-sm">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 hover:border-gray-500 disabled:opacity-40"
          >
            다음
          </button>
        </div>
      )}
    </div>
  )
}
