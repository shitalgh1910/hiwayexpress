'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  CheckCircle,
  Clock,
  Tag,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { formatDateEn } from '@/lib/utils'

interface Article {
  id: number
  title: string
  status: string
  category?: { name: string } | null
  createdAt: string
  views: number
}

interface Stats {
  total: number
  published: number
  draft: number
  categories: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ total: 0, published: 0, draft: 0, categories: 0 })
  const [recentArticles, setRecentArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      try {
        const [articlesRes, draftRes, categoriesRes] = await Promise.all([
          fetch('/api/articles?limit=10&status=published'),
          fetch('/api/articles?limit=100&status=draft'),
          fetch('/api/categories'),
        ])

        if (!articlesRes.ok) throw new Error('Failed to load data')

        const articlesData = await articlesRes.json()
        const draftData = await draftRes.json()
        const catData = await categoriesRes.json()

        setStats({
          total: (articlesData.pagination?.total ?? 0) + (draftData.pagination?.total ?? 0),
          published: articlesData.pagination?.total ?? 0,
          draft: draftData.pagination?.total ?? 0,
          categories: catData.categories?.length ?? 0,
        })
        setRecentArticles(articlesData.articles ?? [])
      } catch (err) {
        setError('Failed to load dashboard data.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this article?')) return
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setRecentArticles((prev) => prev.filter((a) => a.id !== id))
        setStats((s) => ({
          ...s,
          total: s.total - 1,
          published: s.published - 1,
        }))
      }
    } catch {
      alert('Failed to delete article.')
    }
  }

  const statCards = [
    { label: 'Total Articles', value: stats.total, icon: FileText, color: 'bg-blue-500', href: '/admin/articles' },
    { label: 'Published', value: stats.published, icon: CheckCircle, color: 'bg-green-500', href: '/admin/articles?status=published' },
    { label: 'Draft', value: stats.draft, icon: Clock, color: 'bg-yellow-500', href: '/admin/articles?status=draft' },
    { label: 'Categories', value: stats.categories, icon: Tag, color: 'bg-purple-500', href: '/admin/categories' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back to Highway Express admin.</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <PlusCircle size={16} /> New Article
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${card.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
                <TrendingUp size={15} className="text-gray-300" />
              </div>
              {loading ? (
                <div className="h-8 bg-gray-100 rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              )}
              <p className="text-xs text-gray-500 mt-1 font-medium">{card.label}</p>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow group"
        >
          <div className="bg-red-50 group-hover:bg-red-100 w-10 h-10 rounded-lg flex items-center justify-center transition-colors">
            <PlusCircle size={18} className="text-red-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">New Article</p>
            <p className="text-xs text-gray-500">Create a new post</p>
          </div>
        </Link>
        <Link
          href="/admin/categories"
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow group"
        >
          <div className="bg-purple-50 group-hover:bg-purple-100 w-10 h-10 rounded-lg flex items-center justify-center transition-colors">
            <Tag size={18} className="text-purple-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Manage Categories</p>
            <p className="text-xs text-gray-500">Add or edit categories</p>
          </div>
        </Link>
        <Link
          href="/admin/media"
          className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow group"
        >
          <div className="bg-blue-50 group-hover:bg-blue-100 w-10 h-10 rounded-lg flex items-center justify-center transition-colors">
            <Eye size={18} className="text-blue-700" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Media Library</p>
            <p className="text-xs text-gray-500">View uploaded files</p>
          </div>
        </Link>
      </div>

      {/* Recent Articles Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Published Articles</h2>
          <Link
            href="/admin/articles"
            className="text-sm text-red-700 hover:underline font-medium"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : recentArticles.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <FileText size={32} className="mx-auto mb-3 opacity-40" />
            <p>No published articles yet.</p>
            <Link
              href="/admin/articles/new"
              className="inline-block mt-3 text-red-700 hover:underline text-sm font-medium"
            >
              Create your first article
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-left">
                  <th className="px-5 py-3 font-semibold text-gray-600">Title</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">Date</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">Views</th>
                  <th className="px-5 py-3 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">
                        {article.title}
                      </p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-gray-500 text-xs">
                        {article.category?.name ?? '—'}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-gray-500 text-xs">
                      {formatDateEn(article.createdAt)}
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell text-gray-500 text-xs">
                      {article.views.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="p-1.5 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="p-1.5 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
