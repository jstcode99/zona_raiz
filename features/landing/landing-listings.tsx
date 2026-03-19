"use client"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { IconBed, IconBath, IconRuler, IconMapPin } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Lang } from "@/i18n/settings"
import { formatCurrency } from "@/lib/utils"
import { listingTypeLabels, ListingEntity } from "@/domain/entities/listing.entity"
import { ListingType } from "@/domain/entities/listing.enums"

interface LandingListingsProps {
  lang: Lang
  listings: ListingEntity[]
}

export function LandingListings({ lang, listings }: LandingListingsProps) {
  const { t } = useTranslation("landing")
  const router = useRouter()
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set())
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0", 10)
            setVisibleCards(prev => new Set([...prev, index]))
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    )

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [listings])

  const getListingTypeLabel = (type: ListingType) => {
    return listingTypeLabels[type] || type
  }

  const getPropertyImage = (listing: ListingEntity) => {
    if (listing.property?.property_images && listing.property.property_images.length > 0) {
      return listing.property.property_images[0].public_url || ""
    }
    return "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&q=80"
  }

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
            onClick={() => router.push(`/${lang}/colombia`)}
          >
            {t("listings.explore")} →
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing, i) => (
            <div
              key={listing.id}
              ref={(el) => { cardRefs.current[i] = el }}
              data-index={i}
              className={`rounded-2xl overflow-hidden border border-neutral-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white ${
                visibleCards.has(i) ? "animate-card-visible" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
              onClick={() => router.push(`/${lang}/listing/${listing.id}`)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getPropertyImage(listing)}
                  alt={listing.property?.title || "Property"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
                  {getListingTypeLabel(listing.listing_type)}
                </span>
                {listing.featured && (
                  <span className="absolute top-3 right-3 bg-yellow-400 text-neutral-900 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
                    Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-baseline gap-1 mb-1">
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 400 }} className="text-neutral-900">
                    {formatCurrency(listing.price)}
                  </span>
                  {listing.listing_type === ListingType.RENT && (
                    <span className="text-[12px] text-neutral-400">/mes</span>
                  )}
                </div>
                <p className="text-[14px] font-semibold text-neutral-800 mb-1">
                  {listing.property?.title || "Property"}
                </p>
                <p className="flex items-center gap-1 text-[12px] text-neutral-400 mb-3">
                  <IconMapPin className="size-3" />
                  {listing.property?.city || ""}, {listing.property?.country || "Colombia"}
                </p>
                <div className="flex items-center gap-4 pt-3 border-t border-neutral-100">
                  <span className="flex items-center gap-1 text-[12px] text-neutral-500">
                    <IconBed className="size-3.5" />
                    <strong className="text-neutral-700">{listing.property?.bedrooms || 0}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-[12px] text-neutral-500">
                    <IconBath className="size-3.5" />
                    <strong className="text-neutral-700">{listing.property?.bathrooms || 0}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-[12px] text-neutral-500">
                    <IconRuler className="size-3.5" />
                    <strong className="text-neutral-700">{listing.property?.total_area || 0} m²</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === 0 ? "w-6 bg-orange-500" : "w-2 bg-neutral-200"}`} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes card-visible {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card-visible {
          animation: card-visible 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  )
}
