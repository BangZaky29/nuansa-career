import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { slugify } from '@/lib/slug'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('job_categories')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
