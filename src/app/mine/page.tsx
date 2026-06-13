'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { useUser } from '@/contexts/UserContext'
import { User, LogOut, Info, Edit2, Check, X, ChevronDown, Camera } from 'lucide-react'

// 预设头像列表
const avatarList = [
  { id: 'avatar1', emoji: '😀', color: '#4F46E5' },
  { id: 'avatar2', emoji: '😎', color: '#10B981' },
  { id: 'avatar3', emoji: '🥰', color: '#F59E0B' },
  { id: 'avatar4', emoji: '😍', color: '#EF4444' },
  { id: 'avatar5', emoji: '🤩', color: '#8B5CF6' },
  { id: 'avatar6', emoji: '😇', color: '#EC4899' },
  { id: 'avatar7', emoji: '🤗', color: '#06B6D4' },
  { id: 'avatar8', emoji: '😺', color: '#84CC16' },
  { id: 'avatar9', emoji: '🦊', color: '#F97316' },
  { id: 'avatar10', emoji: '🐱', color: '#14B8A6' },
  { id: 'avatar11', emoji: '🐶', color: '#6366F1' },
  { id: 'avatar12', emoji: '🐼', color: '#A855F7' },
  { id: 'avatar13', emoji: '🐨', color: '#0EA5E9' },
  { id: 'avatar14', emoji: '🦁', color: '#FACC15' },
  { id: 'avatar15', emoji: '🐯', color: '#FB923C' },
  { id: 'avatar16', emoji: '🦄', color: '#D946EF' },
]

export default function MinePage() {
  const { users, currentUser, setCurrentUser, updateUser } = useUser()
  const [showUserList, setShowUserList] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)

  const handleSelectUser = (user: typeof currentUser) => {
    if (user) {
      setCurrentUser(user)
      setShowUserList(false)
    }
  }

  const handleStartEdit = (userId: number, name: string) => {
    setEditingUserId(userId)
    setEditingName(name)
    setShowUserList(false)
    setShowAvatarPicker(false)
  }

  const handleSaveName = () => {
    if (editingUserId && editingName.trim()) {
      updateUser(editingUserId, { name: editingName.trim() })
      setEditingUserId(null)
      setEditingName('')
    }
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
    setEditingName('')
  }

  const handleSelectAvatar = (avatar: typeof avatarList[0]) => {
    if (editingUserId) {
      updateUser(editingUserId, { avatar_url: avatar.id })
      setShowAvatarPicker(false)
    }
  }

  const getAvatarDisplay = (user: typeof currentUser) => {
    if (user?.avatar_url) {
      const avatar = avatarList.find(a => a.id === user.avatar_url)
      if (avatar) {
        return (
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${avatar.color}20` }}
          >
            <span className="text-3xl">{avatar.emoji}</span>
          </div>
        )
      }
    }
    // 默认头像
    const defaultAvatar = avatarList.find(a => a.id === 'avatar1')!
    return (
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${user?.color || defaultAvatar.color}20` }}
      >
        <User size={32} style={{ color: user?.color || defaultAvatar.color }} />
      </div>
    )
  }

  const getSmallAvatarDisplay = (user: typeof currentUser) => {
    if (user?.avatar_url) {
      const avatar = avatarList.find(a => a.id === user.avatar_url)
      if (avatar) {
        return (
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${avatar.color}20` }}
          >
            <span className="text-xl">{avatar.emoji}</span>
          </div>
        )
      }
    }
    const defaultAvatar = avatarList.find(a => a.id === 'avatar1')!
    return (
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${user?.color || defaultAvatar.color}20` }}
      >
        <User size={20} style={{ color: user?.color || defaultAvatar.color }} />
      </div>
    )
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
              {getAvatarDisplay(currentUser)}
              <div className="ml-4">
                {editingUserId === currentUser?.id ? (
                  <div className="flex flex-col gap-2">
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
                    <button
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      className="flex items-center text-sm text-primary hover:text-indigo-700"
                    >
                      <Camera size={14} className="mr-1" />
                      更换头像
                    </button>
                    {showAvatarPicker && (
                      <div className="grid grid-cols-8 gap-2 mt-2 p-2 bg-gray-50 rounded-lg">
                        {avatarList.map((avatar) => (
                          <button
                            key={avatar.id}
                            onClick={() => handleSelectAvatar(avatar)}
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:ring-2 ring-primary transition-all"
                            style={{ backgroundColor: `${avatar.color}20` }}
                          >
                            <span className="text-xl">{avatar.emoji}</span>
                          </button>
                        ))}
                      </div>
                    )}
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
          {showUserList && users.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-400 mb-3">选择用户</div>
              <div className="grid grid-cols-5 gap-3">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                      currentUser?.id === user.id
                        ? 'ring-2 ring-primary bg-gray-50'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {getSmallAvatarDisplay(user)}
                    <span className="text-xs text-gray-600 mt-1">{user.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Edit User Names */}
        {users.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">编辑用户</span>
              <Edit2 size={16} className="text-gray-400" />
            </div>
            <div className="space-y-2">
              {users.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    {getSmallAvatarDisplay(user)}
                    <span className="ml-3 text-sm text-gray-600">{user.name}</span>
                  </div>
                  <button
                    onClick={() => handleStartEdit(user.id, user.name)}
                    className="text-primary text-sm hover:text-indigo-700"
                  >
                    编辑
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
