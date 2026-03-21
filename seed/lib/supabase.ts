// ==========================================
// Supabase Client for Seed Scripts
// ==========================================

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Obtiene el cliente de Supabase para el script de seed.
 * Usa el Service Role Key para bypass de RLS.
 */
export function getSeedClient(): SupabaseClient {
  if (_client) {
    return _client;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "❌ Error: Variables de entorno faltantes.\n" +
      "\n" +
      "Por favor configura las siguientes variables:\n" +
      "  - NEXT_PUBLIC_SUPABASE_URL\n" +
      "  - SUPABASE_SERVICE_ROLE_KEY\n" +
      "\n" +
      "Puedes crear un archivo .env.local en la raíz del proyecto:\n" +
      "  NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co\n" +
      "  SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key"
    );
  }

  _client = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _client;
}

/**
 * Verifica que el cliente de Supabase esté configurado correctamente.
 */
export async function verifySeedClient(): Promise<boolean> {
  const client = getSeedClient();
  
  try {
    // Intentar hacer una consulta simple para verificar la conexión
    const { data, error } = await client
      .from("profiles")
      .select("id")
      .limit(1);

    if (error) {
      console.error("❌ Error al verificar conexión con Supabase:", error.message);
      return false;
    }

    console.log("✅ Conexión con Supabase verificada");
    return true;
  } catch (err) {
    console.error("❌ Error de conexión:", err);
    return false;
  }
}
