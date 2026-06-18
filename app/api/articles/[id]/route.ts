import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const articleId = parseInt(id, 10)
    if (isNaN(articleId)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 })
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { category: true },
    })

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('GET /api/articles/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const articleId = parseInt(id, 10)
    if (isNaN(articleId)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 })
    }

    const existing = await prisma.article.findUnique({ where: { id: articleId } })
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      title,
      summary,
      content,
      image,
      categoryId,
      author,
      status,
      featured,
      breaking,
    } = body

    // Re-generate slug only if title changed
    let slug = existing.slug
    if (title && title !== existing.title) {
      const newSlug = slugify(title)
      const conflict = await prisma.article.findFirst({
        where: { slug: newSlug, id: { not: articleId } },
      })
      slug = conflict ? `${newSlug}-${Date.now()}` : newSlug
    }

    const wasPublished = existing.status === 'published'
    const nowPublished = status === 'published'

    const article = await prisma.article.update({
      where: { id: articleId },
      data: {
        ...(title !== undefined && { title }),
        slug,
        ...(summary !== undefined && { summary }),
        ...(content !== undefined && { content }),
        ...(image !== undefined && { image }),
        ...(categoryId !== undefined && {
          categoryId: categoryId ? parseInt(categoryId, 10) : null,
        }),
        ...(author !== undefined && { author }),
        ...(status !== undefined && { status }),
        ...(featured !== undefined && { featured: Boolean(featured) }),
        ...(breaking !== undefined && { breaking: Boolean(breaking) }),
        // Set publishedAt when first publishing
        ...(!wasPublished && nowPublished && { publishedAt: new Date() }),
      },
      include: { category: true },
    })

    return NextResponse.json({ article })
  } catch (error) {
    console.error('PUT /api/articles/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const articleId = parseInt(id, 10)
    if (isNaN(articleId)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 })
    }

    const existing = await prisma.article.findUnique({ where: { id: articleId } })
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    await prisma.article.delete({ where: { id: articleId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/articles/[id] error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
