import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    const correctPassword = process.env.CONTRIBUTOR_PASSWORD
    if (!correctPassword) {
      console.error('CONTRIBUTOR_PASSWORD env var is not set.')
      return NextResponse.json(
        { message: 'Server not configured.' },
        { status: 500 }
      )
    }

    if (typeof password !== 'string' || password.length === 0) {
      return NextResponse.json(
        { message: 'Password required.' },
        { status: 400 }
      )
    }

    if (password === correctPassword) {
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json(
      { message: 'Incorrect password.' },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { message: 'Invalid request.' },
      { status: 400 }
    )
  }
}
