import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { slugify } from '@/lib/slug' // we need to create this util

export async function GET() {
  try {
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
    const supabase = createAdminClient()
    const body = await request.json()
    const { name, icon, is_active } = body

    const slug = slugify(name)

    const { data, error } = await supabase
      .from('job_categories')
      .insert([
        { name, slug, icon, is_active: is_active ?? true }
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
