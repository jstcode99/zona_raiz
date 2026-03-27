// infrastructure/shared/utils/lang.ts
// Language utilities that use Next.js server APIs (next/headers, cookies)

import { cookies } from "next/headers";
import { Lang } from "@/i18n/settings";

export async function getLangServerSide(): Promise<Lang> {
  // Asegúrate de que esta función solo se llame en contextos de servidor donde `cookies()` es accesible.
  // En Next.js, `cookies()` solo es accesible en Server Components, Route Handlers y Server Actions.
  try {
    const cookieStore = await cookies();
    const lang = cookieStore.get("lang")?.value;
    return lang === "en" ? "en" : "es";
  } catch (error) {
    console.warn("No se pudo obtener el idioma del servidor. Usando 'es' por defecto.", error);
    return "es"; // Fallback a español si no se pueden leer las cookies
  }
}
