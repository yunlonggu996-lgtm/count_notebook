'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs from 'dayjs'

interface CalendarPickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export default function CalendarPicker({ value, onChange, label }: CalendarPickerProps) {
  const [date] = useState(dayjs(value))
  const [currentMonth, setCurrentMonth] = useState(dayjs(value))

  const year = currentMonth.year()
  const month = currentMonth.month()
  const today = dayjs()
  const selectedDate = dayjs(value)

  const firstDay = currentMonth.startOf('month').day()
  const daysInMonth = currentMonth.daysInMonth()

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'))
  }

  const handleDateClick = (day: number) => {
    const selected = currentMonth.date(day)
    onChange(selected.format('YYYY-MM-DD'))
  }

  const isToday = (day: number) => {
    return currentMonth.date(day).isSame(today, 'day')
  }

  const isSelected = (day: number) => {
    return currentMonth.date(day).isSame(selectedDate, 'day')
  }

  const isInFuture = (day: number) => {
    return currentMonth.date(day).isAfter(today, 'day')
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <button
          onClick={handlePrevMonth}
          className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center transition-colors"
        >
          <ChevronLeft size={18} className="text-gray-500" />
        </button>
        <div className="text-sm font-semibold text-gray-700">
          {year}年{month + 1}月
        </div>
        <button
          onClick={handleNextMonth}
          className="w-8 h-8 rounded-lg hover:bg-white flex items-center justify-center transition-colors"
        >
          <ChevronRight size={18} className="text-gray-500" />
        </button>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 px-2 py-2">
        {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
          <div key={day} className="text-xs text-gray-400 text-center py-1.5">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 px-2 pb-2">
        {days.map((day, index) => {
          if (day === null) {
            return <div key={index} className="h-8" />
          }
          
          const isDisabled = isInFuture(day)
          const isTodayDay = isToday(day)
          const isSelectedDay = isSelected(day)

          return (
            <button
              key={index}
              onClick={() => !isDisabled && handleDateClick(day)}
              disabled={isDisabled}
              className={`
                h-8 rounded-lg text-sm font-medium transition-all duration-150
                flex items-center justify-center
                ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-indigo-50'}
                ${isSelectedDay ? 'bg-indigo-500 text-white shadow-md shadow-indigo-200' : ''}
                ${isTodayDay && !isSelectedDay ? 'ring-2 ring-indigo-300' : ''}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => onChange('')}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          清除
        </button>
        <button
          onClick={() => onChange(dayjs().format('YYYY-MM-DD'))}
          className="text-xs text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
        >
          今天
        </button>
      </div>
    </div>
  )
}
