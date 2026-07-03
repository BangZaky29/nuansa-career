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
      .from('jobs')
      .select('*, companies(name), job_categories(name)')
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

    const { data, error } = await supabase
      .from('jobs')
      .update({
        company_id: body.company_id,
        category_id: body.category_id,
        title: body.title,
        slug: slugify(body.title),
        location: body.location,
        city: body.city,
        province: body.province,
        employment_type: body.employment_type,
        work_arrangement: body.work_arrangement,
        experience_level: body.experience_level,
        salary_min: body.salary_min,
        salary_max: body.salary_max,
        show_salary: body.show_salary,
        status: body.status,
        is_featured: body.is_featured,
        apply_whatsapp_number: body.apply_whatsapp_number,
        apply_message_template: body.apply_message_template,
        description: body.description,
        responsibilities: body.responsibilities,
        requirements: body.requirements,
        benefits: body.benefits,
        expired_at: body.expired_at || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    await logAdminAction(
      adminUser!.user_id,
      'update',
      'jobs',
      data.id,
      `Updated job: ${data.title}`
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
    const { data: job } = await supabase.from('jobs').select('title').eq('id', params.id).single()

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    await logAdminAction(
      adminUser!.user_id,
      'delete',
      'jobs',
      params.id,
      `Deleted job: ${job?.title || params.id}`
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
