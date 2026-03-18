"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavoriteAction } from "@/application/actions/favorite.action";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface FavoriteToggleButtonProps {
  listingId: string;
  isFavInitial?: boolean;
  size?: "sm" | "default" | "lg";
}

export function FavoriteToggleButton({
  listingId,
  isFavInitial = false,
  size = "default",
}: FavoriteToggleButtonProps) {
  const { t } = useTranslation("status");

  const [isFav, setIsFav] = useState(isFavInitial);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const previousFav = isFav;

    setIsFav(!isFav);

    startTransition(async () => {
      try {
        const result = await toggleFavoriteAction(listingId);
        if (result.success) {
          toast.success(
            previousFav ? t("favorite_removed") : t("favorite_added"),
          );
        } else {
          setIsFav(previousFav);
          toast.error(result.error?.message || t("favorite_error"));
        }
      } catch (error) {
        setIsFav(previousFav);
        toast.error(t("error_favorite"));
        console.error("Error toggling favorite:", error);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`
        ${isFav ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"}
        ${size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10"}
      `}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }}
      disabled={isPending}
    >
      <Heart
        className={`${size === "sm" ? "w-4 h-4" : size === "lg" ? "w-6 h-6" : "w-5 h-5"} ${isFav ? "fill-current" : ""} ${isPending ? "animate-pulse" : ""}`}
      />
    </Button>
  );
}
