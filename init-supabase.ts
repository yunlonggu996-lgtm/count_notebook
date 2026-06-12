import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://refdgixqbreiaegzvxws.supabase.co'
const supabaseKey = 'sb_publishable_aR660OrFyhyXQuOqSNZ2Qg_nf6Ob6bC'

async function initDatabase() {
  console.log('🔌 正在连接 Supabase...\n')

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // 插入测试数据
    console.log('📝 插入测试数据到 transactions 表...\n')

    const testData = [
      { type: 'income', amount: 8500.00, category: 'salary', date: '2026-06-01', note: '工资收入' },
      { type: 'expense', amount: 45.50, category: 'food', date: '2026-06-02', note: '午餐' },
      { type: 'expense', amount: 28.00, category: 'transport', date: '2026-06-03', note: '地铁' },
      { type: 'expense', amount: 156.00, category: 'shopping', date: '2026-06-04', note: '网购' },
      { type: 'expense', amount: 3200.00, category: 'living', date: '2026-06-05', note: '房租' },
      { type: 'income', amount: 500.00, category: 'other', date: '2026-06-06', note: '兼职' },
      { type: 'expense', amount: 88.00, category: 'entertainment', date: '2026-06-07', note: '电影' },
      { type: 'expense', amount: 35.00, category: 'food', date: '2026-06-08', note: '早餐' },
      { type: 'expense', amount: 120.00, category: 'medical', date: '2026-06-09', note: '买药' },
      { type: 'expense', amount: 66.50, category: 'food', date: '2026-06-10', note: '朋友聚餐' },
    ]

    const { data, error } = await supabase
      .from('transactions')
      .insert(testData)
      .select()

    if (error) {
      console.log('⚠️ 批量插入失败，尝试单条插入...')
      for (const item of testData) {
        const { error: singleError } = await supabase
          .from('transactions')
          .insert(item)
        if (singleError) {
          console.log(`❌ 插入失败: ${item.note} - ${singleError.message}`)
        } else {
          console.log(`✅ 插入成功: ${item.note}`)
        }
      }
    } else {
      console.log('✅ 批量插入成功！')
      console.log(JSON.stringify(data, null, 2))
    }

    // 验证查询所有数据
    console.log('\n📋 验证查询所有数据...')
    const { data: allData, error: queryError } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: false })

    if (queryError) {
      console.error('❌ 查询失败:', queryError.message)
      return
    }

    console.log(`\n✅ 表中共有 ${allData?.length || 0} 条记录`)
    console.log('全部数据:', JSON.stringify(allData, null, 2))

  } catch (err) {
    console.error('❌ 操作失败:', err)
  }
}

initDatabase()
