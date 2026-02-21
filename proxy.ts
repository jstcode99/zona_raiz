import { updateSession } from "@/infrastructure/db/supabase.proxy";
import { type NextRequest } from "next/server";
 
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}
 
export const config = {
  matcher: [
    /*
     * Excluir:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - Archivos públicos (svg, png, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}