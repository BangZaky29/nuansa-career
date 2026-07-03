"use client"

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

interface Company {
  id: string
  name: string
  slug: string
  industry: string | null
  logo_url: string | null
  address: string | null
  city: string | null
  province: string | null
  website_url: string | null
  email_hr: string | null
  whatsapp_hr: string
  is_active: boolean
  created_at: string
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [form, setForm] = useState({
    name: '',
    industry: '',
    logo_url: '',
    address: '',
    city: '',
    province: '',
    website_url: '',
    email_hr: '',
    whatsapp_hr: '',
    is_active: true,
  })
  const [saving, setSaving] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const { addToast } = useToast()

  const fetchCompanies = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/companies')
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      const data = await res.json()
      setCompanies(data)
    } catch (err: any) {
      addToast({ type: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const openCreate = () => {
    setEditingCompany(null)
    setForm({
      name: '',
      industry: '',
      logo_url: '',
      address: '',
      city: '',
      province: '',
      website_url: '',
      email_hr: '',
      whatsapp_hr: '',
      is_active: true,
    })
    setShowForm(true)
  }

  const openEdit = (company: Company) => {
    setEditingCompany(company)
    setForm({
      name: company.name,
      industry: company.industry || '',
      logo_url: company.logo_url || '',
      address: company.address || '',
      city: company.city || '',
      province: company.province || '',
      website_url: company.website_url || '',
      email_hr: company.email_hr || '',
      whatsapp_hr: company.whatsapp_hr,
      is_active: company.is_active,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const method = editingCompany ? 'PATCH' : 'POST'
      const url = editingCompany
        ? `/api/admin/companies/${editingCompany.id}`
        : '/api/admin/companies'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan perusahaan.')

      addToast({ type: 'success', message: 'Perusahaan berhasil disimpan!' })
      setShowForm(false)
      fetchCompanies()
    } catch (err: any) {
      addToast({ type: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (company: Company) => {
    try {
      const res = await fetch(`/api/admin/companies/${company.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !company.is_active }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      addToast({ type: 'success', message: 'Status perusahaan berhasil diubah!' })
      fetchCompanies()
    } catch (err: any) {
      addToast({ type: 'error', message: err.message })
    }
  }

  const openDeleteConfirm = (id: string) => {
    setDeleteId(id)
    setShowConfirm(true)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      const res = await fetch(`/api/admin/companies/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      addToast({ type: 'success', message: 'Perusahaan berhasil dihapus!' })
      fetchCompanies()
    } catch (err: any) {
      addToast({ type: 'error', message: err.message })
    } finally {
      setShowConfirm(false)
      setDeleteId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Perusahaan</h1>
          <p className="text-sm text-gray-500">Kelola data perusahaan penyedia lowongan.</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Tambah Perusahaan
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCompany ? 'Edit Perusahaan' : 'Tambah Perusahaan'}
                </h2>
                <p className="text-sm text-gray-500">Isi data lengkap agar lowongan bisa ditautkan.</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-gray-700">
                  Nama Perusahaan *
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Industri
                  <input
                    type="text"
                    value={form.industry}
                    onChange={(e) => setForm({ ...form, industry: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-gray-700">
                  Kota
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Provinsi
                  <input
                    type="text"
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm text-gray-700">
                Alamat
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-gray-700">
                  WhatsApp HR *
                  <input
                    type="text"
                    required
                    value={form.whatsapp_hr}
                    onChange={(e) => setForm({ ...form, whatsapp_hr: e.target.value })}
                    placeholder="628123..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Email HR
                  <input
                    type="email"
                    value={form.email_hr}
                    onChange={(e) => setForm({ ...form, email_hr: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-gray-700">
                  Website
                  <input
                    type="url"
                    value={form.website_url}
                    onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Logo URL
                  <input
                    type="url"
                    value={form.logo_url}
                    onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    className="h-4 w-4"
                  />
                  Aktifkan perusahaan
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perusahaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Memuat data perusahaan...</div>
        ) : companies.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Belum ada perusahaan. Klik "Tambah Perusahaan" untuk mulai.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Nama</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Kota</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">WhatsApp</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 font-medium text-gray-900">{company.name}</td>
                  <td className="px-6 py-3 text-gray-500">
                    {company.city || '-'}{company.province ? `, ${company.province}` : ''}
                  </td>
                  <td className="px-6 py-3 text-gray-500">{company.whatsapp_hr}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleToggleActive(company)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition ${
                        company.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {company.is_active ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(company)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(company.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                        title="Hapus"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false)
          setDeleteId(null)
        }}
        onConfirm={handleDelete}
        title="Hapus Perusahaan"
        message="Apakah Anda yakin ingin menghapus perusahaan ini?"
        confirmText="Hapus"
        cancelText="Batal"
      />
    </div>
  )
}
