import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/news/ArticleCard'
import { ChevronRight, ChevronLeft } from 'lucide-react'

const PAGE_SIZE = 12

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) return { title: 'Category Not Found' }
  return {
    title: `${category.name} - News`,
    description:
      category.description ??
      `Browse all articles in the ${category.name} category on Highway Express.`,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const skip = (page - 1) * PAGE_SIZE

  const category = await prisma.category.findUnique({ where: { slug } })
  if (!category) notFound()

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { categoryId: category.id, status: 'published' },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: PAGE_SIZE,
      include: { category: true },
    }),
    prisma.article.count({
      where: { categoryId: category.id, status: 'published' },
    }),
  ])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-red-700 transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-700">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8 pb-4 border-b-2 border-red-700">
        <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
        {category.nameNepali && (
          <p className="text-lg text-gray-600 mt-1">{category.nameNepali}</p>
        )}
        {category.description && (
          <p className="text-gray-500 mt-2">{category.description}</p>
        )}
        <p className="text-sm text-gray-400 mt-2">
          {total} article{total !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl font-medium">No articles in this category yet.</p>
          <Link
            href="/"
            className="inline-block mt-4 text-red-700 hover:underline"
          >
            Back to Home
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} variant="default" />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && (
                <Link
                  href={`/categories/${slug}?page=${page - 1}`}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={15} /> Previous
                </Link>
              )}

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2
                  )
                  .map((p, idx, arr) => (
                    <span key={p} className="flex items-center">
                      {idx > 0 && arr[idx - 1] !== p - 1 && (
                        <span className="px-2 text-gray-400">…</span>
                      )}
                      <Link
                        href={`/categories/${slug}?page=${p}`}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                          p === page
                            ? 'bg-red-700 text-white'
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </Link>
                    </span>
                  ))}
              </div>

              {page < totalPages && (
                <Link
                  href={`/categories/${slug}?page=${page + 1}`}
                  className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Next <ChevronRight size={15} />
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
