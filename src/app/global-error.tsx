'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Global Error]', error)
  }, [error])

  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#F9F8F6' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#1a1a1a', marginBottom: '12px' }}>오류가 발생했습니다</h2>
            <pre style={{ fontSize: '0.75rem', color: '#555', background: '#f3f3f3', border: '1px solid #ddd', borderRadius: '6px', padding: '12px', textAlign: 'left', overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {error?.message || '알 수 없는 오류'}
              {error?.digest ? `\ndigest: ${error.digest}` : ''}
            </pre>
            <button
              onClick={reset}
              style={{ marginTop: '16px', padding: '8px 20px', background: '#2C4A2E', color: '#F9F8F6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.875rem' }}
            >
              다시 시도
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
