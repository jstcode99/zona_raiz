"use client"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { useRoutes } from "@/i18n/client-router"
import { Button } from "@/components/ui/button"
import { ListingCard } from "@/features/listing/listing-card"
import { ListingEntity } from "@/domain/entities/listing.entity"

interface LandingListingsProps {
  listings: ListingEntity[]
}

export function LandingListings({ listings }: LandingListingsProps) {
  const { t } = useTranslation("landing")
  const router = useRouter()
  const routes = useRoutes()

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-neutral-900 mb-1"
              style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 400 }}>
              {t("listings.title")}
            </h2>
            <p className="text-[13px] text-neutral-400">{t("listings.subtitle")}</p>
          </div>
          <Button
            variant="outline"
            className="rounded-full border-neutral-200 text-neutral-700 hover:bg-neutral-50 text-[13px] font-semibold px-5 h-9"
            onClick={() => router.push(routes.search())}
          >
            {t("listings.explore")} →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.slice(0, 6).map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  )
}
