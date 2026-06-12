import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://refdgixqbreiaegzvxws.supabase.co'
const supabaseKey = 'sb_publishable_aR660OrFyhyXQuOqSNZ2Qg_nf6Ob6bC'

async function testConnection() {
  console.log('🔌 正在连接 Supabase...\n')

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // 测试连接 - 查询 count_notebook 表
    console.log('📋 查询 count_notebook 表...\n')

    const { data, error } = await supabase
      .from('count_notebook')
      .select('*')
      .limit(10)

    if (error) {
      console.error('❌ 查询失败:', error.message)
      console.error('错误详情:', error)
      return
    }

    console.log('✅ 连接成功！\n')
    console.log('📊 数据预览:')
    console.log('------------')

    if (data && data.length > 0) {
      console.log(`找到 ${data.length} 条记录:\n`)
      data.forEach((row, index) => {
        console.log(`记录 ${index + 1}:`, JSON.stringify(row, null, 2))
      })
    } else {
      console.log('表为空或没有数据')
    }

    // 显示表结构信息
    console.log('\n------------')
    console.log('✅ Supabase 连接测试完成！')

  } catch (err) {
    console.error('❌ 连接失败:', err)
  }
}

testConnection()
