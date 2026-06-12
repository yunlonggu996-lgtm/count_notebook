'use client'

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { getCategoryById } from '@/lib/categories'

interface StatsPieChartProps {
  data: Record<string, number>
}

export default function StatsPieChart({ data }: StatsPieChartProps) {
  const chartData = Object.entries(data).map(([category, amount]) => ({
    name: getCategoryById(category).name,
    value: amount,
    color: getCategoryById(category).color,
    icon: getCategoryById(category).icon,
  }))

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  if (total === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        暂无数据
      </div>
    )
  }

  return (
    <div className="h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-sm text-gray-400">支出总额</div>
        <div className="text-xl font-bold">¥{total.toFixed(2)}</div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center text-sm">
            <span
              className="w-2 h-2 rounded-full mr-1"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-gray-600">{item.icon} {item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
