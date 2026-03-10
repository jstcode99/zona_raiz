import { redirect } from "next/navigation"

interface DepartamentoPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DepartamentoPage({ params, searchParams }: DepartamentoPageProps) {
  const { slug } = await params
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
  const redirectUrl = queryString ? `/buscar?${queryString}` : "/buscar"
  
  redirect(redirectUrl)
}
