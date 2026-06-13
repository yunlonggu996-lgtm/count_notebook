import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// GET /api/transactions/[id] - 获取单笔交易记录
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Failed to fetch transaction:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to fetch transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transaction' },
      { status: 500 }
    )
  }
}

// PUT /api/transactions/[id] - 更新交易记录
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const id = parseInt(params.id)
    const body = await request.json()

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      )
    }

    const { type, amount, category, date, note } = body

    if (!type || !amount || !category || !date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('transactions')
      .update({
        type,
        amount: parseFloat(amount),
        category,
        date,
        note: note || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Failed to update transaction:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to update transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update transaction' },
      { status: 500 }
    )
  }
}

// DELETE /api/transactions/[id] - 删除交易记录
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Failed to delete transaction:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Failed to delete transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    )
  }
}
