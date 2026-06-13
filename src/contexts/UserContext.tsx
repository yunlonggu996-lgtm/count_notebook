'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: number
  name: string
  color: string
  avatar_url?: string
}

interface UserContextType {
  users: User[]
  currentUser: User | null
  setCurrentUser: (user: User) => void
  updateUser: (userId: number, data: { name?: string; avatar_url?: string }) => void
  loading: boolean
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [currentUserId, setCurrentUserId] = useState<number>(1)
  const [loading, setLoading] = useState(true)

  // 从数据库加载用户列表
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (data.success) {
        setUsers(data.data)
        // 从 localStorage 恢复当前用户
        const savedUserId = localStorage.getItem('currentUserId')
        if (savedUserId && data.data.some((u: User) => u.id === parseInt(savedUserId))) {
          setCurrentUserId(parseInt(savedUserId))
        }
      }
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentUser = users.find(u => u.id === currentUserId) || null

  const setCurrentUser = (user: User) => {
    setCurrentUserId(user.id)
    localStorage.setItem('currentUserId', user.id.toString())
  }

  const updateUser = async (userId: number, updateData: { name?: string; avatar_url?: string }) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, ...updateData }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, ...updateData } : u
        ))
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  return (
    <UserContext.Provider value={{ users, currentUser, setCurrentUser, updateUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
