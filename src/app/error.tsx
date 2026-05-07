'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App Error]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full space-y-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800">오류가 발생했습니다</h2>
        <p className="text-sm text-gray-500 font-mono bg-gray-50 border border-gray-200 rounded p-3 text-left break-all">
          {error?.message || '알 수 없는 오류'}
        </p>
        {error?.digest && (
          <p className="text-xs text-gray-400">digest: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="px-4 py-2 bg-green-deep text-cream text-sm rounded hover:bg-green-mid transition-colors"
        >
          다시 시도
        </button>
      </div>
    </div>
  )
}
