'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: number
  name: string
  color: string
}

interface UserContextType {
  users: User[]
  currentUser: User | null
  setCurrentUser: (user: User) => void
  updateUserName: (userId: number, name: string) => void
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [currentUserId, setCurrentUserId] = useState<number>(1)

  // 从数据库加载用户列表
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch('/api/users')
        const data = await res.json()
        if (data.success) {
          setUsers(data.data)
        }
      } catch (error) {
        console.error('Failed to load users:', error)
      }
    }
    loadUsers()
  }, [])

  const currentUser = users.find(u => u.id === currentUserId) || null

  const setCurrentUser = (user: User) => {
    setCurrentUserId(user.id)
    localStorage.setItem('currentUserId', user.id.toString())
  }

  const updateUserName = async (userId: number, name: string) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, name }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers(users.map(u => 
          u.id === userId ? { ...u, name } : u
        ))
      }
    } catch (error) {
      console.error('Failed to update user name:', error)
    }
  }

  return (
    <UserContext.Provider value={{ users, currentUser, setCurrentUser, updateUserName }}>
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
