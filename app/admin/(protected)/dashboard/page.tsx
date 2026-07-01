"use client"

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    jobs: 0,
    companies: 0,
    clicks: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      const [
        { count: jobsCount },
        { count: companiesCount },
        { count: clicksCount }
      ] = await Promise.all([
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('companies').select('*', { count: 'exact', head: true }),
        supabase.from('job_apply_clicks').select('*', { count: 'exact', head: true })
      ])

      setStats({
        jobs: jobsCount || 0,
        companies: companiesCount || 0,
        clicks: clicksCount || 0
      })
    }
    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Lowongan</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.jobs}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Perusahaan</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.companies}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Klik Apply</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.clicks}</p>
        </div>
      </div>
    </div>
  )
}
