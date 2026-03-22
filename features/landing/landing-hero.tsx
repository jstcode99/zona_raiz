"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRoutes, buildSearchUrl } from "@/i18n/client-router";
import { Lang } from "@/i18n/settings";
import { LandingCity } from "@/domain/types/landing.types";
import { PlaceSearch, ParsedPlace } from "@/features/places/place-search";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PropertyType } from "@/domain/entities/property.enums";
import { ListingType } from "@/domain/entities/listing.enums";
import { PROPERTIES_SLUG } from "@/lib/search-config";
import {
  landingSearchSchema,
  LandingSearchFormInput,
  defaultLandingSearchValues,
} from "@/application/validation/landing-search.schema";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  IconHome,
  IconBuildingSkyscraper,
  IconTree,
  IconBuildingStore,
  IconBuilding,
  IconArrowRight,
  IconBed,
  IconBath,
  IconCurrencyDollar,
  IconMapPin,
} from "@tabler/icons-react";
import { CtaButton } from "./buttn-cta";

interface LandingHeroProps {
  cities?: LandingCity[];
  lang?: Lang;
}

const PROPERTY_TYPES = [
  {
    value: PropertyType.Apartment,
    label: "hero.property_types.apartment",
    icon: IconBuildingSkyscraper,
  },
  {
    value: PropertyType.House,
    label: "hero.property_types.house",
    icon: IconHome,
  },
  {
    value: PropertyType.Land,
    label: "hero.property_types.land",
    icon: IconTree,
  },
  {
    value: PropertyType.Commercial,
    label: "hero.property_types.commercial",
    icon: IconBuildingStore,
  },
  {
    value: PropertyType.Office,
    label: "hero.property_types.office",
    icon: IconBuilding,
  },
];

const LISTING_TYPES = [
  { value: ListingType.RENT, label: "hero.listing_types.rent" },
  { value: ListingType.SALE, label: "hero.listing_types.sale" },
];

