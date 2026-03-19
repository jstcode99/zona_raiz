"use client"

import { useTranslation } from "react-i18next"
import Link from "next/link"
import { Lang } from "@/i18n/settings"
import type { LandingStats } from "@/domain/types/landing.types"

interface LandingTrustProps { 
  lang: Lang
  stats: LandingStats
  agentAvatars?: string[]
}

const defaultAvatars = [
  "photo-1560250097-0b93528c311a",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1500648767791-00dcc994a43e",
]

const logos = ["Grammarly", "Linear", "Coinbase", "Webflow", "Tinder", "Uber"]

export function LandingTrust({ lang, stats, agentAvatars = defaultAvatars }: LandingTrustProps) {
  const { t } = useTranslation("landing")

  return (
    <section className="border-b border-neutral-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

          <div className="shrink-0">
            <p className="text-neutral-900 leading-tight mb-4"
              style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 3vw, 38px)", fontWeight: 400 }}>
              {stats.totalListings}+<br />
              <span className="text-orange-500">{t("trust.companies")}</span><br />
              {t("trust.trust_us")}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex">
                {agentAvatars.slice(0, 3).map((avatarId, i) => (
                  <img
                    key={i}
                    src={`https://images.unsplash.com/${avatarId}?w=48&q=70`}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    style={{ marginLeft: i > 0 ? "-8px" : 0 }}
                    alt=""
                  />
                ))}
              </div>
              <span className="text-[12px] text-neutral-500 ml-1">{t("trust.more")}</span>
            </div>
          </div>

          <div className="hidden lg:block w-px h-20 bg-neutral-200 shrink-0" />

          <div className="max-w-sm">
            <p className="text-[14px] text-neutral-500 leading-relaxed mb-4">
              {t("trust.description")}
            </p>
            <Link
              href={`/${lang}/colombia`}
              className="inline-flex items-center justify-center w-full bg-neutral-900 text-white hover:bg-neutral-800 rounded-full px-6 h-9 text-[13px] font-semibold transition-all duration-200 hover:scale-105"
            >
              {t("trust.cta")}
            </Link>
          </div>

          <div className="hidden lg:block w-px h-20 bg-neutral-200 shrink-0" />

          <div className="flex-1">
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-4">
              {t("trust.logos_label")} →
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {logos.map(l => (
                <span key={l} className="text-[14px] font-semibold text-neutral-300">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
