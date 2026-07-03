import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { slugify } from '@/lib/slug'
import { requireAdmin } from '@/lib/supabase/admin-auth'
import { logAdminAction } from '@/lib/admin-log'

export async function GET() {
  try {
    const { error: authError } = await requireAdmin()
    if (authError) return authError

    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('job_categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { adminUser, error: authError } = await requireAdmin()
    if (authError) return authError

    const supabase = createAdminClient()
    const body = await request.json()
    const { name, icon, is_active } = body

    const slug = slugify(name)

    const { data, error } = await supabase
      .from('job_categories')
      .insert([{ name, slug, icon, is_active: is_active ?? true }])
      .select()
      .single()

    if (error) throw error

    await logAdminAction(
      adminUser!.user_id,
      'create',
      'job_categories',
      data.id,
      `Created category: ${name}`
    )

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
