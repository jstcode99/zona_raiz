import { redirect } from "next/navigation"
import { ROUTES } from "@/infrastructure/config/constants"

interface PaisPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PaisPage({ params, searchParams }: PaisPageProps) {
  const { slug } = await params
  const sp = await searchParams
  
  const queryParams = new URLSearchParams()
  
  if (slug) {
    queryParams.set("country", decodeURIComponent(slug))
  }
  
  if (sp.listing_type) {
    queryParams.set("listing_type", String(sp.listing_type))
  }
  
  if (sp.type) {
    queryParams.set("type", String(sp.type))
  }

  const queryString = queryParams.toString()
  const redirectUrl = queryString ? `${ROUTES.SEARCH}?${queryString}` : ROUTES.SEARCH
  
  redirect(redirectUrl)
}
