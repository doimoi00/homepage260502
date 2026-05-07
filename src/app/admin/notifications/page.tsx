'use client'

import { useState } from 'react'

const TIER_OPTIONS = [
  { value: 'all', label: '전체 사용자', desc: '앱을 설치한 모든 사용자' },
  { value: 'premium', label: 'Premium', desc: 'Premium 구독자만' },
  { value: 'basic', label: 'Basic', desc: 'Basic 구독자만' },
  { value: 'free', label: 'Free', desc: 'Free 사용자만' },
]

const TEMPLATES = [
  { title: '🎉 새 기능 출시', body: 'Celeb Here가 업데이트됐습니다! 새로운 기능을 확인해보세요.' },
  { title: '⭐ 핫한 셀럽 목격!', body: '지금 근처에서 유명 셀럽이 목격됐습니다. 앱에서 확인하세요!' },
  { title: '🔔 특별 할인 이벤트', body: 'Premium 구독을 20% 할인 중입니다. 지금 업그레이드하세요!' },
]

export default function NotificationsPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [tier, setTier] = useState('all')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; total: number; message?: string } | null>(null)
  const [error, setError] = useState('')

  async function send() {
    if (!title.trim() || !body.trim()) {
      setError('제목과 내용을 모두 입력해주세요.')
      return
    }
    if (!confirm(`"${title}" 알림을 ${tier === 'all' ? '전체 사용자' : tier + ' 구독자'}에게 발송하시겠습니까?`)) return

    setSending(true)
    setError('')
    setResult(null)

    const res = await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, tier }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? '발송 실패')
    } else {
      setResult(data)
      setTitle('')
      setBody('')
    }
    setSending(false)
  }

  return (
    <div className="p-8 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">푸시 알림 발송</h1>
        <p className="text-gray-400 text-sm mt-1">앱 사용자에게 직접 푸시 알림을 보냅니다</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 발송 폼 */}
        <div className="col-span-2 space-y-5">
          {/* 대상 선택 */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">발송 대상</h2>
            <div className="grid grid-cols-2 gap-2">
              {TIER_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTier(t.value)}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    tier === t.value
                      ? 'border-pink-500 bg-pink-900/20'
                      : 'border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="text-sm font-semibold text-white">{t.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 메시지 작성 */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">메시지 작성</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">제목</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={50}
                  placeholder="알림 제목 (최대 50자)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500"
                />
                <div className="text-xs text-gray-600 text-right mt-1">{title.length}/50</div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">내용</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={200}
                  rows={4}
                  placeholder="알림 내용 (최대 200자)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-pink-500 resize-none"
                />
                <div className="text-xs text-gray-600 text-right mt-1">{body.length}/200</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-green-900/30 border border-green-800 rounded-lg px-4 py-3 text-green-400 text-sm">
              ✅ {result.sent}명에게 발송 완료 {result.message && `(${result.message})`}
            </div>
          )}

          <button
            onClick={send}
            disabled={sending || !title.trim() || !body.trim()}
            className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? '발송 중...' : '푸시 알림 발송'}
          </button>
        </div>

        {/* 사이드 패널 */}
        <div className="space-y-5">
          {/* 미리보기 */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">미리보기</h2>
            <div className="bg-gray-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-600 flex items-center justify-center text-lg shrink-0">
                  📍
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">
                    {title || '알림 제목'}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                    {body || '알림 내용이 여기에 표시됩니다.'}
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-600 text-right mt-2">방금 전</div>
            </div>
          </div>

          {/* 템플릿 */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-300 mb-3">빠른 템플릿</h2>
            <div className="space-y-2">
              {TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => { setTitle(t.title); setBody(t.body) }}
                  className="w-full text-left p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div className="text-sm font-medium text-white truncate">{t.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{t.body}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-yellow-900/20 border border-yellow-800/50 rounded-xl p-4">
            <div className="text-yellow-400 text-xs font-semibold mb-2">⚠️ 주의사항</div>
            <ul className="text-xs text-yellow-200/60 space-y-1 list-disc list-inside">
              <li>발송 후 취소가 불가합니다</li>
              <li>스팸성 알림은 앱 삭제로 이어질 수 있습니다</li>
              <li>푸시 토큰이 등록된 사용자에게만 발송됩니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