export function LandingHero({ lang = "es" }: LandingHeroProps) {
  const { t } = useTranslation("landing");
  const router = useRouter();
  const routes = useRoutes();

  const [listingType, setListingType] = useState<ListingType>(ListingType.RENT);
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [place, setPlace] = useState<ParsedPlace | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const form = useForm<LandingSearchFormInput>({
    resolver: yupResolver(
      landingSearchSchema,
    ) as Resolver<LandingSearchFormInput>,
    defaultValues: defaultLandingSearchValues,
    mode: "onChange",
  });

  const onSubmit = (data: LandingSearchFormInput) => {
    setIsSearching(true);

    const url = buildSearchUrl({
      lang,
      listing_type: listingType,
      type: propertyType ?? undefined,
      city: place?.city,
      neighborhood: place?.neighborhood,
    });

    const sp = new URLSearchParams();
    if (data.min_bedrooms) sp.set("min_bedrooms", String(data.min_bedrooms));
    if (data.min_bathrooms) sp.set("min_bathrooms", String(data.min_bathrooms));
    if (data.max_price && data.max_price < 1e8)
      sp.set("max_price", String(data.max_price));

    const qs = sp.toString();
    router.push(`${url}${qs ? `?${qs}` : ""}`);
  };

  return (
    <section className="relative w-full min-h-screen pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpeg"
          alt="Hero property"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/5 via-black/8 to-black/0" />
        <div className="absolute inset-0 bg-linear-to-t from-black/8 via-black/10 to-black/0" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 min-h-[calc(100vh-64px)] flex items-center">
        <div className="flex items-center justify-between w-full gap-12">
          {/* Left */}
          <div className="flex-1 max-w-lg">
            <div
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6"
              style={{ animation: "fadeSlideUp 0.6s ease both" }}
            >
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-white/90 text-xs font-medium tracking-wide">
                {t("hero.badge")}
              </span>
            </div>

            <h1
              className="text-white font-bold leading-none mb-6"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                animation: "fadeSlideUp 0.7s ease 0.1s both",
              }}
            >
              {t("hero.title_1")},<br />
              <span className="text-primary">{t("hero.title_2")}</span>,<br />&{" "}
              {t("hero.title_3")}
            </h1>

            <p
              className="text-white text-xl font-semibold mb-8 max-w-sm leading-relaxed"
              style={{ animation: "fadeSlideUp 0.7s ease 0.2s both" }}
            >
              {t("hero.subtitle")}
            </p>

            <CtaButton
              href={routes.search()}
              className="hidden lg:inline-flex"
              text={t("hero.see_all")}
              style={{ animation: "fadeSlideUp 0.7s ease 0.3s both" }}
            />
          </div>

          {/* Right - Search Card */}
          <div
            className="w-full max-w-sm shrink-0"
            style={{ animation: "fadeSlideUp 0.8s ease 0.2s both" }}
          >
            <Card className="overflow-hidden shadow-2xl">
              {/* Listing type tabs — dentro del header sin padding extra */}
              <CardHeader className="p-0">
                <div className="flex border-b">
                  {LISTING_TYPES.map((lt) => (
                    <button
                      key={lt.value}
                      type="button"
                      onClick={() => setListingType(lt.value)}
                      className={cn(
                        "flex-1 py-3.5 text-sm font-semibold transition-all duration-200",
                        listingType === lt.value
                          ? "text-primary border-b-2 border-primary bg-primary/5"
                          : "text-muted-foreground hover:text-foreground bg-muted/30",
                      )}
                    >
                      {t(lt.label)}
                    </button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {/* Property type pills */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2.5">
                    {t("hero.property_type_label")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPES.map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setPropertyType(propertyType === value ? null : value)
                        }
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                          propertyType === value
                            ? "bg-primary text-primary-foreground border-primary scale-105 shadow-sm"
                            : "bg-background text-foreground border-border hover:border-primary/50 hover:scale-[1.02]",
                        )}
                      >
                        <Icon className="size-3" />
                        {t(label)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Place search */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    {t("hero.location_label")}
                  </p>
                  <PlaceSearch
                    lang={lang}
                    navigate={false}
                    placeholder={t("hero.location_placeholder")}
                    onSelect={(p) => setPlace(p)}
                  />
                </div>

                {/* RHF Form */}
                <Form form={form} onSubmit={onSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Form.Input
                      name="min_bedrooms"
                      type="number"
                      placeholder={t("hero.beds")}
                      min={0}
                      label={
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <IconBed className="size-3" />
                          {t("hero.beds_label")}
                        </span>
                      }
                    />
                    <Form.Input
                      name="min_bathrooms"
                      type="number"
                      placeholder={t("hero.baths")}
                      min={0}
                      label={
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <IconBath className="size-3" />
                          {t("hero.baths_label")}
                        </span>
                      }
                    />
                  </div>

                  <Form.Input
                    name="max_price"
                    type="currency"
                    placeholder={t("hero.max_price_placeholder")}
                    label={
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <IconCurrencyDollar className="size-3" />
                        {t("hero.max_price")}
                      </span>
                    }
                  />

                  {/* Summary chips */}
                  {(place || propertyType || listingType) && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                      <span className="text-[10px] text-muted-foreground w-full">
                        {t("hero.searching_label")}
                      </span>
                      <span className="text-[11px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                        {t(
                          listingType === ListingType.RENT
                            ? "hero.listing_types.rent"
                            : "hero.listing_types.sale",
                        )}
                      </span>
                      {propertyType && (
                        <span className="text-[11px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium">
                          {PROPERTIES_SLUG[propertyType]?.[lang]}
                        </span>
                      )}
                      {place?.label && (
                        <span className="text-[11px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <IconMapPin className="size-2.5" />
                          {place.label}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSearching}
                    className="w-full"
                  >
                    {isSearching ? (
                      <>
                        <span className="size-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                        {t("hero.searching")}
                      </>
                    ) : (
                      <>
                        {t("hero.search_btn")}
                        <IconArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
