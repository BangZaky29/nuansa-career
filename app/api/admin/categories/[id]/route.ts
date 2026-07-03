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
      .from('job_categories')
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
    const { name, icon, is_active } = body

    const updateData: any = { icon, is_active }
    if (name) {
      updateData.name = name
      updateData.slug = slugify(name)
    }

    const { data, error } = await supabase
      .from('job_categories')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    await logAdminAction(
      adminUser!.user_id,
      'update',
      'job_categories',
      data.id,
      `Updated category: ${data.name}`
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
    const { data: category } = await supabase
      .from('job_categories')
      .select('name')
      .eq('id', params.id)
      .single()

    const { error } = await supabase
      .from('job_categories')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    await logAdminAction(
      adminUser!.user_id,
      'delete',
      'job_categories',
      params.id,
      `Deleted category: ${category?.name || params.id}`
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
