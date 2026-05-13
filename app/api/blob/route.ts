import { get } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 })
  }

  try {
    const result = await get(url, { access: 'private' })
    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return new NextResponse(result.stream, {
      status: 200,
      headers: {
        'Content-Type':
          result.headers.get('content-type') || 'application/octet-stream',
        'Cache-Control': 'private, max-age=300',
      },
    })
  } catch (error) {
    console.error('Blob proxy error:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch blob'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
