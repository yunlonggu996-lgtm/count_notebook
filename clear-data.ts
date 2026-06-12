import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://refdgixqbreiaegzvxws.supabase.co'
const supabaseKey = 'sb_publishable_aR660OrFyhyXQuOqSNZ2Qg_nf6Ob6bC'

async function clearTestData() {
  console.log('🔌 正在连接 Supabase...\n')

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // 查询当前数据
    const { data: beforeData, error: beforeError } = await supabase
      .from('transactions')
      .select('*')

    if (beforeError) {
      console.error('❌ 查询数据失败:', beforeError.message)
      return
    }

    console.log(`📋 删除前表中有 ${beforeData?.length || 0} 条记录`)

    // 使用 WHERE 子句删除所有数据
    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .gt('id', 0)  // 使用条件删除所有记录

    if (deleteError) {
      console.error('❌ 删除数据失败:', deleteError.message)
      return
    }

    console.log('✅ 成功删除所有测试数据！')

    // 验证删除结果
    const { data: afterData, error: afterError } = await supabase
      .from('transactions')
      .select('*')

    if (afterError) {
      console.error('❌ 验证失败:', afterError.message)
      return
    }

    console.log(`📋 删除后表中有 ${afterData?.length || 0} 条记录`)

  } catch (err) {
    console.error('❌ 操作失败:', err)
  }
}

clearTestData()
