'use client'

import { useEffect, useState, useCallback } from 'react'

const TIERS = [
  { key: 'all', label: '전체' },
  { key: 'free', label: 'Free' },
  { key: 'basic', label: 'Basic' },
  { key: 'premium', label: 'Premium' },
]

const TIER_STYLE: Record<string, string> = {
  free: 'bg-gray-800 text-gray-400',
  basic: 'bg-blue-900/40 text-blue-400',
  premium: 'bg-pink-900/40 text-pink-400',
}

function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (days === 0) return '오늘'
  if (days < 30) return `${days}일 전`
  if (days < 365) return `${Math.floor(days / 30)}개월 전`
  return `${Math.floor(days / 365)}년 전`
}

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [tierFilter, setTierFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [changingId, setChangingId] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams({ tier: tierFilter, search, page: String(page) })
    fetch(`/api/admin/users?${params}`)
      .then((r) => r.json())
      .then((d) => { setUsers(d.users ?? []); setTotal(d.total ?? 0); setLoading(false) })
  }, [tierFilter, search, page])

  useEffect(() => { load() }, [load])

  async function changeTier(id: string, tier: string) {
    setChangingId(id)
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, subscription_tier: tier }),
    })
    load()
    setChangingId(null)
  }

  const totalPages = Math.ceil(total / 20)

  return (
    <div className="p-8 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">사용자 관리</h1>
        <p className="text-gray-400 text-sm mt-1">전체 {total.toLocaleString()}명</p>
      </div>

      {/* 필터 & 검색 */}
      <div className="flex gap-3 mb-5">
        <div className="flex bg-gray-900 border border-gray-800 rounded-lg p-1 gap-1">
          {TIERS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTierFilter(t.key); setPage(1) }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tierFilter === t.key ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="닉네임 검색..."
          className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-4 py-3 text-gray-400 font-medium">사용자</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">현재 플랜</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">푸시 토큰</th>
              <th className="text-left px-4 py-3 text-gray-400 font-medium">가입일</th>
              <th className="text-center px-4 py-3 text-gray-400 font-medium">플랜 변경</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-600">불러오는 중...</td></tr>
            )}
            {!loading && users.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-600">사용자가 없습니다.</td></tr>
            )}
            {!loading && users.map((u) => (
              <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {u.avatar_url ? (
                      <img src={u.avatar_url} className="w-8 h-8 rounded-full object-cover" alt="" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-pink-700 flex items-center justify-center text-xs font-bold text-white">
                        {(u.nickname ?? 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-white">{u.nickname ?? '—'}</div>
                      <div className="text-xs text-gray-600 font-mono truncate max-w-32">{u.id.slice(0, 8)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${TIER_STYLE[u.subscription_tier ?? 'free']}`}>
                    {(u.subscription_tier ?? 'free').toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {u.push_token ? (
                    <span className="text-green-400 text-xs">✓ 등록</span>
                  ) : (
                    <span className="text-gray-600 text-xs">없음</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{timeAgo(u.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1.5">
                    {['free', 'basic', 'premium'].map((t) => (
                      <button
                        key={t}
                        onClick={() => changeTier(u.id, t)}
                        disabled={changingId === u.id || (u.subscription_tier ?? 'free') === t}
                        className={`px-2 py-0.5 rounded text-xs font-medium transition-colors disabled:opacity-30 ${
                          (u.subscription_tier ?? 'free') === t
                            ? 'bg-pink-600 text-white cursor-default'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 hover:border-gray-500 disabled:opacity-40">이전</button>
          <span className="text-gray-400 text-sm">{page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 hover:border-gray-500 disabled:opacity-40">다음</button>
        </div>
      )}
    </div>
  )
}
