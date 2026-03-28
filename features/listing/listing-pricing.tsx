"use client";

import { ListingEntity } from "@/domain/entities/listing.entity";
import { useTranslation } from "react-i18next";

interface ListingDetailProps {
  listing: ListingEntity | null | undefined;
}
export function ListingPricing({ listing }: ListingDetailProps) {
  if (!listing) return null;
  const { t } = useTranslation("listings");

  return (
    <div className="space-y-1">
      <div className="text-3xl font-light text-foreground">
        <span className="font-normal mr-1">{listing.currency}</span>
        {listing.price.toLocaleString()}
      </div>
      {listing.price_negotiable && (
        <p className="text-xs uppercase  text-muted-foreground/70">
          {t("detail.words.price_negotiable")}
        </p>
      )}
    </div>
  );
}
