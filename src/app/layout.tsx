import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BoxProvider } from '@/contexts/BoxContext'
import { SessionProvider } from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '급식 순서 현황 - 대전대신고등학교',
  description: '대전대신고등학교 급식 순서 현황 및 급식 정보를 확인하세요',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <SessionProvider>
          <BoxProvider>
            {children}
          </BoxProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
