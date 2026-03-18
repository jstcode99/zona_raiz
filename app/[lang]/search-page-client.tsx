"use client";
import {
  ListingSearchFilters,
  ListingSearchFilters as ListingSearchFiltersType,
} from "@/features/listing/listing-search-filters";
import { ListingGrid } from "@/features/listing/listing-grid";
import { ListingEntity } from "@/domain/entities/listing.entity";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconChevronLeft,
  IconChevronRight,
  IconMapPin,
} from "@tabler/icons-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { buildUrl } from "./_search/helpers";
import { Lang } from "@/i18n/settings";

interface SearchPageClientProps {
  filters: ListingSearchFiltersType;
  listings: ListingEntity[];
  total: number;
  totalPages: number;
  currentPage: number;
  breadcrumb: string;
  basePath: string;
  lang: Lang;
  favoriteIds?: string[];
}

export function SearchPageClient({
  filters,
  listings,
  total,
  totalPages,
  currentPage,
  breadcrumb,
  basePath,
  lang,
  favoriteIds,
}: SearchPageClientProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleFiltersChange = (newFilters: ListingSearchFiltersType) => {
    const locationParts = [
      newFilters.country,
      newFilters.state,
      newFilters.city,
    ].filter(Boolean);
    const newBasePath = `/${lang}${locationParts.length ? `/${locationParts.join("/")}` : ""}`;

    const url = buildUrl({ ...newFilters, page: 1 }, newBasePath, newFilters);
    console.log("🔍 navigating to:", url);
    window.location.href = url;
  };

  const handleSortChange = (value: string) => {
    const url = buildUrl({ sort_by: value, page: 1 }, basePath, filters);
    router.push(url, { scroll: false });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/autenticacion/login" className="hover:text-primary">
              {t("actions:sign_in")}
            </Link>
            <IconMapPin className="size-4" />
            <span className="capitalize">{breadcrumb}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-4 bg-card rounded-lg border p-4">
              <h2 className="font-semibold mb-4 capitalize">
                {t("sections:filters")}
              </h2>
              <ListingSearchFilters
                initialFilters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold capitalize">
                  {filters.city ||
                    filters.state ||
                    filters.country ||
                    t("words:properties")}
                </h1>
                <p className="text-sm text-muted-foreground capitalize">
                  {total} {total === 1 ? t("words:result") : t("words:results")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground capitalize">
                  {t("words:order")}:
                </span>
                <Select
                  value={filters.sort_by || "created_at_desc"}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-50">
                    <SelectValue placeholder={t("placeholders:order_by")} />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      { label: "Más recientes", value: "created_at_desc" },
                      { label: "Más antiguos", value: "created_at_asc" },
                      { label: "Precio: menor a mayor", value: "price_asc" },
                      { label: "Precio: mayor a menor", value: "price_desc" },
                    ].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ListingGrid listings={listings} favoriteIds={favoriteIds} />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Link
                  href={buildUrl({ page: currentPage - 1 }, basePath, filters)}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                  >
                    <IconChevronLeft className="size-4" />
                    {t("words:back")}
                  </Button>
                </Link>

                <span className="text-sm text-muted-foreground capitalize">
                  {t("words:page")} {currentPage} {t("words:of")} {totalPages}
                </span>

                <Link
                  href={buildUrl({ page: currentPage + 1 }, basePath, filters)}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                  >
                    {t("words:next")}
                    <IconChevronRight className="size-4" />
                  </Button>
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
