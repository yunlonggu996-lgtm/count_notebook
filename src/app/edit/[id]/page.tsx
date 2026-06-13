'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Header from '@/components/Header'
import AmountInput from '@/components/AmountInput'
import { categories } from '@/lib/categories'
import dayjs from 'dayjs'

type TransactionType = 'expense' | 'income'

interface Transaction {
  id: number
  type: string
  amount: number
  category: string
  date: string
  note?: string
}

export default function EditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransaction()
  }, [id])

  const fetchTransaction = async () => {
    try {
      const res = await fetch(`/api/transactions/${id}`)
      const data = await res.json()
      if (data.success) {
        const trans: Transaction = data.data
        setType(trans.type as TransactionType)
        setAmount(trans.amount.toString())
        setCategory(trans.category)
        setDate(trans.date)
        setNote(trans.note || '')
      }
    } catch (error) {
      console.error('Failed to fetch transaction:', error)
    } finally {
      setLoading(false)
    }
  }

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
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          amount,
          category,
          date,
          note,
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

  const handleDelete = async () => {
    if (!confirm('确定要删除这条记录吗？')) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      if (data.success) {
        router.push('/')
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('Failed to delete:', error)
      alert('删除失败')
    } finally {
      setDeleting(false)
    }
  }

  const expenseCategories = categories.filter(c => c.id !== 'salary')
  const incomeCategories = categories.filter(c => c.id === 'salary' || c.id === 'other')
  const displayCategories = type === 'expense' ? expenseCategories : incomeCategories

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header title="编辑" showBack />
        <div className="flex items-center justify-center h-64 text-gray-400">
          加载中...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header title="编辑" showBack />

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
        <div className="px-4 pb-32">
          <div className="text-sm text-gray-400 mb-3">备注</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="添加备注..."
            rows={3}
            className="w-full p-3 bg-gray-50 rounded-xl resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 space-y-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-primary text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full py-3 bg-white text-expense rounded-2xl font-medium border border-expense hover:bg-red-50 transition-all disabled:opacity-50"
          >
            {deleting ? '删除中...' : '删除'}
          </button>
        </div>
      </div>
    </div>
  )
}
