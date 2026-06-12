'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  title: string
  showBack?: boolean
}

export default function Header({ title, showBack = false }: HeaderProps) {
  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-40">
      <div className="flex items-center h-14 px-4 max-w-[480px] mx-auto">
        {showBack ? (
          <Link
            href="/"
            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
        ) : (
          <div className="w-10" />
        )}
        <h1 className="flex-1 text-center font-semibold text-lg">{title}</h1>
        <div className="w-10" />
      </div>
    </header>
  )
}
