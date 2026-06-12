'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, BarChart3, User } from 'lucide-react'

const tabs = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/stats', icon: BarChart3, label: '统计' },
  { path: '/mine', icon: User, label: '我的' },
]

export default function TabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 px-4 py-2 z-50">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path
          const Icon = tab.icon

          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`flex flex-col items-center py-2 px-4 rounded-xl transition-all ${
                isActive
                  ? 'text-primary bg-indigo-50'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
