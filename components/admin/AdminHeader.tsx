"use client"

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'

export default function AdminHeader() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 px-3 py-2 rounded hover:bg-red-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}
