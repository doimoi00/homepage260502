import type { Metadata } from 'next'
import { Noto_Serif_KR } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const notoSerifKR = Noto_Serif_KR({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: '나의 홈페이지',
    template: '%s | 나의 홈페이지',
  },
  description: '생각을 기록하고 배움을 나누는 개인 공간',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${notoSerifKR.variable} font-serif bg-cream min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
