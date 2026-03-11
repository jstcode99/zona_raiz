import { listingModule } from "@/application/modules/listing.module"
import { ListingDetail } from "@/features/listing/listing-detail"
import { notFound } from "next/navigation"
import { Metadata } from "next"

interface ListingPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
  const { slug } = await params
  const { listingService } = await listingModule()
  const listing = await listingService.getCachedBySlug(slug)

  if (!listing) {
    return {
      title: "Propiedad no encontrada",
    }
  }

  const property = listing.property
  const firstImage = property.property_images?.[0]?.public_url
  const title = listing.meta_title || `${property.title} - ${listing.listing_type === "rent" ? "Renta" : "Venta"} en ${property.city}`
  const description = listing.meta_description || 
    `${property.title} en ${property.city}, ${property.state}. ${property.bedrooms ? `${property.bedrooms} dormitorios` : ""} ${property.bathrooms ? `${property.bathrooms} baños` : ""} ${property.total_area ? `${property.total_area}m²` : ""}. ${listing.currency} ${listing.price.toLocaleString("es-ES")}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "es_ES",
      images: firstImage ? [
        {
          url: firstImage,
          width: 1200,
          height: 630,
          alt: property.title,
        }
      ] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: firstImage ? [firstImage] : undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { slug } = await params
  const { listingService } = await listingModule()
  const listing = await listingService.getCachedBySlug(slug)

  if (!listing) {
    notFound()
  }

  return <ListingDetail listing={listing} />
}
