import { createAdminClient } from '@/lib/supabase/server'

export async function logAdminAction(
  adminId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  description?: string
) {
  try {
    const supabase = createAdminClient()
    await supabase.from('admin_logs').insert([
      {
        admin_id: adminId,
        action,
        target_type: targetType,
        target_id: targetId,
        description,
      },
    ])
  } catch (err) {
    console.error('Failed to log admin action:', err)
  }
}
