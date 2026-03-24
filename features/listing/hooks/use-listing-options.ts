"use client";

import { useTranslation } from "react-i18next";
import { ListingType, ListingStatus, Keywords } from "@/domain/entities/listing.enums";

export function useListingOptions() {
  const { t } = useTranslation("listings");

  const listingTypeOptions = [
    { label: t("listing_types.rent"), value: ListingType.RENT },
    { label: t("listing_types.sale"), value: ListingType.SALE },
  ];

  const listingStatusOptions = [
    { label: t("status_labels.active"), value: ListingStatus.ACTIVE },
    { label: t("status_labels.draft"), value: ListingStatus.DRAFT },
    { label: t("status_labels.archived"), value: ListingStatus.ARCHIVED },
  ];

  const keywordsOptions = [
    { label: t("keywords.pool"), value: Keywords.POOL },
    { label: t("keywords.gym"), value: Keywords.GYM },
    { label: t("keywords.parking"), value: Keywords.PARKING },
    { label: t("keywords.elevator"), value: Keywords.ELEVATOR },
    { label: t("keywords.security"), value: Keywords.SECURITY },
    { label: t("keywords.garden"), value: Keywords.GARDEN },
    { label: t("keywords.balcony"), value: Keywords.BALCONY },
    { label: t("keywords.air_conditioning"), value: Keywords.AIR_CONDITIONING },
    { label: t("keywords.heating"), value: Keywords.HEATING },
    { label: t("keywords.apartment"), value: Keywords.APARTAMENT },
    { label: t("keywords.house"), value: Keywords.HOUSE },
    { label: t("keywords.condo"), value: Keywords.CONDO },
    { label: t("keywords.townhouse"), value: Keywords.TOWNHOUSE },
    { label: t("keywords.land"), value: Keywords.LAND },
    { label: t("keywords.commercial"), value: Keywords.COMMERCIAL },
    { label: t("keywords.office"), value: Keywords.OFFICE },
    { label: t("keywords.warehouse"), value: Keywords.WAREHOUSE },
    { label: t("keywords.other"), value: Keywords.OTHER },
  ];

  const getListingTypeLabel = (type: ListingType) => {
    const labels: Record<ListingType, string> = {
      [ListingType.RENT]: t("listing_types.rent"),
      [ListingType.SALE]: t("listing_types.sale"),
    };
    return labels[type];
  };

  const getListingStatusLabel = (status: ListingStatus) => {
    const labels: Record<ListingStatus, string> = {
      [ListingStatus.ACTIVE]: t("status_labels.active"),
      [ListingStatus.DRAFT]: t("status_labels.draft"),
      [ListingStatus.ARCHIVED]: t("status_labels.archived"),
    };
    return labels[status];
  };

  return {
    listingTypeOptions,
    listingStatusOptions,
    keywordsOptions,
    getListingTypeLabel,
    getListingStatusLabel,
  };
}
