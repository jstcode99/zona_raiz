import { UserRole } from "@/domain/entities/Profile";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rutas por rol (ejemplo)
const PROTECTED_ROUTES: Record<UserRole, string[]> = {
  admin: ['/admin', '/dashboard'],
  agent: ['/agent', '/dashboard'],
  client: ['/client', '/dashboard'],
  coordinator: ['/coordinator', '/dashboard'],
}

const PUBLIC_ROUTES = ['/auth/sign-in', '/auth/sign-up', '/auth/opt', '/auth/callback', '/']

const ROLE_COOKIE_NAME = 'user_role'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );



  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // Permitir rutas públicas
  if (PUBLIC_ROUTES.some(route => path.startsWith(route))) {
    return response
  }

  // Si no hay usuario, redirigir a login
  if (!user) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  // Usar la cookie de rol para evitar query a la base de datos en cada request
  const userRole = request.cookies.get(ROLE_COOKIE_NAME)?.value as UserRole

  if (!userRole) {
    // Si no hay cookie de rol, redirigir a login para refrescar
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  // Verificar acceso a ruta específica
  const hasAccess = Object.entries(PROTECTED_ROUTES).some(([role, routes]) => {
    // Admin tiene acceso a todo
    if (userRole === 'admin') return true
    if (userRole !== role) return false
    return routes.some(route => path.startsWith(route))
  })

  if (!hasAccess) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return response
}