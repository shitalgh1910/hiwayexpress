'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Article {
  id: number
  title: string
  slug: string
}

export default function BreakingNews({ articles }: { articles: Article[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (articles.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [articles.length])

  if (articles.length === 0) return null

  return (
    <div className="bg-red-700 text-white py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        <span className="bg-white text-red-700 font-bold text-xs px-3 py-1 rounded whitespace-nowrap animate-pulse">
          ब्रेकिंग न्युज
        </span>
        <div className="overflow-hidden flex-1">
          <Link
            href={`/news/${articles[currentIndex]?.slug}`}
            className="text-sm hover:underline transition-all"
          >
            {articles[currentIndex]?.title}
          </Link>
        </div>
        <div className="hidden sm:flex gap-1">
          {articles.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-white' : 'bg-red-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
