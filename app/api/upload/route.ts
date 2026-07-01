import { createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'company-logos'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Format file tidak didukung. Gunakan PNG, JPG, atau WEBP.' }, { status: 400 })
    }

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      return NextResponse.json({ error: 'Ukuran file melebihi 1MB.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const filename = `${folder}/${Date.now()}.${ext}`

    const { data, error } = await supabase.storage
      .from('company-logos')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage
      .from('company-logos')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: publicUrl })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
