"use client";

import { BaseRow } from "@/components/ui/data-table";
import { PropertyEntity } from "@/domain/entities/property.entity";
import { type ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  IconDotsVertical,
  IconHome,
  IconCurrencyDollar,
  IconStar,
  IconEye,
  IconMessage,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ListingEntity } from "@/domain/entities/listing.entity";
import { useRoutes } from "@/i18n/client-router";
import { useTranslation } from "react-i18next";
import { useListingOptions } from "./hooks/use-listing-options";

export type ListingRow = BaseRow & {
  created_at: string;
} & ListingEntity & {
    property: PropertyEntity;
  };

export const getListingColumns = (): ColumnDef<ListingRow>[] => {
  const routes = useRoutes();
  const { t, i18n } = useTranslation("listings");
  const { getListingTypeLabel, getListingStatusLabel } = useListingOptions();

  return [
    // =========================
    // PROPIEDAD
    // =========================
    {
      id: "property",
      header: () => t("columns.headers.property"),
      cell: ({ row }) => {
        const property = row.original.property;

        return (
          <Link href={routes.property(property.id)}>
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <IconHome className="size-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-medium truncate max-w-50">
                  {property.title}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {property.city}, {property.state}
                </span>
              </div>
            </div>
          </Link>
        );
      },
    },

    // =========================
    // TIPO + PRECIO
    // =========================
    {
      id: "pricing",
      header: () => t("columns.headers.pricing"),
      cell: ({ row }) => {
        const {
          listing_type,
          price,
          currency,
          price_negotiable,
          expenses_amount,
          expenses_included,
        } = row.original;

        return (
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {getListingTypeLabel(listing_type)}
              </Badge>

              {price_negotiable && (
                <Badge variant="outline">{t("words.negotiable")}</Badge>
              )}
            </div>

            <div className="flex items-center gap-1 font-medium text-sm">
              <IconCurrencyDollar className="size-3.5" />
              {currency} {price.toLocaleString(i18n.language)}
            </div>

            {expenses_amount && (
              <span className="text-muted-foreground">
                {t("words.expenses")}: {currency}{" "}
                {expenses_amount.toLocaleString(i18n.language)}{" "}
                {expenses_included ? `(${t("words.included")})` : ""}
              </span>
            )}
          </div>
        );
      },
    },

    // =========================
    // ESTADO
    // =========================
    {
      accessorKey: "status",
      header: () => t("columns.headers.status"),
      cell: ({ row }) => {
        const { status, featured, featured_until } = row.original;

        return (
          <div className="flex flex-col gap-1">
            <Badge>{getListingStatusLabel(status)}</Badge>

            {featured && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-xs"
              >
                <IconStar className="size-3" />
                {t("words.featured")}
              </Badge>
            )}

            {featured && featured_until && (
              <span className="text-[11px] text-muted-foreground">
                {t("words.until")}{" "}
                {new Date(featured_until).toLocaleDateString(i18n.language)}
              </span>
            )}
          </div>
        );
      },
    },

    // =========================
    // MÉTRICAS
    // =========================
    {
      id: "metrics",
      header: () => t("columns.headers.metrics"),
      cell: ({ row }) => {
        const { views_count, enquiries_count, whatsapp_clicks } = row.original;

        return (
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded">
              <IconEye className="size-3.5" />
              {views_count}
            </div>

            <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded">
              <IconMessage className="size-3.5" />
              {enquiries_count}
            </div>

            <div className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded">
              <IconBrandWhatsapp className="size-3.5" />
              {whatsapp_clicks}
            </div>
          </div>
        );
      },
    },

    // =========================
    // FECHAS
    // =========================
    {
      id: "dates",
      header: () => t("columns.headers.dates"),
      cell: ({ row }) => {
        const { created_at, published_at, available_from } = row.original;

        return (
          <div className="flex flex-col text-xs">
            <span>
              {t("words.created")}:{" "}
              {new Date(created_at).toLocaleDateString(i18n.language)}
            </span>

            {published_at && (
              <span className="text-muted-foreground">
                {t("words.published")}:{" "}
                {new Date(published_at).toLocaleDateString(i18n.language)}
              </span>
            )}

            {available_from && (
              <span className="text-muted-foreground">
                {t("words.available")}:{" "}
                {new Date(available_from).toLocaleDateString(i18n.language)}
              </span>
            )}
          </div>
        );
      },
    },

    // =========================
    // ACCIONES
    // =========================
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const { id } = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical className="size-4" />
                <span className="sr-only">
                  {t("columns.actions.open_menu")}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <Link href={routes.listing(id)}>
                <DropdownMenuItem>
                  {t("columns.actions.edit_listing")}
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem>
                {t("columns.actions.view_public")}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive">
                {t("columns.actions.delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
