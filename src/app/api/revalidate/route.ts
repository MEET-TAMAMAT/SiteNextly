import { revalidatePath } from 'next/cache'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Revalidate the entire app layout (all pages)
    revalidatePath('/', 'layout')

    return Response.json({
      revalidated: true,
      at: Date.now(),
      message: 'All pages have been revalidated'
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return Response.json(
      {
        revalidated: false,
        error: 'Failed to revalidate',
        at: Date.now()
      },
      { status: 500 }
    )
  }
}

// Optional: Add GET method for testing
export async function GET() {
  return Response.json({
    message: 'Revalidation endpoint is working. Use POST to trigger revalidation.',
    usage: 'POST /api/revalidate'
  })
}