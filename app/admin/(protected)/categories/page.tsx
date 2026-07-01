"use client"

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  is_active: boolean
  created_at: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<Category | null>(null)
  const [formName, setFormName] = useState('')
  const [formIcon, setFormIcon] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/categories')
    const data = await res.json()
    setCategories(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const openCreate = () => {
    setEditingItem(null)
    setFormName('')
    setFormIcon('')
    setError(null)
    setShowForm(true)
  }

  const openEdit = (cat: Category) => {
    setEditingItem(cat)
    setFormName(cat.name)
    setFormIcon(cat.icon || '')
    setError(null)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const method = editingItem ? 'PATCH' : 'POST'
      const url = editingItem
        ? `/api/admin/categories/${editingItem.id}`
        : '/api/admin/categories'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, icon: formIcon || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan')

      setShowForm(false)
      fetchCategories()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (cat: Category) => {
    await fetch(`/api/admin/categories/${cat.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !cat.is_active }),
    })
    fetchCategories()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus kategori ini?')) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    fetchCategories()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kategori Lowongan</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Kategori' : 'Tambah Kategori'}
            </h2>
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="cth: Legal & Compliance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji/nama icon)</label>
                <input
                  type="text"
                  value={formIcon}
                  onChange={(e) => setFormIcon(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="cth: ⚖️"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                >
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Memuat data...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Belum ada kategori. Klik "Tambah Kategori" untuk mulai.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Icon</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Nama</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Slug</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 text-xl">{cat.icon || '—'}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-3 text-gray-400 font-mono text-xs">{cat.slug}</td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleToggleActive(cat)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition ${
                        cat.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {cat.is_active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {cat.is_active ? 'Aktif' : 'Nonaktif'}
                    </button>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
