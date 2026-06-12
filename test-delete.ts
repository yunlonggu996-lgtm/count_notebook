import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://refdgixqbreiaegzvxws.supabase.co'
const supabaseKey = 'sb_publishable_aR660OrFyhyXQuOqSNZ2Qg_nf6Ob6bC'

async function testDelete() {
  console.log('🔌 正在连接 Supabase...\n')

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // 删除 id=3 的记录
    console.log('🗑️ 删除 id=3 的记录...\n')

    const { error } = await supabase
      .from('count_notebook')
      .delete()
      .eq('id', 3)

    if (error) {
      console.error('❌ 删除失败:', error.message)
      console.error('错误代码:', error.code)
      return
    }

    console.log('✅ 删除成功！')

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
    console.log('全部数据:', JSON.stringify(allData, null, 2))

  } catch (err) {
    console.error('❌ 操作失败:', err)
  }
}

testDelete()
