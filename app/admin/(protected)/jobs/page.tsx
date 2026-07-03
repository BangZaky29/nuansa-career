"use client"

import { useEffect, useState } from 'react'

interface CompanyOption {
  id: string
  name: string
}

interface CategoryOption {
  id: string
  name: string
}

interface Job {
  id: string
  title: string
  slug: string
  company_id: string
  category_id: string
  location: string | null
  city: string | null
  province: string | null
  employment_type: string | null
  work_arrangement: string | null
  experience_level: string | null
  salary_min: number | null
  salary_max: number | null
  show_salary: boolean
  status: string
  is_featured: boolean
  apply_whatsapp_number: string | null
  apply_message_template: string | null
  description: string | null
  responsibilities: string | null
  requirements: string | null
  benefits: string | null
  created_at: string
  companies?: CompanyOption
  job_categories?: CategoryOption
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    company_id: '',
    category_id: '',
    location: '',
    city: '',
    province: '',
    employment_type: '',
    work_arrangement: '',
    experience_level: '',
    salary_min: '',
    salary_max: '',
    show_salary: false,
    status: 'draft',
    is_featured: false,
    apply_whatsapp_number: '',
    apply_message_template: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
  })

  const fetchData = async () => {
    setLoading(true)
    const [jobsRes, companiesRes, categoriesRes] = await Promise.all([
      fetch('/api/admin/jobs'),
      fetch('/api/admin/companies'),
      fetch('/api/admin/categories'),
    ])

    const [jobsData, companiesData, categoriesData] = await Promise.all([
      jobsRes.json(),
      companiesRes.json(),
      categoriesRes.json(),
    ])

    setJobs(jobsData)
    setCompanies(companiesData)
    setCategories(categoriesData)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openCreate = () => {
    setEditingJob(null)
    setError(null)
    setForm({
      title: '',
      company_id: companies[0]?.id || '',
      category_id: categories[0]?.id || '',
      location: '',
      city: '',
      province: '',
      employment_type: '',
      work_arrangement: '',
      experience_level: '',
      salary_min: '',
      salary_max: '',
      show_salary: false,
      status: 'draft',
      is_featured: false,
      apply_whatsapp_number: '',
      apply_message_template: '',
      description: '',
      responsibilities: '',
      requirements: '',
      benefits: '',
    })
    setShowForm(true)
  }

  const openEdit = (job: Job) => {
    setEditingJob(job)
    setError(null)
    setForm({
      title: job.title,
      company_id: job.company_id,
      category_id: job.category_id,
      location: job.location || '',
      city: job.city || '',
      province: job.province || '',
      employment_type: job.employment_type || '',
      work_arrangement: job.work_arrangement || '',
      experience_level: job.experience_level || '',
      salary_min: job.salary_min?.toString() || '',
      salary_max: job.salary_max?.toString() || '',
      show_salary: job.show_salary,
      status: job.status,
      is_featured: job.is_featured,
      apply_whatsapp_number: job.apply_whatsapp_number || '',
      apply_message_template: job.apply_message_template || '',
      description: job.description || '',
      responsibilities: job.responsibilities || '',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const method = editingJob ? 'PATCH' : 'POST'
      const url = editingJob ? `/api/admin/jobs/${editingJob.id}` : '/api/admin/jobs'
      const payload = {
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan lowongan.')

      setShowForm(false)
      fetchData()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus lowongan ini?')) return
    await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' })
    fetchData()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lowongan</h1>
          <p className="text-sm text-gray-500">Kelola lowongan yang akan tampil di platform.</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={companies.length === 0 || categories.length === 0}
        >
          Tambah Lowongan
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center overflow-y-auto py-10 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingJob ? 'Edit Lowongan' : 'Tambah Lowongan'}
                </h2>
                <p className="text-sm text-gray-500">Isi detail lowongan dengan lengkap.</p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Tutup
              </button>
            </div>

            {error && (
              <div className="mb-4 p-4 rounded-lg bg-red-50 text-red-700">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-gray-700">
                  Judul Lowongan *
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Perusahaan *
                  <select
                    required
                    value={form.company_id}
                    onChange={(e) => setForm({ ...form, company_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih perusahaan</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-gray-700">
                  Kategori *
                  <select
                    required
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Pilih kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Status
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label className="space-y-2 text-sm text-gray-700">
                  Lokasi
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="space-y-2 text-sm text-gray-700">
                  Tipe Kerja
                  <input
                    type="text"
                    value={form.employment_type}
                    onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Pengaturan Kerja
                  <input
                    type="text"
                    value={form.work_arrangement}
                    onChange={(e) => setForm({ ...form, work_arrangement: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Level Pengalaman
                  <input
                    type="text"
                    value={form.experience_level}
                    onChange={(e) => setForm({ ...form, experience_level: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <label className="space-y-2 text-sm text-gray-700">
                  Show Salary
                  <input
                    type="checkbox"
                    checked={form.show_salary}
                    onChange={(e) => setForm({ ...form, show_salary: e.target.checked })}
                    className="h-4 w-4"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Gaji Min
                  <input
                    type="number"
                    value={form.salary_min}
                    onChange={(e) => setForm({ ...form, salary_min: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Gaji Max
                  <input
                    type="number"
                    value={form.salary_max}
                    onChange={(e) => setForm({ ...form, salary_max: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="h-4 w-4"
                  />
                  Featured
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-2 text-sm text-gray-700">
                  WhatsApp Apply
                  <input
                    type="text"
                    value={form.apply_whatsapp_number}
                    onChange={(e) => setForm({ ...form, apply_whatsapp_number: e.target.value })}
                    placeholder="628123..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Template Pesan
                  <input
                    type="text"
                    value={form.apply_message_template}
                    onChange={(e) => setForm({ ...form, apply_message_template: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              <label className="space-y-2 text-sm text-gray-700">
                Deskripsi *
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="space-y-2 text-sm text-gray-700">
                  Responsibilities
                  <textarea
                    rows={3}
                    value={form.responsibilities}
                    onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Requirements
                  <textarea
                    rows={3}
                    value={form.requirements}
                    onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-gray-700">
                  Benefits
                  <textarea
                    rows={3}
                    value={form.benefits}
                    onChange={(e) => setForm({ ...form, benefits: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                  {saving ? 'Menyimpan...' : 'Simpan Lowongan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Memuat data lowongan...</div>
        ) : jobs.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            Belum ada lowongan. Klik "Tambah Lowongan" untuk mulai.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Judul</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Perusahaan</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Kategori</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-3 font-medium text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3 font-medium text-gray-900">{job.title}</td>
                  <td className="px-6 py-3 text-gray-500">{job.companies?.name || '-'}</td>
                  <td className="px-6 py-3 text-gray-500">{job.job_categories?.name || '-'}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold bg-slate-100 text-slate-700">
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(job)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
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
    </div>
  )
}
