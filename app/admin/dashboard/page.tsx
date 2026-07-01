"use client"

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-8">Welcome, {user?.email}</p>
      
      <button 
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  )
}
