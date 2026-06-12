import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://refdgixqbreiaegzvxws.supabase.co'
const supabaseKey = 'sb_publishable_aR660OrFyhyXQuOqSNZ2Qg_nf6Ob6bC'

async function testInsert() {
  console.log('🔌 正在连接 Supabase...\n')

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // 插入一条符合表结构的数据
    console.log('📝 插入测试数据到 count_notebook 表...\n')

    const testData = {
      name: '张三',
      age: 25
    }

    const { data, error } = await supabase
      .from('count_notebook')
      .insert([testData])
      .select()

    if (error) {
      console.error('❌ 插入失败:', error.message)
      console.error('错误代码:', error.code)
      return
    }

    console.log('✅ 插入成功！\n')
    console.log('📊 插入的数据:')
    console.log(JSON.stringify(data, null, 2))

    // 验证查询所有数据
    console.log('\n📋 验证查询所有数据...')
    const { data: allData, error: queryError } = await supabase
      .from('count_notebook')
      .select('*')

    if (queryError) {
      console.error('❌ 查询失败:', queryError.message)
      return
    }

    console.log(`\n✅ 表中共有 ${allData?.length || 0} 条记录`)
    console.log('------------')
    console.log('全部数据:', JSON.stringify(allData, null, 2))

  } catch (err) {
    console.error('❌ 操作失败:', err)
  }
}

testInsert()
