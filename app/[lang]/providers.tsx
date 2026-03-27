"use client";

import { ThemeProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppToaster from "@/components/ui/toast";
import { ReactNode } from "react";
import { I18nProvider } from "@/i18n/provider";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: ReactNode }) {
  const clientIdGoogle = process.env.GOOGLE_CLIENT_ID;

  if (!clientIdGoogle) {
    throw new Error("GOOGLE_CLIENT_ID is not defined");
  }

  return (
    <I18nProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <GoogleOAuthProvider clientId={clientIdGoogle}>
          <AppToaster />
          <TooltipProvider>{children}</TooltipProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}
