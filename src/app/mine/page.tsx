'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { User, LogOut, Info, Edit2, Check, X, ChevronDown, Plus } from 'lucide-react'

interface UserProfile {
  id: number
  name: string
  color: string
}

const defaultUsers: UserProfile[] = [
  { id: 1, name: '用户1', color: '#4F46E5' },
  { id: 2, name: '用户2', color: '#10B981' },
  { id: 3, name: '用户3', color: '#F59E0B' },
  { id: 4, name: '用户4', color: '#EF4444' },
  { id: 5, name: '用户5', color: '#8B5CF6' },
]

export default function MinePage() {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('users')
    return saved ? JSON.parse(saved) : defaultUsers
  })
  
  const [currentUserId, setCurrentUserId] = useState(() => {
    const saved = localStorage.getItem('currentUserId')
    return saved ? parseInt(saved) : 1
  })
  
  const [showUserList, setShowUserList] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')

  const currentUser = users.find(u => u.id === currentUserId)

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem('currentUserId', currentUserId.toString())
  }, [currentUserId])

  const handleSelectUser = (userId: number) => {
    setCurrentUserId(userId)
    setShowUserList(false)
  }

  const handleStartEdit = (user: UserProfile) => {
    setEditingUserId(user.id)
    setEditingName(user.name)
    setShowUserList(false)
  }

  const handleSaveName = () => {
    if (editingUserId && editingName.trim()) {
      setUsers(users.map(u => 
        u.id === editingUserId ? { ...u, name: editingName.trim() } : u
      ))
    }
    setEditingUserId(null)
    setEditingName('')
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
    setEditingName('')
  }

  return (
    <div className="min-h-screen">
      <Header title="我的" />

      <main className="px-4 py-6 max-w-[480px] mx-auto">
        {/* User Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <button
            onClick={() => setShowUserList(!showUserList)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${currentUser?.color}20` }}
              >
                <User size={32} style={{ color: currentUser?.color }} />
              </div>
              <div className="ml-4">
                {editingUserId === currentUserId ? (
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="text-lg font-semibold border-b border-gray-200 px-1 focus:outline-none focus:border-primary"
                      autoFocus
                      maxLength={10}
                    />
                    <button
                      onClick={handleSaveName}
                      className="ml-2 text-primary hover:bg-gray-100 p-1 rounded"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="ml-1 text-gray-400 hover:bg-gray-100 p-1 rounded"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-lg font-semibold">{currentUser?.name}</div>
                    <div className="text-sm text-gray-400">点击切换用户</div>
                  </>
                )}
              </div>
            </div>
            <ChevronDown 
              size={20} 
              className={`text-gray-400 transition-transform ${showUserList ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* User List Dropdown */}
          {showUserList && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-400 mb-3">选择用户</div>
              <div className="grid grid-cols-5 gap-3">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                      currentUserId === user.id
                        ? 'ring-2 ring-primary bg-gray-50'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-1"
                      style={{ backgroundColor: `${user.color}20` }}
                    >
                      <User size={20} style={{ color: user.color }} />
                    </div>
                    <span className="text-xs text-gray-600">{user.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Edit User Names */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">编辑用户名</span>
            <Edit2 size={16} className="text-gray-400" />
          </div>
          <div className="space-y-2">
            {users.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: `${user.color}20` }}
                  >
                    <User size={16} style={{ color: user.color }} />
                  </div>
                  <span className="text-sm text-gray-600">{user.name}</span>
                </div>
                <button
                  onClick={() => handleStartEdit(user)}
                  className="text-primary text-sm hover:text-indigo-700"
                >
                  编辑
                </button>
              </div>
            ))}
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
