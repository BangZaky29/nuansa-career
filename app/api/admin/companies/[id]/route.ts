import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { slugify } from '@/lib/slug'
import { requireAdmin } from '@/lib/supabase/admin-auth'
import { logAdminAction } from '@/lib/admin-log'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { error: authError } = await requireAdmin()
    if (authError) return authError

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { adminUser, error: authError } = await requireAdmin()
    if (authError) return authError

    const supabase = createAdminClient()
    const body = await request.json()
    const { name, ...rest } = body

    const updateData: any = { ...rest, updated_at: new Date().toISOString() }
    if (name) {
      updateData.name = name
      updateData.slug = slugify(name)
    }

    const { data, error } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    await logAdminAction(
      adminUser!.user_id,
      'update',
      'companies',
      data.id,
      `Updated company: ${data.name}`
    )

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { adminUser, error: authError } = await requireAdmin()
    if (authError) return authError

    const supabase = createAdminClient()
    const { data: company } = await supabase.from('companies').select('name').eq('id', params.id).single()
    
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    await logAdminAction(
      adminUser!.user_id,
      'delete',
      'companies',
      params.id,
      `Deleted company: ${company?.name || params.id}`
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
