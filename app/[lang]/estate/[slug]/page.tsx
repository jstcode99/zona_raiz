import { Lang } from "@/i18n/settings"
import { ROUTES } from "@/infrastructure/config/routes"
import { redirect } from "next/navigation"

interface props {
  params: Promise<{ slug: string, lang: Lang }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function page({ params, searchParams }: props) {
  const { slug, lang } = await params
  const sp = await searchParams
  
  const queryParams = new URLSearchParams()
  
  if (slug) {
    queryParams.set("state", decodeURIComponent(slug))
  }
  
  if (sp.listing_type) {
    queryParams.set("listing_type", String(sp.listing_type))
  }
  
  if (sp.type) {
    queryParams.set("type", String(sp.type))
  }

  const queryString = queryParams.toString()
  const redirectUrl = queryString ? `${ROUTES.home[lang]}?${queryString}` : ROUTES.home[lang]
  
  redirect(redirectUrl)
}
