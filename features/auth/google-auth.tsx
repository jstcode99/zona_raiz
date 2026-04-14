"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook";
import { signInWithGoogleAction } from "@/application/actions/auth.actions";
import { toast } from "sonner";
import { useParams } from "next/navigation";

interface GoogleAuthProps {
  disabled?: boolean;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

/**
 * Parsea el hash de la URL actual (ej: #access_token=...&refresh_token=...)
 * y devuelve los parámetros como objeto
 */
function parseHashParams(): Record<string, string> {
  const hash = window.location.hash.slice(1); //去掉#
  if (!hash) return {};

  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(hash);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

/**
 * Construye una URL con los tokens del hash como query params
 */
function buildRedirectUrlWithTokens(
  redirectUrl: string,
  tokenParams: Record<string, string>
): string {
  try {
    const url = new URL(redirectUrl);
    Object.entries(tokenParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.toString();
  } catch {
    // Si la URL no es válida, intentar agregar params manualmente
    const separator = redirectUrl.includes("?") ? "&" : "?";
    const tokenString = Object.entries(tokenParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    return `${redirectUrl}${separator}${tokenString}`;
  }
}

/**
 * Procesa los tokens OAuth que vienen en el hash de la URL desde Supabase.
 * Limpia el error, mueve los tokens a query params y redirige al callback.
 */
function processOAuthHash() {
  const hashParams = parseHashParams();

  if (hashParams.access_token || hashParams.id_token) {
    // Obtener redirect URL del cookie (establecido por el server action)
    const redirectUrl = getCookie("oauth_redirect_url");

    if (redirectUrl) {
      // Limpiar cookie
      document.cookie = "oauth_redirect_url=; Max-Age=0";

      // Construir URL de callback con tokens en query params
      const callbackUrl = buildRedirectUrlWithTokens(
        decodeURIComponent(redirectUrl),
        hashParams
      );

      // Limpiar el hash de la URL actual antes de redirigir
      const cleanPath = window.location.pathname + window.location.search;
      window.history.replaceState(null, "", cleanPath);

      // Redirigir al callback con tokens
      window.location.href = callbackUrl;
      return true;
    }
  }

  return false;
}

export default function GoogleAuth({ disabled }: GoogleAuthProps) {
  const { t } = useTranslation("auth");
  const { lang } = useParams<{ lang: string }>();

  // Procesar tokens OAuth del hash al cargar el componente
  // Esto maneja el caso donde Supabase redirige al login con tokens en el hash
  useEffect(() => {
    processOAuthHash();
  }, []);

  const { action: handleGoogleSignIn, isPending } = useServerMutation({
    action: signInWithGoogleAction,
    onSuccess: () => {
      // Read redirect URL from cookie set by server action
      const redirectUrl = getCookie("oauth_redirect_url");
      if (redirectUrl) {
        // Clear the cookie after use
        document.cookie = "oauth_redirect_url=; Max-Age=0";
        window.location.href = decodeURIComponent(redirectUrl);
      } else {
        toast.error(t("exceptions.google_signin"));
      }
    },
    onError: (error) => {
      toast.error(error.message || t("errors.googleSignIn"));
    },
  });

  const onClick = () => {
    const formData = new FormData();
    // Include lang in the redirect URL
    const langPrefix = lang ? `/${lang}` : "";
    formData.set("redirectTo", `${window.location.origin}${langPrefix}/auth/callback`);
    handleGoogleSignIn(formData);
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full my-2"
      onClick={onClick}
      disabled={disabled || isPending}
    >
      {isPending ? (
        <Spinner className="mr-2 h-4 w-4" />
      ) : (
        <IconBrandGoogle className="mr-2 h-4 w-4" />
      )}
      {t("actions.google")}
    </Button>
  );
}
