"use client";

import { Share2 } from "lucide-react";
import { FavoriteToggleButton } from "../favorites/favorite-toggle-button";
import { Button } from "@/components/ui/button";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { ListingEntity } from "@/domain/entities/listing.entity";
import { useTranslation } from "react-i18next";

interface ListingDetailProps {
  listing: ListingEntity | null | undefined;
  isFavInitial?: boolean;
}

export function ListingActions({
  listing,
  isFavInitial = false,
}: ListingDetailProps) {
  if (!listing) return null;
  const { t } = useTranslation("listings");

  return (
    <div className="flex items-center py-2 space-x-1">
      <Button
        className="grow bg-green-600/80 text-white hover:text-black"
        variant={"outline"}
      >
        <IconBrandWhatsapp className="size-5" />
        {t("detail.actions.whatsapp")}
      </Button>
      <div className="flex gap-1 items-center">
        <FavoriteToggleButton
          listingId={listing.id}
          isFavInitial={isFavInitial}
        />
        <Button title={t("detail.actions.share")} variant="ghost">
          <Share2 className="w-5 h-5 stroke-[1.5]" />
        </Button>
      </div>
    </div>
  );
}
