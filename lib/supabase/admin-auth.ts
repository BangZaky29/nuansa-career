import { createClient } from './server'
import { NextResponse } from 'next/server'

/**
 * Guard untuk semua API route di /api/admin/*.
 * Mengecek session Supabase Auth + memastikan user terdaftar aktif di admin_users.
 * Wajib dipanggil di awal setiap handler route admin (defense in depth,
 * selain proteksi di middleware.ts).
 */
export async function requireAdmin() {
  const supabase = createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      user: null,
      adminUser: null,
      error: NextResponse.json(
        { error: 'Unauthorized. Silakan login terlebih dahulu.' },
        { status: 401 }
      ),
    }
  }

  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('id, name, role, is_active, user_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (adminError || !adminUser || !adminUser.is_active) {
    return {
      user,
      adminUser: null,
      error: NextResponse.json(
        { error: 'Forbidden. Akun Anda tidak memiliki akses admin.' },
        { status: 403 }
      ),
    }
  }

  return { user, adminUser, error: null }
}
