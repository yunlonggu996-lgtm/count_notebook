import type { Metadata } from 'next'
import './globals.css'
import TabBar from '@/components/TabBar'

export const metadata: Metadata = {
  title: '记账本',
  description: '简单优雅的个人记账应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="min-h-screen pb-20">
          {children}
        </div>
        <TabBar />
      </body>
    </html>
  )
}
