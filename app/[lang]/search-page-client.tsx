"use client"

import { ListingSearchFilters, ListingSearchFilters as ListingSearchFiltersType } from "@/features/listing/listing-search-filters"
import { ListingGrid } from "@/features/listing/listing-grid"
import { ListingEntity } from "@/domain/entities/listing.entity"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  IconChevronLeft,
  IconChevronRight
} from "@tabler/icons-react"
import Link from "next/link"
import { IconMapPin } from "@tabler/icons-react"
import { useTranslation } from "react-i18next"

interface SearchPageClientProps {
  filters: ListingSearchFiltersType
  listings: ListingEntity[]
  total: number
  totalPages: number
  currentPage: number
  sortOptions: { label: string; value: string }[]
  breadcrumb: string
}

export function SearchPageClient({
  filters,
  listings,
  total,
  totalPages,
  currentPage,
  sortOptions,
  breadcrumb
}: SearchPageClientProps) {
  const { t } = useTranslation();

  const buildQueryString = (page?: number) => {
    const params = new URLSearchParams()

    if (filters.q) params.set("q", filters.q)
    if (filters.listing_type) params.set("listing_type", filters.listing_type)
    if (filters.type) params.set("type", filters.type)
    if (filters.country) params.set("country", filters.country)
    if (filters.state) params.set("state", filters.state)
    if (filters.city) params.set("city", filters.city)
    if (filters.neighborhood) params.set("neighborhood", filters.neighborhood)
    if (filters.min_price && filters.min_price > 0) params.set("min_price", String(filters.min_price))
    if (filters.max_price && filters.max_price < 100000000) params.set("max_price", String(filters.max_price))
    if (filters.min_bedrooms) params.set("min_bedrooms", String(filters.min_bedrooms))
    if (filters.min_bathrooms) params.set("min_bathrooms", String(filters.min_bathrooms))
    if (filters.amenities?.length) params.set("amenities", filters.amenities.join(","))
    if (filters.sort_by) params.set("sort_by", filters.sort_by)
    if (page && page > 1) params.set("page", String(page))

    return params.toString()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground ">
            <Link href="/autenticacion/login" className="hover:text-primary">{t("actions:sign_in")}</Link>
            <IconMapPin className="size-4" />
            <span className="capitalize">{breadcrumb}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-80 shrink-0">
            <div className="sticky top-4 bg-card rounded-lg border p-4">
              <h2 className="font-semibold mb-4 capitalize">{t("sections:filters")}</h2>
              <ListingSearchFilters initialFilters={filters} />
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold capitalize">
                  {filters.city || filters.state || filters.country || t("words:properties")}
                </h1>
                <p className="text-sm text-muted-foreground capitalize">
                  {total} {total === 1 ? t("words:result") : t("words:results")}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground capitalize">{t("words:order")}:</span>
                <Select
                  value={filters.sort_by || "created_at_desc"}
                  onValueChange={(value) => {
                    const query = buildQueryString()
                    const separator = query ? "?" : ""
                    window.location.href = `${separator}${query ? query + "&" : ""}sort_by=${value}`
                  }}
                >
                  <SelectTrigger className="w-50">
                    <SelectValue placeholder={t("placeholders:order_by")} />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ListingGrid listings={listings} />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Link
                  href={`?${buildQueryString(currentPage - 1)}`}
                >
                  <Button variant="outline" size="sm" disabled={currentPage <= 1}>
                    <IconChevronLeft className="size-4" />
                    {t("words:back")}
                  </Button>
                </Link>

                <span className="text-sm text-muted-foreground capitalize">
                  {t("words:page")} {currentPage} {t("words:of")} {totalPages}
                </span>

                <Link
                  href={`?${buildQueryString(currentPage + 1)}`}
                >
                  <Button variant="outline" size="sm" disabled={currentPage >= totalPages}>
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
  )
}
