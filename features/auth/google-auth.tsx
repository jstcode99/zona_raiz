"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useServerMutation } from "@/shared/hooks/use-server-mutation.hook";
import { signInWithGoogleAction } from "@/application/actions/auth.actions";
import { toast } from "sonner";
import { s } from "vitest/dist/chunks/reporters.D7Jzd9GS.js";

interface GoogleAuthProps {
  disabled?: boolean;
}

export default function GoogleAuth({ disabled }: GoogleAuthProps) {
  const { t } = useTranslation("auth");

  const { action: handleGoogleSignIn, isPending } = useServerMutation({
    action: signInWithGoogleAction,
    onSuccess: (response) => {
      if ("data" in response) {
        if ("redirectUrl" in response.data) {
          const url = decodeURIComponent(response.data.redirectUrl as string);
          console.log(url);
          if (url.trim().length) window.location.href = url;
        }
      }
    },
    onError: (error) => {
      toast.error(error.message || t("errors.googleSignIn"));
    },
  });

  const onClick = () => {
    const formData = new FormData();
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
