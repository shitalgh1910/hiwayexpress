import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/news/ArticleCard'
import { Search, ChevronRight } from 'lucide-react'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}): Promise<Metadata> {
  const { q } = await searchParams
  return {
    title: q ? `Search: "${q}"` : 'Search',
    description: q
      ? `Search results for "${q}" on Highway Express`
      : 'Search articles on Highway Express',
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  let articles: Awaited<ReturnType<typeof prisma.article.findMany>> = []
  if (query) {
    articles = await prisma.article.findMany({
      where: {
        status: 'published',
        OR: [
          { title: { contains: query } },
          { content: { contains: query } },
          { summary: { contains: query } },
        ],
      },
      orderBy: { publishedAt: 'desc' },
      take: 48,
      include: { category: true },
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-red-700 transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-700">Search</span>
      </nav>

      {/* Search Form */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Articles</h1>
        <form method="GET" action="/search" className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search news articles..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent text-gray-900 placeholder-gray-400"
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="bg-red-700 hover:bg-red-800 text-white font-semibold px-5 py-3 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {!query ? (
        <div className="text-center py-16 text-gray-400">
          <Search size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">Enter a search term to find articles.</p>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16">
          <Search size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl font-semibold text-gray-700 mb-2">
            No results found for &ldquo;{query}&rdquo;
          </p>
          <p className="text-gray-500 mb-6">
            Try different keywords or browse by category.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/news"
              className="bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
            >
              Browse All News
            </Link>
            <Link
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
            >
              Go to Home
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 pb-4 border-b border-gray-200">
            <p className="text-gray-600">
              Found{' '}
              <span className="font-bold text-red-700">{articles.length}</span>{' '}
              result{articles.length !== 1 ? 's' : ''} for{' '}
              <span className="font-semibold">&ldquo;{query}&rdquo;</span>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="default" />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
