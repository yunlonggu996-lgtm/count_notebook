'use client'

import { useState } from 'react'
import { Delete, Check } from 'lucide-react'

interface AmountInputProps {
  value: string
  onChange: (value: string) => void
}

export default function AmountInput({ value, onChange }: AmountInputProps) {
  const [inputValue, setInputValue] = useState(value)

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      const newValue = inputValue.slice(0, -1)
      setInputValue(newValue)
      onChange(newValue)
    } else if (key === '.') {
      if (!inputValue.includes('.')) {
        const newValue = inputValue + '.'
        setInputValue(newValue)
        onChange(newValue)
      }
    } else {
      // Limit decimal places to 2
      const parts = inputValue.split('.')
      if (parts[1] && parts[1].length >= 2) return
      if (inputValue.length >= 10) return

      const newValue = inputValue + key
      setInputValue(newValue)
      onChange(newValue)
    }
  }

  const handleClear = () => {
    setInputValue('')
    onChange('')
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'backspace']

  return (
    <div>
      {/* Display */}
      <div className="text-center py-6">
        <span className="text-5xl font-bold tracking-wider">
          {inputValue || '0'}
        </span>
      </div>

      {/* Keyboard */}
      <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50 rounded-t-3xl">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleKeyPress(key)}
            className="keyboard-btn"
          >
            {key === 'backspace' ? (
              <Delete size={24} className="text-gray-500" />
            ) : (
              <span className="text-gray-800">{key}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
