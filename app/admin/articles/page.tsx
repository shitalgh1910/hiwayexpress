'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  FileText,
  AlertCircle,
  Search,
  CheckCircle,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { formatDateEn } from '@/lib/utils'

interface Article {
  id: number
  title: string
  slug: string
  status: string
  featured: boolean
  breaking: boolean
  category?: { name: string; slug: string } | null
  author: string
  createdAt: string
  views: number
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchArticles = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ limit: '200' })
      if (statusFilter !== 'all') params.set('status', statusFilter)
      const res = await fetch(`/api/articles?${params}`)
      if (!res.ok) throw new Error('Failed to load articles')
      const data = await res.json()
      setArticles(data.articles ?? [])
    } catch (err) {
      setError('Failed to load articles.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  async function handleDelete(id: number) {
    if (!confirm('Delete this article? This cannot be undone.')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id))
      } else {
        alert('Failed to delete article.')
      }
    } catch {
      alert('Network error.')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = articles.filter((a) =>
    search ? a.title.toLowerCase().includes(search.toLowerCase()) : true
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage all news articles</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <PlusCircle size={16} /> New Article
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-2">
          {(['all', 'published', 'draft'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-red-700 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <FileText size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-gray-600 font-medium">No articles found.</p>
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="text-red-700 hover:underline text-sm mt-2 block mx-auto"
              >
                Show all articles
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-5 py-3 font-semibold text-gray-600">Title</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 hidden sm:table-cell">Status</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">Date</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">Views</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">{article.title}</p>
                        <div className="flex gap-1.5 mt-0.5">
                          {article.featured && (
                            <span className="text-xs text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                              Featured
                            </span>
                          )}
                          {article.breaking && (
                            <span className="text-xs text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                              Breaking
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-gray-500 text-xs">
                      {article.category?.name ?? '—'}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                          article.status === 'published'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}
                      >
                        {article.status === 'published' ? (
                          <CheckCircle size={11} />
                        ) : (
                          <Clock size={11} />
                        )}
                        {article.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-gray-500 text-xs">
                      {formatDateEn(article.createdAt)}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-gray-500 text-xs">
                      {article.views.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {article.status === 'published' && (
                          <Link
                            href={`/news/${article.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                            title="View on site"
                          >
                            <ExternalLink size={14} />
                          </Link>
                        )}
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="p-1.5 text-gray-400 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          disabled={deleting === article.id}
                          className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-500">
              Showing {filtered.length} of {articles.length} article{articles.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
