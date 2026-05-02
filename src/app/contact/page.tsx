import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: '강의 문의',
  description: '기업체, 학교, 공공기관 강의 문의를 남겨주세요.',
}

export default function ContactPage() {
  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold text-green-deep">강의 문의</h1>
        <p className="text-gray-600 leading-relaxed">
          기업체, 학교, 공공기관 강의 문의를 남겨주세요.<br />
          빠른 시일 내에 답변드리겠습니다.
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-1">
          <span>이메일 · <a href="mailto:doimoi@kakao.com" className="text-green-deep hover:underline">doimoi@kakao.com</a></span>
          <span>카카오톡 · <span className="text-green-deep">doimoi00</span></span>
        </div>
      </section>

      <div className="border border-border rounded-2xl p-6 sm:p-8">
        <ContactForm />
      </div>
    </div>
  )
}
