'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

const LECTURE_TYPES = ['특강', 'AI 프로그래밍 (10시간)', '기타']

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/xzdozwnb', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })

      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-4xl">✉️</p>
        <p className="text-xl font-semibold text-green-deep">문의가 접수되었습니다.</p>
        <p className="text-sm text-gray-500">빠른 시일 내에 답변드리겠습니다.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="이름" required>
          <input
            name="이름"
            type="text"
            required
            placeholder="홍길동"
            className={inputClass}
          />
        </Field>

        <Field label="이메일" required>
          <input
            name="이메일"
            type="email"
            required
            placeholder="example@email.com"
            className={inputClass}
          />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="연락처">
          <input
            name="연락처"
            type="tel"
            placeholder="010-0000-0000"
            className={inputClass}
          />
        </Field>

        <Field label="소속">
          <input
            name="소속"
            type="text"
            placeholder="회사명 / 학교명 / 기관명"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="강의 형태" required>
        <select name="강의 형태" required className={inputClass}>
          <option value="">선택해주세요</option>
          {LECTURE_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </Field>

      <Field label="문의 내용" required>
        <textarea
          name="문의 내용"
          required
          rows={5}
          placeholder="강의 일정, 인원, 목적 등을 자유롭게 작성해주세요."
          className={`${inputClass} resize-none`}
        />
      </Field>

      {status === 'error' && (
        <p className="text-sm text-red-500">
          전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 bg-green-deep text-cream font-semibold rounded-lg hover:bg-green-mid transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? '전송 중...' : '문의 보내기'}
      </button>
    </form>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-green-deep ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-border bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-green-deep transition-colors'
