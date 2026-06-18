'use client'

import { useEffect, useState, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import {
  Save,
  Upload,
  AlertCircle,
  Loader2,
  X,
  ImageIcon,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: number
  name: string
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [author, setAuthor] = useState('KP Ghimire')
  const [status, setStatus] = useState('draft')
  const [featured, setFeatured] = useState(false)
  const [breaking, setBreaking] = useState(false)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [articleRes, catRes] = await Promise.all([
          fetch(`/api/articles/${articleId}`),
          fetch('/api/categories'),
        ])
        if (!articleRes.ok) throw new Error('Article not found')
        const articleData = await articleRes.json()
        const catData = await catRes.json()

        const a = articleData.article
        setTitle(a.title ?? '')
        setSummary(a.summary ?? '')
        setContent(a.content ?? '')
        setImage(a.image ?? '')
        setCategoryId(a.categoryId ? String(a.categoryId) : '')
        setAuthor(a.author ?? 'KP Ghimire')
        setStatus(a.status ?? 'draft')
        setFeatured(a.featured ?? false)
        setBreaking(a.breaking ?? false)
        setCategories(catData.categories ?? [])
      } catch (err) {
        setError('Failed to load article.')
        console.error(err)
      } finally {
        setFetching(false)
      }
    }
    fetchAll()
  }, [articleId])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      setImage(data.url)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Image upload failed.')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required.'); return }
    if (!content.trim()) { setError('Content is required.'); return }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          summary: summary || null,
          content,
          image: image || null,
          categoryId: categoryId || null,
          author,
          status,
          featured,
          breaking,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Failed to update article')
      setSuccess('Article updated successfully!')
      setTimeout(() => router.push('/admin/articles'), 1200)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update article.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 size={28} className="animate-spin text-red-700" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/articles"
          className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
          <p className="text-gray-500 text-sm mt-0.5">Update article content and settings</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3 mb-5">
          <span className="text-green-600">✓</span>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                Article Content
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter article title..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Summary / Excerpt
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Short summary of the article..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Content <span className="text-red-600">*</span>
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  HTML supported: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;strong&gt;, &lt;em&gt;,
                  &lt;ul&gt;, &lt;li&gt;, &lt;blockquote&gt;, etc.
                </p>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<p>Write your article content here...</p>"
                  rows={16}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent resize-y font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publish Settings */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                Publish Settings
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700 bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-700 bg-white"
                >
                  <option value="">— No category —</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-red-700"
                  />
                  <span className="text-sm text-gray-700">Featured article</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={breaking}
                    onChange={(e) => setBreaking(e.target.checked)}
                    className="w-4 h-4 accent-red-700"
                  />
                  <span className="text-sm text-gray-700">Breaking news</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-800 disabled:opacity-60 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Update Article
                  </>
                )}
              </button>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                Featured Image
              </h2>

              {image ? (
                <div className="relative">
                  <div className="relative w-full h-40 rounded-lg overflow-hidden">
                    <Image
                      src={image}
                      alt="Featured image preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1 shadow text-gray-700 hover:text-red-700 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <p className="text-xs text-gray-500 mt-2 truncate">{image}</p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <ImageIcon size={28} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400 mb-3">Upload an image (max 5MB)</p>
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      {uploadingImage ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          Uploading…
                        </>
                      ) : (
                        <>
                          <Upload size={13} />
                          Choose Image
                        </>
                      )}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="sr-only"
                    />
                  </label>
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Or paste image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-700"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
