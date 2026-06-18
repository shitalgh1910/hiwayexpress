import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const media = await prisma.media.findMany({
      orderBy: { uploadedAt: 'desc' },
    })
    return NextResponse.json({ media })
  } catch (error) {
    console.error('GET /api/media error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const idParam = searchParams.get('id')
    if (!idParam) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 })
    }

    const mediaId = parseInt(idParam, 10)
    if (isNaN(mediaId)) {
      return NextResponse.json({ error: 'Invalid media ID' }, { status: 400 })
    }

    const media = await prisma.media.findUnique({ where: { id: mediaId } })
    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }

    // Delete file from disk
    const filePath = path.join(process.cwd(), 'public', media.url)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    // Delete record from database
    await prisma.media.delete({ where: { id: mediaId } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/media error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
