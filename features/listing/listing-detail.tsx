"use client"

import { ListingEntity, listingTypeLabels } from "@/domain/entities/listing.entity"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PropertyDetail } from "@/features/properties/property-details"
import { MapPin, Share2, Heart, Eye, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ROUTES } from "@/infrastructure/config/constants"

interface ListingDetailProps {
  listing: ListingEntity
}

export function ListingDetail({ listing }: ListingDetailProps) {
  const property = listing.property
  const images = (property.property_images?.map(img => img.public_url).filter(Boolean) || []) as string[]
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href={ROUTES.SEARCH} className="hover:underline">
            Propiedades
          </Link>
          <span>/</span>
          <span>{listing.listing_type === "rent" ? "Renta" : "Venta"}</span>
          <span>/</span>
          <span className="text-foreground">{property.city}</span>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>
            {[property.neighborhood, property.city, property.state, property.country]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <PropertyDetail property={property} images={images} />

          {/* Listing Additional Info */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Detalles del anuncio</h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tipo de operación</span>
                  <p className="font-medium">{listingTypeLabels[listing.listing_type]}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Precio</span>
                  <p className="font-medium">
                    {listing.currency} {listing.price.toLocaleString("es-ES")}
                    {listing.price_negotiable && " negociable"}
                  </p>
                </div>
                {listing.expenses_amount && (
                  <div>
                    <span className="text-muted-foreground">Expensas</span>
                    <p className="font-medium">
                      {listing.currency} {listing.expenses_amount.toLocaleString("es-ES")}
                      {listing.expenses_included && " incluidas"}
                    </p>
                  </div>
                )}
                {listing.virtual_tourUrl && (
                  <div>
                    <span className="text-muted-foreground">Tour virtual</span>
                    <a 
                      href={listing.virtual_tourUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      Ver tour 360°
                    </a>
                  </div>
                )}
                {listing.video_url && (
                  <div>
                    <span className="text-muted-foreground">Video</span>
                    <a 
                      href={listing.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      Ver video
                    </a>
                  </div>
                )}
              </div>

              {/* Description */}
              {property.description && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Descripción</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {property.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-foreground mb-1">
                {listing.currency} {listing.price.toLocaleString("es-ES")}
              </div>
              {listing.price_negotiable && (
                <p className="text-sm text-muted-foreground mb-4">Precio negociable</p>
              )}
              
              <div className="flex gap-2">
                <Button className="flex-1" asChild>
                  <a href={`https://wa.me/?text=Me interesa: ${property.title}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{listing.views_count} vistas</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>{listing.inquiries_count} consultas</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agent Card */}
          {property.real_estate && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Inmobiliaria</h3>
                <p className="text-foreground">{property.real_estate.name}</p>
              </CardContent>
            </Card>
          )}

          {/* Keywords */}
          {listing.keywords && listing.keywords.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Características</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.keywords.map((keyword) => (
                    <Badge key={keyword.value} variant="secondary">
                      {keyword.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
