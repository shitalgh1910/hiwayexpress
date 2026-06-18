import { prisma } from '@/lib/prisma'
import BreakingNews from '@/components/layout/BreakingNews'
import ArticleCard from '@/components/news/ArticleCard'
import SectionHeader from '@/components/news/SectionHeader'
import Link from 'next/link'
import { Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getHomeData() {
  const [breakingNews, featuredArticles, latestArticles, popularArticles, categories] =
    await Promise.all([
      prisma.article.findMany({
        where: { status: 'published', breaking: true },
        orderBy: { publishedAt: 'desc' },
        take: 5,
        select: { id: true, title: true, slug: true },
      }),
      prisma.article.findMany({
        where: { status: 'published', featured: true },
        orderBy: { publishedAt: 'desc' },
        take: 4,
        include: { category: true },
      }),
      prisma.article.findMany({
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        take: 12,
        include: { category: true },
      }),
      prisma.article.findMany({
        where: { status: 'published' },
        orderBy: { views: 'desc' },
        take: 6,
        include: { category: true },
      }),
      prisma.category.findMany({
        include: {
          _count: { select: { articles: { where: { status: 'published' } } } },
          articles: {
            where: { status: 'published' },
            orderBy: { publishedAt: 'desc' },
            take: 4,
            include: { category: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
    ])

  return { breakingNews, featuredArticles, latestArticles, popularArticles, categories }
}

export default async function HomePage() {
  const { breakingNews, featuredArticles, latestArticles, popularArticles, categories } =
    await getHomeData()

  const mainFeatured = featuredArticles[0] || latestArticles[0]
  const secondaryFeatured = featuredArticles.length > 0
    ? featuredArticles.slice(1, 4)
    : latestArticles.slice(1, 4)

  return (
    <>
      {breakingNews.length > 0 && <BreakingNews articles={breakingNews} />}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Featured Section */}
        {mainFeatured && (
          <section className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <ArticleCard article={mainFeatured} variant="featured" />
              </div>
              {secondaryFeatured.length > 0 && (
                <div className="space-y-4 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <h3 className="font-bold text-gray-900 border-b pb-2">मुख्य समाचार</h3>
                  {secondaryFeatured.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="horizontal" />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Main Content + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-3 space-y-10">
            {/* Latest News */}
            {latestArticles.length > 0 && (
              <section>
                <SectionHeader title="ताजा समाचार" href="/news" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {latestArticles.slice(0, 6).map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Category Sections */}
            {categories
              .filter((cat) => cat.articles.length > 0)
              .slice(0, 4)
              .map((category) => (
                <section key={category.id}>
                  <SectionHeader
                    title={category.name}
                    href={`/categories/${category.slug}`}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {category.articles.slice(0, 2).map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                  {category.articles.length > 2 && (
                    <div className="mt-3 space-y-2">
                      {category.articles.slice(2).map((article) => (
                        <ArticleCard key={article.id} article={article} variant="compact" />
                      ))}
                    </div>
                  )}
                </section>
              ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Popular */}
            {popularArticles.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <SectionHeader title="लोकप्रिय समाचार" />
                <div className="space-y-4">
                  {popularArticles.map((article, idx) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.slug}`}
                      className="flex gap-3 group"
                    >
                      <span className="text-2xl font-bold text-red-700/30 w-6 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-sm font-medium group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Eye size={10} /> {article.views} पाठकहरू
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* About KP Ghimire */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <SectionHeader title="सम्पादकको बारेमा" />
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-700 to-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-2xl font-bold">KP</span>
                </div>
                <h3 className="font-bold text-gray-900">KP Ghimire</h3>
                <p className="text-xs text-red-700 mb-2">Managing Editor</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  दाङका अनुभवी पत्रकार। Radio Highway FM का पूर्व प्रबन्ध निर्देशक।
                  स्थानीय पत्रकारितामा दशकौंको अनुभव।
                </p>
                <Link
                  href="/about"
                  className="inline-block mt-3 text-xs text-red-700 hover:underline"
                >
                  थप पढ्नुहोस् »
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
              <SectionHeader title="श्रेणीहरू" />
              <div className="space-y-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="flex items-center justify-between text-sm py-1 border-b border-gray-50 hover:text-red-700 transition-colors"
                  >
                    <span>» {cat.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      {cat._count.articles}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* More Latest */}
            {latestArticles.length > 6 && (
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <SectionHeader title="अन्य समाचार" />
                <div className="space-y-3">
                  {latestArticles.slice(6).map((article) => (
                    <ArticleCard key={article.id} article={article} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* About Section Banner */}
        <section className="mt-12 bg-gradient-to-r from-[#1a1a2e] to-red-900 text-white rounded-xl p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Highway Express को बारेमा</h2>
            <p className="text-gray-300 leading-relaxed">
              Highway Express दाङ, नेपालको एक विश्वसनीय डिजिटल समाचार पोर्टल हो।
              अनुभवी पत्रकार KP Ghimire को नेतृत्वमा हामी स्थानीय, राष्ट्रिय र
              अन्तर्राष्ट्रिय समाचार तपाईंसम्म पुर्‍याउन प्रतिबद्ध छौं।
            </p>
            <Link
              href="/about"
              className="inline-block mt-4 bg-red-700 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm transition-colors"
            >
              थप जान्नुहोस्
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
