import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseMiddlewareClient } from "./supabase.middleware-client"

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createSupabaseMiddlewareClient(request, response)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 🔐 proteger dashboard
  if (
    !user &&
    request.nextUrl.pathname.startsWith("/dashboard")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/sign-in"
    return NextResponse.redirect(url)
  }

  // 🚫 evitar login si ya está logueado
  if (user && request.nextUrl.pathname === "/auth/sign-in") {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return response
}
