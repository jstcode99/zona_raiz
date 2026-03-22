"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PropertyDetail } from "@/features/properties/property-details";
import { MapPin, Share2, Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import { FavoriteToggleButton } from "@/features/favorites/favorite-toggle-button";
import { useTranslation } from "react-i18next";
import { ListingDetailDTO } from "@/application/mappers/listing.mapper";
import { useListingOptions } from "./hooks/use-listing-options";

interface ListingDetailProps {
  data: ListingDetailDTO | null | undefined;
  isFavInitial?: boolean;
}

export function ListingDetail({
  data,
  isFavInitial = false,
}: ListingDetailProps) {
  if (!data) return null;

  const { t } = useTranslation("listings");
  const { getListingTypeLabel } = useListingOptions();
  const { listing, propertyDetail, formattedLocation } = data;
  const { property } = propertyDetail;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href={``} className="hover:underline">
            {t("listings:detail.breadcrumb.properties")}
          </Link>
          <span>/</span>
          <span>
            {listing.listing_type === "rent"
              ? t("listings:detail.breadcrumb.rent")
              : t("listings:detail.breadcrumb.sale")}
          </span>
          <span>/</span>
          <span className="text-foreground">{property.city}</span>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          {property.title}
        </h1>

        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>{formattedLocation}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <PropertyDetail data={propertyDetail} />

          {/* Listing Additional Info */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">
                {t("listings:detail.details.title")}
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    {t("listings:detail.labels.operation_type")}
                  </span>
                  <p className="font-medium">
                    {getListingTypeLabel(listing.listing_type)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    {t("listings:detail.labels.price")}
                  </span>
                  <p className="font-medium">
                    {listing.currency} {listing.price.toLocaleString()}
                    {listing.price_negotiable &&
                      ` ${t("listings:detail.labels.negotiable")}`}
                  </p>
                </div>
                {listing.expenses_amount && (
                  <div>
                    <span className="text-muted-foreground">
                      {t("listings:detail.labels.expenses")}
                    </span>
                    <p className="font-medium">
                      {listing.currency}{" "}
                      {listing.expenses_amount.toLocaleString()}
                      {listing.expenses_included &&
                        `${t("listings:detail.labels.expenses_included")}`}
                    </p>
                  </div>
                )}
                {listing.virtual_tourUrl && (
                  <div>
                    <span className="text-muted-foreground">
                      {t("listings:detail.labels.virtual_tour")}
                    </span>
                    <a
                      href={listing.virtual_tourUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {t("listings:detail.actions.view_tour")}
                    </a>
                  </div>
                )}
                {listing.video_url && (
                  <div>
                    <span className="text-muted-foreground">
                      {t("listings:detail.labels.video")}
                    </span>
                    <a
                      href={listing.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      {t("listings:detail.actions.view_video")}
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-foreground mb-1">
                {listing.currency} {listing.price.toLocaleString()}
              </div>
              {listing.price_negotiable && (
                <p className="text-sm text-muted-foreground mb-4">
                  {t("listings:detail.words.price_negotiable")}
                </p>
              )}

              <div className="flex gap-2">
                <Button className="flex-1" asChild>
                  <a
                    href={`https://wa.me/?text=Me interesa: ${property.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t("listings:detail.actions.whatsapp")}
                  </a>
                </Button>
                <FavoriteToggleButton
                  listingId={listing.id}
                  isFavInitial={isFavInitial}
                />
                <Button
                  variant="outline"
                  size="icon"
                  title={t("listings:detail.actions.share")}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>
                    {listing.views_count} {t("listings:detail.labels.views")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {listing.inquiries_count}{" "}
                    {t("listings:detail.labels.inquiries")}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Card */}
          {property.real_estate && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">
                  {t("listings:detail.labels.real_estate")}
                </h3>
                <p className="text-foreground">{property.real_estate.name}</p>
              </CardContent>
            </Card>
          )}

          {/* Keywords */}
          {listing.keywords && listing.keywords.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">
                  {t("listings:detail.labels.features")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {listing.keywords.map((keyword) => (
                    <Badge key={keyword.value} variant="secondary">
                      {keyword.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
