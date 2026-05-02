'use client'

import { useState } from 'react'

export default function FloatingKakao() {
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-white border border-border rounded-2xl shadow-xl p-4 w-52 space-y-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#FEE500] flex items-center justify-center shrink-0">
              <KakaoIcon />
            </span>
            <p className="font-semibold text-gray-800 text-sm">카카오톡 문의</p>
          </div>
          <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm">
            <p className="text-gray-500 text-xs mb-0.5">카카오톡 ID</p>
            <p className="font-mono font-bold text-green-deep">doimoi00</p>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            카카오톡에서 위 ID를 검색해<br />강의 문의를 남겨주세요.
          </p>
        </div>
      )}

      <button
        onClick={() => setOpen(prev => !prev)}
        aria-label="카카오톡 문의"
        className="w-14 h-14 rounded-full bg-[#FEE500] shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        <KakaoIcon size={28} />
      </button>
    </div>
  )
}

function KakaoIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3C6.477 3 2 6.686 2 11.25c0 2.939 1.823 5.51 4.566 7.005L5.5 21.5l3.82-2.54C10.05 19.31 11.01 19.5 12 19.5c5.523 0 10-3.686 10-8.25S17.523 3 12 3z"
        fill="#1A1A1A"
      />
    </svg>
  )
}
