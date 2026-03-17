"use client"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"
import { IconBed, IconBath, IconRuler, IconMapPin } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Lang } from "@/i18n/settings"

interface LandingListingsProps { lang: Lang }

const listings = [
  { name: "Silverwood Manor", price: "$3,095", period: "/mes", address: "Bogotá, Colombia", beds: 3, baths: 2, sqft: "1,200", img: "photo-1600596542815-ffad4c1539a9", tag: "Arriendo" },
  { name: "Palmstone Residences", price: "$2,500", period: "/mes", address: "Medellín, Colombia", beds: 2, baths: 1, sqft: "980", img: "photo-1600585154340-be6161a56a0c", tag: "Arriendo" },
  { name: "Cedar Grove Estate", price: "$3,550", period: "/mes", address: "Cartagena, Colombia", beds: 4, baths: 3, sqft: "1,850", img: "photo-1512917774080-9991f1c4c750", tag: "Venta" },
  { name: "Hillside Haven", price: "$1,400", period: "/mes", address: "Cali, Colombia", beds: 2, baths: 1, sqft: "760", img: "photo-1570129477492-45c003edd2be", tag: "Arriendo" },
  { name: "The Oakridge Villa", price: "$2,500", period: "/mes", address: "Bogotá, Colombia", beds: 3, baths: 2, sqft: "1,100", img: "photo-1564013799919-ab600027ffc6", tag: "Venta" },
  { name: "Bluebell Heights", price: "$1,900", period: "/mes", address: "Medellín, Colombia", beds: 2, baths: 2, sqft: "890", img: "photo-1580587771525-78b9dba3b914", tag: "Arriendo" },
]

export function LandingListings({ lang }: LandingListingsProps) {
  const { t } = useTranslation("landing")
  const router = useRouter()

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
          {listings.map((l, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-neutral-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer bg-white"
              onClick={() => router.push(`/${lang}/colombia`)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={`https://images.unsplash.com/${l.img}?w=500&q=80`}
                  alt={l.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide">
                  {l.tag}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-baseline gap-1 mb-1">
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 400 }} className="text-neutral-900">
                    {l.price}
                  </span>
                  <span className="text-[12px] text-neutral-400">{l.period}</span>
                </div>
                <p className="text-[14px] font-semibold text-neutral-800 mb-1">{l.name}</p>
                <p className="flex items-center gap-1 text-[12px] text-neutral-400 mb-3">
                  <IconMapPin className="size-3" />{l.address}
                </p>
                <div className="flex items-center gap-4 pt-3 border-t border-neutral-100">
                  <span className="flex items-center gap-1 text-[12px] text-neutral-500">
                    <IconBed className="size-3.5" /><strong className="text-neutral-700">{l.beds}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-[12px] text-neutral-500">
                    <IconBath className="size-3.5" /><strong className="text-neutral-700">{l.baths}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-[12px] text-neutral-500">
                    <IconRuler className="size-3.5" /><strong className="text-neutral-700">{l.sqft} m²</strong>
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
    </section>
  )
}