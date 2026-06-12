import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://refdgixqbreiaegzvxws.supabase.co'
const supabaseKey = 'sb_publishable_aR660OrFyhyXQuOqSNZ2Qg_nf6Ob6bC'

async function checkSchema() {
  console.log('🔌 正在连接 Supabase...\n')

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // 先查询所有数据看看表结构
    console.log('📋 查询 count_notebook 表数据...\n')

    const { data, error } = await supabase
      .from('count_notebook')
      .select('*')

    if (error) {
      console.error('❌ 查询失败:', error.message)
      console.error('错误详情:', error)
      return
    }

    console.log('✅ 查询成功！\n')
    console.log('📊 数据预览:')
    console.log('------------')

    if (data && data.length > 0) {
      console.log(`找到 ${data.length} 条记录:\n`)
      console.log('第一条记录的结构:')
      console.log(JSON.stringify(data[0], null, 2))
      console.log('\n所有字段:')
      console.log(Object.keys(data[0]))
    } else {
      console.log('表为空')
      // 尝试插入不同结构的数据
      console.log('\n尝试插入默认结构数据...')

      // 尝试插入第一条数据
      const testData = {
        type: 'expense',
        amount: 88.50,
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        note: '测试'
      }

      const insertResult = await supabase
        .from('count_notebook')
        .insert([testData])
        .select()

      if (insertResult.error) {
        console.log('\n❌ 插入失败')
        console.log('错误:', insertResult.error.message)
        console.log('错误代码:', insertResult.error.code)
      } else {
        console.log('\n✅ 插入成功!')
        console.log(JSON.stringify(insertResult.data, null, 2))
      }
    }

  } catch (err) {
    console.error('❌ 操作失败:', err)
  }
}

checkSchema()
