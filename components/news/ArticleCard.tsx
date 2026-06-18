import Link from 'next/link'
import Image from 'next/image'
import { Clock, User } from 'lucide-react'
import { formatDateEn } from '@/lib/utils'

interface Article {
  id: number
  title: string
  slug: string
  summary?: string | null
  image?: string | null
  author: string
  createdAt: Date
  category?: { name: string; slug: string } | null
}

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'featured' | 'compact' | 'horizontal'
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  if (variant === 'featured') {
    return (
      <Link href={`/news/${article.slug}`} className="group block">
        <div className="relative h-72 md:h-96 overflow-hidden rounded-lg">
          {article.image ? (
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-700 to-blue-900 flex items-center justify-center">
              <span className="text-white text-4xl font-bold opacity-20">HE</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            {article.category && (
              <span className="inline-block bg-red-700 text-white text-xs px-2 py-1 rounded mb-2">
                {article.category.name}
              </span>
            )}
            <h2 className="text-white text-xl md:text-2xl font-bold leading-tight group-hover:text-yellow-300 transition-colors">
              {article.title}
            </h2>
            <div className="flex items-center gap-3 mt-2 text-gray-300 text-xs">
              <span className="flex items-center gap-1"><User size={12} /> {article.author}</span>
              <span className="flex items-center gap-1"><Clock size={12} /> {formatDateEn(article.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/news/${article.slug}`} className="group flex gap-3">
        <div className="relative w-24 h-20 flex-shrink-0 rounded overflow-hidden">
          {article.image ? (
            <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-700 to-blue-900" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1">{formatDateEn(article.createdAt)}</p>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/news/${article.slug}`} className="group block border-b border-gray-100 pb-2">
        <h3 className="text-sm font-medium text-gray-800 group-hover:text-red-700 transition-colors line-clamp-2">
          » {article.title}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{formatDateEn(article.createdAt)}</p>
      </Link>
    )
  }

  return (
    <Link href={`/news/${article.slug}`} className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      <div className="relative h-44 overflow-hidden">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-red-700 to-blue-900 flex items-center justify-center">
            <span className="text-white text-2xl font-bold opacity-30">HE</span>
          </div>
        )}
        {article.category && (
          <span className="absolute top-2 left-2 bg-red-700 text-white text-xs px-2 py-0.5 rounded">
            {article.category.name}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug text-sm">
          {article.title}
        </h3>
        {article.summary && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.summary}</p>
        )}
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
          <span className="flex items-center gap-1"><User size={10} /> {article.author}</span>
          <span className="flex items-center gap-1"><Clock size={10} /> {formatDateEn(article.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
