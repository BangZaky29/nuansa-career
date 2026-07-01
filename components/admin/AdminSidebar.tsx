"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, Briefcase, Tags, BarChart3, Settings } from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Perusahaan', href: '/admin/companies', icon: Building2 },
  { name: 'Kategori', href: '/admin/categories', icon: Tags },
  { name: 'Lowongan', href: '/admin/jobs', icon: Briefcase },
  { name: 'Statistik', href: '/admin/stats', icon: BarChart3 },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold">Nuansa Admin</h2>
      </div>
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
