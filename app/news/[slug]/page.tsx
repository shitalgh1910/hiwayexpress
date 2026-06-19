import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ArticleCard from '@/components/news/ArticleCard'
import { formatDateEn } from '@/lib/utils'
import { Eye, Clock, User, ChevronRight, Share2 } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { category: true },
  })
  if (!article) return { title: 'Article Not Found' }
  return {
    title: article.title,
    description: article.summary ?? undefined,
    openGraph: {
      title: article.title,
      description: article.summary ?? undefined,
      images: article.image ? [{ url: article.image }] : [],
      type: 'article',
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const article = await prisma.article.findUnique({
    where: { slug, status: 'published' },
    include: { category: true },
  })

  if (!article) notFound()

  // Increment views (fire and forget)
  prisma.article
    .update({ where: { id: article.id }, data: { views: { increment: 1 } } })
    .catch(() => {})

  const relatedArticles = article.categoryId
    ? await prisma.article.findMany({
        where: {
          categoryId: article.categoryId,
          status: 'published',
          id: { not: article.id },
        },
        orderBy: { publishedAt: 'desc' },
        take: 4,
        include: { category: true },
      })
    : []

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-red-700 transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <Link href="/news" className="hover:text-red-700 transition-colors">
          News
        </Link>
        {article.category && (
          <>
            <ChevronRight size={14} />
            <Link
              href={`/categories/${article.category.slug}`}
              className="hover:text-red-700 transition-colors"
            >
              {article.category.name}
            </Link>
          </>
        )}
        <ChevronRight size={14} />
        <span className="text-gray-700 line-clamp-1">{article.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <article className="lg:col-span-2">
          {/* Category Badge */}
          {article.category && (
            <Link
              href={`/categories/${article.category.slug}`}
              className="inline-block bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded mb-3 hover:bg-red-800 transition-colors"
            >
              {article.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-5 pb-5 border-b border-gray-200">
            <span className="flex items-center gap-1.5">
              <User size={15} />
              <span className="font-medium text-gray-700">{article.author}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={15} />
              {formatDateEn(article.publishedAt ?? article.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Eye size={15} />
              {article.views.toLocaleString()} views
            </span>
          </div>

          {/* Hero Image */}
          {article.image && (
            <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Summary */}
          {article.summary && (
            <p className="text-lg text-gray-600 font-medium italic border-l-4 border-red-700 pl-4 mb-6 bg-red-50 py-3 rounded-r-lg">
              {article.summary}
            </p>
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Social Sharing */}
          <SocialShare title={article.title} />
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          {relatedArticles.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-4">
              <h3 className="text-base font-bold text-gray-900 border-b-2 border-red-700 pb-2 mb-4">
                Related Articles
              </h3>
              <div className="space-y-4">
                {relatedArticles.map((related: typeof relatedArticles[number]) => (
                  <ArticleCard
                    key={related.id}
                    article={related}
                    variant="horizontal"
                  />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

// Client component for social sharing
function SocialShare({ title }: { title: string }) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
          <Share2 size={15} /> Share:
        </span>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}&quote=${encodeURIComponent(title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-[#1877F2] hover:bg-[#166fe5] text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-black hover:bg-gray-800 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          Twitter / X
        </a>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20be5c] text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
        >
          WhatsApp
        </a>
      </div>
    </div>
  )
}
