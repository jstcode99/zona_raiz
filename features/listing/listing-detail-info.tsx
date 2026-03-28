"use client";

import { useTranslation } from "react-i18next";
import { useListingOptions } from "./hooks/use-listing-options";
import { ListingEntity } from "@/domain/entities/listing.entity";

interface ListingDetailProps {
  listing: ListingEntity | null | undefined;
}

export function ListingDetailInfo({ listing }: ListingDetailProps) {
  const { t } = useTranslation("listings");

  if (!listing) return null;

  const { getListingTypeLabel } = useListingOptions();

  return (
    <div className="px-6 pb-10 space-y-4">
      <h3 className="text-sm font-semibold uppercase mb-8 text-foreground/80">
        {t("detail.details.title")}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
        {/* Tipo de Operación */}
        <div className="space-y-1">
          <p className="text-xs uppercase text-muted-foreground">
            {t("detail.labels.operation_type")}
          </p>
          <p className="text-sm font-medium">
            {getListingTypeLabel(listing.listing_type)}
          </p>
        </div>

        {/* Precio */}
        <div className="space-y-1">
          <p className="text-xs uppercase text-muted-foreground">
            {t("detail.labels.price")}
          </p>
          <p className="text-sm font-medium">
            {listing.currency} {listing.price.toLocaleString()}
            {listing.price_negotiable && (
              <span className="ml-2 text-xs font-light text-muted-foreground">
                ({t("detail.labels.negotiable")})
              </span>
            )}
          </p>
        </div>

        {/* Gastos/Expensas */}
        {listing.expenses_amount && (
          <div className="space-y-1">
            <p className="text-xs uppercase text-muted-foreground">
              {t("detail.labels.expenses")}
            </p>
            <p className="text-sm font-medium">
              {listing.currency} {listing.expenses_amount.toLocaleString()}
              {listing.expenses_included && (
                <span className="ml-1 text-xs text-muted-foreground">
                  incl.
                </span>
              )}
            </p>
          </div>
        )}

        {/* Enlaces (Tour / Video) */}
        {(listing.virtual_tourUrl || listing.video_url) && (
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <p className="text-xs uppercase text-muted-foreground">
              {t("detail.labels.media")}
            </p>
            <div className="flex gap-6">
              {listing.virtual_tourUrl && (
                <a
                  href={listing.virtual_tourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium border-b border-foreground/20 hover:border-foreground transition-all pb-0.5"
                >
                  {t("detail.actions.view_tour")}
                </a>
              )}
              {listing.video_url && (
                <a
                  href={listing.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium border-b border-foreground/20 hover:border-foreground transition-all pb-0.5"
                >
                  {t("detail.actions.view_video")}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
