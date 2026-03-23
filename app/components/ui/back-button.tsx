"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function BackButton({
  ...props
}: React.ComponentProps<"button">) {
  const router = useRouter();
  const { t } = useTranslation("common");

  return (
    <Button
      variant="ghost"
      type="button"
      onClick={() => router.back()}
      {...props}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      {t("words.back")}
    </Button>
  );
}
