import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { EUserRole, UserRole } from "@/domain/entities/Profile"
import { COOKIE_NAMES, COOKIE_OPTIONS } from "../config/constants"
import { createAuthRepository } from "./SupabaseAuthRepository"

// ==========================================
// CONFIGURACIÓN
// ==========================================

const PUBLIC_ROUTES = [
  "/",
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/otp",
  "/auth/callback",
  "/post-login",
  "/post-login/register-real-estate",
  "/unauthorized",
] as const

const ROLE_ROUTES: Record<UserRole, string[]> = {
  admin: [
    "/api",
    "/admin",
    "/dashboard",
    "/real-estates",
    "/agents",
    "/settings",
  ],
  coordinator: [
    "/api",
    "/dashboard",
    "/real-estates",
    "/agents",
    "/properties"
  ],
  agent: [
    "/api",
    "/dashboard",
    "/properties",
    "/clients"],

  client: [
    "/api",
    "/dashboard",
    "/properties",
    "/favorites"],

}

// ==========================================
// MIDDLEWARE
// ==========================================

export async function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Rutas públicas - permitir sin auth
  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // 2. Crear response mutable
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 3. Crear cliente Supabase con proxy
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 4. Verificar sesión
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // 5. No autenticado -> login
  if (!user || error) {
    return redirectTo("/auth/sign-in", request)
  }

  // 6. Obtener cookies de app
  const role = request.cookies.get(COOKIE_NAMES.ROLE)?.value as UserRole | undefined
  const realEstateId = request.cookies.get(COOKIE_NAMES.REAL_ESTATE)?.value

  // 7. Sin rol -> forzar re-login
  if (!role) {
    return redirectTo("/auth/sign-in", request)
  }

  // 8. PROXY DE REAL ESTATE para agentes, coordinadores y admins
  if (role === EUserRole.Agent || role === EUserRole.Coordinator || role === EUserRole.Admin) {

    // Si no hay realEstateId, verificar cuántos tiene
    if (!realEstateId && !pathname.startsWith("/post-login")) {

      const authRepo = createAuthRepository()

      const realEstates = await authRepo.getRealEstatesForUser()
      const count = realEstates.length

      // CASO 1: Tiene exactamente 1 → Auto-seleccionar
      if (count === 1) {
        const autoRealEstateId = realEstates[0].real_estate.id

        // Crear redirect response con la cookie incluida
        const redirectResponse = redirectTo("/dashboard", request)
        redirectResponse.cookies.set(
          COOKIE_NAMES.REAL_ESTATE,
          autoRealEstateId,
          COOKIE_OPTIONS
        )

        return redirectResponse
      }

      // CASO 2: Tiene 0 o varios → Ir a post-login
      // (0 = registrar nuevo, varios = seleccionar)
      return redirectTo("/post-login", request)
    }

    // Si ya tiene realEstateId pero está en post-login → Ir a dashboard
    if (realEstateId && pathname.startsWith("/post-login")) {
      return redirectTo("/dashboard", request)
    }
  }

  // 9. Verificar permisos por rol
  if (!hasRoleAccess(role, pathname)) {
    return redirectTo("/auth/sign-in", request)
  }

  // 10. Todo OK -> continuar
  return response
}

// ==========================================
// HELPERS
// ==========================================

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  )
}

function hasRoleAccess(role: UserRole, pathname: string): boolean {
  if (role === "admin") return true
  const allowedRoutes = ROLE_ROUTES[role] || []
  return allowedRoutes.some((route) => pathname.startsWith(route))
}

function redirectTo(path: string, request: NextRequest): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = path
  return NextResponse.redirect(url)
}