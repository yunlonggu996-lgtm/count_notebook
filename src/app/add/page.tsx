'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import AmountInput from '@/components/AmountInput'
import CategoryIcon from '@/components/CategoryIcon'
import { useUser } from '@/contexts/UserContext'
import { categories } from '@/lib/categories'
import dayjs from 'dayjs'

type TransactionType = 'expense' | 'income'

export default function AddPage() {
  const router = useRouter()
  const { currentUser } = useUser()
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const expenseCategories = categories.filter(c => c.id !== 'salary')
  const incomeCategories = categories.filter(c => c.id === 'salary' || c.id === 'other')

  const displayCategories = type === 'expense' ? expenseCategories : incomeCategories

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('请输入金额')
      return
    }
    if (!category) {
      alert('请选择分类')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          amount,
          category,
          date,
          note,
          userId: currentUser?.id || 1,
        }),
      })

      const data = await res.json()
      if (data.success) {
        router.push('/')
      } else {
        alert('保存失败')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="记账" showBack />

      <div className="max-w-[480px] mx-auto">
        {/* Type Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => { setType('expense'); setCategory('') }}
            className={`flex-1 py-3 text-center font-medium transition-all ${
              type === 'expense'
                ? 'text-expense border-b-2 border-expense'
                : 'text-gray-400'
            }`}
          >
            支出
          </button>
          <button
            onClick={() => { setType('income'); setCategory('') }}
            className={`flex-1 py-3 text-center font-medium transition-all ${
              type === 'income'
                ? 'text-income border-b-2 border-income'
                : 'text-gray-400'
            }`}
          >
            收入
          </button>
        </div>

        {/* Amount Input */}
        <AmountInput value={amount} onChange={setAmount} />

        {/* Category Grid */}
        <div className="p-4">
          <div className="text-sm text-gray-400 mb-3">选择分类</div>
          <div className="grid grid-cols-4 gap-3">
            {displayCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  category === cat.id
                    ? 'bg-indigo-50 ring-2 ring-primary'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className="text-xs text-gray-600">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="px-4 pb-4">
          <div className="text-sm text-gray-400 mb-3">日期</div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 bg-gray-50 rounded-xl text-center"
          />
        </div>

        {/* Note */}
        <div className="px-4 pb-28">
          <div className="text-sm text-gray-400 mb-3">备注</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="添加备注..."
            rows={3}
            className="w-full p-3 bg-gray-50 rounded-xl resize-none"
          />
        </div>

        {/* Save Button */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-primary text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  )
}
