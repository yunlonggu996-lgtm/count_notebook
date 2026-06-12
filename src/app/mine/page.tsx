'use client'

import Header from '@/components/Header'
import { User, LogOut, Info } from 'lucide-react'

export default function MinePage() {
  return (
    <div className="min-h-screen">
      <Header title="我的" />

      <main className="px-4 py-6 max-w-[480px] mx-auto">
        {/* User Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-primary" />
            </div>
            <div className="ml-4">
              <div className="text-lg font-semibold">记账用户</div>
              <div className="text-sm text-gray-400">开始管理你的财务</div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center px-4 py-4 border-b border-gray-50">
            <Info size={20} className="text-gray-400 mr-3" />
            <span className="flex-1">关于</span>
            <span className="text-gray-400">v1.0.0</span>
          </div>

          <button
            onClick={() => alert('退出登录功能开发中...')}
            className="w-full flex items-center px-4 py-4 text-expense hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} className="mr-3" />
            <span>退出登录</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-300">
          <p>记账本 · 让生活更清晰</p>
        </div>
      </main>
    </div>
  )
}
