import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { slugify } from '@/lib/slug'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('jobs')
      .select('*, companies(name), job_categories(name)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('jobs')
      .insert([
        {
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
        },
      ])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
