'use client'

import { useEffect, useState, FormEvent } from 'react'
import {
  PlusCircle,
  Edit,
  Trash2,
  Tag,
  AlertCircle,
  Loader2,
  Save,
  X,
  Check,
} from 'lucide-react'

interface Category {
  id: number
  name: string
  nameNepali?: string | null
  slug: string
  description?: string | null
  _count?: { articles: number }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // New category form
  const [newName, setNewName] = useState('')
  const [newNameNepali, setNewNameNepali] = useState('')
  const [newDescription, setNewDescription] = useState('')

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editNameNepali, setEditNameNepali] = useState('')
  const [editDescription, setEditDescription] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data.categories ?? [])
    } catch {
      setError('Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          nameNepali: newNameNepali || null,
          description: newDescription || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to create')
      setCategories((prev) => [...prev, data.category])
      setNewName('')
      setNewNameNepali('')
      setNewDescription('')
      setSuccess('Category created!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create category.')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditNameNepali(cat.nameNepali ?? '')
    setEditDescription(cat.description ?? '')
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function handleUpdate(id: number) {
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          nameNepali: editNameNepali || null,
          description: editDescription || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to update')
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data.category } : c))
      )
      setEditingId(null)
      setSuccess('Category updated!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update category.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete category "${name}"? Articles in this category will be uncategorized.`))
      return
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setCategories((prev) => prev.filter((c) => c.id !== id))
      setSuccess('Category deleted.')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to delete category.')
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage article categories</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
          <AlertCircle size={16} />
          {error}
          <button onClick={() => setError('')} className="ml-auto">
            <X size={14} />
          </button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5">
          <Check size={16} />
          {success}
        </div>
      )}

      {/* Add New Category */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <PlusCircle size={17} className="text-red-700" />
          Add New Category
        </h2>
        <form onSubmit={handleCreate} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Name (English) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Politics"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Name (Nepali)
              </label>
              <input
                type="text"
                value={newNameNepali}
                onChange={(e) => setNewNameNepali(e.target.value)}
                placeholder="e.g. राजनीति"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description (optional)
            </label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Brief description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
            />
          </div>
          <button
            type="submit"
            disabled={saving || !newName.trim()}
            className="flex items-center gap-2 bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <PlusCircle size={14} />}
            Add Category
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">
            All Categories ({categories.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <Tag size={32} className="mx-auto mb-3 opacity-40" />
            <p>No categories yet. Add one above.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <div key={cat.id} className="px-5 py-4">
                {editingId === cat.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
                        placeholder="Name (English)"
                      />
                      <input
                        type="text"
                        value={editNameNepali}
                        onChange={(e) => setEditNameNepali(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
                        placeholder="Name (Nepali)"
                      />
                    </div>
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
                      placeholder="Description"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        disabled={saving}
                        className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <X size={12} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{cat.name}</span>
                        {cat.nameNepali && (
                          <span className="text-gray-500 text-sm">({cat.nameNepali})</span>
                        )}
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {cat.slug}
                        </span>
                        {cat._count !== undefined && (
                          <span className="text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                            {cat._count.articles} articles
                          </span>
                        )}
                      </div>
                      {cat.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-3">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-1.5 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
