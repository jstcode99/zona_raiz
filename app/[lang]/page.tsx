import type { Metadata } from "next"
import { SearchPageClient } from "./search-page-client"
import { getTranslation } from "@/i18n/server"
import { Lang } from "@/i18n/settings"
import { parseSearchParams } from "./_search/helpers"
import { getListings } from "./_search/server"

interface HomePageProps {
  params: Promise<{ lang: Lang }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params, searchParams }: HomePageProps): Promise<Metadata> {
  const { lang } = await params
  const { t } = await getTranslation(lang)
  const sp = await searchParams

  const title = `${t("sections:all_properties")} | ${t("titles:app")}`
  const description = t("sections:search_meta_description", { location: t("sections:all_properties") })
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? ""

  const canonicalParams = new URLSearchParams()
  if (sp.listing_type) canonicalParams.set("listing_type", String(sp.listing_type))
  if (sp.type) canonicalParams.set("type", String(sp.type))
  if (sp.sort_by && sp.sort_by !== "created_at_desc") canonicalParams.set("sort_by", String(sp.sort_by))
  if (sp.page && Number(sp.page) > 1) canonicalParams.set("page", String(sp.page))
  const qs = canonicalParams.toString()

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/${lang}${qs ? `?${qs}` : ""}`,
    },
  }
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { lang } = await params
  const { t } = await getTranslation(lang)
  const sp = await searchParams

  const filters = parseSearchParams(sp, undefined)
  const { listings, total } = await getListings(filters, lang)

  const totalPages = Math.ceil(total / (filters.limit || 12))
  const currentPage = filters.page || 1
  

  return (
    <SearchPageClient
      lang={lang}
      filters={filters}
      listings={listings}
      total={total}
      totalPages={totalPages}
      currentPage={currentPage}
      breadcrumb={t("sections:all_properties")}
      basePath={`/${lang}`}
    />
  )
}