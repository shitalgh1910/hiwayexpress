import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10)))
    const status = searchParams.get('status') // admin can request all
    const skip = (page - 1) * limit

    // Determine status filter
    const session = await getSession()
    const statusFilter = session
      ? status ?? undefined // admin: return requested status or all
      : 'published' // public: only published

    const where: Record<string, unknown> = {}
    if (statusFilter) where.status = statusFilter

    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      })
      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 })
      }
      where.categoryId = category.id
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { category: true },
      }),
      prisma.article.count({ where }),
    ])

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('GET /api/articles error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      summary,
      content,
      image,
      categoryId,
      author = 'KP Ghimire',
      status = 'draft',
      featured = false,
      breaking = false,
    } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate unique slug
    let slug = slugify(title)
    const existingSlug = await prisma.article.findUnique({ where: { slug } })
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        summary: summary ?? null,
        content,
        image: image ?? null,
        categoryId: categoryId ? parseInt(categoryId, 10) : null,
        author,
        status,
        featured: Boolean(featured),
        breaking: Boolean(breaking),
        publishedAt: status === 'published' ? new Date() : null,
      },
      include: { category: true },
    })

    return NextResponse.json({ article }, { status: 201 })
  } catch (error) {
    console.error('POST /api/articles error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
