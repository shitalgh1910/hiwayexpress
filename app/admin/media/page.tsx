'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  Loader2,
  X,
  Check,
  Copy,
  FileImage,
} from 'lucide-react'

interface MediaItem {
  id: number
  filename: string
  url: string
  size?: number | null
  mimeType?: string | null
  uploadedAt: string
}

function formatBytes(bytes?: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  async function fetchMedia() {
    try {
      const res = await fetch('/api/media')
      const data = await res.json()
      setMedia(data.media ?? [])
    } catch {
      setError('Failed to load media.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')

    const uploadedItems: MediaItem[] = []
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Upload failed')
        // Fetch fresh list to get full media record
        uploadedItems.push({
          id: data.id,
          filename: file.name,
          url: data.url,
          size: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
        })
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : `Failed to upload ${file.name}`)
        break
      }
    }
    setMedia((prev) => [...uploadedItems.reverse(), ...prev])
    if (uploadedItems.length > 0) {
      setSuccess(`${uploadedItems.length} file(s) uploaded successfully.`)
      setTimeout(() => setSuccess(''), 3000)
    }
    setUploading(false)
    e.target.value = ''
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this image? This cannot be undone.')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/media?id=${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setMedia((prev) => prev.filter((m) => m.id !== id))
      setSuccess('Image deleted.')
      setTimeout(() => setSuccess(''), 3000)
    } catch {
      setError('Failed to delete image.')
    } finally {
      setDeleting(null)
    }
  }

  async function copyUrl(item: MediaItem) {
    try {
      await navigator.clipboard.writeText(item.url)
      setCopiedId(item.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // fallback: just show the URL selected
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          {media.length} file{media.length !== 1 ? 's' : ''} uploaded
        </p>
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

      {/* Upload Zone */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Upload size={17} className="text-red-700" />
          Upload Images
        </h2>
        <div className="border-2 border-dashed border-gray-200 hover:border-red-400 rounded-xl p-8 text-center transition-colors">
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <Loader2 size={32} className="animate-spin text-red-700" />
              <p className="text-sm font-medium">Uploading files…</p>
            </div>
          ) : (
            <>
              <FileImage size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium mb-1">
                Drag &amp; drop or click to upload
              </p>
              <p className="text-xs text-gray-400 mb-4">
                JPG, PNG, GIF, WebP — max 5MB each
              </p>
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
                  <Upload size={15} />
                  Select Files
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="sr-only"
                />
              </label>
            </>
          )}
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
          <p className="font-medium text-gray-600">No images uploaded yet.</p>
          <p className="text-sm mt-1">Upload your first image above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gray-50">
                <Image
                  src={item.url}
                  alt={item.filename}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => copyUrl(item)}
                  className="p-2 bg-white/90 hover:bg-white rounded-lg text-gray-700 hover:text-blue-700 transition-colors shadow"
                  title="Copy URL"
                >
                  {copiedId === item.id ? (
                    <Check size={15} className="text-green-600" />
                  ) : (
                    <Copy size={15} />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className="p-2 bg-white/90 hover:bg-white rounded-lg text-gray-700 hover:text-red-700 transition-colors shadow disabled:opacity-50"
                  title="Delete"
                >
                  {deleting === item.id ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                </button>
              </div>

              {/* File info */}
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate font-medium">{item.filename}</p>
                <p className="text-xs text-gray-400">{formatBytes(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
