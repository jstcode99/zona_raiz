import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAMES, COOKIE_OPTIONS } from "@/infrastructure/config/constants"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  
  if (!id) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  const response = NextResponse.redirect(new URL('/dashboard', request.url))
  response.cookies.set(COOKIE_NAMES.REAL_ESTATE, id, COOKIE_OPTIONS)
  
  return response
}