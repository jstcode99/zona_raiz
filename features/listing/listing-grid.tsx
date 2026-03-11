"use client"

import { ListingEntity, listingTypeLabels } from "@/domain/entities/listing.entity"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Maximize } from "lucide-react"
import { IconHome } from "@tabler/icons-react"
import Link from "next/link"
import { useRoutes } from "@/i18n/client-router"

interface ListingCardProps {
  listing: ListingEntity
}

export function ListingCard({ listing }: ListingCardProps) {
  const property = listing.property
  const images = property.property_images || []
  const mainImage = images.length > 0 ? images[0].public_url : null
  const routes = useRoutes()

  return (
    <Link href={routes.listings(listing.id.toString())}>
      <Card className="overflow-hidden pt-0 cursor-pointer hover:shadow-lg transition-all group h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          {mainImage ? (
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <IconHome className="w-12 h-12 text-muted-foreground/50" />
            </div>
          )}

          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
              {listingTypeLabels[listing.listing_type]}
            </Badge>
            {listing.featured && (
              <Badge className="bg-amber-500 hover:bg-amber-600">
                Destacado
              </Badge>
            )}
          </div>

          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-foreground">
              {listing.currency} {listing.price.toLocaleString("es-ES")}
              {listing.price_negotiable && " negociable"}
            </Badge>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <h3 className="font-semibold text-foreground line-clamp-1">
            {property.title}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="text-sm truncate">
              {[property.neighborhood, property.city, property.state]
                .filter(Boolean)
                .join(", ")}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 flex-1">
            {property.bedrooms !== null && property.bedrooms > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms !== null && property.bathrooms > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.total_area && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Maximize className="w-4 h-4" />
                <span>{property.total_area} m²</span>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground mt-2">
            {property.property_type}
          </div>
        </div>
      </Card>
    </Link>
  )
}

interface ListingGridProps {
  listings: ListingEntity[]
  loading?: boolean
}

export function ListingGrid({ listings, loading }: ListingGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48 bg-muted animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
              <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
              <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <IconHome className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground">
          No se encontraron propiedades
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Intenta ajustar los filtros de búsqueda
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
